/**
 * Card component - Design system primitive
 * Compound component with Card.Header, Card.Body, Card.Footer
 * Variants: default, elevated, flat
 */

import React from 'react'
import type { CardVariant } from '@/types'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant style */
  variant?: CardVariant
  /** Whether card is clickable (adds hover effect) */
  clickable?: boolean
  /** Children content */
  children?: React.ReactNode
}

interface CardSubcomponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * Main Card component
 */
function CardRoot({
  variant = 'default',
  clickable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  // Base styles
  const baseStyles = 'rounded-2xl transition-all duration-200'

  // Variant styles
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-warm-50 border border-calm-200',
    elevated: 'bg-white shadow-md hover:shadow-lg',
    flat: 'bg-warm-100',
  }

  // Clickable styles
  const clickableStyles = clickable
    ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
    : ''

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${clickableStyles} ${className}`

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Header subcomponent
 */
function CardHeader({ className = '', children, ...props }: CardSubcomponentProps) {
  return (
    <div className={`px-6 py-4 border-b border-calm-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Body subcomponent
 */
function CardBody({ className = '', children, ...props }: CardSubcomponentProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer subcomponent
 */
function CardFooter({ className = '', children, ...props }: CardSubcomponentProps) {
  return (
    <div className={`px-6 py-4 border-t border-calm-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Compound Card component with subcomponents
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
