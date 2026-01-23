/**
 * Mock TTS Provider for UI/UX development phase
 * Returns generated silence or bundled sample audio
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice } from '@/types'
import voiceManifest from '@/data/voices.json'

/**
 * MockTTSProvider - Returns silence audio for development
 * Simulates TTS generation with realistic timing
 */
export class MockTTSProvider implements TTSProvider {
  private voices: Voice[]
  private defaultVoiceId: string

  constructor() {
    this.voices = voiceManifest.voices
    this.defaultVoiceId = voiceManifest.defaultVoiceId
  }

  /**
   * Synthesize text to speech (mock implementation)
   * Returns generated silence audio with estimated duration
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    // Estimate speech duration based on word count (~150 words per minute)
    const wordCount = options.text.split(/\s+/).length
    const estimatedDuration = (wordCount / 150) * 60

    // Apply speed multiplier
    const speed = options.speed ?? 1.0
    const actualDuration = estimatedDuration / speed

    // Simulate processing delay
    await this.simulateDelay(300, 800)

    // Generate silent audio blob (WAV format)
    const audioBlob = this.generateSilentAudio(actualDuration)

    return {
      audioBlob,
      durationSeconds: actualDuration,
    }
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    await this.simulateDelay(100, 200)
    return [...this.voices]
  }

  /**
   * Get preview audio URL for a voice
   * Returns the bundled preview audio path
   */
  async getVoicePreview(voiceId: string): Promise<string> {
    const voice = this.voices.find((v) => v.id === voiceId)
    if (!voice) {
      throw new Error(`Voice not found: ${voiceId}`)
    }
    return voice.previewUrl
  }

  /**
   * Check if provider is available
   * Mock provider is always available
   */
  async isAvailable(): Promise<boolean> {
    return true
  }

  /**
   * Get default voice ID
   */
  getDefaultVoiceId(): string {
    return this.defaultVoiceId
  }

  /**
   * Simulate network/processing delay
   */
  private simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs)
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  /**
   * Generate silent audio as WAV blob
   * Creates a valid WAV file with silence for the specified duration
   */
  private generateSilentAudio(durationSeconds: number): Blob {
    const sampleRate = 44100
    const numChannels = 1
    const bitsPerSample = 16
    const numSamples = Math.floor(sampleRate * durationSeconds)

    // Calculate sizes
    const dataSize = numSamples * numChannels * (bitsPerSample / 8)
    const headerSize = 44
    const fileSize = headerSize + dataSize

    // Create buffer
    const buffer = new ArrayBuffer(fileSize)
    const view = new DataView(buffer)

    // Write WAV header
    let offset = 0

    // RIFF chunk descriptor
    this.writeString(view, offset, 'RIFF')
    offset += 4
    view.setUint32(offset, fileSize - 8, true) // File size - 8
    offset += 4
    this.writeString(view, offset, 'WAVE')
    offset += 4

    // fmt sub-chunk
    this.writeString(view, offset, 'fmt ')
    offset += 4
    view.setUint32(offset, 16, true) // Subchunk1Size for PCM
    offset += 4
    view.setUint16(offset, 1, true) // AudioFormat: PCM = 1
    offset += 2
    view.setUint16(offset, numChannels, true) // NumChannels
    offset += 2
    view.setUint32(offset, sampleRate, true) // SampleRate
    offset += 4
    view.setUint32(offset, sampleRate * numChannels * (bitsPerSample / 8), true) // ByteRate
    offset += 4
    view.setUint16(offset, numChannels * (bitsPerSample / 8), true) // BlockAlign
    offset += 2
    view.setUint16(offset, bitsPerSample, true) // BitsPerSample
    offset += 2

    // data sub-chunk
    this.writeString(view, offset, 'data')
    offset += 4
    view.setUint32(offset, dataSize, true) // Subchunk2Size
    offset += 4

    // Audio data is already zero (silence) because ArrayBuffer is zero-initialized

    return new Blob([buffer], { type: 'audio/wav' })
  }

  /**
   * Helper to write string to DataView
   */
  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }
}
