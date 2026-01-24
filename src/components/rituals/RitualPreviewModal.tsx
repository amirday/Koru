/**
 * RitualPreviewModal - Full ritual preview before starting
 */

import { useState, useEffect } from 'react'
import type { Ritual, RitualTone, Soundscape } from '@/types'
import { Modal, Button } from '@/components/ui'
import { SectionList } from './SectionList'
import { getRitualAudioStatus, generateRitualAudio, getProviderFromVoiceId } from '@/services/api'

type AudioStatus = 'loading' | 'none' | 'partial' | 'ready' | 'generating'

export interface RitualPreviewModalProps {
  /** Ritual to preview (null = closed) */
  ritual: Ritual | null
  /** Close callback */
  onClose: () => void
  /** Start session callback (only called when audio is ready) */
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
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('loading')
  const [audioProgress, setAudioProgress] = useState({ generated: 0, total: 0 })

  // Check audio status when ritual changes
  useEffect(() => {
    if (!ritual) return

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
    setAudioStatus('loading')
    checkAudioStatus()
  }, [ritual?.id, ritual?.isTemplate])

  if (!ritual) return null

  const handleActionButton = async () => {
    if (audioStatus === 'ready') {
      onStart(ritual)
      onClose()
    } else if (audioStatus === 'none' || audioStatus === 'partial') {
      setAudioStatus('generating')
      try {
        const voiceId = ritual.voiceId || 'sarah'
        const result = await generateRitualAudio({
          ritualId: ritual.id,
          voiceId,
          provider: getProviderFromVoiceId(voiceId),
        })
        setAudioProgress({ generated: result.segmentsGenerated + audioProgress.generated, total: result.segmentsTotal })
        setAudioStatus(result.status === 'ready' ? 'ready' : 'partial')

        if (result.status === 'ready') {
          onStart(ritual)
          onClose()
        }
      } catch (error) {
        console.error('Failed to generate audio:', error)
        setAudioStatus('partial')
      }
    }
  }

  const getButtonText = (): string => {
    switch (audioStatus) {
      case 'loading':
        return 'Checking...'
      case 'generating':
        return 'Generating Audio...'
      case 'none':
        return 'Generate Audio'
      case 'partial':
        return `Complete Audio (${audioProgress.generated}/${audioProgress.total})`
      case 'ready':
        return 'Start Session'
      default:
        return 'Start Session'
    }
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
          variant={audioStatus === 'ready' ? 'primary' : 'secondary'}
          fullWidth
          onClick={handleActionButton}
          loading={audioStatus === 'generating'}
          disabled={audioStatus === 'loading'}
        >
          {getButtonText()}
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
