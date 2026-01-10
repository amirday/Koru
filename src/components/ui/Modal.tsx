/**
 * Modal component - Design system primitive
 * Features: backdrop blur, close on outside click, Escape key, focus trap, animate in/out
 */

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks'
import type { ModalProps } from '@/types'

/**
 * Modal component with backdrop and animations
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  footer,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const modal = modalRef.current
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    full: 'max-w-full m-4',
  }

  // Animation classes
  const backdropAnimation = prefersReducedMotion
    ? 'opacity-100'
    : 'animate-fadeIn'

  const modalAnimation = prefersReducedMotion
    ? 'opacity-100 scale-100'
    : 'animate-scaleIn'

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropAnimation}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-calm-900/50 backdrop-blur-sm"
        onClick={closeOnOutsideClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-warm-50 rounded-2xl shadow-2xl w-full ${sizeStyles[size]} ${modalAnimation}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-calm-200">
          <h2
            id="modal-title"
            className="text-xl font-serif font-bold text-calm-900"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-calm-600 hover:text-calm-900 transition-colors p-1 rounded-lg hover:bg-calm-100"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-calm-200 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
