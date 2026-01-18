/**
 * VoicePacingTab - Configure tone, pace, silence, and soundscape
 */

import type { RitualTone, RitualPace, Soundscape } from '@/types'
import { Button, Slider, useToast } from '@/components/ui'

export interface VoicePacingTabProps {
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
  tone,
  pace,
  silence,
  soundscape,
  soundscapeVolume = 50,
  onToneChange,
  onPaceChange,
  onSilenceChange,
  onSoundscapeChange,
  onVolumeChange,
}: VoicePacingTabProps) {
  const toast = useToast()

  const handlePreviewSound = () => {
    toast.showToast('info', `Playing ${soundscape} preview... (mocked)`)
  }

  return (
    <div className="space-y-8">
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
