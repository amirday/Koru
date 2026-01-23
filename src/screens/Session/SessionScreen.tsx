/**
 * SessionScreen - Sacred fullscreen meditation player
 * Features: Audio generation, minimal UI, auto-hide controls, text size cycling, gesture support
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRituals } from '@/contexts'
import { useSessionPlayer } from '@/hooks/useSessionPlayer'
import { useReducedMotion } from '@/hooks'
import { GuidanceText, SessionControls } from '@/components/session'
import { getSectionGuidanceText } from '@/types'
import { getTTSService } from '@/services'

type TextSize = 'medium' | 'large' | 'extra-large'

/**
 * Audio Preparation Screen - Shows while generating audio
 */
function AudioPreparation({
  progress,
  message,
  error,
  onRetry,
  onSkip,
  onCancel,
}: {
  progress: number
  message: string
  error: string | null
  onRetry: () => void
  onSkip: () => void
  onCancel: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  if (error) {
    return (
      <div className="fixed inset-0 bg-warm-50 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-serif font-bold text-calm-900 mb-2">
            Audio generation failed
          </h2>
          <p className="text-calm-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="w-full px-6 py-3 bg-peach-500 text-white rounded-lg font-medium hover:bg-peach-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onSkip}
              className="w-full px-6 py-3 bg-calm-100 text-calm-700 rounded-lg font-medium hover:bg-calm-200 transition-colors"
            >
              Continue without audio
            </button>
            <button
              onClick={onCancel}
              className="w-full px-6 py-2 text-calm-500 hover:text-calm-700 transition-colors"
            >
              Cancel session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-warm-50 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        {/* Animated breath circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-peach-200 to-calm-200 ${
              prefersReducedMotion ? '' : 'animate-pulse'
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-calm-700">{progress}%</span>
          </div>
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-calm-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
              strokeLinecap="round"
              className={`text-peach-500 ${
                prefersReducedMotion ? '' : 'transition-all duration-300'
              }`}
            />
          </svg>
        </div>

        <h2 className="text-xl font-serif font-bold text-calm-900 mb-2">
          Preparing your session
        </h2>
        <p className="text-calm-600 mb-2">{message || 'Generating audio...'}</p>
        <p className="text-sm text-calm-500 mb-8">
          Take a moment to settle in...
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onSkip}
            className="px-6 py-2 text-calm-500 hover:text-calm-700 transition-colors text-sm"
          >
            Skip audio and use text only
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 text-calm-400 hover:text-calm-600 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * SessionScreen - Sacred fullscreen meditation experience
 */
export function SessionScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRitual } = useRituals()
  const prefersReducedMotion = useReducedMotion()

  // Get ritual
  const ritual = id ? getRitual(id) : null

  // Session player
  const {
    state,
    currentSection,
    showGuidance,
    elapsedTime,
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
  } = useSessionPlayer(ritual ?? null)

  // Local state
  const textSize: TextSize = 'large'
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [sessionId] = useState(`session-${Date.now()}`)
  const [preparationStarted, setPreparationStarted] = useState(false)

  // Long press detection
  const longPressRef = useRef<number | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Check if TTS is available
  const ttsService = getTTSService()
  const isRealTTS = ttsService.isRealTTS()

  // Start audio generation on mount (if real TTS is available)
  useEffect(() => {
    if (ritual && state === 'idle' && !preparationStarted) {
      setPreparationStarted(true)
      if (isRealTTS) {
        // Generate audio first
        generateAudio()
      } else {
        // No real TTS, go straight to text mode
        skipToTextMode()
      }
    }
  }, [ritual, state, preparationStarted, isRealTTS, generateAudio, skipToTextMode])

  // Start playback when audio is ready
  useEffect(() => {
    if (state === 'ready') {
      // Small delay before starting
      const timer = setTimeout(() => {
        play()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [state, play])

  // Handle session completion
  useEffect(() => {
    if (state === 'completed') {
      // Navigate to reflection after brief delay
      setTimeout(() => {
        navigate(`/reflection/${sessionId}?ritualId=${id}`)
      }, 1000)
    }
  }, [state, navigate, sessionId, id])

  // Handle long press start
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX

    touchStartRef.current = { x: clientX, y: clientY }

    // Start long press timer
    longPressRef.current = window.setTimeout(() => {
      setShowExitConfirm(true)
      longPressRef.current = null
    }, 2000)
  }, [])

  // Handle touch end (clear long press timer)
  const handleTouchEnd = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
    touchStartRef.current = null
  }, [])

  // Handle touch move (detect swipe down)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.touches[0]
    if (!touch) return
    const clientY = touch.clientY
    const deltaY = clientY - touchStartRef.current.y

    // If swiped down more than 100px from top area, show exit confirm
    if (touchStartRef.current.y < 100 && deltaY > 100) {
      setShowExitConfirm(true)
      if (longPressRef.current) {
        clearTimeout(longPressRef.current)
        longPressRef.current = null
      }
    }
  }, [])

  // Handle exit confirmation
  const handleExitConfirm = () => {
    cancelGeneration()
    end()
    navigate('/home')
  }

  const handleExitCancel = () => {
    setShowExitConfirm(false)
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExitConfirm(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Not found state
  if (!ritual) {
    return (
      <div className="fixed inset-0 bg-warm-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-serif font-bold text-calm-900 mb-2">
            Ritual not found
          </h2>
          <button
            onClick={() => navigate('/rituals')}
            className="mt-4 px-6 py-2 bg-peach-500 text-white rounded-lg font-medium hover:bg-peach-600 transition-colors"
          >
            Back to Rituals
          </button>
        </div>
      </div>
    )
  }

  // Show preparation screen during audio generation
  if (state === 'generating' || state === 'error') {
    return (
      <AudioPreparation
        progress={generationProgress}
        message={generationMessage}
        error={state === 'error' ? errorMessage : null}
        onRetry={generateAudio}
        onSkip={skipToTextMode}
        onCancel={handleExitConfirm}
      />
    )
  }

  // Get current guidance text
  const guidanceText = currentSection?.type === 'silence'
    ? ''
    : currentSection ? getSectionGuidanceText(currentSection) : ''

  // Background animation class
  const bgTransition = prefersReducedMotion ? '' : 'transition-colors duration-1000'

  return (
    <div
      className={`fixed inset-0 bg-warm-50 ${bgTransition}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      {/* Audio indicator */}
      {hasAudio && (
        <div className="fixed top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
          <svg className="w-4 h-4 text-peach-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v18l-7-5H2V8h3l7-5zm10.5 9c0-3.33-2.27-6.18-5.5-7.37v1.72c2.3 1.09 4 3.39 4 5.65s-1.7 4.56-4 5.65v1.72c3.23-1.19 5.5-4.04 5.5-7.37zm-3.47 0c0-1.88-1.1-3.59-2.53-4.4v8.8c1.43-.81 2.53-2.52 2.53-4.4z"/>
          </svg>
          <span className="text-xs text-peach-600">Audio</span>
        </div>
      )}

      {/* Guidance text container */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <GuidanceText
          text={guidanceText}
          visible={showGuidance && !!guidanceText}
          size={textSize}
        />

        {/* Silence indicator */}
        {(state === 'silence' || currentSection?.type === 'silence') && (
          <div className="text-calm-400 text-sm font-medium">
            {/* Empty - just show calm background */}
          </div>
        )}

        {/* Ending state */}
        {state === 'ending' && (
          <div className={`text-center ${prefersReducedMotion ? '' : 'animate-fadeIn'}`}>
            <p className="text-2xl font-serif text-calm-700">
              Session complete
            </p>
          </div>
        )}
      </div>

      {/* Soundscape indicator (mocked) */}
      {ritual.soundscape && ritual.soundscape !== 'none' && (
        <div className="fixed top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
          <svg className="w-4 h-4 text-calm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span className="text-xs text-calm-600 capitalize">{ritual.soundscape}</span>
        </div>
      )}

      {/* Session controls */}
      <SessionControls
        state={state}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
        onSkipNext={skipToNextSection}
        autoHide={false}
      />

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-calm-900/50 backdrop-blur-sm">
          <div className="bg-warm-50 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-calm-900 mb-2">
              End session?
            </h3>
            <p className="text-calm-600 mb-6">
              You've been meditating for {Math.round(elapsedTime / 60)} minutes.
              Are you sure you want to end early?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExitCancel}
                className="flex-1 px-4 py-2 rounded-lg bg-calm-100 text-calm-700 font-medium hover:bg-calm-200 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-peach-500 text-white font-medium hover:bg-peach-600 transition-colors"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
