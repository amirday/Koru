/**
 * SectionEditor - Edit individual ritual sections with drag reorder
 */

import { useState } from 'react'
import type { RitualSection, RitualSectionType } from '@/types'
import { Toggle, Slider } from '@/components/ui'

export interface SectionEditorProps {
  /** Section to edit */
  section: RitualSection
  /** Section index for display */
  index: number
  /** Whether section is enabled */
  enabled?: boolean
  /** Update section callback */
  onUpdate: (section: RitualSection) => void
  /** Toggle enabled callback */
  onToggleEnabled?: (enabled: boolean) => void
  /** Delete section callback */
  onDelete?: () => void
  /** Move section up callback */
  onMoveUp?: () => void
  /** Move section down callback */
  onMoveDown?: () => void
  /** Whether this is the first section */
  isFirst?: boolean
  /** Whether this is the last section */
  isLast?: boolean
}

/**
 * Get section type display name
 */
function getSectionTypeName(type: RitualSectionType): string {
  switch (type) {
    case 'intro':
      return 'Introduction'
    case 'body':
      return 'Main Practice'
    case 'silence':
      return 'Silence'
    case 'transition':
      return 'Transition'
    case 'closing':
      return 'Closing'
    default:
      return type
  }
}

/**
 * Get section type icon
 */
function getSectionIcon(type: RitualSectionType): string {
  switch (type) {
    case 'intro':
      return '🌅'
    case 'body':
      return '🧘'
    case 'silence':
      return '🤫'
    case 'transition':
      return '↔️'
    case 'closing':
      return '🌙'
    default:
      return '📝'
  }
}

/**
 * SectionEditor - Individual section editor component
 */
export function SectionEditor({
  section,
  index,
  enabled = true,
  onUpdate,
  onToggleEnabled,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
}: SectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDurationChange = (value: number) => {
    onUpdate({
      ...section,
      durationSeconds: value,
    })
  }

  const handleGuidanceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...section,
      guidanceText: e.target.value,
    })
  }

  return (
    <div
      className={`bg-white rounded-lg border transition-colors ${
        enabled ? 'border-calm-200' : 'border-calm-100 opacity-60'
      }`}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle / reorder buttons */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-0.5 text-calm-400 hover:text-calm-600 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move up"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-0.5 text-calm-400 hover:text-calm-600 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move down"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Section number */}
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-peach-100 text-peach-700 text-xs font-medium flex items-center justify-center">
          {index + 1}
        </span>

        {/* Icon and name */}
        <span className="text-lg" role="img" aria-hidden="true">
          {getSectionIcon(section.type)}
        </span>
        <span className="font-medium text-calm-900 flex-1">
          {getSectionTypeName(section.type)}
        </span>

        {/* Duration display */}
        <span className="text-sm text-calm-600">
          {Math.round(section.durationSeconds / 60)}m
        </span>

        {/* Enable/disable toggle */}
        {onToggleEnabled && (
          <Toggle
            checked={enabled}
            onChange={onToggleEnabled}
            label={enabled ? 'Enabled' : 'Disabled'}
          />
        )}

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-calm-400 hover:text-calm-600 rounded-lg hover:bg-calm-100 transition-colors"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-calm-100">
          {/* Duration slider */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-calm-700 mb-2">
              Duration: {Math.round(section.durationSeconds / 60)} minutes
            </label>
            <Slider
              min={30}
              max={600}
              step={30}
              value={section.durationSeconds}
              onChange={handleDurationChange}
            />
          </div>

          {/* Guidance text (not for silence) */}
          {section.type !== 'silence' && (
            <div>
              <label className="block text-sm font-medium text-calm-700 mb-2">
                Guidance Text
              </label>
              <textarea
                value={section.guidanceText}
                onChange={handleGuidanceChange}
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-lg border border-calm-300 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-peach-500 resize-none"
                placeholder="Enter guidance text for this section..."
              />
            </div>
          )}

          {/* Delete button */}
          {onDelete && (
            <div className="pt-2">
              <button
                onClick={onDelete}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                Remove section
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
