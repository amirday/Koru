/**
 * VoiceSelector - Radio-style list for voice selection
 * Features: Voice name, provider badge, description, preview button (mocked)
 */

import { useState, useEffect } from 'react'

export interface Voice {
  id: string
  name: string
  provider: string
  description: string
  labels: string[]
  previewUrl: string
  previewText: string
}

export interface VoiceSelectorProps {
  /** Selected voice ID */
  value: string
  /** Change handler */
  onChange: (voiceId: string) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Provider badge component
 */
function ProviderBadge({ provider }: { provider: string }) {
  const colors: Record<string, string> = {
    google: 'bg-blue-100 text-blue-700',
    elevenlabs: 'bg-purple-100 text-purple-700',
  }

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${colors[provider] || 'bg-calm-100 text-calm-700'}
      `}
    >
      {provider}
    </span>
  )
}

/**
 * Radio-style voice selection list
 */
export function VoiceSelector({
  value,
  onChange,
  className = '',
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load voices from JSON
  useEffect(() => {
    async function loadVoices() {
      try {
        const response = await fetch('/src/data/voices.json')
        const data = await response.json()
        setVoices(data.voices)
      } catch (error) {
        // Fallback to inline data if fetch fails
        console.warn('Failed to load voices.json, using fallback')
        setVoices([
          {
            id: 'Aoede',
            name: 'Aoede',
            provider: 'google',
            description: 'Warm, gentle female voice perfect for calming meditations',
            labels: ['calm', 'female', 'warm', 'meditative'],
            previewUrl: '/voices/aoede-preview.mp3',
            previewText: 'Take a deep breath and let your shoulders relax.',
          },
          {
            id: 'Charon',
            name: 'Charon',
            provider: 'google',
            description: 'Deep, grounding male voice ideal for focused practices',
            labels: ['deep', 'male', 'grounding', 'focused'],
            previewUrl: '/voices/charon-preview.mp3',
            previewText: 'Take a deep breath and let your shoulders relax.',
          },
          {
            id: 'EXAVITQu4vr4xnSDxMaL',
            name: 'Sarah',
            provider: 'elevenlabs',
            description: 'Soft and calm American female voice',
            labels: ['calm', 'female', 'american', 'soft'],
            previewUrl: '/voices/elevenlabs-sarah-preview.mp3',
            previewText: 'Welcome to your meditation practice.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadVoices()
  }, [])

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-warm-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`space-y-2 ${className}`}
      role="radiogroup"
      aria-label="Meditation guide voice"
    >
      {voices.map((voice) => {
        const isSelected = value === voice.id

        return (
          <button
            key={voice.id}
            type="button"
            onClick={() => onChange(voice.id)}
            role="radio"
            aria-checked={isSelected}
            className={`
              w-full text-left
              p-3 rounded-lg
              border-2 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-500 focus-visible:ring-offset-2
              ${
                isSelected
                  ? 'border-peach-500 bg-peach-50'
                  : 'border-warm-200 bg-white hover:border-warm-300 hover:bg-warm-50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Radio indicator */}
              <div
                className={`
                  flex-shrink-0 mt-0.5
                  w-5 h-5 rounded-full
                  border-2 flex items-center justify-center
                  ${
                    isSelected
                      ? 'border-peach-500 bg-peach-500'
                      : 'border-calm-300'
                  }
                `}
              >
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              {/* Voice info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-calm-900">
                    {voice.name}
                  </span>
                  <ProviderBadge provider={voice.provider} />
                </div>
                <p className="text-sm text-calm-600 line-clamp-2">
                  {voice.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
