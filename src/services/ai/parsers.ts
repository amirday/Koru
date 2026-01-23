/**
 * Response parsing utilities for OpenAI ritual generation
 * Handles JSON extraction, validation, and transformation to Ritual model
 */

import type { Ritual, RitualSection, RitualSectionType, Segment } from '@/types'
import type { AIGenerationOptions } from '@/types'
import { Timestamp, getTextFromSegments } from '@/types'
import type { OpenAIRitualResponse, OpenAIRitualSectionResponse, OpenAISegmentResponse } from '@/types/openai'

/**
 * Extract JSON from OpenAI response content
 * Handles markdown code blocks and raw JSON
 */
export function extractJSON(content: string): string {
  // Try to extract from markdown code blocks first
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim()
  }

  // Try to find JSON object directly
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch?.[0]) {
    return jsonMatch[0]
  }

  // Return as-is if no extraction needed
  return content.trim()
}

/**
 * Parse and validate OpenAI ritual response
 * @throws Error if JSON is invalid or missing required fields
 */
export function parseRitualResponse(content: string): OpenAIRitualResponse {
  const jsonString = extractJSON(content)

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error(`Invalid JSON in response: ${jsonString.slice(0, 100)}...`)
  }

  // Validate required fields
  if (!isValidRitualResponse(parsed)) {
    throw new Error('Response missing required fields (title, sections, tags)')
  }

  return parsed
}

/**
 * Type guard for OpenAIRitualResponse
 */
function isValidRitualResponse(obj: unknown): obj is OpenAIRitualResponse {
  if (typeof obj !== 'object' || obj === null) return false

  const response = obj as Record<string, unknown>

  return (
    typeof response.title === 'string' &&
    Array.isArray(response.sections) &&
    response.sections.length > 0 &&
    response.sections.every(isValidSection) &&
    Array.isArray(response.tags)
  )
}

/**
 * Type guard for segment validation
 */
function isValidSegment(obj: unknown): obj is OpenAISegmentResponse {
  if (typeof obj !== 'object' || obj === null) return false

  const segment = obj as Record<string, unknown>

  // Must have type and durationSeconds
  if (typeof segment.type !== 'string') return false
  if (!['text', 'silence'].includes(segment.type)) return false
  if (typeof segment.durationSeconds !== 'number' || segment.durationSeconds < 0) return false

  // Text segments must have text field
  if (segment.type === 'text' && typeof segment.text !== 'string') return false

  return true
}

/**
 * Type guard for section validation
 * Supports both old guidanceText format and new segments format
 */
function isValidSection(obj: unknown): obj is OpenAIRitualSectionResponse {
  if (typeof obj !== 'object' || obj === null) return false

  const section = obj as Record<string, unknown>

  // Type and duration are required
  if (typeof section.type !== 'string') return false
  if (!['intro', 'body', 'silence', 'transition', 'closing'].includes(section.type)) return false
  if (typeof section.durationSeconds !== 'number' || section.durationSeconds <= 0) return false

  // Either segments array OR guidanceText must be present
  const hasSegments = Array.isArray(section.segments) && section.segments.length > 0
  const hasGuidanceText = typeof section.guidanceText === 'string'

  if (!hasSegments && !hasGuidanceText) return false

  // Validate segments if present
  if (hasSegments) {
    const segments = section.segments as unknown[]
    if (!segments.every(isValidSegment)) return false
  }

  return true
}

/**
 * Adjust section durations to match target total duration
 * Proportionally scales all sections to fit the target
 */
export function adjustDurations(
  sections: OpenAIRitualSectionResponse[],
  targetDuration: number
): OpenAIRitualSectionResponse[] {
  const currentTotal = sections.reduce((sum, s) => sum + s.durationSeconds, 0)

  if (currentTotal === targetDuration) {
    return sections
  }

  // Calculate scale factor
  const scale = targetDuration / currentTotal

  // Scale all sections
  const scaled = sections.map((section) => ({
    ...section,
    durationSeconds: Math.round(section.durationSeconds * scale),
  }))

  // Fix rounding errors by adjusting the body section (or largest section)
  const scaledTotal = scaled.reduce((sum, s) => sum + s.durationSeconds, 0)
  const diff = targetDuration - scaledTotal

  if (diff !== 0 && scaled.length > 0) {
    // Find the body section or largest section to absorb the difference
    const bodyIndex = scaled.findIndex((s) => s.type === 'body')
    let adjustIndex = bodyIndex >= 0 ? bodyIndex : 0

    // Find largest section if no body section
    if (bodyIndex < 0) {
      let maxDuration = 0
      scaled.forEach((s, idx) => {
        if (s.durationSeconds > maxDuration) {
          maxDuration = s.durationSeconds
          adjustIndex = idx
        }
      })
    }

    const sectionToAdjust = scaled[adjustIndex]
    if (sectionToAdjust) {
      scaled[adjustIndex] = {
        ...sectionToAdjust,
        durationSeconds: sectionToAdjust.durationSeconds + diff,
      }
    }
  }

  return scaled
}

/**
 * Convert OpenAI segments to our Segment type, or create segments from guidanceText
 */
function convertToSegments(
  section: OpenAIRitualSectionResponse,
  sectionId: string
): Segment[] {
  // If section has segments, convert them
  if (section.segments && section.segments.length > 0) {
    return section.segments.map((seg, idx) => ({
      id: `${sectionId}-seg-${idx}`,
      type: seg.type,
      text: seg.text,
      durationSeconds: seg.durationSeconds,
    }))
  }

  // Legacy format: convert guidanceText to a single text segment with surrounding silence
  const guidanceText = section.guidanceText || ''
  const segments: Segment[] = []

  if (section.type === 'silence' || !guidanceText) {
    // Pure silence section
    segments.push({
      id: `${sectionId}-seg-0`,
      type: 'silence',
      durationSeconds: section.durationSeconds,
    })
  } else {
    // Add intro silence (2s), text, and outro silence (remaining)
    const introSilence = 2
    const estimatedSpeechDuration = Math.min(
      section.durationSeconds - 4, // Leave at least 2s for outro
      Math.ceil((guidanceText.split(' ').length / 150) * 60) // ~150 words per minute
    )
    const outroSilence = Math.max(0, section.durationSeconds - introSilence - estimatedSpeechDuration)

    segments.push({
      id: `${sectionId}-seg-0`,
      type: 'silence',
      durationSeconds: introSilence,
    })
    segments.push({
      id: `${sectionId}-seg-1`,
      type: 'text',
      text: guidanceText,
      durationSeconds: estimatedSpeechDuration,
    })
    segments.push({
      id: `${sectionId}-seg-2`,
      type: 'silence',
      durationSeconds: outroSilence,
    })
  }

  return segments
}

/**
 * Transform OpenAI response to full Ritual model
 */
export function transformToRitual(
  response: OpenAIRitualResponse,
  options: AIGenerationOptions
): Ritual {
  const now = Timestamp.now()
  const ritualId = `ritual-${Date.now()}`

  // Adjust durations to match target
  const adjustedSections = adjustDurations(response.sections, options.duration)

  // Transform sections with segments
  const sections: RitualSection[] = adjustedSections.map((section, index) => {
    const sectionId = `section-${section.type}-${Date.now()}-${index}`
    const segments = convertToSegments(section, sectionId)

    return {
      id: sectionId,
      type: section.type as RitualSectionType,
      durationSeconds: section.durationSeconds,
      segments,
      // Keep guidanceText for backwards compatibility
      guidanceText: getTextFromSegments(segments),
      // Add silence duration for silence sections
      ...(section.type === 'silence' && {
        silenceDuration: section.durationSeconds,
      }),
    }
  })

  return {
    id: ritualId,
    title: response.title,
    instructions: options.instructions,
    duration: options.duration,
    tone: options.tone,
    pace: 'medium',
    includeSilence: options.includeSilence,
    soundscape: options.soundscape,
    sections,
    tags: response.tags.slice(0, 5), // Limit to 5 tags
    isTemplate: false,
    generatedFrom: {
      instructions: options.instructions,
      modelVersion: 'gpt-4o-mini',
    },
    createdAt: now,
    updatedAt: now,
    statistics: {
      id: `stats-${Date.now()}`,
      ritualId,
      isFavorite: false,
      usageCount: 0,
    },
  }
}

/**
 * Parse clarifying question response
 */
export interface ClarifyingQuestionResponse {
  needsClarification: boolean
  questionText?: string
  options?: string[]
}

export function parseClarifyingResponse(content: string): ClarifyingQuestionResponse {
  const jsonString = extractJSON(content)

  try {
    const parsed = JSON.parse(jsonString) as ClarifyingQuestionResponse
    return {
      needsClarification: Boolean(parsed.needsClarification),
      questionText: parsed.questionText,
      options: parsed.options,
    }
  } catch {
    // Default to no clarification needed if parsing fails
    return { needsClarification: false }
  }
}
