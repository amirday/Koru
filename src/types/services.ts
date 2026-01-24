/**
 * Service interface contracts for AI providers and storage adapters
 * Enables swapping implementations without code changes
 */

import type { Ritual, RitualTone, Soundscape, Timestamp } from './models'

// ====================
// AI Provider
// ====================

export type AIGenerationStage = 'clarifying' | 'structuring' | 'writing' | 'complete'

export interface AIGenerationOptions {
  /** What the user wants to achieve through this ritual */
  instructions: string
  /** Desired duration in seconds */
  duration: number
  /** Voice tone preference */
  tone: RitualTone
  /** Include silence periods */
  includeSilence: boolean
  /** Background soundscape */
  soundscape?: Soundscape
  /** Additional preferences or context for generation (optional) */
  additionalPreferences?: string
  /** Selected voice ID for TTS */
  voiceId?: string
  /** TTS provider to use */
  provider?: 'elevenlabs' | 'google'
}

export interface AIGenerationProgress {
  /** Current stage of generation */
  stage: AIGenerationStage
  /** Progress percentage (0-100) */
  progress: number
  /** Human-readable status message */
  message: string
}

export interface AIClarifyingQuestion {
  /** The question to ask the user */
  questionText: string
  /** Pre-defined answer options */
  options: string[]
  /** Whether user can provide custom answer */
  allowCustomInput: boolean
}

export interface AIProvider {
  /**
   * Generate a meditation ritual based on options
   * @param options - Generation parameters
   * @param onProgress - Callback for progress updates
   * @returns Generated ritual
   */
  generateRitual(
    options: AIGenerationOptions,
    onProgress: (progress: AIGenerationProgress) => void
  ): Promise<Ritual>

  /**
   * Ask clarifying question before generation (optional)
   * @param context - User's instructions and preferences
   * @returns Question to ask, or null if none needed
   */
  askClarifyingQuestion(context: {
    instructions: string
    tone?: RitualTone
  }): Promise<AIClarifyingQuestion | null>
}

// ====================
// Storage Adapter
// ====================

export interface StorageAdapter {
  /**
   * Get value by key
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  get<T>(key: string): Promise<T | null>

  /**
   * Set value for key
   * @param key - Storage key
   * @param value - Value to store (will be JSON serialized)
   */
  set<T>(key: string, value: T): Promise<void>

  /**
   * Remove value by key
   * @param key - Storage key
   */
  remove(key: string): Promise<void>

  /**
   * Clear all storage
   */
  clear(): Promise<void>

  /**
   * Get all keys with optional prefix filter
   * @param prefix - Filter keys by prefix (optional)
   * @returns Array of matching keys
   */
  keys(prefix?: string): Promise<string[]>
}

// ====================
// Background Task Manager
// ====================

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface BackgroundTask {
  /** Unique task identifier */
  id: string
  /** Task type */
  type: string
  /** Current status */
  status: TaskStatus
  /** Progress percentage (0-100) */
  progress: number
  /** Error message if failed */
  error?: string
  /** When task was created */
  createdAt: Timestamp
  /** When task completed (optional) */
  completedAt?: Timestamp
}

export interface BackgroundTaskManager {
  /**
   * Create and run a background task
   * @param type - Task type identifier
   * @param work - Async function to execute
   * @returns Task ID
   */
  run<T>(type: string, work: () => Promise<T>): Promise<string>

  /**
   * Get task status
   * @param taskId - Task identifier
   * @returns Task info or null if not found
   */
  getTask(taskId: string): Promise<BackgroundTask | null>

  /**
   * Cancel a running task
   * @param taskId - Task identifier
   */
  cancel(taskId: string): Promise<void>
}
