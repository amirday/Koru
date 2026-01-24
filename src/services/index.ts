/**
 * Central export point for all services
 * Import from '@/services' to access service instances
 */

// Backend API (primary interface for all backend operations)
export * from './api'

// Storage (deprecated - use backend API instead)
export { storageService } from './storage/storage-service'
export { LocalStorageAdapter } from './storage/LocalStorageAdapter'

// AI (deprecated - use backend API instead)
export { aiService } from './ai/ai-service'
export { MockAIProvider } from './ai/MockAIProvider'

// Background tasks
export { backgroundTaskService } from './background/background-task-service'

// Notifications
export { notificationService } from './notification/notification-service'
export type {
  NotificationOptions,
  NotificationPermission,
  NotificationService,
} from './notification/notification-service'

// TTS
export { TTSService, MockTTSProvider, getTTSService, resetTTSService } from './tts'
export type { TTSServiceConfig } from './tts'

// Audio
export { AudioStitcher, audioStitcher, AudioCache, audioCache } from './audio'
export type { AudioSegment, FadeOptions, AudioCacheEntry } from './audio'
export {
  getAudioDuration,
  createAudioUrl,
  revokeAudioUrl,
  isWebAudioSupported,
  estimateSpeechDuration,
  formatDuration,
} from './audio'

// Ritual Audio
export { RitualAudioGenerator, ritualAudioGenerator } from './ritual-audio'
export type {
  GenerationProgress,
  SectionAudio,
  RitualAudioResult,
} from './ritual-audio'
