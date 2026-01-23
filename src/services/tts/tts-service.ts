/**
 * TTS Service - Provider selection and management
 * Selects appropriate TTS provider based on configuration
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice } from '@/types'
import { MockTTSProvider } from './MockTTSProvider'

/**
 * TTS Provider type configuration
 */
export type TTSProviderType = 'mock' | 'elevenlabs'

/**
 * TTS Service configuration
 */
export interface TTSServiceConfig {
  /** Provider to use */
  provider: TTSProviderType
  /** Default voice ID */
  defaultVoiceId?: string
}

/**
 * TTS Service - Manages TTS provider and provides unified API
 */
export class TTSService implements TTSProvider {
  private provider: TTSProvider
  private defaultVoiceId: string

  constructor(config: TTSServiceConfig = { provider: 'mock' }) {
    // Select provider based on config
    switch (config.provider) {
      case 'elevenlabs':
        // Future: ElevenLabsProvider
        console.warn('ElevenLabs provider not yet implemented, using mock')
        this.provider = new MockTTSProvider()
        break
      case 'mock':
      default:
        this.provider = new MockTTSProvider()
        break
    }

    // Set default voice ID
    this.defaultVoiceId =
      config.defaultVoiceId ??
      (this.provider instanceof MockTTSProvider
        ? this.provider.getDefaultVoiceId()
        : 'rachel')
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
}

// Singleton instance for easy access
let ttsServiceInstance: TTSService | null = null

/**
 * Get the singleton TTS service instance
 */
export function getTTSService(): TTSService {
  if (!ttsServiceInstance) {
    // Read provider from environment or default to mock
    const providerType =
      (import.meta.env.VITE_TTS_PROVIDER as TTSProviderType) || 'mock'

    ttsServiceInstance = new TTSService({ provider: providerType })
  }
  return ttsServiceInstance
}

/**
 * Reset the TTS service (for testing)
 */
export function resetTTSService(): void {
  ttsServiceInstance = null
}
