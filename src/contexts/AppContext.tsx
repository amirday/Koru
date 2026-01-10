/**
 * AppContext - Global application state
 * Manages user goal, preferences, onboarding, and navigation state
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Goal, UserPreferences } from '@/types'
import { Timestamp, STORAGE_KEYS, DEFAULT_PREFERENCES } from '@/types'
import { storageService } from '@/services'

// ====================
// Types
// ====================

interface AppContextState {
  /** Current user goal */
  goal: Goal | null
  /** User preferences */
  preferences: UserPreferences
  /** Whether user has completed onboarding */
  hasCompletedOnboarding: boolean
  /** Whether bottom navigation is visible */
  bottomNavVisible: boolean
  /** Loading state */
  isLoading: boolean
}

interface AppContextActions {
  /** Update goal instructions */
  updateGoal: (instructions: string) => Promise<void>
  /** Update user preferences (merges with existing) */
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
  /** Mark onboarding as complete */
  completeOnboarding: () => Promise<void>
  /** Show/hide bottom navigation */
  setBottomNavVisible: (visible: boolean) => void
}

type AppContextValue = AppContextState & AppContextActions

// ====================
// Context
// ====================

const AppContext = createContext<AppContextValue | null>(null)

// ====================
// Provider
// ====================

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [bottomNavVisible, setBottomNavVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial state from storage
  useEffect(() => {
    loadFromStorage()
  }, [])

  /**
   * Load all app state from localStorage
   */
  const loadFromStorage = async () => {
    try {
      setIsLoading(true)

      // Load goal
      const savedGoal = await storageService.get<Goal>(STORAGE_KEYS.GOAL)
      if (savedGoal) {
        setGoal(savedGoal)
      }

      // Load preferences
      const savedPrefs = await storageService.get<UserPreferences>(STORAGE_KEYS.PREFERENCES)
      if (savedPrefs) {
        setPreferences(savedPrefs)
      }

      // Load onboarding status
      const onboardingComplete = await storageService.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE)
      if (onboardingComplete) {
        setHasCompletedOnboarding(true)
      }
    } catch (error) {
      console.error('[AppContext] Failed to load from storage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Update goal instructions
   */
  const updateGoal = useCallback(async (instructions: string) => {
    try {
      const now = Timestamp.now()

      const newGoal: Goal = goal
        ? {
            ...goal,
            instructions,
            updatedAt: now,
          }
        : {
            id: `goal-${Date.now()}`,
            instructions,
            createdAt: now,
            updatedAt: now,
          }

      setGoal(newGoal)
      await storageService.set(STORAGE_KEYS.GOAL, newGoal)
    } catch (error) {
      console.error('[AppContext] Failed to update goal:', error)
      throw error
    }
  }, [goal])

  /**
   * Update user preferences (merge with existing)
   */
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences: UserPreferences = {
        ...preferences,
        ...updates,
      }

      setPreferences(newPreferences)
      await storageService.set(STORAGE_KEYS.PREFERENCES, newPreferences)
    } catch (error) {
      console.error('[AppContext] Failed to update preferences:', error)
      throw error
    }
  }, [preferences])

  /**
   * Mark onboarding as complete
   */
  const completeOnboarding = useCallback(async () => {
    try {
      setHasCompletedOnboarding(true)
      await storageService.set(STORAGE_KEYS.ONBOARDING_COMPLETE, true)
    } catch (error) {
      console.error('[AppContext] Failed to complete onboarding:', error)
      throw error
    }
  }, [])

  const value: AppContextValue = {
    // State
    goal,
    preferences,
    hasCompletedOnboarding,
    bottomNavVisible,
    isLoading,

    // Actions
    updateGoal,
    updatePreferences,
    completeOnboarding,
    setBottomNavVisible,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// ====================
// Hook
// ====================

/**
 * Use app context
 * @throws Error if used outside AppProvider
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
