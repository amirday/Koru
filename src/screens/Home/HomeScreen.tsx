/**
 * HomeScreen - Main app screen with goal management and ritual generation
 * Features: Goal editing, quick starts, generation interface
 */

import { useState } from 'react'
import { useApp, useRituals } from '@/contexts'
import { ScreenContainer, Header } from '@/components/layout'
import { useToast } from '@/components/ui'
import { GoalBox } from '@/components/cards/GoalBox'
import { QuickStartCard } from '@/components/cards/QuickStartCard'
import { GenerateButton } from '@/components/generation/GenerateButton'
import { GenerationProgress } from '@/components/generation/GenerationProgress'
import { ClarifyingQuestionModal } from '@/components/generation/ClarifyingQuestionModal'
import { quickStarts } from '@/mocks/quickStarts'

/**
 * Home screen with goal management and ritual generation
 */
export function HomeScreen() {
  const { goal, updateGoal, preferences } = useApp()
  const {
    isGenerating,
    generationProgress,
    clarifyingQuestion,
    startGeneration,
    answerClarifyingQuestion,
    cancelGeneration,
  } = useRituals()
  const toast = useToast()

  const [showProgress, setShowProgress] = useState(true)

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  // Handle goal update
  const handleUpdateGoal = async (instructions: string) => {
    try {
      await updateGoal(instructions)
      toast.showToast('success', 'Goal updated')
    } catch (error) {
      console.error('Failed to update goal:', error)
      toast.showToast('error', 'Failed to update goal')
    }
  }

  // Handle quick start tap
  const handleQuickStartTap = () => {
    toast.showToast('info', 'Session player coming in Phase 3')
  }

  // Handle generate
  const handleGenerate = async (options: any) => {
    // Validate goal exists
    if (!goal?.instructions) {
      toast.showToast('error', 'Please set your goal first')
      return
    }

    try {
      setShowProgress(true)
      await startGeneration({
        ...options,
        instructions: goal.instructions,
      })
      toast.showToast('success', 'Ritual created!')
    } catch (error) {
      console.error('Generation failed:', error)
      toast.showToast('error', 'Generation failed')
    }
  }

  // Handle dismiss progress
  const handleDismissProgress = () => {
    setShowProgress(false)
    toast.showToast('info', 'Working in background...')
  }

  // Handle answer clarifying question
  const handleAnswerQuestion = async (answer: string) => {
    try {
      await answerClarifyingQuestion(answer)
    } catch (error) {
      console.error('Failed to answer question:', error)
      toast.showToast('error', 'Failed to answer question')
    }
  }

  // Handle cancel generation
  const handleCancelGeneration = async () => {
    try {
      await cancelGeneration()
      setShowProgress(true)
      toast.showToast('info', 'Generation cancelled')
    } catch (error) {
      console.error('Failed to cancel generation:', error)
    }
  }

  return (
    <>
      {/* Optional header with greeting */}
      <Header title={getGreeting()} />

      <ScreenContainer>
        <div className="space-y-8">
          {/* Goal Box Section */}
          <section>
            <GoalBox goal={goal} onUpdate={handleUpdateGoal} />
          </section>

          {/* Quick Starts Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-calm-900 mb-4">
              Quick Starts
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
              {quickStarts.map((ritual) => (
                <QuickStartCard
                  key={ritual.id}
                  ritual={ritual}
                  onTap={handleQuickStartTap}
                />
              ))}
            </div>
          </section>

          {/* Generate Section */}
          <section>
            <GenerateButton
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              defaultDuration={preferences.defaultDuration}
              defaultTone={preferences.defaultTone}
              defaultIncludeSilence={true}
            />
          </section>

          {/* Generation Progress (conditional) */}
          {isGenerating && generationProgress && showProgress && (
            <section>
              <GenerationProgress
                progress={generationProgress}
                onDismiss={handleDismissProgress}
              />
            </section>
          )}
        </div>
      </ScreenContainer>

      {/* Clarifying Question Modal (conditional) */}
      <ClarifyingQuestionModal
        question={clarifyingQuestion}
        onAnswer={handleAnswerQuestion}
        onCancel={handleCancelGeneration}
      />
    </>
  )
}
