/**
 * StructureTab - Manage ritual sections structure
 */

import React from 'react'
import type { RitualSection, RitualSectionType } from '@/types'
import { Button } from '@/components/ui'
import { SectionEditor } from './SectionEditor'

export interface StructureTabProps {
  /** Ritual sections */
  sections: RitualSection[]
  /** Disabled section IDs */
  disabledSections?: Set<string>
  /** Update sections callback */
  onSectionsChange: (sections: RitualSection[]) => void
  /** Toggle section enabled callback */
  onToggleSectionEnabled?: (sectionId: string, enabled: boolean) => void
  /** Preview ritual callback */
  onPreview?: () => void
}

const sectionTemplates: { type: RitualSectionType; label: string }[] = [
  { type: 'intro', label: 'Introduction' },
  { type: 'body', label: 'Main Practice' },
  { type: 'silence', label: 'Silence' },
  { type: 'transition', label: 'Transition' },
  { type: 'closing', label: 'Closing' },
]

/**
 * StructureTab - Edit ritual structure and sections
 */
export function StructureTab({
  sections,
  disabledSections = new Set(),
  onSectionsChange,
  onToggleSectionEnabled,
  onPreview,
}: StructureTabProps) {
  const [showAddMenu, setShowAddMenu] = React.useState(false)

  const handleUpdateSection = (index: number, updatedSection: RitualSection) => {
    const newSections = [...sections]
    newSections[index] = updatedSection
    onSectionsChange(newSections)
  }

  const handleDeleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    onSectionsChange(newSections)
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= sections.length) return

    // Swap sections
    const temp = newSections[index]
    const target = newSections[newIndex]
    if (temp && target) {
      newSections[index] = target
      newSections[newIndex] = temp
      onSectionsChange(newSections)
    }
  }

  const handleAddSection = (type: RitualSectionType) => {
    const newSection: RitualSection = {
      id: `section-${Date.now()}`,
      type,
      durationSeconds: type === 'silence' ? 60 : 120,
      guidanceText: '',
      ...(type === 'silence' ? { silenceDuration: 60 } : {}),
    }
    onSectionsChange([...sections, newSection])
    setShowAddMenu(false)
  }

  const totalDuration = sections.reduce((sum, s) => sum + s.durationSeconds, 0)

  return (
    <div className="space-y-4">
      {/* Total duration */}
      <div className="flex items-center justify-between p-4 bg-warm-100 rounded-lg">
        <span className="text-calm-700">Total Duration</span>
        <span className="text-lg font-semibold text-calm-900">
          {Math.round(totalDuration / 60)} minutes
        </span>
      </div>

      {/* Sections list */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            enabled={!disabledSections.has(section.id)}
            onUpdate={(updated) => handleUpdateSection(index, updated)}
            onToggleEnabled={
              onToggleSectionEnabled
                ? (enabled) => onToggleSectionEnabled(section.id, enabled)
                : undefined
            }
            onDelete={() => handleDeleteSection(index)}
            onMoveUp={() => handleMoveSection(index, 'up')}
            onMoveDown={() => handleMoveSection(index, 'down')}
            isFirst={index === 0}
            isLast={index === sections.length - 1}
          />
        ))}
      </div>

      {/* Add section button */}
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setShowAddMenu(!showAddMenu)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Section
        </Button>

        {/* Add section menu */}
        {showAddMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowAddMenu(false)}
            />
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-calm-200 z-20 py-1">
              {sectionTemplates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => handleAddSection(template.type)}
                  className="w-full px-4 py-2 text-left text-sm text-calm-700 hover:bg-warm-50 transition-colors"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Preview button */}
      {onPreview && (
        <div className="pt-4 border-t border-calm-200">
          <Button
            variant="secondary"
            fullWidth
            onClick={onPreview}
          >
            Preview Session
          </Button>
        </div>
      )}
    </div>
  )
}
