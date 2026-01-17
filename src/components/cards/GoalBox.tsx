/**
 * GoalBox component - Editable card for user's meditation goal
 * Features: display/edit modes, auto-save on blur, empty state
 */

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui'
import type { Goal } from '@/types'

export interface GoalBoxProps {
  /** Current goal (null if not set) */
  goal: Goal | null
  /** Update handler */
  onUpdate: (instructions: string) => void
}

/**
 * Editable goal card for home screen
 */
export function GoalBox({ goal, onUpdate }: GoalBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleEdit = () => {
    setEditValue(goal?.instructions || '')
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== goal?.instructions) {
      onUpdate(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditValue(goal?.instructions || '')
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [isEditing, editValue])

  return (
    <Card
      variant="elevated"
      className="bg-gradient-to-br from-gentle-yellow to-warm-100 cursor-pointer"
      onClick={!isEditing ? handleEdit : undefined}
    >
      <Card.Body>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-calm-700 mb-2">
              Your Goal
            </h3>

            {!isEditing ? (
              // Display mode
              <div>
                {goal?.instructions ? (
                  <p className="text-lg font-serif text-calm-900 leading-relaxed">
                    {goal.instructions}
                  </p>
                ) : (
                  <div>
                    <p className="text-lg font-serif text-calm-600 italic mb-1">
                      Tap to set your goal
                    </p>
                    <p className="text-sm text-calm-500">
                      Short is fine. Clarity beats poetry.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Edit mode
              <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="What do you want more of?"
                className="w-full font-sans text-base text-calm-900 bg-white rounded-lg px-3 py-2 border-2 border-peach-300 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent resize-none"
                rows={1}
              />
            )}
          </div>

          {/* Edit icon */}
          {!isEditing && (
            <button
              className="flex-shrink-0 p-2 text-calm-500 hover:text-peach-500 transition-colors rounded-lg hover:bg-white/50"
              aria-label="Edit goal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
