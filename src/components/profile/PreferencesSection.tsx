/**
 * PreferencesSection - Settings group with title and items
 */

import React from 'react'
import { Card } from '@/components/ui'

export interface PreferencesSectionProps {
  /** Section title */
  title: string
  /** Children content */
  children: React.ReactNode
}

/**
 * PreferencesSection - Wrapper for settings groups
 */
export function PreferencesSection({ title, children }: PreferencesSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-calm-800 mb-3">{title}</h3>
      <Card variant="flat">
        <Card.Body className="divide-y divide-calm-100">
          {children}
        </Card.Body>
      </Card>
    </div>
  )
}

/**
 * SettingRow - Individual setting item
 */
export interface SettingRowProps {
  /** Setting label */
  label: string
  /** Optional description */
  description?: string
  /** Setting control (right side) */
  children: React.ReactNode
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-calm-900">{label}</p>
        {description && (
          <p className="text-xs text-calm-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}
