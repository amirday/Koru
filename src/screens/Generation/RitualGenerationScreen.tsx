/**
 * RitualGenerationScreen - Form screen for ritual creation
 * Features: Name, goals, duration, voice, soundscape inputs
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header, ScreenContainer } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import { DurationPicker, VoiceSelector, SoundscapeSelector } from '@/components/generation'
import type { Soundscape, Ritual } from '@/types'

interface FormState {
  name: string
  goals: string
  duration: number // in seconds
  voiceId: string
  soundscape: Soundscape
}

interface FormErrors {
  name?: string
  goals?: string
}

/**
 * Ritual generation form screen
 */
export function RitualGenerationScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get template ritual from navigation state (if any)
  const templateRitual = (location.state as { templateRitual?: Ritual })?.templateRitual

  // Form state
  const [form, setForm] = useState<FormState>({
    name: templateRitual?.title || '',
    goals: templateRitual?.instructions || '',
    duration: templateRitual?.duration || 600, // 10 min default
    voiceId: templateRitual?.voiceId || 'Aoede',
    soundscape: templateRitual?.soundscape || 'none',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form if template changes
  useEffect(() => {
    if (templateRitual) {
      setForm({
        name: templateRitual.title || '',
        goals: templateRitual.instructions || '',
        duration: templateRitual.duration || 600,
        voiceId: templateRitual.voiceId || 'Aoede',
        soundscape: templateRitual.soundscape || 'none',
      })
    }
  }, [templateRitual])

  /**
   * Handle form field changes
   */
  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error for field on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  /**
   * Validate form
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Please enter a name for your ritual'
    }

    if (!form.goals.trim()) {
      newErrors.goals = 'Please describe your goals for this ritual'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)

    // Store form data in session storage for the progress screen
    const generationData = {
      name: form.name.trim(),
      goals: form.goals.trim(),
      duration: form.duration,
      voiceId: form.voiceId,
      soundscape: form.soundscape,
      // Backend defaults (not exposed in UI)
      tone: 'gentle',
      includeSilence: true,
      pace: 'medium',
    }

    sessionStorage.setItem('pendingGeneration', JSON.stringify(generationData))

    // Navigate to progress screen
    navigate('/generate/progress')
  }

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Header title="Create Ritual" onBack={handleBack} />
      <ScreenContainer>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Ritual Name */}
          <div className="space-y-2">
            <label
              htmlFor="ritual-name"
              className="block text-sm font-medium text-calm-700"
            >
              Ritual Name
            </label>
            <Input
              id="ritual-name"
              type="text"
              placeholder="e.g., Morning Focus, Evening Wind-Down"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
            />
          </div>

          {/* Goals / Intention */}
          <div className="space-y-2">
            <label
              htmlFor="ritual-goals"
              className="block text-sm font-medium text-calm-700"
            >
              Your Goals
            </label>
            <textarea
              id="ritual-goals"
              rows={4}
              placeholder="What do you want to achieve with this meditation? e.g., Reduce morning anxiety, improve focus before meetings, wind down before sleep..."
              value={form.goals}
              onChange={(e) => handleChange('goals', e.target.value)}
              className={`
                w-full px-4 py-3
                bg-white border rounded-lg
                text-calm-900 placeholder-calm-400
                resize-none
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent
                ${errors.goals ? 'border-red-400' : 'border-warm-200'}
              `}
            />
            {errors.goals && (
              <p className="text-sm text-red-600">{errors.goals}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-calm-700">
              Duration
            </label>
            <DurationPicker
              value={form.duration}
              onChange={(duration) => handleChange('duration', duration)}
            />
          </div>

          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-calm-700">
              Meditation Guide
            </label>
            <VoiceSelector
              value={form.voiceId}
              onChange={(voiceId) => handleChange('voiceId', voiceId)}
            />
          </div>

          {/* Soundscape */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-calm-700">
              Background Audio
            </label>
            <SoundscapeSelector
              value={form.soundscape}
              onChange={(soundscape) => handleChange('soundscape', soundscape)}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              Generate
            </Button>
          </div>
        </form>
      </ScreenContainer>
    </>
  )
}
