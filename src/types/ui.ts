/**
 * UI component types, variants, and props
 */

import type { ReactNode } from 'react'
import type { AIGenerationStage } from './services'
import type { Timestamp } from './models'

// ====================
// Component Variants
// ====================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type CardVariant = 'default' | 'elevated' | 'flat'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type InputSize = 'sm' | 'md' | 'lg'

// ====================
// Toast Notifications
// ====================

export interface ToastMessage {
  /** Unique identifier */
  id: string
  /** Toast type/severity */
  type: ToastType
  /** Message content */
  message: string
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration: number
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
}

// ====================
// Modal
// ====================

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Modal title */
  title: string
  /** Modal content */
  children: ReactNode
  /** Close on outside click (default: true) */
  closeOnOutsideClick?: boolean
  /** Close on escape key (default: true) */
  closeOnEscape?: boolean
  /** Optional footer content */
  footer?: ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'full'
}

// ====================
// Form Fields
// ====================

export interface FormFieldProps {
  /** Field label */
  label: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Required field indicator */
  required?: boolean
  /** Field disabled state */
  disabled?: boolean
}

export interface SelectOption {
  /** Option value */
  value: string
  /** Display label */
  label: string
  /** Optional description */
  description?: string
  /** Disabled state */
  disabled?: boolean
}

// ====================
// Navigation
// ====================

export type TabRoute = 'feed' | 'rituals' | 'dashboard' | 'profile'

export interface NavigationTab {
  /** Route identifier */
  route: TabRoute
  /** Display label */
  label: string
  /** Icon name or component */
  icon: string
  /** Badge count (optional) */
  badge?: number
}

// ====================
// Generation State
// ====================

export interface GenerationState {
  /** Whether generation is in progress */
  isGenerating: boolean
  /** Current progress (0-100) */
  progress: number
  /** Current generation stage */
  stage: AIGenerationStage | null
  /** Status message */
  message: string
  /** Background task ID (optional) */
  taskId?: string
  /** Error if generation failed */
  error?: string
}

// ====================
// Loading States
// ====================

export interface LoadingState {
  /** Is loading */
  isLoading: boolean
  /** Loading message */
  message?: string
  /** Progress percentage (optional) */
  progress?: number
}

export interface EmptyState {
  /** Illustration or icon */
  icon: string
  /** Heading */
  title: string
  /** Description */
  description: string
  /** Call to action (optional) */
  action?: {
    label: string
    onClick: () => void
  }
}

// ====================
// List Items
// ====================

/**
 * Ritual list item for UI display
 * Flattened view combining content and statistics for convenience
 */
export interface RitualListItem {
  /** Ritual ID */
  id: string
  /** Ritual title */
  title: string
  /** Duration in seconds */
  duration: number
  /** Tags */
  tags: string[]
  /** Favorited (from statistics) */
  isFavorite: boolean
  /** Last used date (from statistics, optional) */
  lastUsedAt?: Timestamp
  /** Usage count (from statistics) */
  usageCount: number
}

export interface GoalListItem {
  /** Goal ID */
  id: string
  /** What the user wants to achieve */
  instructions: string
  /** When goal was created */
  createdAt: Timestamp
  /** Has generated rituals */
  hasRituals: boolean
}

// ====================
// Player State
// ====================

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'completed'

export interface PlayerState {
  /** Current status */
  status: PlayerStatus
  /** Current section index */
  currentSectionIndex: number
  /** Elapsed time in current section (seconds) */
  sectionElapsed: number
  /** Total elapsed time (seconds) */
  totalElapsed: number
  /** Total duration (seconds) */
  totalDuration: number
  /** Volume (0-1) */
  volume: number
  /** Muted state */
  isMuted: boolean
}
