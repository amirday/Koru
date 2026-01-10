/**
 * Toggle component - Design system primitive
 * Variants: checkbox, switch
 * Features: label positioning, indeterminate support
 */

import React from 'react'

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Toggle variant */
  variant?: 'checkbox' | 'switch'
  /** Label text */
  label?: string
  /** Label position */
  labelPosition?: 'left' | 'right'
  /** Helper text below toggle */
  helperText?: string
  /** Indeterminate state (checkbox only) */
  indeterminate?: boolean
}

/**
 * Toggle component (checkbox or switch)
 */
export function Toggle({
  variant = 'checkbox',
  label,
  labelPosition = 'right',
  helperText,
  indeterminate = false,
  checked,
  className = '',
  disabled,
  ...props
}: ToggleProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Set indeterminate property (can't be set via attribute)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  // Checkbox styles
  const checkboxStyles = `
    w-5 h-5 rounded border-2 transition-all cursor-pointer
    ${
      checked
        ? 'bg-peach-500 border-peach-500'
        : 'bg-white border-calm-300 hover:border-peach-400'
    }
    ${indeterminate ? 'bg-peach-500 border-peach-500' : ''}
    focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  // Switch styles
  const switchStyles = `
    relative w-11 h-6 rounded-full transition-colors cursor-pointer
    ${checked ? 'bg-peach-500' : 'bg-calm-300'}
    focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const switchKnobStyles = `
    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform
    ${checked ? 'translate-x-5' : 'translate-x-0'}
  `

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        className={`flex items-center gap-3 cursor-pointer ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {label && labelPosition === 'left' && (
          <span className="text-sm font-medium text-calm-800">{label}</span>
        )}

        <div className="relative inline-flex items-center">
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />

          {variant === 'checkbox' && (
            <div className={checkboxStyles}>
              {/* Checkmark icon */}
              {checked && !indeterminate && (
                <svg
                  className="w-full h-full text-white p-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}

              {/* Indeterminate dash */}
              {indeterminate && (
                <svg
                  className="w-full h-full text-white p-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 12h12"
                  />
                </svg>
              )}
            </div>
          )}

          {variant === 'switch' && (
            <div className={switchStyles}>
              <div className={switchKnobStyles} />
            </div>
          )}
        </div>

        {label && labelPosition === 'right' && (
          <span className="text-sm font-medium text-calm-800">{label}</span>
        )}
      </label>

      {helperText && <p className="mt-1.5 text-sm text-calm-600 ml-8">{helperText}</p>}
    </div>
  )
}
