/**
 * TTS Service exports
 *
 * Supported providers:
 * - mock: Silent audio for testing
 * - google: Google Gemini TTS (voice-based routing)
 * - elevenlabs: ElevenLabs TTS (voice-based routing)
 *
 * Provider selection is automatic based on voice.provider field.
 * Configure API keys in .env:
 * - VITE_GEMINI_API_KEY for Google voices
 * - VITE_ELEVENLABS_API_KEY for ElevenLabs voices
 */

// Service (use this - abstracts providers from the app)
export { TTSService, getTTSService, initTTSService, resetTTSService } from './tts-service'
export type { TTSServiceConfig } from './tts-service'

// Providers (internal use only - don't import these directly in app code)
export { MockTTSProvider } from './MockTTSProvider'
export { GoogleTTSProvider } from './GoogleTTSProvider'
export { ElevenLabsTTSProvider } from './ElevenLabsTTSProvider'
