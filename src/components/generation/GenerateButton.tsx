/**
 * GenerateButton component - Primary CTA to start ritual generation
 * Features: duration/tone dropdowns, voice selector, silence toggle, loading state
 */

import { useState, useEffect } from 'react'
import { Button, Card, Toggle } from '@/components/ui'
import { getTTSService } from '@/services/tts'
import type { RitualTone, AIGenerationOptions, Voice } from '@/types'

export interface GenerateButtonProps {
  /** Generation start handler */
  onGenerate: (options: AIGenerationOptions) => void
  /** Whether generation is in progress */
  isGenerating: boolean
  /** Default duration in seconds */
  defaultDuration: number
  /** Default tone */
  defaultTone: RitualTone
  /** Default include silence */
  defaultIncludeSilence?: boolean
}

// Duration options (in seconds)
const DURATION_OPTIONS = [
  { value: 5 * 60, label: '5 min' },
  { value: 10 * 60, label: '10 min' },
  { value: 15 * 60, label: '15 min' },
  { value: 20 * 60, label: '20 min' },
]

// Tone options
const TONE_OPTIONS: Array<{ value: RitualTone; label: string }> = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'coach', label: 'Coach' },
]

/**
 * Generate button with configuration options
 */
export function GenerateButton({
  onGenerate,
  isGenerating,
  defaultDuration,
  defaultTone,
  defaultIncludeSilence = true,
}: GenerateButtonProps) {
  const [duration, setDuration] = useState(defaultDuration)
  const [tone, setTone] = useState<RitualTone>(defaultTone)
  const [includeSilence, setIncludeSilence] = useState(defaultIncludeSilence)
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('sarah')

  // Load available voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const ttsService = getTTSService()
        const allVoices = await ttsService.getVoices()
        // Filter to only available voices
        const availableVoices = allVoices.filter(v => ttsService.isVoiceAvailable(v.id))
        setVoices(availableVoices)
        // Set default voice if available
        const firstVoice = availableVoices[0]
        if (firstVoice && !availableVoices.find(v => v.id === selectedVoice)) {
          setSelectedVoice(firstVoice.id)
        }
      } catch (error) {
        console.error('Failed to load voices:', error)
      }
    }
    loadVoices()
  }, [])

  const handleGenerate = () => {
    // Determine provider from selected voice
    const voice = voices.find(v => v.id === selectedVoice)
    const provider = voice?.provider as 'elevenlabs' | 'google' | undefined

    onGenerate({
      instructions: '', // Will be filled from goal context
      duration,
      tone,
      includeSilence,
      soundscape: 'ocean', // Default soundscape
      voiceId: selectedVoice,
      provider: provider || 'elevenlabs',
    })
  }

  return (
    <Card variant="elevated">
      <Card.Body>
        <div className="space-y-4">
          {/* Header */}
          <h3 className="text-lg font-serif font-bold text-calm-900">
            Generate New Ritual
          </h3>

          {/* Duration selector */}
          <div>
            <label className="block text-sm font-medium text-calm-800 mb-2">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDuration(option.value)}
                  disabled={isGenerating}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      duration === option.value
                        ? 'bg-peach-500 text-white'
                        : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone selector */}
          <div>
            <label className="block text-sm font-medium text-calm-800 mb-2">
              Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  disabled={isGenerating}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      tone === option.value
                        ? 'bg-peach-500 text-white'
                        : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice selector */}
          {voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-calm-800 mb-2">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 rounded-lg border border-calm-300 bg-white text-calm-700 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500 disabled:opacity-50"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.provider === 'elevenlabs' ? 'ElevenLabs' : 'Google'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Silence toggle */}
          <div>
            <Toggle
              variant="switch"
              label="Include silence moments"
              labelPosition="left"
              checked={includeSilence}
              onChange={(checked) => setIncludeSilence(checked)}
              disabled={isGenerating}
              className="flex items-center justify-between"
            />
          </div>

          {/* Generate button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGenerate}
            disabled={isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
