/**
 * RitualCard - Enhanced ritual card with action menu
 * Shows ritual info with Start, Edit, Duplicate, Delete actions
 * Button shows: "Generate" / "Complete Generation" / "Start" based on audio status
 */

import React, { useState, useEffect } from 'react'
import type { Ritual, RitualTone } from '@/types'
import { Card, Button, Modal } from '@/components/ui'
import { getRitualAudioStatus, generateRitualAudio, getProviderFromVoiceId } from '@/services/api'

type AudioStatus = 'loading' | 'none' | 'partial' | 'ready' | 'generating'

export interface RitualCardProps {
  /** Ritual data */
  ritual: Ritual
  /** Callback when Start is clicked (only when audio is ready) */
  onStart?: (ritual: Ritual) => void
  /** Callback when Edit is clicked */
  onEdit?: (ritual: Ritual) => void
  /** Callback when Duplicate is clicked */
  onDuplicate?: (ritual: Ritual) => void
  /** Callback when Delete is confirmed */
  onDelete?: (ritual: Ritual) => void
  /** Callback when card is clicked (opens preview) */
  onCardClick?: (ritual: Ritual) => void
}

/**
 * Format duration in seconds to human-readable string
 */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

/**
 * Format timestamp to relative date
 */
function formatRelativeDate(timestamp?: string, prefix?: string): string {
  if (!timestamp) return prefix ? '' : 'Never used'

  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  let relative: string
  if (diffDays === 0) relative = 'Today'
  else if (diffDays === 1) relative = 'Yesterday'
  else if (diffDays < 7) relative = `${diffDays} days ago`
  else if (diffDays < 30) relative = `${Math.floor(diffDays / 7)} weeks ago`
  else relative = date.toLocaleDateString()

  return prefix ? `${prefix} ${relative}` : relative
}

/**
 * Format creation timestamp
 */
function formatCreatedAt(timestamp?: string): string {
  return formatRelativeDate(timestamp, 'Created')
}

/**
 * Check if ritual was created recently (within last 24 hours)
 */
function isNewRitual(createdAt?: string): boolean {
  if (!createdAt) return false

  const created = new Date(createdAt)
  const now = new Date()
  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)

  return diffHours < 24
}

/**
 * Get tone badge color
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
 * Enhanced ritual card with actions
 */
export function RitualCard({
  ritual,
  onStart,
  onEdit,
  onDuplicate,
  onDelete,
  onCardClick,
}: RitualCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('loading')
  const [audioProgress, setAudioProgress] = useState({ generated: 0, total: 0 })

  // Check audio status on mount
  useEffect(() => {
    const checkAudioStatus = async () => {
      // Skip for template rituals
      if (ritual.isTemplate) {
        setAudioStatus('none')
        return
      }

      try {
        const status = await getRitualAudioStatus(ritual.id)
        setAudioProgress({ generated: status.generated, total: status.total })
        setAudioStatus(status.status)
      } catch (error) {
        console.error('Failed to check audio status:', error)
        setAudioStatus('none')
      }
    }
    checkAudioStatus()
  }, [ritual.id, ritual.isTemplate])

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return
    onCardClick?.(ritual)
  }

  const handleActionButton = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (audioStatus === 'ready') {
      // Audio ready - start the session
      onStart?.(ritual)
    } else if (audioStatus === 'none' || audioStatus === 'partial') {
      // Generate missing audio
      setAudioStatus('generating')
      try {
        const voiceId = ritual.voiceId || 'sarah'
        const result = await generateRitualAudio({
          ritualId: ritual.id,
          voiceId,
          provider: getProviderFromVoiceId(voiceId),
        })
        setAudioProgress({ generated: result.segmentsGenerated + (audioProgress.generated || 0), total: result.segmentsTotal })
        setAudioStatus(result.status === 'ready' ? 'ready' : 'partial')

        // If ready, automatically start
        if (result.status === 'ready') {
          onStart?.(ritual)
        }
      } catch (error) {
        console.error('Failed to generate audio:', error)
        setAudioStatus('partial')
      }
    }
  }

  // Get button text based on audio status
  const getButtonText = (): string => {
    switch (audioStatus) {
      case 'loading':
        return '...'
      case 'generating':
        return 'Generating...'
      case 'none':
        return 'Generate Audio'
      case 'partial':
        return 'Complete Audio'
      case 'ready':
        return 'Start'
      default:
        return 'Start'
    }
  }

  const handleEdit = () => {
    setShowMenu(false)
    onEdit?.(ritual)
  }

  const handleDuplicate = () => {
    setShowMenu(false)
    onDuplicate?.(ritual)
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    onDelete?.(ritual)
  }

  return (
    <>
      <Card
        variant="elevated"
        clickable
        className="relative"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`${ritual.title}, ${formatDuration(ritual.duration)}`}
      >
        <Card.Body className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-calm-900 line-clamp-1">
              {ritual.title}
            </h3>

            {/* More menu button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="p-1.5 rounded-lg text-calm-500 hover:text-calm-700 hover:bg-calm-100 transition-colors"
                aria-label="More options"
                aria-expanded={showMenu}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowMenu(false)
                    }}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-calm-200 z-20 py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-calm-700 hover:bg-warm-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicate()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-calm-700 hover:bg-warm-50 transition-colors"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick()
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-calm-600 line-clamp-2 mb-3">
            {ritual.instructions}
          </p>

          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3">
            {/* New badge - shown for rituals created in last 24 hours */}
            {isNewRitual(ritual.createdAt) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-peach-100 text-peach-700 border border-peach-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
                </svg>
                New
              </span>
            )}

            {/* Duration badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-calm-700">
              {formatDuration(ritual.duration)}
            </span>

            {/* Tone badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getToneBadgeColor(ritual.tone)}`}>
              {ritual.tone}
            </span>

            {/* Favorite indicator */}
            {ritual.statistics?.isFavorite && (
              <span className="text-peach-500" aria-label="Favorite">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            )}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-calm-500">
                {formatCreatedAt(ritual.createdAt)}
              </span>
              {ritual.statistics?.lastUsedAt && (
                <span className="text-xs text-calm-400">
                  Last used {formatRelativeDate(ritual.statistics.lastUsedAt)}
                </span>
              )}
            </div>

            <Button
              variant={audioStatus === 'ready' ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleActionButton}
              loading={audioStatus === 'generating'}
              disabled={audioStatus === 'loading'}
            >
              {getButtonText()}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Ritual"
      >
        <div className="p-4">
          <p className="text-calm-700 mb-6">
            Are you sure you want to delete "{ritual.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
