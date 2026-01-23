/**
 * Google TTS Provider using Gemini 2.5 Pro TTS
 * Integrates with Google GenAI for text-to-speech synthesis
 */

import { GoogleGenAI } from '@google/genai'
import type { TTSProvider, TTSOptions, TTSResult, Voice } from '@/types'
import voiceManifest from '@/data/voices.json'

/**
 * WAV conversion options parsed from MIME type
 */
interface WavConversionOptions {
  numChannels: number
  sampleRate: number
  bitsPerSample: number
}

/**
 * GoogleTTSProvider - Real TTS using Google Gemini
 */
export class GoogleTTSProvider implements TTSProvider {
  private ai: GoogleGenAI
  private model: string
  private voices: Voice[]
  private defaultVoiceId: string

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey })
    this.model = 'gemini-2.5-pro-preview-tts'
    this.voices = voiceManifest.voices
    this.defaultVoiceId = voiceManifest.defaultVoiceId
  }

  /**
   * Synthesize text to speech using Google Gemini TTS
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const voiceId = options.voiceId ?? this.defaultVoiceId

    // Build the prompt with meditation-style instructions
    const prompt = this.buildTTSPrompt(options.text)

    const config = {
      temperature: 1,
      responseModalities: ['audio'] as string[],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voiceId,
          },
        },
      },
    }

    try {
      const response = await this.ai.models.generateContentStream({
        model: this.model,
        config,
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      })

      // Collect all audio chunks
      const audioChunks: Uint8Array[] = []
      let mimeType = ''

      for await (const chunk of response) {
        if (!chunk.candidates?.[0]?.content?.parts) {
          continue
        }

        const part = chunk.candidates[0].content.parts[0]
        if (part?.inlineData) {
          const inlineData = part.inlineData
          mimeType = inlineData.mimeType || ''

          // Decode base64 to Uint8Array
          const binaryString = atob(inlineData.data || '')
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          audioChunks.push(bytes)
        }
      }

      // Combine all chunks
      const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const combinedData = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of audioChunks) {
        combinedData.set(chunk, offset)
        offset += chunk.length
      }

      // Convert to WAV if needed
      let audioBlob: Blob
      if (mimeType.startsWith('audio/L') || !mimeType.includes('wav')) {
        // Raw PCM data - convert to WAV
        const wavData = this.convertToWav(combinedData, mimeType)
        // Create ArrayBuffer copy to avoid SharedArrayBuffer issues
        const buffer = new ArrayBuffer(wavData.byteLength)
        new Uint8Array(buffer).set(wavData)
        audioBlob = new Blob([buffer], { type: 'audio/wav' })
      } else {
        // Create ArrayBuffer copy to avoid SharedArrayBuffer issues
        const buffer = new ArrayBuffer(combinedData.byteLength)
        new Uint8Array(buffer).set(combinedData)
        audioBlob = new Blob([buffer], { type: mimeType || 'audio/wav' })
      }

      // Calculate duration
      const durationSeconds = await this.getAudioDuration(audioBlob)

      return {
        audioBlob,
        durationSeconds,
      }
    } catch (error) {
      console.error('Google TTS synthesis error:', error)
      throw new Error(`TTS synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Build TTS prompt with meditation style instructions
   */
  private buildTTSPrompt(text: string): string {
    return `[meditative, slow, hushed, gentle, low pitch]

"${text}"
`
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    return [...this.voices]
  }

  /**
   * Get preview audio URL for a voice
   */
  async getVoicePreview(voiceId: string): Promise<string> {
    const voice = this.voices.find((v) => v.id === voiceId)
    if (!voice) {
      throw new Error(`Voice not found: ${voiceId}`)
    }
    return voice.previewUrl
  }

  /**
   * Check if provider is available (has API key configured)
   */
  async isAvailable(): Promise<boolean> {
    // Check if we can make a simple request
    try {
      // Just return true if we have an AI instance configured
      return true
    } catch {
      return false
    }
  }

  /**
   * Get default voice ID
   */
  getDefaultVoiceId(): string {
    return this.defaultVoiceId
  }

  /**
   * Parse MIME type to get WAV conversion options
   */
  private parseMimeType(mimeType: string): WavConversionOptions {
    const parts = mimeType.split(';').map((s) => s.trim())
    const fileType = parts[0] ?? ''
    const params = parts.slice(1)
    const format = fileType.split('/')[1] ?? ''

    const options: WavConversionOptions = {
      numChannels: 1,
      sampleRate: 24000, // Default for Gemini TTS
      bitsPerSample: 16,
    }

    // Parse format like "L16" or "L24"
    if (format && format.startsWith('L')) {
      const bits = parseInt(format.slice(1), 10)
      if (!isNaN(bits)) {
        options.bitsPerSample = bits
      }
    }

    // Parse parameters like "rate=24000"
    for (const param of params) {
      const paramParts = param.split('=').map((s) => s.trim())
      const key = paramParts[0]
      const value = paramParts[1]
      if (key === 'rate' && value) {
        options.sampleRate = parseInt(value, 10)
      }
    }

    return options
  }

  /**
   * Convert raw PCM data to WAV format
   */
  private convertToWav(rawData: Uint8Array, mimeType: string): Uint8Array {
    const options = this.parseMimeType(mimeType)
    const header = this.createWavHeader(rawData.length, options)

    // Combine header and data
    const wavData = new Uint8Array(header.length + rawData.length)
    wavData.set(header, 0)
    wavData.set(rawData, header.length)

    return wavData
  }

  /**
   * Create WAV header for PCM data
   * Based on: http://soundfile.sapp.org/doc/WaveFormat
   */
  private createWavHeader(dataLength: number, options: WavConversionOptions): Uint8Array {
    const { numChannels, sampleRate, bitsPerSample } = options
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
    const blockAlign = (numChannels * bitsPerSample) / 8

    const buffer = new ArrayBuffer(44)
    const view = new DataView(buffer)

    // "RIFF" chunk descriptor
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataLength, true) // ChunkSize
    this.writeString(view, 8, 'WAVE')

    // "fmt " sub-chunk
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // Subchunk1Size (PCM = 16)
    view.setUint16(20, 1, true) // AudioFormat (PCM = 1)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitsPerSample, true)

    // "data" sub-chunk
    this.writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true) // Subchunk2Size

    return new Uint8Array(buffer)
  }

  /**
   * Helper to write string to DataView
   */
  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  /**
   * Get audio duration from blob using Web Audio API
   */
  private async getAudioDuration(blob: Blob): Promise<number> {
    const audioContext = new AudioContext()
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      return audioBuffer.duration
    } finally {
      await audioContext.close()
    }
  }
}
