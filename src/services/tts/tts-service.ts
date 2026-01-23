/**
 * TTS Service - Voice-based provider routing
 * Routes TTS requests to the correct provider based on voice selection
 * Supports: mock, google (Gemini), elevenlabs
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice, TTSProviderType } from '@/types'
import { MockTTSProvider } from './MockTTSProvider'
import { GoogleTTSProvider } from './GoogleTTSProvider'
import { ElevenLabsTTSProvider } from './ElevenLabsTTSProvider'
import voiceManifest from '@/data/voices.json'

// Re-export TTSProviderType for backward compatibility
export type { TTSProviderType } from '@/types'

/**
 * TTS Service configuration
 */
export interface TTSServiceConfig {
  /** API key for Google TTS (Gemini) */
  googleApiKey?: string
  /** API key for ElevenLabs */
  elevenLabsApiKey?: string
  /** Default voice ID */
  defaultVoiceId?: string
}

/**
 * Provider interface with getDefaultVoiceId
 */
interface TTSProviderWithDefault extends TTSProvider {
  getDefaultVoiceId(): string
}

/**
 * TTS Service - Routes to correct provider based on voice selection
 * The application interacts only with this service, not providers directly
 */
export class TTSService implements TTSProvider {
  private mockProvider: TTSProviderWithDefault
  private googleProvider: TTSProviderWithDefault | null = null
  private elevenLabsProvider: TTSProviderWithDefault | null = null
  private voices: Voice[]
  private defaultVoiceId: string

  constructor(config: TTSServiceConfig = {}) {
    // Always have mock provider available
    this.mockProvider = new MockTTSProvider()

    // Initialize Google provider if API key available
    if (config.googleApiKey) {
      this.googleProvider = new GoogleTTSProvider(config.googleApiKey)
    }

    // Initialize ElevenLabs provider if API key available
    if (config.elevenLabsApiKey) {
      this.elevenLabsProvider = new ElevenLabsTTSProvider(config.elevenLabsApiKey)
    }

    // Load voices from manifest
    this.voices = voiceManifest.voices as Voice[]
    this.defaultVoiceId = config.defaultVoiceId ?? voiceManifest.defaultVoiceId
  }

  /**
   * Get the provider for a specific voice
   */
  private getProviderForVoice(voiceId: string): TTSProviderWithDefault {
    const voice = this.voices.find(v => v.id === voiceId)

    if (!voice) {
      console.warn(`[TTSService] Voice ${voiceId} not found, using mock provider`)
      return this.mockProvider
    }

    switch (voice.provider) {
      case 'google':
        if (!this.googleProvider) {
          throw new Error(
            `Google TTS provider not configured. Set VITE_GEMINI_API_KEY in .env to use voice "${voice.name}"`
          )
        }
        return this.googleProvider

      case 'elevenlabs':
        if (!this.elevenLabsProvider) {
          throw new Error(
            `ElevenLabs TTS provider not configured. Set VITE_ELEVENLABS_API_KEY in .env to use voice "${voice.name}"`
          )
        }
        return this.elevenLabsProvider

      case 'mock':
      default:
        return this.mockProvider
    }
  }

  /**
   * Synthesize text to speech using the provider for the selected voice
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const voiceId = options.voiceId ?? this.defaultVoiceId
    const provider = this.getProviderForVoice(voiceId)

    console.log(`[TTSService] Synthesizing with voice ${voiceId}`)

    return provider.synthesize({
      ...options,
      voiceId,
    })
  }

  /**
   * Get all available voices from the manifest
   */
  async getVoices(): Promise<Voice[]> {
    return [...this.voices]
  }

  /**
   * Get preview audio URL for a voice
   */
  async getVoicePreview(voiceId: string): Promise<string> {
    const voice = this.voices.find(v => v.id === voiceId)
    if (!voice) {
      throw new Error(`Voice not found: ${voiceId}`)
    }
    return voice.previewUrl
  }

  /**
   * Check if at least one real provider is available
   */
  async isAvailable(): Promise<boolean> {
    return this.googleProvider !== null || this.elevenLabsProvider !== null
  }

  /**
   * Get current default voice ID
   */
  getDefaultVoiceId(): string {
    return this.defaultVoiceId
  }

  /**
   * Set default voice ID
   */
  setDefaultVoiceId(voiceId: string): void {
    this.defaultVoiceId = voiceId
  }

  /**
   * Get provider type for a specific voice
   */
  getProviderTypeForVoice(voiceId: string): TTSProviderType {
    const voice = this.voices.find(v => v.id === voiceId)
    return voice?.provider ?? 'mock'
  }

  /**
   * Check if a voice's provider is configured
   */
  isVoiceAvailable(voiceId: string): boolean {
    const voice = this.voices.find(v => v.id === voiceId)
    if (!voice) return false

    switch (voice.provider) {
      case 'google':
        return this.googleProvider !== null
      case 'elevenlabs':
        return this.elevenLabsProvider !== null
      case 'mock':
        return true
      default:
        return false
    }
  }

  /**
   * Get list of available voices (only those whose provider is configured)
   */
  async getAvailableVoices(): Promise<Voice[]> {
    return this.voices.filter(v => this.isVoiceAvailable(v.id))
  }

  /**
   * Check if at least one real TTS provider is configured (not mock)
   */
  isRealTTS(): boolean {
    return this.googleProvider !== null || this.elevenLabsProvider !== null
  }
}

// Singleton instance for easy access
let ttsServiceInstance: TTSService | null = null

/**
 * Get the singleton TTS service instance
 * Reads configuration from environment variables
 */
export function getTTSService(): TTSService {
  if (!ttsServiceInstance) {
    ttsServiceInstance = new TTSService({
      googleApiKey: import.meta.env.VITE_GEMINI_API_KEY as string | undefined,
      elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined,
    })

    const hasGoogle = import.meta.env.VITE_GEMINI_API_KEY ? 'yes' : 'no'
    const hasElevenlabs = import.meta.env.VITE_ELEVENLABS_API_KEY ? 'yes' : 'no'
    console.log(`[TTSService] Initialized - Google: ${hasGoogle}, ElevenLabs: ${hasElevenlabs}`)
  }
  return ttsServiceInstance
}

/**
 * Initialize TTS service with specific config
 * Call this to override the default singleton configuration
 */
export function initTTSService(config: TTSServiceConfig): TTSService {
  ttsServiceInstance = new TTSService(config)
  return ttsServiceInstance
}

/**
 * Reset the TTS service (for testing)
 */
export function resetTTSService(): void {
  ttsServiceInstance = null
}
