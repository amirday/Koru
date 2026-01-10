/**
 * Toast component - Design system primitive
 * Features: auto-dismiss, queue (max 3), slide-up animation, types (success/error/info/warning)
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useReducedMotion } from '@/hooks'
import type { ToastType, ToastMessage } from '@/types'
import { TOAST_DURATION } from '@/types'

// ====================
// Context
// ====================

interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// ====================
// Provider
// ====================

const MAX_TOASTS = 3

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  /**
   * Show a toast notification
   */
  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = TOAST_DURATION.MEDIUM) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: ToastMessage = { id, type, message, duration }

      setToasts((prev) => {
        // Keep only the most recent toasts (max 3)
        const updated = [...prev, newToast].slice(-MAX_TOASTS)
        return updated
      })

      // Auto-dismiss if duration > 0
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    []
  )

  /**
   * Remove a toast
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

/**
 * Hook to use toast
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// ====================
// Toast Container
// ====================

function ToastContainer() {
  const { toasts } = useToast()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} prefersReducedMotion={prefersReducedMotion} />
      ))}
    </div>
  )
}

// ====================
// Toast Item
// ====================

interface ToastItemProps {
  toast: ToastMessage
  prefersReducedMotion: boolean
}

function ToastItem({ toast, prefersReducedMotion }: ToastItemProps) {
  const { removeToast } = useToast()
  const [isVisible, setIsVisible] = useState(false)

  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Type styles
  const typeStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: 'bg-green-50', border: 'border-green-500', icon: '✓' },
    error: { bg: 'bg-red-50', border: 'border-red-500', icon: '✕' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', icon: '⚠' },
    info: { bg: 'bg-blue-50', border: 'border-blue-500', icon: 'ℹ' },
  }

  const { bg, border, icon } = typeStyles[toast.type]

  const animationClass = prefersReducedMotion
    ? 'opacity-100'
    : isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-2'

  return (
    <div
      className={`${bg} ${border} border-l-4 px-4 py-3 rounded-lg shadow-lg max-w-md pointer-events-auto transition-all duration-300 ${animationClass}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <p className="text-sm text-calm-900 flex-1">{toast.message}</p>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-calm-600 hover:text-calm-900 transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
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
    </div>
  )
}
