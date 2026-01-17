/**
 * ClarifyingQuestionModal component - Present AI questions during generation
 * Features: modal overlay, radio/textarea answers, submit/cancel
 */

import { useState } from 'react'
import { Modal, Button, Input } from '@/components/ui'
import type { AIClarifyingQuestion } from '@/types'

export interface ClarifyingQuestionModalProps {
  /** Question to display (null if no question) */
  question: AIClarifyingQuestion | null
  /** Answer submit handler */
  onAnswer: (answer: string) => void
  /** Cancel handler (cancels generation) */
  onCancel: () => void
}

/**
 * Modal for clarifying questions during generation
 */
export function ClarifyingQuestionModal({
  question,
  onAnswer,
  onCancel,
}: ClarifyingQuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [freeTextAnswer, setFreeTextAnswer] = useState('')

  if (!question) return null

  const isMultipleChoice = question.options && question.options.length > 0
  const canSubmit = isMultipleChoice
    ? selectedAnswer.length > 0
    : freeTextAnswer.trim().length > 0

  const handleSubmit = () => {
    const answer = isMultipleChoice ? selectedAnswer : freeTextAnswer.trim()
    if (answer) {
      onAnswer(answer)
      // Reset state
      setSelectedAnswer('')
      setFreeTextAnswer('')
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title="Quick Question"
      size="md"
      closeOnOutsideClick={false}
      closeOnEscape={false}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancel Generation
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Continue
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Question text */}
        <p className="text-lg font-serif text-calm-900 leading-relaxed">
          {question.questionText}
        </p>

        {/* Multiple choice options */}
        {isMultipleChoice && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`
                  flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
                  ${
                    selectedAnswer === option
                      ? 'bg-peach-100 border-2 border-peach-500'
                      : 'bg-warm-50 border-2 border-calm-200 hover:border-calm-300'
                  }
                `}
              >
                <input
                  type="radio"
                  name="clarifying-question"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mt-0.5 text-peach-500 focus:ring-peach-500"
                />
                <span className="text-sm text-calm-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Free text answer */}
        {!isMultipleChoice && (
          <Input
            type="textarea"
            value={freeTextAnswer}
            onChange={(e) => setFreeTextAnswer(e.target.value)}
            placeholder="Type your answer..."
            autoResize
            maxRows={6}
          />
        )}

      </div>
    </Modal>
  )
}
