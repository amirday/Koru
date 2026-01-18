/**
 * GenerateButton component - Primary CTA to start ritual generation
 * Features: duration/tone dropdowns, silence toggle, loading state
 */

import { useState } from 'react'
import { Button, Card, Toggle } from '@/components/ui'
import type { RitualTone, AIGenerationOptions } from '@/types'

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

  const handleGenerate = () => {
    onGenerate({
      instructions: '', // Will be filled from goal context
      duration,
      tone,
      includeSilence,
      soundscape: 'ocean', // Default soundscape
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
