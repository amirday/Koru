/**
 * SearchInput component - Search field with clear button
 */

import React from 'react'

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Current search value */
  value: string
  /** Callback when value changes */
  onValueChange: (value: string) => void
  /** Callback when search is cleared */
  onClear?: () => void
}

/**
 * Search input with clear button and search icon
 */
export function SearchInput({
  value,
  onValueChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onValueChange('')
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-calm-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 text-base font-sans rounded-lg border border-calm-300 bg-white text-calm-900 placeholder:text-calm-400 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-2 focus:border-peach-500 transition-colors"
        {...props}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-calm-400 hover:text-calm-600 transition-colors"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
