/**
 * GenerationProgress component - Show staged progress during AI generation
 * Features: progress bar, stage messages, dismiss to background
 */

import { Card } from '@/components/ui'
import type { AIGenerationProgress } from '@/types'

export interface GenerationProgressProps {
  /** Current generation progress */
  progress: AIGenerationProgress
  /** Dismiss handler (move to background) */
  onDismiss: () => void
}

/**
 * Get stage message based on progress percentage
 */
function getStageMessage(progress: number): string {
  if (progress < 25) return 'Understanding your intention...'
  if (progress < 50) return 'Choosing the right pace...'
  if (progress < 75) return 'Crafting your guidance...'
  if (progress < 100) return 'Finalizing your ritual...'
  return 'Your ritual is ready!'
}

/**
 * Generation progress indicator with stages
 */
export function GenerationProgress({
  progress,
  onDismiss,
}: GenerationProgressProps) {
  const progressPercent = progress.progress
  const stageMessage = progress.message || getStageMessage(progressPercent)

  return (
    <Card variant="elevated">
      <Card.Body>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-calm-900 mb-1">
                Creating your ritual
              </h3>
              <p className="text-sm text-calm-600 transition-opacity duration-300">
                {stageMessage}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 text-calm-500 hover:text-calm-700 transition-colors"
              aria-label="Move to background"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-2 bg-calm-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-peach-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Progress percentage */}
            <p className="text-xs text-calm-600 text-right mt-1.5">
              {progressPercent}%
            </p>
          </div>

          {/* Stage indicator (optional) */}
          {progress.stage && (
            <p className="text-xs text-calm-500">
              Stage: {progress.stage}
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
