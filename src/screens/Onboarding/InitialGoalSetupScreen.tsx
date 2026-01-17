/**
 * InitialGoalSetupScreen - Goal setup during onboarding
 * Features: goal input, duration/tone selection, validation, submission
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useRituals } from '@/contexts'
import { ScreenContainer } from '@/components/layout'
import { Button, Card, Input } from '@/components/ui'
import type { RitualTone } from '@/types'

// Suggestion chips for goal input
const GOAL_SUGGESTIONS = [
  'Focus',
  'Calm',
  'Confidence',
  'Gratitude',
  'Better sleep',
]

// Duration options (in minutes)
const DURATION_OPTIONS = [
  { value: 5 * 60, label: '5 min' },
  { value: 10 * 60, label: '10 min' },
  { value: 15 * 60, label: '15 min' },
  { value: 20 * 60, label: '20 min' },
]

// Tone options
const TONE_OPTIONS: Array<{ value: RitualTone; label: string; description: string }> = [
  { value: 'gentle', label: 'Gentle', description: 'Soft & nurturing' },
  { value: 'neutral', label: 'Neutral', description: 'Clear & balanced' },
  { value: 'coach', label: 'Coach', description: 'Direct & motivating' },
]

/**
 * Goal setup screen for onboarding
 */
export function InitialGoalSetupScreen() {
  const navigate = useNavigate()
  const { updateGoal, updatePreferences, completeOnboarding } = useApp()
  const { startGeneration } = useRituals()

  const [goalText, setGoalText] = useState('')
  const [duration, setDuration] = useState(10 * 60) // default 10 min
  const [tone, setTone] = useState<RitualTone>('gentle') // default gentle
  const [isSubmitting, setIsSubmitting] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Validation
  const isValid = goalText.trim().length >= 3
  const canSubmit = isValid && !isSubmitting

  const handleSuggestionClick = (suggestion: string) => {
    setGoalText(suggestion)
    textareaRef.current?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit) return

    setIsSubmitting(true)

    try {
      // 1. Update goal
      await updateGoal(goalText.trim())

      // 2. Update preferences
      await updatePreferences({
        defaultDuration: duration,
        defaultTone: tone,
      })

      // 3. Complete onboarding
      await completeOnboarding()

      // 4. Start generation in background
      await startGeneration({
        instructions: goalText.trim(),
        duration,
        tone,
        includeSilence: true,
        soundscape: 'ocean',
      })

      // 5. Navigate to home
      navigate('/home', { replace: true })
    } catch (error) {
      console.error('Onboarding submission failed:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <ScreenContainer showTabBarPadding={false}>
      <div className="max-w-lg mx-auto py-8">
        {/* Progress indicator */}
        <p className="text-center text-sm text-calm-600 mb-8">
          Almost there...
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal input */}
          <Card>
            <Card.Body>
              <h2 className="text-lg font-serif font-bold text-calm-900 mb-4">
                What do you want more of this month?
              </h2>

              <Input
                ref={textareaRef}
                type="textarea"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Type your goal..."
                helperText="Short is fine. Clarity beats poetry."
                autoResize
                maxRows={6}
                className="mb-4"
              />

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2">
                {GOAL_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm rounded-full bg-warm-100 text-calm-700 hover:bg-peach-100 hover:text-peach-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Duration selection */}
          <Card>
            <Card.Body>
              <h3 className="text-base font-semibold text-calm-900 mb-3">
                How much time do you have?
              </h3>

              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDuration(option.value)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        duration === option.value
                          ? 'bg-peach-500 text-white'
                          : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Tone selection */}
          <Card>
            <Card.Body>
              <h3 className="text-base font-semibold text-calm-900 mb-3">
                What style feels right?
              </h3>

              <div className="space-y-2">
                {TONE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTone(option.value)}
                    className={`
                      w-full px-4 py-3 rounded-lg text-left transition-colors
                      ${
                        tone === option.value
                          ? 'bg-peach-500 text-white'
                          : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
                      }
                    `}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={`text-sm ${
                        tone === option.value ? 'text-white/90' : 'text-calm-600'
                      }`}
                    >
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create my first ritual'}
          </Button>

          {/* Validation message */}
          {goalText.length > 0 && !isValid && (
            <p className="text-sm text-calm-500 text-center">
              Goal must be at least 3 characters
            </p>
          )}
        </form>
      </div>
    </ScreenContainer>
  )
}
