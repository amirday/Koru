/**
 * GenerationCompleteScreen - Post-generation with play/add options
 * Features: Success checkmark, ritual preview, play now, add to gallery
 */

import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, useToast } from '@/components/ui'
import { useRituals } from '@/contexts'
import type { Ritual, Soundscape } from '@/types'

/**
 * Format duration from seconds to human-readable string
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

/**
 * Get soundscape display info
 */
function getSoundscapeInfo(soundscape?: Soundscape): { icon: string; label: string } | null {
  const info: Record<string, { icon: string; label: string }> = {
    ocean: { icon: '\u{1F30A}', label: 'Ocean' },
    forest: { icon: '\u{1F332}', label: 'Forest' },
    rain: { icon: '\u{1F327}', label: 'Rain' },
    fire: { icon: '\u{1F525}', label: 'Fire' },
  }
  return soundscape && soundscape !== 'none' ? info[soundscape] || null : null
}

/**
 * Get tone display label
 */
function getToneLabel(tone: string): string {
  const labels: Record<string, string> = {
    gentle: 'Gentle',
    neutral: 'Balanced',
    coach: 'Motivating',
  }
  return labels[tone] || tone
}

/**
 * Generation complete screen
 */
export function GenerationCompleteScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const toast = useToast()
  const { getRitual, clearGeneratedRitualId } = useRituals()

  const [ritual, setRitual] = useState<Ritual | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load ritual data
  useEffect(() => {
    if (!id) {
      navigate('/feed', { replace: true })
      return
    }

    // Try to get the ritual from context
    const foundRitual = getRitual(id)
    if (foundRitual) {
      setRitual(foundRitual)
      setIsLoading(false)
      return
    }

    // Fallback: check sessionStorage for basic info
    const storedData = sessionStorage.getItem('generatedRitual')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        // Create a minimal ritual object from stored data
        setRitual({
          id: data.id,
          title: data.name || 'New Ritual',
          instructions: data.goals || '',
          duration: data.duration || 600,
          tone: data.tone || 'gentle',
          pace: 'medium',
          includeSilence: true,
          soundscape: data.soundscape,
          voiceId: data.voiceId,
          sections: [],
          tags: [],
          isTemplate: false,
          createdAt: new Date().toISOString() as any,
          updatedAt: new Date().toISOString() as any,
          statistics: null,
        })
        setIsLoading(false)
        return
      } catch {
        // Ignore parse errors
      }
    }

    // No ritual found, redirect
    navigate('/feed', { replace: true })
  }, [id, getRitual, navigate])

  /**
   * Handle Play Now - navigate to session
   */
  const handlePlayNow = useCallback(() => {
    if (!ritual) return

    // Clean up
    sessionStorage.removeItem('pendingGeneration')
    sessionStorage.removeItem('generatedRitual')
    clearGeneratedRitualId()

    // Navigate to session player
    navigate(`/session/${ritual.id}`)
  }, [ritual, navigate, clearGeneratedRitualId])

  /**
   * Handle Add to Gallery - just navigate to feed (ritual already saved by backend)
   */
  const handleAddToGallery = useCallback(() => {
    // Clean up
    sessionStorage.removeItem('pendingGeneration')
    sessionStorage.removeItem('generatedRitual')
    clearGeneratedRitualId()

    // Show success toast
    toast.showToast('success', 'Ritual added to your gallery')

    // Navigate to feed
    navigate('/feed', { replace: true })
  }, [navigate, clearGeneratedRitualId, toast])

  if (isLoading || !ritual) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-peach-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const soundscapeInfo = getSoundscapeInfo(ritual.soundscape)

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-6">
      {/* Success checkmark */}
      <div className="mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-2xl font-bold text-calm-900 text-center mb-8">
        Your ritual is ready!
      </h1>

      {/* Ritual preview card */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-warm-200 shadow-card p-5 mb-8">
        {/* Title */}
        <h2 className="font-serif text-xl font-semibold text-calm-900 mb-2">
          {ritual.title}
        </h2>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-100 text-calm-700 rounded-full text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(ritual.duration)}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 bg-warm-100 text-calm-700 rounded-full text-sm">
            {getToneLabel(ritual.tone)}
          </span>
          {soundscapeInfo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-100 text-calm-700 rounded-full text-sm">
              <span role="img" aria-hidden="true">{soundscapeInfo.icon}</span>
              {soundscapeInfo.label}
            </span>
          )}
        </div>

        {/* Instructions preview */}
        <p className="text-calm-600 text-sm line-clamp-3">
          {ritual.instructions}
        </p>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        {/* Primary: Play Now */}
        <Button
          variant="primary"
          size="lg"
          onClick={handlePlayNow}
          className="w-full"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Play Now
        </Button>

        {/* Secondary: Add to Gallery */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleAddToGallery}
          className="w-full"
        >
          Add to Gallery
        </Button>
      </div>
    </div>
  )
}
