/**
 * FeedRitualCard - Vertical card for ritual display in feed
 * Features: Full-width, warm background, badges, tags, Start button, tone colors
 */

import type { Ritual, RitualTone } from '@/types'
import { Button } from '@/components/ui'

export interface FeedRitualCardProps {
  /** Ritual to display */
  ritual: Ritual
  /** Click handler - navigate to generation or session */
  onClick: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Format duration from seconds to human-readable string
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

/**
 * Get a friendly tone label
 */
function getToneLabel(tone: string): string {
  const labels: Record<string, string> = {
    gentle: 'Gentle',
    neutral: 'Balanced',
    coach: 'Motivating',
  }
  return labels[tone] || tone
}

/**
 * Get tone badge color classes matching RitualCard's design
 */
function getToneBadgeColor(tone: RitualTone): string {
  switch (tone) {
    case 'gentle':
      return 'bg-green-100 text-green-700'
    case 'neutral':
      return 'bg-calm-100 text-calm-700'
    case 'coach':
      return 'bg-peach-100 text-peach-700'
    default:
      return 'bg-calm-100 text-calm-700'
  }
}

/**
 * Get soundscape icon
 */
function getSoundscapeIcon(soundscape?: string): string | null {
  const icons: Record<string, string> = {
    ocean: '\u{1F30A}',
    forest: '\u{1F332}',
    rain: '\u{1F327}',
    fire: '\u{1F525}',
  }
  return soundscape && soundscape !== 'none' ? icons[soundscape] || null : null
}

/**
 * Format a timestamp to a readable date
 */
function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Feed ritual card with warm styling
 */
export function FeedRitualCard({
  ritual,
  onClick,
  className = '',
}: FeedRitualCardProps) {
  const soundscapeIcon = getSoundscapeIcon(ritual.soundscape)
  const isFavorite = ritual.statistics?.isFavorite ?? false
  const isUserCreated = !ritual.isTemplate

  return (
    <div
      className={`
        w-full text-left
        bg-white rounded-xl
        border border-warm-200
        shadow-card hover:shadow-card-hover
        transition-all duration-200
        p-4
        hover:scale-[1.01]
        ${className}
      `}
    >
      {/* Clickable content area */}
      <button
        onClick={onClick}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-500 focus-visible:ring-offset-2 rounded-lg"
      >
        {/* Header: Title + Favorite */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif font-semibold text-lg text-calm-900 line-clamp-1">
            {ritual.title}
          </h3>
          {isFavorite && (
            <span className="flex-shrink-0 text-peach-500" aria-label="Favorite">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          )}
        </div>

        {/* Created by you annotation */}
        {isUserCreated && (
          <p className="text-xs text-peach-600 font-medium mb-1">Created by you</p>
        )}

        {/* Description */}
        <p className="text-calm-600 text-sm line-clamp-2 mb-3">
          {ritual.instructions}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Duration badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-100 text-calm-700 rounded-full text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(ritual.duration)}
          </span>

          {/* Tone badge with color */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getToneBadgeColor(ritual.tone)}`}>
            {getToneLabel(ritual.tone)}
          </span>

          {/* Soundscape badge */}
          {soundscapeIcon && (
            <span className="inline-flex items-center px-2 py-0.5 bg-warm-100 text-calm-700 rounded-full text-xs font-medium">
              {soundscapeIcon}
            </span>
          )}
        </div>

        {/* Tags */}
        {ritual.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {ritual.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 bg-warm-50 text-calm-500 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>

      {/* Footer: Date + Start button */}
      <div className="flex items-center justify-between pt-3 border-t border-warm-100">
        <span className="text-xs text-calm-400">
          {formatDate(ritual.createdAt)}
        </span>
        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          Start
        </Button>
      </div>
    </div>
  )
}
