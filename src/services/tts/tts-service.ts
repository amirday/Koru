/**
 * TTS Service - Routes TTS requests through the backend API
 * All TTS synthesis happens on the backend to keep API keys secure
 */

import type { TTSProvider, TTSOptions, TTSResult, Voice, TTSProviderType } from '@/types'
import { synthesizeSpeech, getVoices as fetchVoices, getAudioUrl } from '@/services/api'
import { MockTTSProvider } from './MockTTSProvider'
import voiceManifest from '@/data/voices.json'

// Re-export TTSProviderType for backward compatibility
export type { TTSProviderType } from '@/types'

/**
 * TTS Service configuration
 */
export interface TTSServiceConfig {
  /** Use mock provider instead of backend (for testing) */
  useMock?: boolean
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
 * TTS Service - Routes to backend API for real TTS
 * Falls back to mock provider if backend is unavailable
 */
export class TTSService implements TTSProvider {
  private mockProvider: TTSProviderWithDefault
  private voices: Voice[]
  private defaultVoiceId: string
  private useMock: boolean

  constructor(config: TTSServiceConfig = {}) {
    this.mockProvider = new MockTTSProvider()
    this.useMock = config.useMock ?? false

    // Load voices from manifest (used for voice metadata/previews)
    this.voices = voiceManifest.voices as Voice[]
    this.defaultVoiceId = config.defaultVoiceId ?? voiceManifest.defaultVoiceId
  }

  /**
   * Synthesize text to speech via backend API
   */
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const voiceId = options.voiceId ?? this.defaultVoiceId

    // Use mock for testing
    if (this.useMock) {
      return this.mockProvider.synthesize({ ...options, voiceId })
    }

    // Get voice info to determine provider
    const voice = this.voices.find(v => v.id === voiceId)
    const provider = voice?.provider === 'mock' ? undefined : voice?.provider

    // If voice is mock type, use mock provider
    if (voice?.provider === 'mock') {
      return this.mockProvider.synthesize({ ...options, voiceId })
    }

    console.log(`[TTSService] Synthesizing via backend with voice ${voiceId}`)

    try {
      // Call backend API
      const response = await synthesizeSpeech({
        text: options.text,
        voiceId,
        provider: provider as 'elevenlabs' | 'google' | undefined,
        speed: options.speed,
      })

      // Fetch the audio from the backend
      const audioUrl = getAudioUrl(response.audioUrl)
      const audioResponse = await fetch(audioUrl)
      const audioBlob = await audioResponse.blob()

      return {
        audioBlob,
        durationSeconds: response.durationSeconds,
      }
    } catch (error) {
      console.error('[TTSService] Backend synthesis failed:', error)
      throw error
    }
  }

  /**
   * Get all available voices from the manifest
   * (Voice metadata is loaded from local manifest, not backend)
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
   * Check if backend TTS is available
   */
  async isAvailable(): Promise<boolean> {
    if (this.useMock) return true

    try {
      // Try to fetch voices from backend to check availability
      await fetchVoices()
      return true
    } catch {
      return false
    }
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
   * Check if a voice is available (always true for backend-routed voices)
   */
  isVoiceAvailable(voiceId: string): boolean {
    const voice = this.voices.find(v => v.id === voiceId)
    if (!voice) return false

    // Mock voices are always available
    if (voice.provider === 'mock') return true

    // Real voices depend on backend availability
    // For now, assume they're available (backend has the keys)
    return true
  }

  /**
   * Get list of available voices
   */
  async getAvailableVoices(): Promise<Voice[]> {
    return this.voices.filter(v => this.isVoiceAvailable(v.id))
  }

  /**
   * Check if real TTS is configured (always true when using backend)
   */
  isRealTTS(): boolean {
    return !this.useMock
  }
}

// Singleton instance for easy access
let ttsServiceInstance: TTSService | null = null

/**
 * Get the singleton TTS service instance
 */
export function getTTSService(): TTSService {
  if (!ttsServiceInstance) {
    ttsServiceInstance = new TTSService()
    console.log('[TTSService] Initialized - using backend API for TTS')
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
