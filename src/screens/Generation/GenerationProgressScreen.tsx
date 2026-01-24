/**
 * GenerationProgressScreen - Real generation with backend API
 * Features: Progress bar, stage messages, cancel button
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, useToast } from '@/components/ui'
import { useRituals } from '@/contexts'
import type { RitualTone, Soundscape } from '@/types'

interface PendingGenerationData {
  name: string
  goals: string
  duration: number
  voiceId: string
  soundscape: Soundscape
  tone: RitualTone
  includeSilence: boolean
  pace: string
}

/**
 * Generation progress screen - calls real backend API
 */
export function GenerationProgressScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    startGeneration,
    isGenerating,
    generationProgress,
    generatedRitualId,
    cancelGeneration,
    clearGeneratedRitualId,
  } = useRituals()

  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const hasStartedRef = useRef(false)

  /**
   * Start generation when component mounts
   */
  useEffect(() => {
    // Prevent double-start in strict mode
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const pendingDataStr = sessionStorage.getItem('pendingGeneration')
    if (!pendingDataStr) {
      navigate('/generate', { replace: true })
      return
    }

    let pendingData: PendingGenerationData
    try {
      pendingData = JSON.parse(pendingDataStr)
    } catch {
      navigate('/generate', { replace: true })
      return
    }

    // Start the real generation
    const runGeneration = async () => {
      try {
        await startGeneration({
          instructions: pendingData.goals,
          duration: pendingData.duration,
          tone: pendingData.tone || 'gentle',
          includeSilence: pendingData.includeSilence ?? true,
          soundscape: pendingData.soundscape,
          voiceId: pendingData.voiceId,
        })
      } catch (err) {
        console.error('Generation failed:', err)
        setError(err instanceof Error ? err.message : 'Generation failed')
      }
    }

    runGeneration()
  }, [navigate, startGeneration])

  /**
   * Navigate to complete screen when generation finishes
   */
  useEffect(() => {
    if (generatedRitualId && !isGenerating && !error) {
      // Store generated ritual info for complete screen
      const pendingDataStr = sessionStorage.getItem('pendingGeneration')
      if (pendingDataStr) {
        const pendingData = JSON.parse(pendingDataStr)
        sessionStorage.setItem(
          'generatedRitual',
          JSON.stringify({
            id: generatedRitualId,
            name: pendingData.name,
            goals: pendingData.goals,
            duration: pendingData.duration,
            voiceId: pendingData.voiceId,
            soundscape: pendingData.soundscape,
            tone: pendingData.tone || 'gentle',
          })
        )
      }

      // Clear the pending data
      sessionStorage.removeItem('pendingGeneration')

      // Navigate to complete screen
      navigate(`/generate/complete/${generatedRitualId}`, { replace: true })
    }
  }, [generatedRitualId, isGenerating, error, navigate])

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(async () => {
    setIsCancelling(true)
    try {
      await cancelGeneration()
      sessionStorage.removeItem('pendingGeneration')
      clearGeneratedRitualId()
      navigate('/feed', { replace: true })
    } catch (err) {
      console.error('Failed to cancel:', err)
      toast.showToast('error', 'Failed to cancel generation')
    } finally {
      setIsCancelling(false)
    }
  }, [cancelGeneration, clearGeneratedRitualId, navigate, toast])

  /**
   * Handle retry after error
   */
  const handleRetry = useCallback(() => {
    setError(null)
    hasStartedRef.current = false
    // Re-trigger the effect
    window.location.reload()
  }, [])

  /**
   * Handle go back after error
   */
  const handleGoBack = useCallback(() => {
    sessionStorage.removeItem('pendingGeneration')
    navigate('/generate', { replace: true })
  }, [navigate])

  // Get progress info
  const progress = generationProgress?.progress ?? 10
  const message = generationProgress?.message ?? 'Starting generation...'

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="font-serif text-2xl font-bold text-calm-900 text-center mb-2">
          Generation Failed
        </h1>

        <p className="text-calm-600 text-center mb-8 max-w-xs">
          {error}
        </p>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button variant="primary" onClick={handleRetry}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-6">
      {/* Animated indicator */}
      <div className="relative mb-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-peach-200 animate-ping opacity-20" />
          <div
            className="absolute inset-2 rounded-full bg-peach-300 animate-ping opacity-30"
            style={{ animationDelay: '0.3s' }}
          />
          <div className="absolute inset-4 rounded-full bg-peach-400 animate-pulse" />
          <div className="absolute inset-6 rounded-full bg-peach-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-2xl font-bold text-calm-900 text-center mb-2">
        Your ritual is being generated
      </h1>

      {/* Progress bar */}
      <div className="w-full max-w-xs mt-6 mb-4">
        <div className="h-2 bg-warm-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-peach-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-calm-500">
          <span>{progress}%</span>
          <span>{progress < 100 ? 'Generating...' : 'Complete!'}</span>
        </div>
      </div>

      {/* Stage message */}
      <p className="text-calm-600 text-center italic mb-12 h-6 transition-opacity duration-300">
        "{message}"
      </p>

      {/* Cancel button */}
      <Button
        variant="ghost"
        onClick={handleCancel}
        loading={isCancelling}
        disabled={progress >= 95}
      >
        Cancel
      </Button>
    </div>
  )
}
