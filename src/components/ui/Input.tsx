/**
 * Input component - Design system primitive
 * Types: text, textarea, search
 * Features: label, helper text, error states, auto-resize textarea
 */

import React, { useEffect, useRef } from 'react'
import type { InputSize } from '@/types'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  /** Input type */
  type?: 'text' | 'textarea' | 'search' | 'email' | 'password' | 'number'
  /** Input label */
  label?: string
  /** Helper text below input */
  helperText?: string
  /** Error message (shows error state) */
  error?: string
  /** Input size */
  inputSize?: InputSize
  /** Auto-resize textarea as content changes */
  autoResize?: boolean
  /** Maximum rows for textarea */
  maxRows?: number
}

/**
 * Input component with label, error, and helper text
 */
export function Input({
  type = 'text',
  label,
  helperText,
  error,
  inputSize = 'md',
  autoResize = false,
  maxRows = 10,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (type === 'textarea' && autoResize && textareaRef.current) {
      const textarea = textareaRef.current
      // Reset height to get correct scrollHeight
      textarea.style.height = 'auto'
      // Set new height based on content
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight)
      const maxHeight = lineHeight * maxRows
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [type, autoResize, maxRows, props.value])

  // Base input styles
  const baseStyles =
    'w-full font-sans rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-peach-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-calm-400'

  // Size styles
  const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  }

  // State styles
  const stateStyles = error
    ? 'border-red-300 bg-red-50 text-calm-900 focus:border-red-500'
    : 'border-calm-300 bg-white text-calm-900 focus:border-peach-500'

  const combinedClassName = `${baseStyles} ${sizeStyles[inputSize]} ${stateStyles} ${className}`

  // Render textarea
  if (type === 'textarea') {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-calm-800 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={textareaRef}
          className={`${combinedClassName} resize-none`}
          disabled={disabled}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-calm-600">{helperText}</p>
        )}
      </div>
    )
  }

  // Render input
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-calm-800 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={combinedClassName}
        disabled={disabled}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-sm text-calm-600">{helperText}</p>
      )}
    </div>
  )
}
