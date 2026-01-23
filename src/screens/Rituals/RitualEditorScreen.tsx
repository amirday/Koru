/**
 * RitualEditorScreen - Full 4-tab ritual editor
 */

import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRituals } from '@/contexts'
import { ScreenContainer } from '@/components/layout'
import { Button, useToast } from '@/components/ui'
import {
  EditorTabs,
  EditorTab,
  StructureTab,
  PromptTab,
  VoicePacingTab,
  AdvancedTab,
} from '@/components/editor'
import type { Ritual, RitualSection, RitualTone, RitualPace, Soundscape, Timestamp } from '@/types'

/**
 * RitualEditorScreen - Edit ritual with 4 tabs
 */
export function RitualEditorScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { getRitual, saveRitual, isLoading } = useRituals()

  // Editor state
  const [activeTab, setActiveTab] = useState<EditorTab>('structure')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Ritual state (local copy for editing)
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [sections, setSections] = useState<RitualSection[]>([])
  const [tone, setTone] = useState<RitualTone>('gentle')
  const [pace, setPace] = useState<RitualPace>('medium')
  const [silence, setSilence] = useState<'off' | 'light' | 'heavy'>('light')
  const [soundscape, setSoundscape] = useState<Soundscape>('none')
  const [soundscapeVolume, setSoundscapeVolume] = useState(50)
  const [voiceId, setVoiceId] = useState<string | undefined>(undefined)
  const [disabledSections, setDisabledSections] = useState<Set<string>>(new Set())

  // Original ritual for comparison
  const [originalRitual, setOriginalRitual] = useState<Ritual | null>(null)

  // Load ritual on mount
  useEffect(() => {
    if (id && id !== 'new') {
      const ritual = getRitual(id)
      if (ritual) {
        setOriginalRitual(ritual)
        setTitle(ritual.title)
        setInstructions(ritual.instructions)
        setSections(ritual.sections)
        setTone(ritual.tone)
        setPace(ritual.pace)
        setSoundscape(ritual.soundscape || 'none')
        setSilence(ritual.includeSilence ? 'light' : 'off')
        setVoiceId(ritual.voiceId)
      } else {
        toast.showToast('error', 'Ritual not found')
        navigate('/rituals')
      }
    } else {
      // New ritual
      const now = Date.now()
      setTitle('New Ritual')
      setInstructions('')
      setSections([
        {
          id: `section-${now}-1`,
          type: 'intro',
          durationSeconds: 60,
          segments: [{ id: `section-${now}-1-seg-0`, type: 'silence', durationSeconds: 60 }],
          guidanceText: '',
        },
        {
          id: `section-${now}-2`,
          type: 'body',
          durationSeconds: 300,
          segments: [{ id: `section-${now}-2-seg-0`, type: 'silence', durationSeconds: 300 }],
          guidanceText: '',
        },
        {
          id: `section-${now}-3`,
          type: 'closing',
          durationSeconds: 60,
          segments: [{ id: `section-${now}-3-seg-0`, type: 'silence', durationSeconds: 60 }],
          guidanceText: '',
        },
      ])
    }
  }, [id, getRitual, navigate, toast])

  // Track changes
  useEffect(() => {
    if (!originalRitual && id !== 'new') return

    if (id === 'new') {
      setHasChanges(title !== 'New Ritual' || instructions !== '' || sections.length > 3)
      return
    }

    if (!originalRitual) return

    const changed =
      title !== originalRitual.title ||
      instructions !== originalRitual.instructions ||
      tone !== originalRitual.tone ||
      pace !== originalRitual.pace ||
      soundscape !== (originalRitual.soundscape || 'none') ||
      voiceId !== originalRitual.voiceId ||
      JSON.stringify(sections) !== JSON.stringify(originalRitual.sections)

    setHasChanges(changed)
  }, [title, instructions, sections, tone, pace, soundscape, voiceId, originalRitual, id])

  // Computed ritual for saving/display
  const currentRitual = useMemo((): Ritual | null => {
    if (!originalRitual && id !== 'new') return null

    const totalDuration = sections.reduce((sum, s) => sum + s.durationSeconds, 0)

    return {
      id: id === 'new' ? `ritual-${Date.now()}` : id!,
      title,
      instructions,
      duration: totalDuration,
      tone,
      pace,
      includeSilence: silence !== 'off',
      soundscape: soundscape === 'none' ? undefined : soundscape,
      voiceId,
      sections,
      tags: originalRitual?.tags || [],
      isTemplate: originalRitual?.isTemplate || false,
      generatedFrom: originalRitual?.generatedFrom,
      createdAt: originalRitual?.createdAt || (new Date().toISOString() as Timestamp),
      updatedAt: new Date().toISOString() as Timestamp,
      statistics: originalRitual?.statistics || null,
    }
  }, [id, title, instructions, sections, tone, pace, silence, soundscape, voiceId, originalRitual])

  // Handlers
  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/rituals')
      }
    } else {
      navigate('/rituals')
    }
  }

  const handleSave = async () => {
    if (!currentRitual) return

    if (!title.trim()) {
      toast.showToast('error', 'Please enter a ritual title')
      return
    }

    try {
      setIsSaving(true)
      await saveRitual(currentRitual)
      setOriginalRitual(currentRitual)
      setHasChanges(false)
      toast.showToast('success', 'Ritual saved')

      // If this was a new ritual, navigate to the edit URL
      if (id === 'new') {
        navigate(`/rituals/${currentRitual.id}/edit`, { replace: true })
      }
    } catch (error) {
      console.error('Failed to save ritual:', error)
      toast.showToast('error', 'Failed to save ritual')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = async () => {
    if (!instructions.trim()) {
      toast.showToast('error', 'Please enter a prompt first')
      return
    }

    try {
      setIsRegenerating(true)
      // Simulate regeneration delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.showToast('success', 'Ritual regenerated (mocked)')
    } catch (error) {
      console.error('Regeneration failed:', error)
      toast.showToast('error', 'Failed to regenerate ritual')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handlePreview = () => {
    if (currentRitual) {
      navigate(`/session/${currentRitual.id}`)
    }
  }

  const handleToggleSectionEnabled = (sectionId: string, enabled: boolean) => {
    setDisabledSections((prev) => {
      const next = new Set(prev)
      if (enabled) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenContainer>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-peach-500 border-t-transparent rounded-full" />
        </div>
      </ScreenContainer>
    )
  }

  // Generated preview text (combine all section guidance)
  const generatedPreview = sections
    .filter((s) => s.guidanceText)
    .map((s) => s.guidanceText)
    .join('\n\n---\n\n')

  return (
    <div className="flex flex-col h-screen bg-warm-50">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-calm-200">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="p-2 text-calm-600 hover:text-calm-900 hover:bg-calm-100 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Editable title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-lg font-serif font-bold text-calm-900 bg-transparent border-none focus:outline-none focus:ring-0 truncate"
          placeholder="Ritual Title"
        />

        {/* Save status */}
        <span className="text-sm text-calm-500 hidden sm:inline">
          {isSaving ? 'Saving...' : hasChanges ? 'Unsaved changes' : 'Saved'}
        </span>

        {/* Save button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          loading={isSaving}
          disabled={!hasChanges && id !== 'new'}
        >
          Save
        </Button>
      </div>

      {/* Tab bar */}
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {activeTab === 'structure' && (
            <StructureTab
              sections={sections}
              disabledSections={disabledSections}
              onSectionsChange={(newSections) => {
                setSections(newSections)
              }}
              onToggleSectionEnabled={handleToggleSectionEnabled}
              onPreview={handlePreview}
            />
          )}

          {activeTab === 'prompt' && (
            <PromptTab
              prompt={instructions}
              generatedPreview={generatedPreview || undefined}
              onPromptChange={setInstructions}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
          )}

          {activeTab === 'voice' && (
            <VoicePacingTab
              voiceId={voiceId}
              tone={tone}
              pace={pace}
              silence={silence}
              soundscape={soundscape}
              soundscapeVolume={soundscapeVolume}
              onVoiceChange={setVoiceId}
              onToneChange={setTone}
              onPaceChange={setPace}
              onSilenceChange={setSilence}
              onSoundscapeChange={setSoundscape}
              onVolumeChange={setSoundscapeVolume}
            />
          )}

          {activeTab === 'advanced' && currentRitual && (
            <AdvancedTab ritual={currentRitual} />
          )}
        </div>
      </div>
    </div>
  )
}
