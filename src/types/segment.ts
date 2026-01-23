/**
 * Segment types for TTS and audio stitching
 * A segment is either text (to be spoken) or silence (pause)
 */

/**
 * A segment is either text/speech or silence.
 * This same structure is used at all stages:
 * 1. Text generation (OpenAI) - creates segments with text
 * 2. Audio generation (TTS) - adds audioBlob to segments
 */
export interface Segment {
  /** Unique identifier */
  id: string
  /** Segment type: text for spoken content, silence for pauses */
  type: 'text' | 'silence'

  // For text segments
  /** The text content (filled by OpenAI for text segments) */
  text?: string

  // Duration
  /** Target duration for this segment in seconds */
  durationSeconds: number

  // Audio (populated after TTS generation)
  /** Generated audio blob (populated after TTS) */
  audioBlob?: Blob
  /** Measured actual audio duration in seconds */
  actualDurationSeconds?: number
}

/**
 * Configuration for silence distribution within a section
 */
export interface SilenceConfig {
  /** Pause before speech starts in milliseconds (default: 2000) */
  introSilenceMs: number
  /** Pause after speech ends in milliseconds (calculated: target - tts_duration - intro) */
  outroSilenceMs: number
}

/**
 * Create a text segment
 */
export function createTextSegment(
  id: string,
  text: string,
  durationSeconds: number
): Segment {
  return {
    id,
    type: 'text',
    text,
    durationSeconds,
  }
}

/**
 * Create a silence segment
 */
export function createSilenceSegment(
  id: string,
  durationSeconds: number
): Segment {
  return {
    id,
    type: 'silence',
    durationSeconds,
  }
}

/**
 * Get concatenated text from all text segments
 * Used for backwards compatibility with guidanceText
 */
export function getTextFromSegments(segments: Segment[]): string {
  return segments
    .filter((s) => s.type === 'text' && s.text)
    .map((s) => s.text)
    .join(' ')
}

/**
 * Calculate total duration of segments
 */
export function getTotalDuration(segments: Segment[]): number {
  return segments.reduce((sum, s) => sum + s.durationSeconds, 0)
}

/**
 * Type guard to check if a segment is a text segment
 */
export function isTextSegment(segment: Segment): segment is Segment & { type: 'text'; text: string } {
  return segment.type === 'text' && typeof segment.text === 'string'
}

/**
 * Type guard to check if a segment is a silence segment
 */
export function isSilenceSegment(segment: Segment): segment is Segment & { type: 'silence' } {
  return segment.type === 'silence'
}
