/**
 * Slider component - Design system primitive
 * Features: styled track, value display, min/max/step, warm colors
 */

import React from 'react'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Slider label */
  label?: string
  /** Show current value */
  showValue?: boolean
  /** Value formatter function */
  formatValue?: (value: number) => string
  /** Helper text below slider */
  helperText?: string
}

/**
 * Slider component with warm color styling
 */
export function Slider({
  label,
  showValue = true,
  formatValue,
  helperText,
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  className = '',
  ...props
}: SliderProps) {
  const currentValue = Number(value)
  const percentage = ((currentValue - Number(min)) / (Number(max) - Number(min))) * 100

  const displayValue = formatValue ? formatValue(currentValue) : currentValue.toString()

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="block text-sm font-medium text-calm-800">{label}</label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-peach-600">{displayValue}</span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-warm-200 rounded-full" />

        {/* Track fill (colored portion) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-peach-500 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />

        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-peach-500
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-peach-500
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-transform
            [&::-moz-range-thumb]:hover:scale-110
            [&::-moz-range-thumb]:active:scale-95
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-peach-500
            focus-visible:ring-offset-2
            disabled:opacity-50
            disabled:cursor-not-allowed"
          {...props}
        />
      </div>

      {helperText && <p className="mt-2 text-sm text-calm-600">{helperText}</p>}
    </div>
  )
}
