/**
 * DurationPicker - Horizontal button group for duration selection
 * Features: Multiple duration options, selected state styling
 */

export interface DurationPickerProps {
  /** Selected duration in seconds */
  value: number
  /** Change handler (duration in seconds) */
  onChange: (duration: number) => void
  /** Additional CSS classes */
  className?: string
}

interface DurationOption {
  label: string
  seconds: number
}

const DURATION_OPTIONS: DurationOption[] = [
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
]

/**
 * Horizontal button group for selecting meditation duration
 */
export function DurationPicker({
  value,
  onChange,
  className = '',
}: DurationPickerProps) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="radiogroup"
      aria-label="Duration"
    >
      {DURATION_OPTIONS.map((option) => {
        const isSelected = value === option.seconds

        return (
          <button
            key={option.seconds}
            type="button"
            onClick={() => onChange(option.seconds)}
            role="radio"
            aria-checked={isSelected}
            className={`
              px-4 py-2 rounded-lg
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
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
