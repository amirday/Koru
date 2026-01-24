/**
 * Ritual Audio Types
 * Types for audio generation progress and section audio data
 */

import type { SegmentAudio } from '../audio/AudioSequencer'

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
