/**
 * useSessionPlayer - Hook for managing session playback
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Ritual, RitualSection } from '@/types'

export type SessionState = 'idle' | 'playing' | 'paused' | 'silence' | 'ending' | 'completed'

export interface SessionPlayerState {
  /** Current session state */
  state: SessionState
  /** Current section index */
  currentSectionIndex: number
  /** Current section */
  currentSection: RitualSection | null
  /** Progress within current section (0-1) */
  sectionProgress: number
  /** Total elapsed time in seconds */
  elapsedTime: number
  /** Total duration of the ritual */
  totalDuration: number
  /** Whether guidance text should be visible */
  showGuidance: boolean
}

export interface UseSessionPlayerReturn extends SessionPlayerState {
  /** Start or resume playback */
  play: () => void
  /** Pause playback */
  pause: () => void
  /** Restart from beginning */
  restart: () => void
  /** End the session */
  end: () => void
}

/**
 * Hook for managing meditation session playback
 */
export function useSessionPlayer(ritual: Ritual | null): UseSessionPlayerReturn {
  const [state, setState] = useState<SessionState>('idle')
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [sectionElapsed, setSectionElapsed] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [showGuidance, setShowGuidance] = useState(true)

  const intervalRef = useRef<number | null>(null)

  // Current section
  const currentSection = ritual?.sections[currentSectionIndex] || null
  const totalDuration = ritual?.sections.reduce((sum, s) => sum + s.durationSeconds, 0) || 0

  // Calculate section progress
  const sectionProgress = currentSection
    ? Math.min(sectionElapsed / currentSection.durationSeconds, 1)
    : 0

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle section transitions
  useEffect(() => {
    if (!ritual || state !== 'playing') return

    const section = ritual.sections[currentSectionIndex]
    if (!section) {
      // No more sections - session complete
      setState('ending')
      setTimeout(() => setState('completed'), 2000)
      return
    }

    // Check if section is silence type
    if (section.type === 'silence') {
      setState('silence')
      setShowGuidance(false)
    } else {
      setState('playing')
      // Fade in guidance
      setShowGuidance(true)
    }
  }, [ritual, currentSectionIndex, state])

  // Timer tick
  const tick = useCallback(() => {
    if (!ritual) return

    setSectionElapsed((prev) => {
      const section = ritual.sections[currentSectionIndex]
      if (!section) return prev

      const newElapsed = prev + 1

      // Check if section complete
      if (newElapsed >= section.durationSeconds) {
        // Move to next section
        setCurrentSectionIndex((i) => i + 1)
        return 0
      }

      return newElapsed
    })

    setTotalElapsed((prev) => prev + 1)
  }, [ritual, currentSectionIndex])

  // Start timer when playing
  useEffect(() => {
    if (state === 'playing' || state === 'silence') {
      intervalRef.current = window.setInterval(tick, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state, tick])

  // Play
  const play = useCallback(() => {
    if (state === 'completed') {
      // Restart if completed
      setCurrentSectionIndex(0)
      setSectionElapsed(0)
      setTotalElapsed(0)
    }
    setState('playing')
  }, [state])

  // Pause
  const pause = useCallback(() => {
    setState('paused')
  }, [])

  // Restart
  const restart = useCallback(() => {
    setCurrentSectionIndex(0)
    setSectionElapsed(0)
    setTotalElapsed(0)
    setState('playing')
  }, [])

  // End
  const end = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setState('completed')
  }, [])

  return {
    state,
    currentSectionIndex,
    currentSection,
    sectionProgress,
    elapsedTime: totalElapsed,
    totalDuration,
    showGuidance,
    play,
    pause,
    restart,
    end,
  }
}
