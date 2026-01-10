/**
 * RitualContext - Ritual management and generation
 * Manages ritual library, AI generation, and editing
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Ritual, AIGenerationOptions, AIGenerationProgress, AIClarifyingQuestion } from '@/types'
import { Timestamp, STORAGE_KEYS } from '@/types'
import { storageService, aiService, backgroundTaskService } from '@/services'
import { mockRituals, quickStarts } from '@/mocks'

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
  /** Duplicate ritual */
  duplicateRitual: (id: string) => Promise<Ritual>
  /** Set ritual for editing */
  setEditingRitual: (ritual: Ritual | null) => void
  /** Get ritual by ID */
  getRitual: (id: string) => Ritual | undefined
  /** Cancel ongoing generation */
  cancelGeneration: () => Promise<void>
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

  // Load initial state from storage
  useEffect(() => {
    loadFromStorage()
  }, [])

  /**
   * Load rituals from localStorage
   */
  const loadFromStorage = async () => {
    try {
      setIsLoading(true)

      // Load saved rituals
      const savedRituals = await storageService.get<Ritual[]>(STORAGE_KEYS.RITUALS)
      if (savedRituals && savedRituals.length > 0) {
        setRituals(savedRituals)
      } else {
        // First time - load mock rituals as starting point
        setRituals(mockRituals)
        await storageService.set(STORAGE_KEYS.RITUALS, mockRituals)
      }
    } catch (error) {
      console.error('[RitualContext] Failed to load from storage:', error)
      // Fallback to mock rituals
      setRituals(mockRituals)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Save rituals to localStorage
   */
  const persistRituals = useCallback(async (updatedRituals: Ritual[]) => {
    try {
      await storageService.set(STORAGE_KEYS.RITUALS, updatedRituals)
    } catch (error) {
      console.error('[RitualContext] Failed to persist rituals:', error)
    }
  }, [])

  /**
   * Start ritual generation
   */
  const startGeneration = useCallback(async (options: AIGenerationOptions) => {
    try {
      setIsGenerating(true)
      setGenerationProgress(null)
      setClarifyingQuestion(null)

      // Check if AI wants to ask clarifying question first
      const question = await aiService.askClarifyingQuestion({
        instructions: options.instructions,
        tone: options.tone,
      })

      if (question) {
        setClarifyingQuestion(question)
        setIsGenerating(false)
        return
      }

      // Start generation in background
      const taskId = await backgroundTaskService.run('ritual-generation', async () => {
        const ritual = await aiService.generateRitual(options, (progress) => {
          setGenerationProgress(progress)
        })
        return ritual
      })

      setGenerationTaskId(taskId)

      // Poll for completion
      pollGenerationTask(taskId)
    } catch (error) {
      console.error('[RitualContext] Generation failed:', error)
      setIsGenerating(false)
      setGenerationProgress(null)
      throw error
    }
  }, [])

  /**
   * Poll background task for completion
   */
  const pollGenerationTask = useCallback(async (taskId: string) => {
    const checkTask = async () => {
      const task = await backgroundTaskService.getTask(taskId)

      if (!task) {
        setIsGenerating(false)
        return
      }

      if (task.status === 'completed') {
        // Generation complete - task.result should have the ritual
        // For now, just generate a new one since we can't access result
        // In real implementation, we'd get the ritual from task result
        setIsGenerating(false)
        setGenerationProgress({
          stage: 'complete',
          progress: 100,
          message: 'Your ritual is ready!',
        })
        setGenerationTaskId(null)
      } else if (task.status === 'failed') {
        console.error('[RitualContext] Generation task failed:', task.error)
        setIsGenerating(false)
        setGenerationProgress(null)
        setGenerationTaskId(null)
      } else {
        // Still running, check again
        setTimeout(checkTask, 500)
      }
    }

    checkTask()
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
   * Save ritual to library
   */
  const saveRitual = useCallback(async (ritual: Ritual) => {
    try {
      const now = Timestamp.now()

      // Check if ritual already exists
      const existingIndex = rituals.findIndex((r) => r.id === ritual.id)

      let updatedRituals: Ritual[]
      if (existingIndex >= 0) {
        // Update existing
        const updatedRitual: Ritual = {
          ...ritual,
          updatedAt: now,
        }
        updatedRituals = [...rituals]
        updatedRituals[existingIndex] = updatedRitual
      } else {
        // Add new
        const newRitual: Ritual = {
          ...ritual,
          createdAt: ritual.createdAt || now,
          updatedAt: now,
        }
        updatedRituals = [...rituals, newRitual]
      }

      setRituals(updatedRituals)
      await persistRituals(updatedRituals)
    } catch (error) {
      console.error('[RitualContext] Failed to save ritual:', error)
      throw error
    }
  }, [rituals, persistRituals])

  /**
   * Delete ritual from library
   */
  const deleteRitual = useCallback(async (id: string) => {
    try {
      const updatedRituals = rituals.filter((r) => r.id !== id)
      setRituals(updatedRituals)
      await persistRituals(updatedRituals)
    } catch (error) {
      console.error('[RitualContext] Failed to delete ritual:', error)
      throw error
    }
  }, [rituals, persistRituals])

  /**
   * Duplicate ritual
   */
  const duplicateRitual = useCallback(async (id: string): Promise<Ritual> => {
    const ritual = rituals.find((r) => r.id === id)
    if (!ritual) {
      throw new Error(`Ritual ${id} not found`)
    }

    const now = Timestamp.now()
    const duplicated: Ritual = {
      ...ritual,
      id: `ritual-${Date.now()}`,
      title: `${ritual.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
      statistics: ritual.statistics
        ? {
            id: `stats-${Date.now()}`,
            ritualId: `ritual-${Date.now()}`,
            isFavorite: false,
            usageCount: 0,
          }
        : null,
    }

    await saveRitual(duplicated)
    return duplicated
  }, [rituals, saveRitual])

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
  }, [generationTaskId])

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

    // Actions
    startGeneration,
    answerClarifyingQuestion,
    saveRitual,
    deleteRitual,
    duplicateRitual,
    setEditingRitual,
    getRitual,
    cancelGeneration,
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
