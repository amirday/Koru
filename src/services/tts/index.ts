/**
 * TTS Service exports
 *
 * TTS requests are routed through the Python backend which handles:
 * - Google Gemini TTS
 * - ElevenLabs TTS
 *
 * The frontend only needs to call the TTSService which uses the backend API.
 * API keys are stored securely on the backend.
 */

// Service (use this - routes to backend API)
export { TTSService, getTTSService, initTTSService, resetTTSService } from './tts-service'
export type { TTSServiceConfig } from './tts-service'

// Mock provider (for testing/development without backend)
export { MockTTSProvider } from './MockTTSProvider'
