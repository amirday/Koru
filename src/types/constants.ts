/**
 * Application constants and configuration
 * All constants are readonly to prevent accidental mutation
 */

import type { RitualTone, Soundscape, UserPreferences } from './models'
import type { AIGenerationStage } from './services'

// ====================
// Storage Keys
// ====================

/**
 * Namespaced storage keys to prevent conflicts with other apps
 * All keys use 'koru:' prefix
 */
export const STORAGE_KEYS = {
  /** Current user goal */
  GOAL: 'koru:goal',
  /** User preferences */
  PREFERENCES: 'koru:preferences',
  /** List of rituals */
  RITUALS: 'koru:rituals',
  /** Session history */
  SESSIONS: 'koru:sessions',
  /** Onboarding completion flag */
  ONBOARDING_COMPLETE: 'koru:onboarding_complete',
  /** Last selected ritual ID */
  LAST_RITUAL_ID: 'koru:last_ritual_id',
} as const

// ====================
// Ritual Options
// ====================

/**
 * Available ritual tone options
 */
export const RITUAL_TONES: ReadonlyArray<{
  value: RitualTone
  label: string
  description: string
}> = [
  {
    value: 'gentle',
    label: 'Gentle',
    description: 'Soft, nurturing guidance',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    description: 'Balanced, mindful presence',
  },
  {
    value: 'coach',
    label: 'Coach',
    description: 'Focused, motivating tone',
  },
] as const

/**
 * Available ritual durations (in seconds)
 */
export const RITUAL_DURATIONS: ReadonlyArray<{
  value: number
  label: string
}> = [
  { value: 5 * 60, label: '5 min' },
  { value: 10 * 60, label: '10 min' },
  { value: 15 * 60, label: '15 min' },
  { value: 20 * 60, label: '20 min' },
  { value: 30 * 60, label: '30 min' },
] as const

/**
 * Available soundscape options
 */
export const SOUNDSCAPES: ReadonlyArray<{
  value: Soundscape
  label: string
  description: string
}> = [
  {
    value: 'ocean',
    label: 'Ocean',
    description: 'Gentle waves and seashore',
  },
  {
    value: 'forest',
    label: 'Forest',
    description: 'Birds and rustling leaves',
  },
  {
    value: 'rain',
    label: 'Rain',
    description: 'Soft rainfall',
  },
  {
    value: 'fire',
    label: 'Fire',
    description: 'Crackling fireplace',
  },
  {
    value: 'none',
    label: 'None',
    description: 'No background sound',
  },
] as const

// ====================
// Default Values
// ====================

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 10 * 60, // 10 minutes in seconds
  defaultTone: 'gentle',
  notifications: false,
  soundscapesEnabled: true,
} as const

/**
 * Default ritual settings
 */
export const DEFAULT_RITUAL_SETTINGS = {
  duration: 10 * 60, // 10 minutes
  tone: 'gentle' as RitualTone,
  pace: 'medium' as const,
  includeSilence: true,
  soundscape: 'none' as Soundscape,
} as const

// ====================
// Generation Stages
// ====================

/**
 * AI generation stage configurations
 * Matches UI_design.md §6.3
 */
export const GENERATION_STAGES: ReadonlyArray<{
  stage: AIGenerationStage
  label: string
  message: string
  progress: number
}> = [
  {
    stage: 'clarifying',
    label: 'Understanding',
    message: 'Understanding your intention...',
    progress: 25,
  },
  {
    stage: 'structuring',
    label: 'Planning',
    message: 'Planning your ritual structure...',
    progress: 50,
  },
  {
    stage: 'writing',
    label: 'Creating',
    message: 'Writing your guided meditation...',
    progress: 75,
  },
  {
    stage: 'complete',
    label: 'Complete',
    message: 'Your ritual is ready!',
    progress: 100,
  },
] as const

// ====================
// UI Constants
// ====================

/**
 * Toast notification durations (milliseconds)
 */
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const

/**
 * Breakpoints (pixels) - matches Tailwind defaults
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const

/**
 * Maximum lengths for user input
 */
export const INPUT_LIMITS = {
  GOAL_TEXT: 200,
  RITUAL_TITLE: 100,
  REFLECTION: 500,
  CUSTOM_PROMPT: 300,
} as const

// ====================
// Player Constants
// ====================

/**
 * Audio player settings
 */
export const PLAYER_SETTINGS = {
  /** Default volume (0-1) */
  DEFAULT_VOLUME: 0.7,
  /** Volume fade duration (ms) */
  FADE_DURATION: 1000,
  /** Update interval for progress (ms) */
  PROGRESS_UPDATE_INTERVAL: 100,
  /** Minimum silence duration (seconds) */
  MIN_SILENCE_DURATION: 10,
  /** Maximum silence duration (seconds) */
  MAX_SILENCE_DURATION: 300,
} as const

// ====================
// API & Feature Flags
// ====================

/**
 * Feature flags for progressive rollout
 */
export const FEATURES = {
  /** Enable AI generation (vs templates only) */
  AI_GENERATION: true,
  /** Enable TTS playback (vs text-only) */
  TTS_PLAYBACK: false, // Future phase
  /** Enable cloud sync */
  CLOUD_SYNC: false, // Future phase
  /** Enable social sharing */
  SHARING: false, // Future phase
} as const

/**
 * Mock generation delay ranges (milliseconds)
 * Used for simulating AI generation in UI/UX phase
 */
export const MOCK_DELAYS = {
  MIN: 1000,
  MAX: 3000,
} as const
