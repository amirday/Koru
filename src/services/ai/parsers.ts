/**
 * Response parsing utilities for OpenAI ritual generation
 * Handles JSON extraction, validation, and transformation to Ritual model
 */

import type { Ritual, RitualSection, RitualSectionType } from '@/types'
import type { AIGenerationOptions } from '@/types'
import { Timestamp } from '@/types'
import type { OpenAIRitualResponse, OpenAIRitualSectionResponse } from '@/types/openai'

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
 * Type guard for section validation
 */
function isValidSection(obj: unknown): obj is OpenAIRitualSectionResponse {
  if (typeof obj !== 'object' || obj === null) return false

  const section = obj as Record<string, unknown>

  return (
    typeof section.type === 'string' &&
    ['intro', 'body', 'silence', 'transition', 'closing'].includes(section.type) &&
    typeof section.durationSeconds === 'number' &&
    section.durationSeconds > 0 &&
    typeof section.guidanceText === 'string'
  )
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

  // Transform sections
  const sections: RitualSection[] = adjustedSections.map((section, index) => ({
    id: `section-${section.type}-${Date.now()}-${index}`,
    type: section.type as RitualSectionType,
    durationSeconds: section.durationSeconds,
    guidanceText: section.guidanceText,
    // Add silence duration for silence sections
    ...(section.type === 'silence' && {
      silenceDuration: section.durationSeconds,
    }),
  }))

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
