/**
 * Backend API Service exports
 */

export {
  // Error class
  BackendAPIError,

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
  type SynthesizeRequest,
  type SynthesizeResponse,

  // Health
  checkHealth,
  isBackendAvailable,
  type HealthStatus,
} from './backend-api'
