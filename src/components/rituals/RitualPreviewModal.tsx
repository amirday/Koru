/**
 * RitualPreviewModal - Full ritual preview before starting
 */

import type { Ritual, RitualTone, Soundscape } from '@/types'
import { Modal, Button } from '@/components/ui'
import { SectionList } from './SectionList'

export interface RitualPreviewModalProps {
  /** Ritual to preview (null = closed) */
  ritual: Ritual | null
  /** Close callback */
  onClose: () => void
  /** Start session callback */
  onStart: (ritual: Ritual) => void
  /** Edit ritual callback */
  onEdit: (ritual: Ritual) => void
  /** Save as new callback */
  onSaveAsNew?: (ritual: Ritual) => void
}

/**
 * Format duration in seconds to human-readable
 */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

/**
 * Get tone display label
 */
function getToneLabel(tone: RitualTone): string {
  switch (tone) {
    case 'gentle':
      return 'Gentle'
    case 'neutral':
      return 'Neutral'
    case 'coach':
      return 'Coaching'
    default:
      return tone
  }
}

/**
 * Get soundscape display label
 */
function getSoundscapeLabel(soundscape?: Soundscape): string {
  if (!soundscape || soundscape === 'none') return 'None'
  return soundscape.charAt(0).toUpperCase() + soundscape.slice(1)
}

/**
 * RitualPreviewModal - Shows full ritual details
 */
export function RitualPreviewModal({
  ritual,
  onClose,
  onStart,
  onEdit,
  onSaveAsNew,
}: RitualPreviewModalProps) {
  if (!ritual) return null

  const handleStart = () => {
    onStart(ritual)
    onClose()
  }

  const handleEdit = () => {
    onEdit(ritual)
    onClose()
  }

  const handleSaveAsNew = () => {
    onSaveAsNew?.(ritual)
    onClose()
  }

  return (
    <Modal
      isOpen={!!ritual}
      onClose={onClose}
      title={ritual.title}
      size="lg"
    >
      <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Description */}
        <p className="text-calm-700">{ritual.instructions}</p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3">
          {/* Duration */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warm-100 rounded-lg">
            <svg className="w-4 h-4 text-calm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-calm-700">{formatDuration(ritual.duration)}</span>
          </div>

          {/* Tone */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warm-100 rounded-lg">
            <svg className="w-4 h-4 text-calm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-sm text-calm-700">{getToneLabel(ritual.tone)}</span>
          </div>

          {/* Soundscape */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warm-100 rounded-lg">
            <svg className="w-4 h-4 text-calm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <span className="text-sm text-calm-700">{getSoundscapeLabel(ritual.soundscape)}</span>
          </div>

          {/* Silence indicator */}
          {ritual.includeSilence && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warm-100 rounded-lg">
              <span className="text-sm text-calm-700">Includes silence</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {ritual.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ritual.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-peach-100 text-peach-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sections */}
        <div>
          <h3 className="text-sm font-semibold text-calm-800 mb-3">
            Sections ({ritual.sections.length})
          </h3>
          <SectionList sections={ritual.sections} expandable />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-calm-200 px-4 py-4 flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
        >
          Start Session
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={handleEdit}
        >
          Edit
        </Button>
        {onSaveAsNew && (
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSaveAsNew}
          >
            Save as New
          </Button>
        )}
      </div>
    </Modal>
  )
}
