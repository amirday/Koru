/**
 * Button component - Design system primitive
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 */

import React from 'react'
import type { ButtonVariant, ButtonSize } from '@/types'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Loading state (shows spinner, disables button) */
  loading?: boolean
  /** Icon to display before text */
  icon?: React.ReactNode
  /** Full width button */
  fullWidth?: boolean
  /** Children content */
  children?: React.ReactNode
}

/**
 * Button component with variants and states
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-peach-500 text-white hover:bg-peach-600 active:bg-peach-700',
    secondary:
      'bg-warm-50 text-calm-800 border-2 border-peach-500 hover:bg-peach-50 active:bg-peach-100',
    ghost: 'bg-transparent text-calm-700 hover:bg-warm-100 active:bg-warm-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  }

  // Size styles
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  }

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : ''

  // Combine styles
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`

  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="inline-flex">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  )
}
