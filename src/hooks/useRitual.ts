/**
 * useRitual hook
 * Convenience hook for ritual operations (wraps RitualContext)
 */

import { useCallback } from 'react'
import { useRituals } from '@/contexts'
import type { Ritual, AIGenerationOptions } from '@/types'

interface UseRitualReturn {
  /** Get ritual by ID */
  getRitual: (id: string) => Ritual | undefined
  /** Save ritual to library */
  saveRitual: (ritual: Ritual) => Promise<void>
  /** Delete ritual from library */
  deleteRitual: (id: string) => Promise<void>
  /** Duplicate ritual */
  duplicateRitual: (id: string) => Promise<Ritual>
  /** Start ritual generation */
  generateRitual: (options: AIGenerationOptions) => Promise<void>
  /** Cancel ongoing generation */
  cancelGeneration: () => Promise<void>
  /** Mark ritual as favorite */
  toggleFavorite: (id: string) => Promise<void>
  /** Increment usage count */
  recordUsage: (id: string) => Promise<void>
}

/**
 * Hook for ritual CRUD operations
 * Wraps RitualContext with convenient functions
 * @returns Ritual operation functions
 */
export function useRitual(): UseRitualReturn {
  const ritualsContext = useRituals()

  /**
   * Get ritual by ID
   */
  const getRitual = useCallback(
    (id: string): Ritual | undefined => {
      return ritualsContext.getRitual(id)
    },
    [ritualsContext]
  )

  /**
   * Save ritual to library
   */
  const saveRitual = useCallback(
    async (ritual: Ritual): Promise<void> => {
      await ritualsContext.saveRitual(ritual)
    },
    [ritualsContext]
  )

  /**
   * Delete ritual from library
   */
  const deleteRitual = useCallback(
    async (id: string): Promise<void> => {
      await ritualsContext.deleteRitual(id)
    },
    [ritualsContext]
  )

  /**
   * Duplicate ritual
   */
  const duplicateRitual = useCallback(
    async (id: string): Promise<Ritual> => {
      return await ritualsContext.duplicateRitual(id)
    },
    [ritualsContext]
  )

  /**
   * Start ritual generation
   */
  const generateRitual = useCallback(
    async (options: AIGenerationOptions): Promise<void> => {
      await ritualsContext.startGeneration(options)
    },
    [ritualsContext]
  )

  /**
   * Cancel ongoing generation
   */
  const cancelGeneration = useCallback(async (): Promise<void> => {
    await ritualsContext.cancelGeneration()
  }, [ritualsContext])

  /**
   * Toggle ritual favorite status
   */
  const toggleFavorite = useCallback(
    async (id: string): Promise<void> => {
      const ritual = ritualsContext.getRitual(id)
      if (!ritual || !ritual.statistics) return

      const updatedRitual: Ritual = {
        ...ritual,
        statistics: {
          ...ritual.statistics,
          isFavorite: !ritual.statistics.isFavorite,
        },
      }

      await ritualsContext.saveRitual(updatedRitual)
    },
    [ritualsContext]
  )

  /**
   * Record ritual usage
   */
  const recordUsage = useCallback(
    async (id: string): Promise<void> => {
      const ritual = ritualsContext.getRitual(id)
      if (!ritual) return

      // Import Timestamp here to avoid circular dependency
      const { Timestamp } = await import('@/types')

      const updatedRitual: Ritual = {
        ...ritual,
        statistics: ritual.statistics
          ? {
              ...ritual.statistics,
              usageCount: ritual.statistics.usageCount + 1,
              lastUsedAt: Timestamp.now(),
            }
          : {
              id: `stats-${Date.now()}`,
              ritualId: ritual.id,
              isFavorite: false,
              usageCount: 1,
              lastUsedAt: Timestamp.now(),
            },
      }

      await ritualsContext.saveRitual(updatedRitual)
    },
    [ritualsContext]
  )

  return {
    getRitual,
    saveRitual,
    deleteRitual,
    duplicateRitual,
    generateRitual,
    cancelGeneration,
    toggleFavorite,
    recordUsage,
  }
}
