/**
 * TTS Service - Provider selection and management
 * Selects appropriate TTS provider based on configuration
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice } from '@/types'
import { MockTTSProvider } from './MockTTSProvider'
import { GoogleTTSProvider } from './GoogleTTSProvider'

/**
 * TTS Provider type configuration
 */
export type TTSProviderType = 'mock' | 'google'

/**
 * TTS Service configuration
 */
export interface TTSServiceConfig {
  /** Provider to use */
  provider: TTSProviderType
  /** API key for the provider (required for google) */
  apiKey?: string
  /** Default voice ID */
  defaultVoiceId?: string
}

/**
 * TTS Service - Manages TTS provider and provides unified API
 */
export class TTSService implements TTSProvider {
  private provider: TTSProvider
  private providerType: TTSProviderType
  private defaultVoiceId: string

  constructor(config: TTSServiceConfig = { provider: 'mock' }) {
    this.providerType = config.provider

    // Select provider based on config
    switch (config.provider) {
      case 'google':
        if (!config.apiKey) {
          console.warn('Google TTS provider requires API key, falling back to mock')
          this.provider = new MockTTSProvider()
          this.providerType = 'mock'
        } else {
          this.provider = new GoogleTTSProvider(config.apiKey)
        }
        break
      case 'mock':
      default:
        this.provider = new MockTTSProvider()
        break
    }

    // Set default voice ID
    this.defaultVoiceId =
      config.defaultVoiceId ??
      (this.provider instanceof MockTTSProvider || this.provider instanceof GoogleTTSProvider
        ? this.provider.getDefaultVoiceId()
        : 'Aoede')
  }

  /**
   * Synthesize text to speech
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const voiceId = options.voiceId ?? this.defaultVoiceId
    return this.provider.synthesize({
      ...options,
      voiceId,
    })
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<Voice[]> {
    return this.provider.getVoices()
  }

  /**
   * Get preview audio URL for a voice
   */
  async getVoicePreview(voiceId: string): Promise<string> {
    return this.provider.getVoicePreview(voiceId)
  }

  /**
   * Check if provider is available
   */
  async isAvailable(): Promise<boolean> {
    return this.provider.isAvailable()
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
   * Get current provider type
   */
  getProviderType(): TTSProviderType {
    return this.providerType
  }

  /**
   * Check if using real TTS (not mock)
   */
  isRealTTS(): boolean {
    return this.providerType !== 'mock'
  }
}

// Singleton instance for easy access
let ttsServiceInstance: TTSService | null = null

/**
 * Get the singleton TTS service instance
 */
export function getTTSService(): TTSService {
  if (!ttsServiceInstance) {
    // Read provider and API key from environment
    const providerType =
      (import.meta.env.VITE_TTS_PROVIDER as TTSProviderType) || 'mock'
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

    ttsServiceInstance = new TTSService({
      provider: providerType,
      apiKey,
    })
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
