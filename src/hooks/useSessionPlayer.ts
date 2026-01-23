/**
 * useSessionPlayer - Hook for managing session playback with audio
 * Uses AudioSequencer for segment-based playback
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Ritual, RitualSection } from '@/types'
import {
  ritualAudioGenerator,
  type GenerationProgress,
  type SectionAudio,
} from '@/services'
import { AudioSequencer, type SequencerState } from '@/services/audio/AudioSequencer'

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
 * Uses AudioSequencer for segment-based playback
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
  const sequencerRef = useRef<AudioSequencer | null>(null)
  const sequencerUnsubscribeRef = useRef<(() => void) | null>(null)

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

  // Initialize sequencer
  useEffect(() => {
    if (!sequencerRef.current) {
      sequencerRef.current = new AudioSequencer()
    }

    return () => {
      // Clean up sequencer on unmount
      if (sequencerUnsubscribeRef.current) {
        sequencerUnsubscribeRef.current()
      }
      if (sequencerRef.current) {
        sequencerRef.current.dispose()
        sequencerRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle sequencer state changes
  const handleSequencerStateChange = useCallback((seqState: SequencerState) => {
    if (seqState.status === 'completed') {
      // Current section audio completed - advance to next section
      // The section transition effect will handle loading the next section's audio
    }

    // Update section elapsed from sequencer
    if (seqState.status === 'playing' || seqState.status === 'paused') {
      const sectionElapsedSeconds = seqState.elapsedMs / 1000
      setSectionElapsed(sectionElapsedSeconds)
    }
  }, [])

  // Load and play audio for current section
  const loadSectionAudio = useCallback((sectionId: string) => {
    const sectionAudio = sectionAudios.find((a) => a.sectionId === sectionId)
    if (!sectionAudio || !sequencerRef.current) return false

    // Unsubscribe from previous state changes
    if (sequencerUnsubscribeRef.current) {
      sequencerUnsubscribeRef.current()
    }

    // Load segments into sequencer
    sequencerRef.current.load(sectionAudio.segments)

    // Subscribe to state changes
    sequencerUnsubscribeRef.current = sequencerRef.current.onStateChange(
      handleSequencerStateChange
    )

    return true
  }, [sectionAudios, handleSequencerStateChange])

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
      const loaded = loadSectionAudio(section.id)
      if (loaded && sequencerRef.current) {
        sequencerRef.current.play()
      }
    }
  }, [ritual, currentSectionIndex, hasAudio, loadSectionAudio])

  // Stop sequencer when state changes away from playing
  useEffect(() => {
    if (state !== 'playing' && state !== 'silence' && state !== 'paused') {
      if (sequencerRef.current) {
        const seqState = sequencerRef.current.getState()
        if (seqState.status === 'playing') {
          sequencerRef.current.stop()
        }
      }
    }
  }, [state])

  // Timer tick (for text-only mode and overall progress)
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

  // Start timer when playing (for text-only mode or as fallback)
  useEffect(() => {
    // Only use timer for text-only mode
    // With audio, the sequencer handles timing within sections
    if ((state === 'playing' || state === 'silence') && !hasAudio) {
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
  }, [state, tick, hasAudio])

  // Update total elapsed when section elapsed changes (with audio)
  useEffect(() => {
    if (hasAudio && ritual) {
      // Calculate total elapsed from completed sections + current section elapsed
      let completedSectionsTime = 0
      for (let i = 0; i < currentSectionIndex; i++) {
        const section = ritual.sections[i]
        if (section) {
          completedSectionsTime += section.durationSeconds
        }
      }
      setTotalElapsed(completedSectionsTime + sectionElapsed)
    }
  }, [hasAudio, ritual, currentSectionIndex, sectionElapsed])

  // Handle sequencer completion to advance sections (with audio)
  useEffect(() => {
    if (!hasAudio || !sequencerRef.current) return

    const checkCompletion = () => {
      const seqState = sequencerRef.current?.getState()
      if (seqState?.status === 'completed' && (state === 'playing' || state === 'silence')) {
        // Section audio completed, advance to next section
        const nextIndex = currentSectionIndex + 1
        if (ritual && nextIndex < ritual.sections.length) {
          setCurrentSectionIndex(nextIndex)
          setSectionElapsed(0)
        } else {
          // No more sections
          setState('ending')
          setTimeout(() => setState('completed'), 2000)
        }
      }
    }

    // Subscribe to completion
    const unsubscribe = sequencerRef.current.onStateChange((seqState) => {
      if (seqState.status === 'completed') {
        checkCompletion()
      }
    })

    return () => unsubscribe()
  }, [hasAudio, ritual, currentSectionIndex, state])

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

    if (state === 'paused' && hasAudio && sequencerRef.current) {
      sequencerRef.current.play()
    }

    setState('playing')
  }, [state, hasAudio])

  // Pause
  const pause = useCallback(() => {
    if (hasAudio && sequencerRef.current) {
      sequencerRef.current.pause()
    }
    setState('paused')
  }, [hasAudio])

  // Restart
  const restart = useCallback(() => {
    if (sequencerRef.current) {
      sequencerRef.current.stop()
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
    if (sequencerRef.current) {
      sequencerRef.current.stop()
    }
    setState('completed')
  }, [])

  // Skip to next section
  const skipToNextSection = useCallback(() => {
    if (!ritual) return

    // Stop current audio
    if (sequencerRef.current) {
      sequencerRef.current.stop()
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
    const currentSec = ritual.sections[currentSectionIndex]
    if (currentSec) {
      const skippedTime = currentSec.durationSeconds - sectionElapsed
      setTotalElapsed((prev) => prev + skippedTime)
    }

    // Move to next section
    setCurrentSectionIndex(nextIndex)
    setSectionElapsed(0)
  }, [ritual, currentSectionIndex, sectionElapsed])

  // Cleanup section audio URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup is handled by the sequencer's dispose method
    }
  }, [])

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
