/**
 * ElevenLabs TTS Provider
 * Integrates with ElevenLabs API for text-to-speech synthesis
 * https://docs.elevenlabs.io/api-reference/text-to-speech
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice } from '@/types'

/**
 * ElevenLabs API base URL
 */
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1'

/**
 * Rate limit configuration
 */
const RATE_LIMIT_COOLDOWN_MS = 60000

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Default ElevenLabs voices (subset of available voices)
 * These are well-suited for meditation/calm content
 */
const DEFAULT_VOICES: Voice[] = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    provider: 'elevenlabs',
    description: 'Soft and calm American female voice',
    labels: ['calm', 'female', 'american'],
    previewUrl: '/audio/previews/elevenlabs-sarah.mp3',
    previewText: 'Welcome to your meditation practice.',
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    provider: 'elevenlabs',
    description: 'Warm British male voice',
    labels: ['warm', 'male', 'british'],
    previewUrl: '/audio/previews/elevenlabs-daniel.mp3',
    previewText: 'Take a deep breath and relax.',
  },
  {
    id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    provider: 'elevenlabs',
    description: 'Gentle and soothing female voice',
    labels: ['gentle', 'female', 'neutral'],
    previewUrl: '/audio/previews/elevenlabs-charlotte.mp3',
    previewText: 'Let your thoughts drift away.',
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'Lily',
    provider: 'elevenlabs',
    description: 'Peaceful British female voice',
    labels: ['peaceful', 'female', 'british'],
    previewUrl: '/audio/previews/elevenlabs-lily.mp3',
    previewText: 'Find your center and breathe.',
  },
  {
    id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'Liam',
    provider: 'elevenlabs',
    description: 'Calm American male voice',
    labels: ['calm', 'male', 'american'],
    previewUrl: '/audio/previews/elevenlabs-liam.mp3',
    previewText: 'Be present in this moment.',
  },
]

const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah

/**
 * ElevenLabsTTSProvider - TTS using ElevenLabs API
 */
export class ElevenLabsTTSProvider implements TTSProvider {
  private apiKey: string
  private voices: Voice[]
  private defaultVoiceId: string
  private rateLimitedUntil: number = 0

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.voices = DEFAULT_VOICES
    this.defaultVoiceId = DEFAULT_VOICE_ID
  }

  /**
   * Check if currently rate limited
   */
  isRateLimited(): boolean {
    return Date.now() < this.rateLimitedUntil
  }

  /**
   * Synthesize text to speech using ElevenLabs API
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const requestId = Date.now()
    console.log(`[ElevenLabs] Request ${requestId} STARTED - text: "${options.text.slice(0, 40)}..."`)

    // If rate limited, wait for cooldown
    if (this.isRateLimited()) {
      const waitTime = this.rateLimitedUntil - Date.now()
      if (waitTime > 0) {
        console.log(`[ElevenLabs] Request ${requestId} - Rate limited, waiting ${Math.ceil(waitTime / 1000)}s for cooldown...`)
        await sleep(waitTime + 1000)
      }
    }

    const voiceId = options.voiceId ?? this.defaultVoiceId

    try {
      const response = await fetch(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: options.text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.75, // Higher for more consistent, calmer voice
              similarity_boost: 0.75,
              style: 0.5, // Moderate expressiveness
              use_speaker_boost: true,
            },
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited
          this.rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS
          console.warn('[ElevenLabs] Rate limited, setting cooldown')
          throw new Error('RATE_LIMITED: ElevenLabs rate limit exceeded')
        }

        const errorText = await response.text()
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`)
      }

      // Get audio blob
      const audioBlob = await response.blob()

      // Calculate duration from audio
      const durationSeconds = await this.getAudioDuration(audioBlob)

      console.log(`[ElevenLabs] Request ${requestId} COMPLETED - duration: ${durationSeconds.toFixed(2)}s`)

      return {
        audioBlob,
        durationSeconds,
      }
    } catch (error) {
      console.error(`[ElevenLabs] Request ${requestId} FAILED:`, error)
      throw error
    }
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    // Return cached voices
    // Could be enhanced to fetch from ElevenLabs API: GET /v1/voices
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
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Quick check - just verify API key works
      const response = await fetch(`${ELEVENLABS_API_URL}/user`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      })
      return response.ok
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
