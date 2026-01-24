/**
 * Backend API Service exports
 */

export {
  // Error class
  BackendAPIError,

  // Utils
  getProviderFromVoiceId,

  // Ritual generation
  generateRitual,
  type GenerateRitualRequest,
  type GenerateRitualResponse,

  // Rituals CRUD
  getRituals,
  getRitual,
  createRitual,
  deleteRitual,

  // TTS
  synthesizeSpeech,
  getVoices,
  getAudioUrl,
  getRitualAudioStatus,
  generateRitualAudio,
  type SynthesizeRequest,
  type SynthesizeResponse,
  type RitualAudioStatusResponse,
  type GenerateRitualAudioRequest,
  type GenerateRitualAudioResponse,

  // Health
  checkHealth,
  isBackendAvailable,
  type HealthStatus,
} from './backend-api'
