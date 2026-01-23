/**
 * VoicePacingTab - Configure voice, tone, pace, silence, and soundscape
 */

import { useEffect, useState } from 'react'
import type { RitualTone, RitualPace, Soundscape, Voice } from '@/types'
import { Button, Slider, useToast } from '@/components/ui'
import { getTTSService } from '@/services/tts'

export interface VoicePacingTabProps {
  /** Selected voice ID */
  voiceId?: string
  /** Voice tone */
  tone: RitualTone
  /** Speech pace */
  pace: RitualPace
  /** Silence level */
  silence: 'off' | 'light' | 'heavy'
  /** Soundscape selection */
  soundscape: Soundscape
  /** Soundscape volume (0-100) */
  soundscapeVolume?: number
  /** Update voice callback */
  onVoiceChange?: (voiceId: string) => void
  /** Update tone callback */
  onToneChange: (tone: RitualTone) => void
  /** Update pace callback */
  onPaceChange: (pace: RitualPace) => void
  /** Update silence callback */
  onSilenceChange: (silence: 'off' | 'light' | 'heavy') => void
  /** Update soundscape callback */
  onSoundscapeChange: (soundscape: Soundscape) => void
  /** Update volume callback */
  onVolumeChange?: (volume: number) => void
}

const toneOptions: { value: RitualTone; label: string; description: string }[] = [
  { value: 'gentle', label: 'Gentle', description: 'Soft, nurturing guidance' },
  { value: 'neutral', label: 'Neutral', description: 'Balanced, calm instruction' },
  { value: 'coach', label: 'Coaching', description: 'Direct, motivating tone' },
]

const paceOptions: { value: RitualPace; label: string; description: string }[] = [
  { value: 'slow', label: 'Slow', description: 'Spacious, with longer pauses' },
  { value: 'medium', label: 'Medium', description: 'Natural, comfortable pace' },
  { value: 'fast', label: 'Fast', description: 'Brisk, efficient delivery' },
]

const silenceOptions: { value: 'off' | 'light' | 'heavy'; label: string; description: string }[] = [
  { value: 'off', label: 'Off', description: 'Continuous guidance' },
  { value: 'light', label: 'Light', description: 'Short silent pauses' },
  { value: 'heavy', label: 'Heavy', description: 'Extended silence periods' },
]

const soundscapeOptions: { value: Soundscape; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'rain', label: 'Rain' },
  { value: 'ocean', label: 'Ocean Waves' },
  { value: 'forest', label: 'Forest' },
  { value: 'fire', label: 'Fireplace' },
]

/**
 * Provider badge component
 */
function ProviderBadge({ provider }: { provider: string }) {
  const colors = {
    google: 'bg-blue-100 text-blue-700',
    elevenlabs: 'bg-purple-100 text-purple-700',
    mock: 'bg-gray-100 text-gray-600',
  }
  const labels = {
    google: 'Google',
    elevenlabs: 'ElevenLabs',
    mock: 'Mock',
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[provider as keyof typeof colors] || colors.mock}`}>
      {labels[provider as keyof typeof labels] || provider}
    </span>
  )
}

/**
 * Voice selection card component
 */
function VoiceCard({
  voice,
  isSelected,
  isAvailable,
  onSelect,
  onPreview,
}: {
  voice: Voice
  isSelected: boolean
  isAvailable: boolean
  onSelect: () => void
  onPreview: () => void
}) {
  return (
    <div
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-peach-500 bg-peach-50'
          : isAvailable
          ? 'border-calm-200 hover:border-calm-300 hover:bg-warm-50'
          : 'border-calm-100 bg-calm-50 opacity-60 cursor-not-allowed'
      }`}
      onClick={isAvailable ? onSelect : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-calm-900">{voice.name}</h4>
            <ProviderBadge provider={voice.provider} />
          </div>
          <p className="text-sm text-calm-600 mb-2">{voice.description}</p>
          <div className="flex flex-wrap gap-1">
            {voice.labels.slice(0, 3).map((label) => (
              <span
                key={label}
                className="text-xs px-2 py-0.5 rounded-full bg-calm-100 text-calm-600"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Selection indicator */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? 'border-peach-500 bg-peach-500'
                : 'border-calm-300 bg-white'
            }`}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Preview button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPreview()
            }}
            className="p-1.5 rounded-full hover:bg-calm-100 text-calm-500 hover:text-calm-700 transition-colors"
            title="Preview voice"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Unavailable overlay message */}
      {!isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
          <span className="text-xs text-calm-500 bg-white px-2 py-1 rounded shadow-sm">
            API key not configured
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * RadioGroup component for selecting options
 */
function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string; description?: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-calm-800 mb-3">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              value === option.value
                ? 'border-peach-500 bg-peach-50'
                : 'border-calm-200 hover:border-calm-300 hover:bg-warm-50'
            }`}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-0.5 w-4 h-4 text-peach-500 focus:ring-peach-500 focus:ring-offset-2"
            />
            <div>
              <span className="block font-medium text-calm-900">{option.label}</span>
              {option.description && (
                <span className="block text-sm text-calm-600">{option.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

/**
 * VoicePacingTab - Voice and pacing settings
 */
export function VoicePacingTab({
  voiceId,
  tone,
  pace,
  silence,
  soundscape,
  soundscapeVolume = 50,
  onVoiceChange,
  onToneChange,
  onPaceChange,
  onSilenceChange,
  onSoundscapeChange,
  onVolumeChange,
}: VoicePacingTabProps) {
  const toast = useToast()
  const [voices, setVoices] = useState<Voice[]>([])
  const [loading, setLoading] = useState(true)

  // Load voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const ttsService = getTTSService()
        const allVoices = await ttsService.getVoices()
        setVoices(allVoices)
      } catch (error) {
        console.error('Failed to load voices:', error)
        toast.showToast('error', 'Failed to load voices')
      } finally {
        setLoading(false)
      }
    }
    loadVoices()
  }, [])

  // Get default voice ID if none selected
  const selectedVoiceId = voiceId || getTTSService().getDefaultVoiceId()

  const handlePreviewVoice = (voice: Voice) => {
    toast.showToast('info', `Playing preview for ${voice.name}... (mocked)`)
    // In a real implementation, this would play the voice preview audio
  }

  const handlePreviewSound = () => {
    toast.showToast('info', `Playing ${soundscape} preview... (mocked)`)
  }

  const isVoiceAvailable = (voice: Voice) => {
    return getTTSService().isVoiceAvailable(voice.id)
  }

  return (
    <div className="space-y-8">
      {/* Voice Selection */}
      {onVoiceChange && (
        <div>
          <h3 className="text-sm font-semibold text-calm-800 mb-3">Voice</h3>
          <p className="text-sm text-calm-600 mb-4">
            Choose the voice character for your meditation guidance
          </p>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-calm-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {voices.map((voice) => (
                <VoiceCard
                  key={voice.id}
                  voice={voice}
                  isSelected={voice.id === selectedVoiceId}
                  isAvailable={isVoiceAvailable(voice)}
                  onSelect={() => onVoiceChange(voice.id)}
                  onPreview={() => handlePreviewVoice(voice)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tone */}
      <RadioGroup
        label="Voice Tone"
        value={tone}
        options={toneOptions}
        onChange={onToneChange}
      />

      {/* Pace */}
      <RadioGroup
        label="Pace"
        value={pace}
        options={paceOptions}
        onChange={onPaceChange}
      />

      {/* Silence */}
      <RadioGroup
        label="Silence Level"
        value={silence}
        options={silenceOptions}
        onChange={onSilenceChange}
      />

      {/* Soundscape */}
      <div>
        <h3 className="text-sm font-semibold text-calm-800 mb-3">Soundscape</h3>
        <select
          value={soundscape}
          onChange={(e) => onSoundscapeChange(e.target.value as Soundscape)}
          className="w-full px-4 py-2.5 text-base rounded-lg border border-calm-300 bg-white text-calm-900 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
        >
          {soundscapeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Volume control (only when soundscape is not none) */}
        {soundscape !== 'none' && onVolumeChange && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-calm-700">Volume</label>
              <span className="text-sm text-calm-600">{soundscapeVolume}%</span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={soundscapeVolume}
              onChange={onVolumeChange}
            />
          </div>
        )}

        {/* Preview button */}
        {soundscape !== 'none' && (
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviewSound}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Preview Sound
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
