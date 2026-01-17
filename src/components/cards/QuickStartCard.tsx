/**
 * QuickStartCard component - Display pre-made rituals
 * Features: horizontal scrollable cards, hover effect, tag badge
 */

import { Card } from '@/components/ui'
import type { Ritual } from '@/types'

export interface QuickStartCardProps {
  /** Ritual to display */
  ritual: Ritual
  /** Tap handler */
  onTap: () => void
}

// Tag colors based on ritual category
const TAG_COLORS: Record<string, string> = {
  Breath: 'bg-blue-100 text-blue-700',
  Body: 'bg-green-100 text-green-700',
  Sleep: 'bg-purple-100 text-purple-700',
  Focus: 'bg-peach-100 text-peach-700',
  Gratitude: 'bg-yellow-100 text-yellow-700',
}

/**
 * Quick start ritual card for home screen
 */
export function QuickStartCard({ ritual, onTap }: QuickStartCardProps) {
  // Get primary tag color
  const primaryTag = ritual.tags[0]
  const tagColor = primaryTag ? TAG_COLORS[primaryTag] || 'bg-calm-100 text-calm-700' : 'bg-calm-100 text-calm-700'

  // Format duration
  const durationMinutes = Math.floor(ritual.duration / 60)
  const durationText = `${durationMinutes} min`

  return (
    <Card
      variant="default"
      className="min-w-[280px] w-[280px] cursor-pointer hover:shadow-card-hover transition-shadow flex-shrink-0"
      onClick={onTap}
    >
      <Card.Body>
        <div className="space-y-3">
          {/* Header: Title + Duration */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-serif font-bold text-calm-900 flex-1">
              {ritual.title}
            </h3>
            <span className="text-sm font-medium text-calm-600 flex-shrink-0">
              {durationText}
            </span>
          </div>

          {/* Benefit/Description */}
          {ritual.sections.length > 0 && ritual.sections[0]?.guidanceText && (
            <p className="text-sm text-calm-600 line-clamp-2">
              {ritual.sections[0].guidanceText}
            </p>
          )}

          {/* Tag badge */}
          {primaryTag && (
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${tagColor}`}>
                {primaryTag}
              </span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
