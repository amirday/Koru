/**
 * Audio utility functions
 * Helpers for audio duration detection, format conversion, etc.
 */

/**
 * Get the duration of an audio blob in seconds
 * Uses Web Audio API to decode and measure
 */
export async function getAudioDuration(blob: Blob): Promise<number> {
  const audioContext = new AudioContext()

  try {
    const arrayBuffer = await blob.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer.duration
  } finally {
    await audioContext.close()
  }
}

/**
 * Create an audio blob URL
 * Remember to revoke when done to free memory
 */
export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}

/**
 * Revoke an audio blob URL to free memory
 */
export function revokeAudioUrl(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * Convert an audio blob to a different format (future use)
 * Currently just returns the blob as-is
 */
export async function convertAudioFormat(
  blob: Blob,
  _targetFormat: 'wav' | 'mp3' = 'wav'
): Promise<Blob> {
  // For now, just return the blob as-is
  // Future: implement actual format conversion using MediaRecorder or external library
  return blob
}

/**
 * Check if Web Audio API is supported
 */
export function isWebAudioSupported(): boolean {
  return typeof AudioContext !== 'undefined' || typeof window.AudioContext !== 'undefined'
}

/**
 * Calculate estimated speech duration for text
 * Based on average speaking rate of ~150 words per minute
 */
export function estimateSpeechDuration(text: string, wordsPerMinute = 150): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return (wordCount / wordsPerMinute) * 60
}

/**
 * Format duration in seconds to MM:SS string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
