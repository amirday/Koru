/**
 * GuidanceText - Fading meditation guidance text display
 */

import { useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks'

export interface GuidanceTextProps {
  /** Text to display */
  text: string
  /** Whether text is visible */
  visible: boolean
  /** Text size setting */
  size?: 'medium' | 'large' | 'extra-large'
  /** Click handler for size cycling */
  onClick?: () => void
}

const sizeClasses = {
  medium: 'text-xl sm:text-2xl',
  large: 'text-2xl sm:text-3xl',
  'extra-large': 'text-3xl sm:text-4xl',
}

/**
 * GuidanceText - Animated guidance text display
 */
export function GuidanceText({
  text,
  visible,
  size = 'large',
  onClick,
}: GuidanceTextProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle text changes with fade
  useEffect(() => {
    if (text !== displayText) {
      if (prefersReducedMotion) {
        // Instant change if reduced motion
        setDisplayText(text)
      } else {
        // Fade out, change, fade in
        setIsAnimating(true)
        setTimeout(() => {
          setDisplayText(text)
          setIsAnimating(false)
        }, 300)
      }
    }
  }, [text, displayText, prefersReducedMotion])

  // Opacity based on visibility and animation state
  const opacity = !visible || isAnimating ? 'opacity-0' : 'opacity-100'
  const transition = prefersReducedMotion ? '' : 'transition-opacity duration-300'

  return (
    <div
      className={`${opacity} ${transition} cursor-pointer select-none`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Guidance text. Tap to change size. ${displayText}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <p
        className={`font-serif text-calm-900 leading-relaxed text-center px-6 ${sizeClasses[size]}`}
      >
        {displayText}
      </p>
    </div>
  )
}
