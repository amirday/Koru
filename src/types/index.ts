/**
 * Central export point for all types
 * Import from '@/types' to access all type definitions
 */

// Domain models
export type {
  Goal,
  RitualContent,
  RitualStatistics,
  Ritual,
  RitualTone,
  RitualPace,
  RitualSection,
  RitualSectionType,
  Soundscape,
  SessionData,
  SessionReflection,
  Session,
  SessionStatus,
  UserPreferences,
  VoiceOption,
  ThemeOption,
  AudioStatus,
} from './models'

// Export Timestamp and helpers (both type and value in single export)
export { Timestamp, getSectionGuidanceText } from './models'

// Segment types for TTS/audio
export type { Segment, SilenceConfig } from './segment'

// Segment utility functions
export {
  createTextSegment,
  createSilenceSegment,
  getTextFromSegments,
  getTotalDuration,
  isTextSegment,
  isSilenceSegment,
} from './segment'

// Voice types for TTS
export type {
  Voice,
  VoiceManifest,
  UserVoicePreferences,
  TTSOptions,
  TTSResult,
  TTSProvider,
} from './voice'

// Service interfaces
export type {
  AIProvider,
  AIGenerationOptions,
  AIGenerationProgress,
  AIGenerationStage,
  AIClarifyingQuestion,
  StorageAdapter,
  BackgroundTask,
  BackgroundTaskManager,
  TaskStatus,
} from './services'

// UI types
export type {
  ButtonVariant,
  ButtonSize,
  CardVariant,
  ToastType,
  ToastMessage,
  InputSize,
  ModalProps,
  FormFieldProps,
  SelectOption,
  TabRoute,
  NavigationTab,
  GenerationState,
  LoadingState,
  EmptyState,
  RitualListItem,
  GoalListItem,
  PlayerState,
  PlayerStatus,
} from './ui'

// Constants
export {
  STORAGE_KEYS,
  RITUAL_TONES,
  RITUAL_DURATIONS,
  SOUNDSCAPES,
  DEFAULT_PREFERENCES,
  DEFAULT_RITUAL_SETTINGS,
  GENERATION_STAGES,
  TOAST_DURATION,
  ANIMATION_DURATION,
  BREAKPOINTS,
  INPUT_LIMITS,
  PLAYER_SETTINGS,
  FEATURES,
  MOCK_DELAYS,
} from './constants'

// OpenAI types (for external use if needed)
export type {
  OpenAIChatMessage,
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
  OpenAIRitualSectionResponse,
  OpenAIRitualResponse,
  OpenAIErrorResponse,
  OpenAIErrorType,
  OpenAIServiceError,
  OpenAIConfig,
} from './openai'

export { OPENAI_DEFAULTS } from './openai'
