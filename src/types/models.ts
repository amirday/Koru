/**
 * Core domain models for the Koru meditation app
 * Uses Timestamp branded type for type-safe dates that serialize as ISO 8601 strings
 */

// ====================
// Timestamp (Branded Type)
// ====================

/**
 * Type-safe timestamp that compiles as string but prevents mixing with regular strings
 * Runtime: ISO 8601 string (JSON/localStorage compatible)
 * Compile-time: Cannot assign string to Timestamp without explicit casting
 */
export type Timestamp = string & { readonly __brand: 'Timestamp' }

/**
 * Timestamp helper functions for safe creation and parsing
 */
export const Timestamp = {
  /** Create timestamp from current time */
  now: (): Timestamp => new Date().toISOString() as Timestamp,

  /** Create timestamp from Date object or ISO string */
  from: (date: Date | string): Timestamp =>
    (typeof date === 'string' ? date : date.toISOString()) as Timestamp,

  /** Parse timestamp to Date object */
  parse: (ts: Timestamp): Date => new Date(ts),
}

// ====================
// Goal
// ====================

export interface Goal {
  /** Unique identifier */
  id: string
  /** What the user wants to achieve through meditation */
  instructions: string
  /** When this goal was created */
  createdAt: Timestamp
  /** Last time this goal was updated */
  updatedAt: Timestamp
}

// ====================
// Ritual (Content + Metadata)
// ====================

export type RitualTone = 'gentle' | 'neutral' | 'coach'
export type RitualPace = 'slow' | 'medium' | 'fast'
export type Soundscape = 'ocean' | 'forest' | 'rain' | 'fire' | 'none'

/**
 * Core ritual definition - what the ritual IS
 * Includes metadata about creation/modification, excludes usage statistics
 */
export interface RitualContent {
  /** Unique identifier */
  id: string
  /** Ritual title */
  title: string
  /** What this ritual helps achieve */
  instructions: string
  /** Total duration in seconds */
  duration: number
  /** Voice tone for guidance */
  tone: RitualTone
  /** Speech pace */
  pace: RitualPace
  /** Whether to include silence periods */
  includeSilence: boolean
  /** Background soundscape (optional) */
  soundscape?: Soundscape
  /** Ordered sections of the ritual */
  sections: RitualSection[]
  /** Searchable tags */
  tags: string[]
  /** If true, shown in template library */
  isTemplate: boolean
  /** Metadata about how ritual was created (optional) */
  generatedFrom?: {
    /** Instructions that generated this ritual */
    instructions?: string
    /** Custom prompt used */
    prompt?: string
    /** AI model version */
    modelVersion?: string
  }
  /** When this ritual was created */
  createdAt: Timestamp
  /** Last time this ritual content was updated */
  updatedAt: Timestamp
}

/**
 * Ritual usage statistics - completely separate entity
 * Managed independently from content, has its own ID
 */
export interface RitualStatistics {
  /** Unique identifier for this statistics record */
  id: string
  /** Reference to the ritual this tracks */
  ritualId: string
  /** User favorited this ritual */
  isFavorite: boolean
  /** Number of times completed */
  usageCount: number
  /** Last time this ritual was used (optional) */
  lastUsedAt?: Timestamp
}

/**
 * Audio generation status
 */
export type AudioStatus = 'pending' | 'generating' | 'ready' | 'error'

/**
 * Full ritual with content and statistics combined
 * Use this type when you need both content and usage stats in one object
 * Note: Statistics can be null if not yet loaded/created
 */
export interface Ritual extends RitualContent {
  /** Usage statistics (null if not loaded) */
  statistics: RitualStatistics | null
  /** Audio generation state */
  audioStatus?: AudioStatus
  /** Selected voice for TTS */
  voiceId?: string
}

// ====================
// Ritual Section
// ====================

import type { Segment, SilenceConfig } from './segment'
import { getTextFromSegments } from './segment'

export type RitualSectionType = 'intro' | 'body' | 'silence' | 'transition' | 'closing'

/**
 * A ritual section contains an ordered list of segments.
 * Each segment is either text (to be spoken) or silence (pause).
 */
export interface RitualSection {
  /** Unique identifier */
  id: string
  /** Section type */
  type: RitualSectionType
  /** Total target duration for this section in seconds */
  durationSeconds: number
  /** Ordered list of text/silence segments */
  segments: Segment[]
  /** @deprecated Use segments instead - kept for backwards compatibility */
  guidanceText?: string
  /** For silence type: duration of silence in seconds */
  silenceDuration?: number
  /** Optional soundscape override for this section */
  soundscape?: Soundscape
  /** Configuration for silence distribution */
  silenceConfig?: SilenceConfig
  /** Cached combined audio URL */
  audioUrl?: string
  /** Actual combined audio duration in seconds */
  audioDurationSeconds?: number
  /** Cache invalidation timestamp */
  audioGeneratedAt?: string
}

/**
 * Helper to get guidance text from a section (from segments or legacy field)
 */
export function getSectionGuidanceText(section: RitualSection): string {
  if (section.segments && section.segments.length > 0) {
    return getTextFromSegments(section.segments)
  }
  return section.guidanceText ?? ''
}

// ====================
// Session (Data + Reflection)
// ====================

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'

/**
 * Core session tracking data
 * Includes timing and completion metadata
 */
export interface SessionData {
  /** Unique identifier */
  id: string
  /** Ritual used for this session */
  ritualId: string
  /** Session status */
  status: SessionStatus
  /** When session started */
  startedAt: Timestamp
  /** When session completed or abandoned (optional) */
  completedAt?: Timestamp
  /** How far user progressed (seconds) */
  progressSeconds: number
}

/**
 * Post-session reflection and rating - completely separate entity
 * Managed independently from session, has its own ID
 */
export interface SessionReflection {
  /** Unique identifier for this reflection record */
  id: string
  /** Session this reflection belongs to */
  sessionId: string
  /** User's reflection after session (optional) */
  reflection?: string
  /** User rating 1-5 (optional) */
  rating?: number
  /** When reflection was created */
  createdAt: Timestamp
}

/**
 * Full session with optional reflection combined
 * Use this type when you need both session data and reflection in one object
 * Note: Reflection can be null if not yet created
 */
export interface Session extends SessionData {
  /** Post-session reflection (null if not created) */
  reflection: SessionReflection | null
}

// ====================
// User Preferences
// ====================

export type VoiceOption = 'default' | 'male' | 'female' | 'neutral'
export type ThemeOption = 'light' | 'dark' | 'auto'

export interface UserPreferences {
  /** Default ritual duration in seconds */
  defaultDuration: number
  /** Default ritual tone */
  defaultTone: RitualTone
  /** Enable push notifications */
  notifications: boolean
  /** Enable background soundscapes */
  soundscapesEnabled: boolean
  /** Preferred voice (optional, future) */
  voice?: VoiceOption
  /** Theme preference (future) */
  theme?: ThemeOption
}
