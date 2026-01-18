/**
 * ReflectionScreen - Post-session reflection capture
 * Features: Checkboxes, mood sliders, free text, smart suggestions
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRituals } from '@/contexts'
import { ScreenContainer } from '@/components/layout'
import { Button, Input, Card, useToast } from '@/components/ui'
import { ReflectionCheckboxes, MoodSlider, reflectionOptions } from '@/components/reflection'

const smartSuggestions = [
  { id: 'shorter', label: 'Shorter' },
  { id: 'more-silence', label: 'More silence' },
  { id: 'more-breath', label: 'More breath work' },
  { id: 'softer-tone', label: 'Softer tone' },
  { id: 'more-coaching', label: 'More coaching' },
]

/**
 * ReflectionScreen - Capture post-session reflection
 */
export function ReflectionScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const { getRitual } = useRituals()

  const ritualId = searchParams.get('ritualId')
  const ritual = ritualId ? getRitual(ritualId) : null

  // Form state
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([])
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [freeText, setFreeText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Check if user wants to adjust ritual
  const wantsAdjustment = selectedCheckboxes.includes('adjust-ritual')

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In real app, would save reflection to context/storage
      console.log('Saving reflection:', {
        selectedCheckboxes,
        moodBefore,
        moodAfter,
        freeText,
        ritualId,
      })

      toast.showToast('success', 'Reflection saved')
      navigate('/home')
    } catch (error) {
      console.error('Failed to save reflection:', error)
      toast.showToast('error', 'Failed to save reflection')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle skip
  const handleSkip = () => {
    navigate('/home')
  }

  // Handle edit ritual
  const handleEditRitual = () => {
    if (ritualId) {
      navigate(`/rituals/${ritualId}/edit`)
    } else {
      navigate('/rituals')
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestionId: string) => {
    toast.showToast('info', `Applying "${suggestionId}" to ritual... (mocked)`)
    if (ritualId) {
      navigate(`/rituals/${ritualId}/edit`)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-warm-50 pt-safe">
        <div className="px-6 py-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-calm-900 mb-2">
            Nice work.
          </h1>
          <p className="text-lg text-calm-600">
            What did you notice?
          </p>
        </div>
      </div>

      <ScreenContainer>
        <div className="space-y-8 pb-8">
          {/* Checkboxes */}
          <section>
            <ReflectionCheckboxes
              options={reflectionOptions}
              selected={selectedCheckboxes}
              onChange={setSelectedCheckboxes}
            />
          </section>

          {/* Smart suggestions (shown when adjustment selected) */}
          {wantsAdjustment && (
            <section>
              <h3 className="text-sm font-semibold text-calm-800 mb-3">
                Quick adjustments
              </h3>
              <div className="flex flex-wrap gap-2">
                {smartSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.id)}
                    className="px-4 py-2 bg-peach-100 text-peach-700 rounded-full text-sm font-medium hover:bg-peach-200 transition-colors"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Mood sliders */}
          <section>
            <h3 className="text-sm font-semibold text-calm-800 mb-4">
              How did your mood change?
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card variant="flat">
                <Card.Body>
                  <MoodSlider
                    label="Before session"
                    value={moodBefore}
                    onChange={setMoodBefore}
                  />
                </Card.Body>
              </Card>
              <Card variant="flat">
                <Card.Body>
                  <MoodSlider
                    label="After session"
                    value={moodAfter}
                    onChange={setMoodAfter}
                  />
                </Card.Body>
              </Card>
            </div>

            {/* Mood delta indicator */}
            {moodAfter !== moodBefore && (
              <div className="mt-4 text-center">
                <span className={`text-sm font-medium ${moodAfter > moodBefore ? 'text-green-600' : 'text-calm-600'}`}>
                  {moodAfter > moodBefore
                    ? `+${moodAfter - moodBefore} improvement`
                    : `${moodAfter - moodBefore} change`}
                </span>
              </div>
            )}
          </section>

          {/* Free text */}
          <section>
            <Input
              type="textarea"
              label="Anything else?"
              placeholder="One sentence is enough."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              autoResize
              maxRows={4}
            />
          </section>

          {/* Actions */}
          <section className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleSave}
              loading={isSaving}
            >
              Save Reflection
            </Button>

            {ritual && (
              <Button
                variant="secondary"
                fullWidth
                onClick={handleEditRitual}
              >
                Edit Ritual Based on This
              </Button>
            )}

            <Button
              variant="ghost"
              fullWidth
              onClick={handleSkip}
            >
              Skip
            </Button>
          </section>
        </div>
      </ScreenContainer>
    </div>
  )
}
