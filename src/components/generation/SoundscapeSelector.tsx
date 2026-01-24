/**
 * SoundscapeSelector - Horizontal pill buttons with icons
 * Features: Ocean, Forest, Rain, Fire, None options
 */

import type { Soundscape } from '@/types'

export interface SoundscapeSelectorProps {
  /** Selected soundscape */
  value: Soundscape
  /** Change handler */
  onChange: (soundscape: Soundscape) => void
  /** Additional CSS classes */
  className?: string
}

interface SoundscapeOption {
  id: Soundscape
  label: string
  icon: string
}

const SOUNDSCAPE_OPTIONS: SoundscapeOption[] = [
  { id: 'ocean', label: 'Ocean', icon: '\u{1F30A}' },
  { id: 'forest', label: 'Forest', icon: '\u{1F332}' },
  { id: 'rain', label: 'Rain', icon: '\u{1F327}' },
  { id: 'fire', label: 'Fire', icon: '\u{1F525}' },
  { id: 'none', label: 'None', icon: '\u{2205}' },
]

/**
 * Horizontal pill buttons for soundscape selection
 */
export function SoundscapeSelector({
  value,
  onChange,
  className = '',
}: SoundscapeSelectorProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="radiogroup"
      aria-label="Background audio"
    >
      {SOUNDSCAPE_OPTIONS.map((option) => {
        const isSelected = value === option.id

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
            className={`
              flex items-center gap-1.5
              px-3 py-2 rounded-full
              text-sm font-medium
              transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-500 focus-visible:ring-offset-2
              ${
                isSelected
                  ? 'bg-peach-500 text-white shadow-sm'
                  : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
              }
            `}
          >
            <span className="text-base" role="img" aria-hidden="true">
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
