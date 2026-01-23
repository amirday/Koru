/**
 * useSessionPlayer - Hook for managing session playback with audio
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Ritual, RitualSection } from '@/types'
import {
  ritualAudioGenerator,
  type GenerationProgress,
  type SectionAudio,
} from '@/services'

export type SessionState =
  | 'idle'
  | 'generating'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'silence'
  | 'ending'
  | 'completed'
  | 'error'

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
  /** Audio generation progress (0-100) */
  generationProgress: number
  /** Audio generation status message */
  generationMessage: string
  /** Error message if any */
  errorMessage: string | null
  /** Whether audio is available */
  hasAudio: boolean
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
  /** Skip to next section */
  skipToNextSection: () => void
  /** Generate audio for the ritual */
  generateAudio: () => Promise<void>
  /** Cancel audio generation */
  cancelGeneration: () => void
  /** Skip to text-only mode */
  skipToTextMode: () => void
}

/**
 * Hook for managing meditation session playback with audio
 */
export function useSessionPlayer(ritual: Ritual | null): UseSessionPlayerReturn {
  const [state, setState] = useState<SessionState>('idle')
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [sectionElapsed, setSectionElapsed] = useState(0)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const [showGuidance, setShowGuidance] = useState(true)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sectionAudios, setSectionAudios] = useState<SectionAudio[]>([])
  const [useTextMode, setUseTextMode] = useState(false)

  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Current section
  const currentSection = ritual?.sections[currentSectionIndex] || null
  const totalDuration =
    ritual?.sections.reduce((sum, s) => sum + s.durationSeconds, 0) || 0

  // Calculate section progress
  const sectionProgress = currentSection
    ? Math.min(sectionElapsed / currentSection.durationSeconds, 1)
    : 0

  // Has audio available
  const hasAudio = sectionAudios.length > 0 && !useTextMode

  // Clean up audio element and URLs on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      // Revoke audio URLs
      sectionAudios.forEach((audio) => {
        URL.revokeObjectURL(audio.audioUrl)
      })
    }
  }, [])

  // Handle section transitions
  useEffect(() => {
    if (!ritual || (state !== 'playing' && state !== 'silence')) return

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

    // Start audio for this section if available
    if (hasAudio) {
      const sectionAudio = sectionAudios.find((a) => a.sectionId === section.id)
      if (sectionAudio) {
        playAudio(sectionAudio.audioUrl)
      }
    }
  }, [ritual, currentSectionIndex, state, hasAudio, sectionAudios])

  // Play audio for a section
  const playAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(url)
    audioRef.current = audio

    audio.onended = () => {
      // Audio finished, section transition will be handled by timer
    }

    audio.onerror = () => {
      console.error('Audio playback error')
      // Continue with timer-based progression
    }

    audio.play().catch((err) => {
      console.error('Failed to play audio:', err)
    })
  }, [])

  // Pause audio
  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  // Resume audio
  const resumeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }, [])

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

  // Generate audio for the ritual
  const generateAudio = useCallback(async () => {
    if (!ritual) return

    setState('generating')
    setGenerationProgress(0)
    setGenerationMessage('Preparing audio generation...')
    setErrorMessage(null)

    try {
      const result = await ritualAudioGenerator.generateRitualAudio(
        ritual,
        ritual.voiceId,
        (progress: GenerationProgress) => {
          setGenerationProgress(progress.percentage)
          setGenerationMessage(progress.message)
        }
      )

      setSectionAudios(result.sections)
      setState('ready')
      setGenerationMessage('Audio ready!')
    } catch (error) {
      console.error('Audio generation error:', error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Audio generation failed'
      )
      setState('error')
    }
  }, [ritual])

  // Cancel audio generation
  const cancelGeneration = useCallback(() => {
    ritualAudioGenerator.cancel()
    setState('idle')
    setGenerationProgress(0)
    setGenerationMessage('')
  }, [])

  // Skip to text-only mode
  const skipToTextMode = useCallback(() => {
    setUseTextMode(true)
    setState('ready')
    setGenerationMessage('')
  }, [])

  // Play
  const play = useCallback(() => {
    if (state === 'completed') {
      // Restart if completed
      setCurrentSectionIndex(0)
      setSectionElapsed(0)
      setTotalElapsed(0)
    }

    if (state === 'paused' && hasAudio) {
      resumeAudio()
    }

    setState('playing')
  }, [state, hasAudio, resumeAudio])

  // Pause
  const pause = useCallback(() => {
    pauseAudio()
    setState('paused')
  }, [pauseAudio])

  // Restart
  const restart = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
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
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setState('completed')
  }, [])

  // Skip to next section
  const skipToNextSection = useCallback(() => {
    if (!ritual) return

    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause()
    }

    // Check if there's a next section
    const nextIndex = currentSectionIndex + 1
    if (nextIndex >= ritual.sections.length) {
      // No more sections - end session
      setState('ending')
      setTimeout(() => setState('completed'), 2000)
      return
    }

    // Update elapsed time to account for skipped time
    const currentSection = ritual.sections[currentSectionIndex]
    if (currentSection) {
      const skippedTime = currentSection.durationSeconds - sectionElapsed
      setTotalElapsed((prev) => prev + skippedTime)
    }

    // Move to next section
    setCurrentSectionIndex(nextIndex)
    setSectionElapsed(0)
  }, [ritual, currentSectionIndex, sectionElapsed])

  return {
    state,
    currentSectionIndex,
    currentSection,
    sectionProgress,
    elapsedTime: totalElapsed,
    totalDuration,
    showGuidance,
    generationProgress,
    generationMessage,
    errorMessage,
    hasAudio,
    play,
    pause,
    restart,
    end,
    skipToNextSection,
    generateAudio,
    cancelGeneration,
    skipToTextMode,
  }
}
