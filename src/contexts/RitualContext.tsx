/**
 * RitualContext - Ritual management and generation
 * Manages ritual library, AI generation, and editing
 *
 * All data is persisted to the Python backend via API calls.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Ritual, AIGenerationOptions, AIGenerationProgress, AIClarifyingQuestion } from '@/types'
import { Timestamp } from '@/types'
import {
  getRituals as fetchRituals,
  createRitual as apiCreateRitual,
  deleteRitual as apiDeleteRitual,
  generateRitual as apiGenerateRitual,
  isBackendAvailable,
} from '@/services/api'
import { backgroundTaskService } from '@/services'
import { quickStarts } from '@/mocks'

// ====================
// Types
// ====================

interface RitualContextState {
  /** User's saved rituals */
  rituals: Ritual[]
  /** Template rituals (quick starts, etc.) */
  templates: Ritual[]
  /** Whether ritual is currently being generated */
  isGenerating: boolean
  /** Current generation progress */
  generationProgress: AIGenerationProgress | null
  /** Clarifying question from AI (if any) */
  clarifyingQuestion: AIClarifyingQuestion | null
  /** Ritual currently being edited */
  editingRitual: Ritual | null
  /** Background task ID for generation */
  generationTaskId: string | null
  /** Loading state */
  isLoading: boolean
  /** ID of newly generated ritual (for navigation) */
  generatedRitualId: string | null
}

interface RitualContextActions {
  /** Start ritual generation */
  startGeneration: (options: AIGenerationOptions) => Promise<void>
  /** Answer clarifying question and continue generation */
  answerClarifyingQuestion: (answer: string) => Promise<void>
  /** Save ritual to library */
  saveRitual: (ritual: Ritual) => Promise<void>
  /** Delete ritual from library */
  deleteRitual: (id: string) => Promise<void>
  /** Delete all rituals from library */
  deleteAllRituals: () => Promise<void>
  /** Duplicate ritual */
  duplicateRitual: (id: string) => Promise<Ritual>
  /** Set ritual for editing */
  setEditingRitual: (ritual: Ritual | null) => void
  /** Get ritual by ID */
  getRitual: (id: string) => Ritual | undefined
  /** Cancel ongoing generation */
  cancelGeneration: () => Promise<void>
  /** Clear generated ritual ID (after navigation) */
  clearGeneratedRitualId: () => void
}

type RitualContextValue = RitualContextState & RitualContextActions

// ====================
// Context
// ====================

const RitualContext = createContext<RitualContextValue | null>(null)

// ====================
// Provider
// ====================

export function RitualProvider({ children }: { children: React.ReactNode }) {
  const [rituals, setRituals] = useState<Ritual[]>([])
  const [templates] = useState<Ritual[]>(quickStarts)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<AIGenerationProgress | null>(null)
  const [clarifyingQuestion, setClarifyingQuestion] = useState<AIClarifyingQuestion | null>(null)
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null)
  const [generationTaskId, setGenerationTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [generatedRitualId, setGeneratedRitualId] = useState<string | null>(null)

  // Load initial state from backend
  useEffect(() => {
    loadFromBackend()
  }, [])

  /**
   * Load rituals from backend API
   */
  const loadFromBackend = async () => {
    try {
      setIsLoading(true)

      // Check if backend is available
      const backendUp = await isBackendAvailable()
      if (!backendUp) {
        console.warn('[RitualContext] Backend not available, starting with empty state')
        setRituals([])
        return
      }

      // Load saved rituals from backend
      const savedRituals = await fetchRituals()
      setRituals(savedRituals)
      console.log('[RitualContext] Loaded', savedRituals.length, 'rituals from backend')
    } catch (error) {
      console.error('[RitualContext] Failed to load from backend:', error)
      // Start with empty state on error
      setRituals([])
    } finally {
      setIsLoading(false)
    }
  }

  // Note: Individual CRUD operations now use backend API directly
  // No bulk persist needed - backend handles persistence

  /**
   * Start ritual generation via backend API
   */
  const startGeneration = useCallback(async (options: AIGenerationOptions) => {
    try {
      setIsGenerating(true)
      setGenerationProgress(null)
      setClarifyingQuestion(null)
      setGeneratedRitualId(null)

      // Show progress stages for UX feedback
      setGenerationProgress({
        stage: 'structuring',
        message: 'Analyzing your intention...',
        progress: 10,
      })

      // Generate ritual via backend API (OpenAI call happens on backend)
      const ritual = await apiGenerateRitual({
        intention: options.instructions,
        durationMinutes: Math.round(options.duration / 60),
        tone: options.tone,
        includeSilence: options.includeSilence,
      })

      setGenerationProgress({
        stage: 'complete',
        message: 'Ritual created!',
        progress: 100,
      })

      // Backend already saved the ritual, just update local state
      setRituals(prevRituals => [...prevRituals, ritual])

      // Set the generated ritual ID for navigation
      setGeneratedRitualId(ritual.id)
      setIsGenerating(false)

      console.log('[RitualContext] Ritual generated:', ritual.id, ritual.title)
    } catch (error) {
      console.error('[RitualContext] Generation failed:', error)
      setIsGenerating(false)
      setGenerationProgress(null)
      throw error
    }
  }, [])

  /**
   * Answer clarifying question and continue generation
   */
  const answerClarifyingQuestion = useCallback(async (answer: string) => {
    if (!clarifyingQuestion) return

    console.log('[RitualContext] User answered:', answer)
    setClarifyingQuestion(null)

    // In real implementation, we'd pass the answer to AI
    // For now, just continue generation without the answer
    setIsGenerating(true)
  }, [clarifyingQuestion])

  /**
   * Save ritual to library via backend API
   */
  const saveRitual = useCallback(async (ritual: Ritual) => {
    try {
      const now = Timestamp.now()

      // Prepare ritual with timestamps
      const ritualToSave: Ritual = {
        ...ritual,
        createdAt: ritual.createdAt || now,
        updatedAt: now,
      }

      // Save to backend (creates or updates based on ID)
      const savedRitual = await apiCreateRitual(ritualToSave)

      // Update local state
      setRituals(prevRituals => {
        const existingIndex = prevRituals.findIndex((r) => r.id === savedRitual.id)
        if (existingIndex >= 0) {
          const updated = [...prevRituals]
          updated[existingIndex] = savedRitual
          return updated
        }
        return [...prevRituals, savedRitual]
      })

      console.log('[RitualContext] Ritual saved:', savedRitual.id)
    } catch (error) {
      console.error('[RitualContext] Failed to save ritual:', error)
      throw error
    }
  }, [])

  /**
   * Delete ritual from library via backend API
   */
  const deleteRitual = useCallback(async (id: string) => {
    try {
      // Delete from backend
      await apiDeleteRitual(id)

      // Update local state
      setRituals(prevRituals => prevRituals.filter((r) => r.id !== id))

      console.log('[RitualContext] Ritual deleted:', id)
    } catch (error) {
      console.error('[RitualContext] Failed to delete ritual:', error)
      throw error
    }
  }, [])

  /**
   * Delete all rituals from library
   */
  const deleteAllRituals = useCallback(async () => {
    try {
      // Delete each ritual from backend
      const deletePromises = rituals.map(r => apiDeleteRitual(r.id).catch(() => {
        // Ignore individual delete errors
      }))
      await Promise.all(deletePromises)

      // Clear local state
      setRituals([])

      console.log('[RitualContext] All rituals deleted')
    } catch (error) {
      console.error('[RitualContext] Failed to delete all rituals:', error)
      throw error
    }
  }, [rituals])

  /**
   * Duplicate ritual via backend API
   */
  const duplicateRitual = useCallback(async (id: string): Promise<Ritual> => {
    const ritual = rituals.find((r) => r.id === id)
    if (!ritual) {
      throw new Error(`Ritual ${id} not found`)
    }

    const now = Timestamp.now()
    const newId = `ritual-${Date.now()}`
    const duplicated: Ritual = {
      ...ritual,
      id: newId,
      title: `${ritual.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
      audioStatus: 'pending', // Reset audio status for new ritual
      statistics: null, // Start fresh statistics
    }

    // Save to backend
    const saved = await apiCreateRitual(duplicated)

    // Update local state
    setRituals(prevRituals => [...prevRituals, saved])

    console.log('[RitualContext] Ritual duplicated:', saved.id)
    return saved
  }, [rituals])

  /**
   * Get ritual by ID
   */
  const getRitual = useCallback((id: string): Ritual | undefined => {
    return rituals.find((r) => r.id === id) || templates.find((t) => t.id === id)
  }, [rituals, templates])

  /**
   * Cancel ongoing generation
   */
  const cancelGeneration = useCallback(async () => {
    if (generationTaskId) {
      await backgroundTaskService.cancel(generationTaskId)
      setGenerationTaskId(null)
    }
    setIsGenerating(false)
    setGenerationProgress(null)
    setClarifyingQuestion(null)
    setGeneratedRitualId(null)
  }, [generationTaskId])

  /**
   * Clear generated ritual ID (after navigation)
   */
  const clearGeneratedRitualId = useCallback(() => {
    setGeneratedRitualId(null)
  }, [])

  const value: RitualContextValue = {
    // State
    rituals,
    templates,
    isGenerating,
    generationProgress,
    clarifyingQuestion,
    editingRitual,
    generationTaskId,
    isLoading,
    generatedRitualId,

    // Actions
    startGeneration,
    answerClarifyingQuestion,
    saveRitual,
    deleteRitual,
    deleteAllRituals,
    duplicateRitual,
    setEditingRitual,
    getRitual,
    cancelGeneration,
    clearGeneratedRitualId,
  }

  return <RitualContext.Provider value={value}>{children}</RitualContext.Provider>
}

// ====================
// Hook
// ====================

/**
 * Use ritual context
 * @throws Error if used outside RitualProvider
 */
export function useRituals(): RitualContextValue {
  const context = useContext(RitualContext)
  if (!context) {
    throw new Error('useRituals must be used within RitualProvider')
  }
  return context
}
