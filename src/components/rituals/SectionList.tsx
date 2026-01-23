/**
 * SectionList - Collapsible list of ritual sections
 */

import { useState } from 'react'
import type { RitualSection, RitualSectionType } from '@/types'
import { getSectionGuidanceText } from '@/types'

export interface SectionListProps {
  /** Ritual sections */
  sections: RitualSection[]
  /** Whether sections are expandable */
  expandable?: boolean
  /** Initially expanded section IDs */
  initialExpanded?: string[]
}

/**
 * Get icon for section type
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
 * Get display name for section type
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
 * Format duration in seconds to human-readable
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) {
    return `${minutes}m`
  }
  return `${minutes}m ${remainingSeconds}s`
}

/**
 * SectionList - Displays ritual sections with expand/collapse
 */
export function SectionList({
  sections,
  expandable = true,
  initialExpanded = [],
}: SectionListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(initialExpanded))

  const toggleExpanded = (id: string) => {
    if (!expandable) return

    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-6 text-calm-500">
        No sections in this ritual
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sections.map((section, index) => {
        const isExpanded = expandedIds.has(section.id)
        const sectionText = getSectionGuidanceText(section)
        const hasContent = sectionText && section.type !== 'silence'

        return (
          <div
            key={section.id}
            className="bg-warm-50 rounded-lg border border-calm-200 overflow-hidden"
          >
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleExpanded(section.id)}
              disabled={!expandable || !hasContent}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                expandable && hasContent
                  ? 'hover:bg-warm-100 cursor-pointer'
                  : 'cursor-default'
              }`}
              aria-expanded={isExpanded}
            >
              {/* Section number */}
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-peach-100 text-peach-700 text-xs font-medium flex items-center justify-center">
                {index + 1}
              </span>

              {/* Icon */}
              <span className="text-lg" role="img" aria-hidden="true">
                {getSectionIcon(section.type)}
              </span>

              {/* Section info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-calm-900 capitalize">
                  {getSectionTypeName(section.type)}
                </div>
                <div className="text-xs text-calm-500">
                  {formatDuration(section.durationSeconds)}
                </div>
              </div>

              {/* Expand icon */}
              {expandable && hasContent && (
                <svg
                  className={`w-5 h-5 text-calm-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* Expanded content */}
            {isExpanded && hasContent && (
              <div className="px-4 pb-4 pt-0">
                <div className="pl-9 border-l-2 border-peach-200 ml-3">
                  <p className="text-sm text-calm-700 leading-relaxed whitespace-pre-wrap pl-4">
                    {sectionText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
