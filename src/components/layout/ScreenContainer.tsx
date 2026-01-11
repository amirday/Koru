/**
 * ScreenContainer component - Layout primitive
 * Features: safe area padding, centered max-width, vertical scroll
 */

import React from 'react'

export interface ScreenContainerProps {
  /** Screen content */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Whether to show bottom tab bar padding (default: true) */
  showTabBarPadding?: boolean
}

/**
 * Screen container with safe area and max-width constraints
 */
export function ScreenContainer({
  children,
  className = '',
  showTabBarPadding = true,
}: ScreenContainerProps) {
  return (
    <div
      className={`
        min-h-screen
        bg-warm-50
        safe-top safe-left safe-right
        ${showTabBarPadding ? 'pb-20' : 'safe-bottom'}
        ${className}
      `}
    >
      <div className="max-w-screen-sm mx-auto px-4 py-6 w-full">
        {children}
      </div>
    </div>
  )
}
