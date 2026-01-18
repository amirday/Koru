/**
 * SessionControls - Minimal session controls (pause/restart)
 */

import { useState, useEffect } from 'react'
import type { SessionState } from '@/hooks/useSessionPlayer'
import { useReducedMotion } from '@/hooks'

export interface SessionControlsProps {
  /** Current session state */
  state: SessionState
  /** Play callback */
  onPlay: () => void
  /** Pause callback */
  onPause: () => void
  /** Restart callback (shows confirm) */
  onRestart: () => void
  /** Auto-hide controls */
  autoHide?: boolean
  /** Auto-hide delay in ms */
  autoHideDelay?: number
}

/**
 * SessionControls - Minimal control bar
 */
export function SessionControls({
  state,
  onPlay,
  onPause,
  onRestart,
  autoHide = true,
  autoHideDelay = 3000,
}: SessionControlsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Auto-hide controls when playing
  useEffect(() => {
    if (!autoHide || state !== 'playing') {
      setIsVisible(true)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, autoHideDelay)

    return () => clearTimeout(timer)
  }, [autoHide, autoHideDelay, state])

  // Show controls on any interaction
  const handleShowControls = () => {
    setIsVisible(true)
  }

  const handleTogglePlay = () => {
    if (state === 'playing' || state === 'silence') {
      onPause()
    } else {
      onPlay()
    }
  }

  const handleRestartClick = () => {
    setShowRestartConfirm(true)
  }

  const handleRestartConfirm = () => {
    setShowRestartConfirm(false)
    onRestart()
  }

  const handleRestartCancel = () => {
    setShowRestartConfirm(false)
  }

  const isPaused = state === 'paused'
  const isPlaying = state === 'playing' || state === 'silence'

  // Transition classes
  const opacity = isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
  const transition = prefersReducedMotion ? '' : 'transition-opacity duration-300'

  return (
    <>
      {/* Controls bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 pb-safe ${opacity} ${transition}`}
        onClick={handleShowControls}
      >
        <div className="flex items-center justify-center gap-6 p-6 pb-8">
          {/* Restart button */}
          <button
            onClick={handleRestartClick}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-calm-800 hover:bg-white/30 transition-colors"
            aria-label="Restart session"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Play/Pause button */}
          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm text-calm-900 hover:bg-white/40 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Spacer for symmetry */}
          <div className="w-12 h-12" />
        </div>

        {/* Paused indicator */}
        {isPaused && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4">
            <span className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium text-calm-800">
              Paused
            </span>
          </div>
        )}
      </div>

      {/* Restart confirmation modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-calm-900/50 backdrop-blur-sm">
          <div className="bg-warm-50 rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-serif font-bold text-calm-900 mb-2">
              Restart session?
            </h3>
            <p className="text-calm-600 mb-6">
              This will start the ritual from the beginning.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestartCancel}
                className="flex-1 px-4 py-2 rounded-lg bg-calm-100 text-calm-700 font-medium hover:bg-calm-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestartConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-peach-500 text-white font-medium hover:bg-peach-600 transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
