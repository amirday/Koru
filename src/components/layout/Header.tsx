/**
 * Header component - Layout primitive
 * Features: optional back button, centered title, actions slot, sticky top
 */

import React from 'react'

export interface HeaderProps {
  /** Page title (centered, serif font) */
  title: string
  /** Optional back button handler */
  onBack?: () => void
  /** Optional action buttons (right side) */
  actions?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

// Back arrow icon
const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

/**
 * Page header with optional back button and actions
 */
export function Header({
  title,
  onBack,
  actions,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-30
        bg-warm-50 border-b border-calm-200
        safe-top safe-left safe-right
        ${className}
      `}
    >
      <div className="max-w-screen-sm mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Back button or spacer */}
        <div className="flex-shrink-0 w-10">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-calm-700 hover:text-calm-900 transition-colors rounded-lg hover:bg-warm-100"
              aria-label="Go back"
            >
              <BackIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="flex-1 text-center text-xl font-serif font-bold text-calm-900 truncate px-4">
          {title}
        </h1>

        {/* Right: Actions or spacer */}
        <div className="flex-shrink-0 w-10 flex items-center justify-end">
          {actions}
        </div>
      </div>
    </header>
  )
}
