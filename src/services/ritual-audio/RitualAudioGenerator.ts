/**
 * RitualAudioGenerator - Orchestrates TTS generation and audio stitching
 * Generates audio for entire rituals, managing per-section TTS and silence padding
 */

import type { Ritual, RitualSection } from '@/types/models'
import { isTextSegment, getTextFromSegments } from '@/types/segment'
import { getTTSService } from '../tts/tts-service'
import { audioStitcher, type AudioSegment } from '../audio/AudioStitcher'
import { audioCache, AudioCache } from '../audio/AudioCache'

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
 * Generated audio for a section
 */
export interface SectionAudio {
  /** Section ID */
  sectionId: string
  /** Combined audio blob */
  audioBlob: Blob
  /** Actual duration in seconds */
  durationSeconds: number
  /** Object URL for playback */
  audioUrl: string
}

/**
 * Result of ritual audio generation
 */
export interface RitualAudioResult {
  /** Audio for each section */
  sections: SectionAudio[]
  /** Total duration in seconds */
  totalDurationSeconds: number
}

/**
 * RitualAudioGenerator - Generates audio for entire rituals
 */
export class RitualAudioGenerator {
  private abortController: AbortController | null = null

  /**
   * Generate audio for an entire ritual
   * @param ritual The ritual to generate audio for
   * @param voiceId Optional voice ID override
   * @param onProgress Progress callback
   * @returns Promise with generated audio for all sections
   */
  async generateRitualAudio(
    ritual: Ritual,
    voiceId?: string,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<RitualAudioResult> {
    this.abortController = new AbortController()
    const sections: SectionAudio[] = []
    const totalSections = ritual.sections.length
    const effectiveVoiceId = voiceId ?? ritual.voiceId

    for (let sectionIndex = 0; sectionIndex < totalSections; sectionIndex++) {
      if (this.abortController.signal.aborted) {
        throw new Error('Audio generation cancelled')
      }

      const section = ritual.sections[sectionIndex]
      if (!section) continue

      // Check cache first
      const cacheKey = this.getCacheKey(ritual.id, section.id)
      const contentHash = AudioCache.hashContent(getTextFromSegments(section.segments))
      const cached = await audioCache.get(cacheKey, contentHash)

      if (cached) {
        sections.push({
          sectionId: section.id,
          audioBlob: cached.audioBlob,
          durationSeconds: cached.durationSeconds,
          audioUrl: URL.createObjectURL(cached.audioBlob),
        })

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

      // Cache the result with content hash
      await audioCache.set(cacheKey, sectionAudio.audioBlob, sectionAudio.durationSeconds, contentHash)

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

    const totalDurationSeconds = sections.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    )

    return {
      sections,
      totalDurationSeconds,
    }
  }

  /**
   * Generate audio for a single section
   */
  async generateSectionAudio(
    section: RitualSection,
    voiceId?: string,
    onProgress?: (segmentIndex: number, totalSegments: number, message: string) => void
  ): Promise<SectionAudio> {
    const tts = getTTSService()
    const audioSegments: AudioSegment[] = []
    const textSegments = section.segments.filter(isTextSegment)
    const totalSegments = textSegments.length

    // Track total speech duration for silence calculation
    let totalSpeechDurationMs = 0

    // Process each segment
    for (let i = 0; i < section.segments.length; i++) {
      const segment = section.segments[i]
      if (!segment) continue

      if (segment.type === 'silence') {
        // Add silence segment
        audioSegments.push({
          type: 'silence',
          durationMs: segment.durationSeconds * 1000,
        })
      } else if (isTextSegment(segment)) {
        const textIndex = textSegments.indexOf(segment)
        onProgress?.(textIndex, totalSegments, `Generating speech: "${segment.text?.slice(0, 30)}..."`)

        // Generate TTS for text segment
        const result = await tts.synthesize({
          text: segment.text,
          voiceId,
        })

        const durationMs = result.durationSeconds * 1000
        totalSpeechDurationMs += durationMs

        audioSegments.push({
          type: 'speech',
          blob: result.audioBlob,
          durationMs,
        })
      }
    }

    // Calculate if we need padding silence to reach target duration
    const targetDurationMs = section.durationSeconds * 1000
    const currentDurationMs = audioSegments.reduce((sum, seg) => sum + seg.durationMs, 0)
    const paddingNeededMs = targetDurationMs - currentDurationMs

    if (paddingNeededMs > 0) {
      // Distribute padding: some at intro, rest at outro
      const introSilenceMs = section.silenceConfig?.introSilenceMs ?? Math.min(2000, paddingNeededMs * 0.3)
      const outroSilenceMs = paddingNeededMs - introSilenceMs

      // Add intro silence at the beginning
      if (introSilenceMs > 0) {
        audioSegments.unshift({
          type: 'silence',
          durationMs: introSilenceMs,
        })
      }

      // Add outro silence at the end
      if (outroSilenceMs > 0) {
        audioSegments.push({
          type: 'silence',
          durationMs: outroSilenceMs,
        })
      }
    }

    // Stitch all segments together
    onProgress?.(totalSegments, totalSegments, 'Stitching audio...')

    const audioBlob = await audioStitcher.stitch(
      audioSegments,
      targetDurationMs,
      { fadeInMs: 500, fadeOutMs: 1000 }
    )

    const durationSeconds = await audioStitcher.getDuration(audioBlob)

    return {
      sectionId: section.id,
      audioBlob,
      durationSeconds,
      audioUrl: URL.createObjectURL(audioBlob),
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
}

// Singleton instance
export const ritualAudioGenerator = new RitualAudioGenerator()
