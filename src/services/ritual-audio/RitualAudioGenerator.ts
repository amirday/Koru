/**
 * RitualAudioGenerator - Orchestrates TTS generation for rituals
 * Returns segment arrays for playback by AudioSequencer (no stitching)
 */

import type { Ritual, RitualSection } from '@/types/models'
import { isTextSegment, getTextFromSegments } from '@/types/segment'
import { getTTSService } from '../tts/tts-service'
import { audioCache, AudioCache } from '../audio/AudioCache'
import type { SegmentAudio } from '../audio/AudioSequencer'

/**
 * Delay between TTS requests to avoid rate limiting (ms)
 * Google Gemini preview TTS model has very strict limits
 * Using 10 seconds to ensure ~6 requests/minute max
 */
const TTS_REQUEST_DELAY_MS = 10000

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Progress callback for audio generation
 */
export interface GenerationProgress {
  /** Current section index being processed */
  sectionIndex: number
  /** Total number of sections */
  totalSections: number
  /** Current segment index within section */
  segmentIndex: number
  /** Total segments in current section */
  totalSegments: number
  /** Overall progress percentage (0-100) */
  percentage: number
  /** Current status message */
  message: string
}

/**
 * Generated audio for a section (segment-based)
 */
export interface SectionAudio {
  /** Section ID */
  sectionId: string
  /** Individual audio segments for sequential playback */
  segments: SegmentAudio[]
  /** Total duration in milliseconds */
  totalDurationMs: number
}

/**
 * Result of ritual audio generation
 */
export interface RitualAudioResult {
  /** Audio segments for each section */
  sections: SectionAudio[]
  /** Total duration in milliseconds */
  totalDurationMs: number
}

// Note: Caching for segment-based audio is not yet implemented
// A future implementation would cache individual segment blobs
// with metadata about order, durations, and types

/**
 * RitualAudioGenerator - Generates segment-based audio for rituals
 */
export class RitualAudioGenerator {
  private abortController: AbortController | null = null
  private isGenerating: boolean = false
  private currentGenerationPromise: Promise<RitualAudioResult> | null = null

  /**
   * Generate audio for an entire ritual
   * @param ritual The ritual to generate audio for
   * @param voiceId Optional voice ID override
   * @param onProgress Progress callback
   * @returns Promise with generated audio segments for all sections
   */
  async generateRitualAudio(
    ritual: Ritual,
    voiceId?: string,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<RitualAudioResult> {
    // If generation is already in progress, return the existing promise
    // This handles React Strict Mode double-mounting
    if (this.isGenerating && this.currentGenerationPromise) {
      console.warn('[RitualAudioGenerator] Generation already in progress, returning existing promise')
      return this.currentGenerationPromise
    }

    this.isGenerating = true
    this.abortController = new AbortController()

    this.currentGenerationPromise = this.doGenerateRitualAudio(ritual, voiceId, onProgress)

    try {
      return await this.currentGenerationPromise
    } finally {
      this.isGenerating = false
      this.currentGenerationPromise = null
    }
  }

  private async doGenerateRitualAudio(
    ritual: Ritual,
    voiceId?: string,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<RitualAudioResult> {
    try {
      const sections: SectionAudio[] = []
      const totalSections = ritual.sections.length
      const effectiveVoiceId = voiceId ?? ritual.voiceId
      console.log(`[RitualAudioGenerator] Starting generation for ritual with ${totalSections} sections`)

      for (let sectionIndex = 0; sectionIndex < totalSections; sectionIndex++) {
        if (this.abortController?.signal.aborted) {
          throw new Error('Audio generation cancelled')
        }

        const section = ritual.sections[sectionIndex]
        if (!section) continue

        // Check cache first
        const cacheKey = this.getCacheKey(ritual.id, section.id)
        const contentHash = AudioCache.hashContent(getTextFromSegments(section.segments))
        const cached = await this.getCachedSectionAudio(cacheKey, contentHash)

        if (cached) {
          sections.push(cached)

          onProgress?.({
            sectionIndex,
            totalSections,
            segmentIndex: section.segments.length,
            totalSegments: section.segments.length,
            percentage: Math.round(((sectionIndex + 1) / totalSections) * 100),
            message: `Loaded cached audio for section ${sectionIndex + 1}`,
          })
          continue
        }

        // Generate audio for this section
        const sectionAudio = await this.generateSectionAudio(
          section,
          effectiveVoiceId,
          (segmentIndex, totalSegments, message) => {
            const sectionProgress = segmentIndex / totalSegments
            const overallProgress =
              (sectionIndex + sectionProgress) / totalSections

            onProgress?.({
              sectionIndex,
              totalSections,
              segmentIndex,
              totalSegments,
              percentage: Math.round(overallProgress * 100),
              message,
            })
          }
        )

        // Cache the result
        await this.cacheSectionAudio(cacheKey, sectionAudio, contentHash)

        sections.push(sectionAudio)

        onProgress?.({
          sectionIndex,
          totalSections,
          segmentIndex: section.segments.length,
          totalSegments: section.segments.length,
          percentage: Math.round(((sectionIndex + 1) / totalSections) * 100),
          message: `Completed section ${sectionIndex + 1} of ${totalSections}`,
        })
      }

      const totalDurationMs = sections.reduce(
        (sum, s) => sum + s.totalDurationMs,
        0
      )

      console.log('[RitualAudioGenerator] Generation completed successfully')

      return {
        sections,
        totalDurationMs,
      }
    } catch (error) {
      console.error('[RitualAudioGenerator] Generation failed:', error)
      throw error
    }
  }

  /**
   * Generate audio for a single section
   * Returns individual segment audio (not stitched)
   */
  async generateSectionAudio(
    section: RitualSection,
    voiceId?: string,
    onProgress?: (segmentIndex: number, totalSegments: number, message: string) => void
  ): Promise<SectionAudio> {
    const tts = getTTSService()
    const segmentAudios: SegmentAudio[] = []
    const textSegments = section.segments.filter(isTextSegment)
    const totalSegments = textSegments.length

    // Track total content duration for padding calculation
    let totalContentDurationMs = 0

    // Process each segment
    for (let i = 0; i < section.segments.length; i++) {
      const segment = section.segments[i]
      if (!segment) continue

      if (segment.type === 'silence') {
        // Silence segment - no blob needed, just duration
        const durationMs = segment.durationSeconds * 1000
        totalContentDurationMs += durationMs

        segmentAudios.push({
          segmentId: segment.id,
          type: 'silence',
          durationMs,
        })
      } else if (isTextSegment(segment)) {
        const textIndex = textSegments.indexOf(segment)

        // Add delay BEFORE each TTS request to avoid rate limiting
        // This ensures we never send requests too quickly
        if (textIndex > 0) {
          console.log(`[RitualAudioGenerator] Waiting ${TTS_REQUEST_DELAY_MS}ms before next TTS request...`)
          onProgress?.(textIndex, totalSegments, `Waiting before next request...`)
          await sleep(TTS_REQUEST_DELAY_MS)
        }

        onProgress?.(textIndex, totalSegments, `Generating speech: "${segment.text?.slice(0, 30)}..."`)
        console.log(`[RitualAudioGenerator] Sending TTS request ${textIndex + 1}/${totalSegments}`)

        // Generate TTS for text segment
        const result = await tts.synthesize({
          text: segment.text,
          voiceId,
        })

        console.log(`[RitualAudioGenerator] TTS request ${textIndex + 1} completed`)

        const durationMs = result.durationSeconds * 1000
        totalContentDurationMs += durationMs

        segmentAudios.push({
          segmentId: segment.id,
          type: 'speech',
          audioBlob: result.audioBlob,
          durationMs,
        })
      }
    }

    // Calculate if we need padding silence to reach target duration
    const targetDurationMs = section.durationSeconds * 1000
    const paddingNeededMs = targetDurationMs - totalContentDurationMs

    if (paddingNeededMs > 0) {
      // Distribute padding: some at intro, rest at outro
      const introSilenceMs = section.silenceConfig?.introSilenceMs ?? Math.min(2000, paddingNeededMs * 0.3)
      const outroSilenceMs = paddingNeededMs - introSilenceMs

      // Add intro silence at the beginning
      if (introSilenceMs > 0) {
        segmentAudios.unshift({
          segmentId: `${section.id}-intro-silence`,
          type: 'silence',
          durationMs: introSilenceMs,
        })
      }

      // Add outro silence at the end
      if (outroSilenceMs > 0) {
        segmentAudios.push({
          segmentId: `${section.id}-outro-silence`,
          type: 'silence',
          durationMs: outroSilenceMs,
        })
      }
    }

    onProgress?.(totalSegments, totalSegments, 'Audio segments ready')

    return {
      sectionId: section.id,
      segments: segmentAudios,
      totalDurationMs: targetDurationMs,
    }
  }

  /**
   * Cancel ongoing generation
   */
  cancel(): void {
    this.abortController?.abort()
    this.abortController = null
  }

  /**
   * Clear cached audio for a ritual
   */
  async clearCache(ritualId: string, sectionIds: string[]): Promise<void> {
    for (const sectionId of sectionIds) {
      const cacheKey = this.getCacheKey(ritualId, sectionId)
      await audioCache.delete(cacheKey)
    }
  }

  /**
   * Generate cache key for a section
   */
  private getCacheKey(ritualId: string, sectionId: string): string {
    return `ritual:${ritualId}:section:${sectionId}`
  }

  /**
   * Get cached section audio if available
   * Note: Caching for segment-based audio is not yet implemented
   */
  private async getCachedSectionAudio(
    _cacheKey: string,
    _contentHash: string
  ): Promise<SectionAudio | null> {
    // For now, we don't cache segment-based audio
    // This can be enhanced later to cache individual segment blobs
    // The cache structure would need to change to support multiple blobs per section
    return null
  }

  /**
   * Cache section audio
   * Note: Caching for segment-based audio is not yet implemented
   */
  private async cacheSectionAudio(
    _cacheKey: string,
    _sectionAudio: SectionAudio,
    _contentHash: string
  ): Promise<void> {
    // For now, we skip caching segment-based audio
    // A proper implementation would:
    // 1. Cache each speech segment's blob with a unique key
    // 2. Store metadata about the segments (order, durations, types)
    // 3. Reconstruct SectionAudio from cached data
  }
}

// Singleton instance
export const ritualAudioGenerator = new RitualAudioGenerator()
