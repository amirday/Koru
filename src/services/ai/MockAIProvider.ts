/**
 * Mock AI Provider for UI/UX phase
 * Simulates realistic AI generation with delays and progress callbacks
 */

import type {
  AIProvider,
  AIGenerationOptions,
  AIGenerationProgress,
  AIClarifyingQuestion,
  Segment,
} from '@/types'
import type { Ritual, RitualSection, RitualTone } from '@/types'
import { Timestamp } from '@/types'
import { GENERATION_STAGES, MOCK_DELAYS } from '@/types/constants'

/**
 * Helper to create segments from guidance text
 */
function createSegmentsFromText(
  sectionId: string,
  guidanceText: string,
  totalDuration: number
): Segment[] {
  if (!guidanceText) {
    return [{
      id: `${sectionId}-seg-0`,
      type: 'silence',
      durationSeconds: totalDuration,
    }]
  }

  const introSilence = 2
  const wordCount = guidanceText.split(' ').length
  const estimatedSpeechDuration = Math.min(
    totalDuration - 4,
    Math.ceil((wordCount / 150) * 60)
  )
  const outroSilence = Math.max(0, totalDuration - introSilence - estimatedSpeechDuration)

  return [
    { id: `${sectionId}-seg-0`, type: 'silence', durationSeconds: introSilence },
    { id: `${sectionId}-seg-1`, type: 'text', text: guidanceText, durationSeconds: estimatedSpeechDuration },
    { id: `${sectionId}-seg-2`, type: 'silence', durationSeconds: outroSilence },
  ]
}

export class MockAIProvider implements AIProvider {
  /**
   * Generate a ritual with simulated progress
   */
  async generateRitual(
    options: AIGenerationOptions,
    onProgress: (progress: AIGenerationProgress) => void
  ): Promise<Ritual> {
    // Simulate progression through stages
    for (const stageConfig of GENERATION_STAGES) {
      onProgress({
        stage: stageConfig.stage,
        progress: stageConfig.progress,
        message: stageConfig.message,
      })

      // Don't delay on final stage
      if (stageConfig.stage !== 'complete') {
        await this.randomDelay()
      }
    }

    // Generate mock ritual
    const ritual = this.createMockRitual(options)
    return ritual
  }

  /**
   * Optionally ask clarifying questions
   * Returns null 70% of the time (most generations don't need clarification)
   */
  async askClarifyingQuestion(_context: {
    instructions: string
    tone?: RitualTone
  }): Promise<AIClarifyingQuestion | null> {
    // 70% chance of no question
    if (Math.random() > 0.3) {
      return null
    }

    // Return a sample clarifying question
    return {
      questionText: 'What time of day will you practice this meditation?',
      options: ['Morning (6-10am)', 'Midday (11am-2pm)', 'Evening (5-9pm)', 'Before bed'],
      allowCustomInput: true,
    }
  }

  /**
   * Create a mock ritual based on options
   */
  private createMockRitual(options: AIGenerationOptions): Ritual {
    const now = Timestamp.now()
    const sections = this.generateMockSections(options)

    return {
      // RitualContent
      id: `ritual-${Date.now()}`,
      title: this.generateTitle(options.instructions),
      instructions: options.instructions,
      duration: options.duration,
      tone: options.tone,
      pace: 'medium',
      includeSilence: options.includeSilence,
      soundscape: options.soundscape,
      sections,
      tags: this.extractTags(options.instructions),
      isTemplate: false,
      generatedFrom: {
        instructions: options.instructions,
        modelVersion: 'mock-v1',
      },
      createdAt: now,
      updatedAt: now,

      // RitualStatistics (separate entity, initially null)
      statistics: {
        id: `stats-${Date.now()}`,
        ritualId: `ritual-${Date.now()}`,
        isFavorite: false,
        usageCount: 0,
      },
    }
  }

  /**
   * Generate mock sections based on duration
   */
  private generateMockSections(options: AIGenerationOptions): RitualSection[] {
    const sections: RitualSection[] = []
    let remainingTime = options.duration

    // Intro (10% of time, min 30s)
    const introDuration = Math.max(30, Math.floor(options.duration * 0.1))
    const introId = `section-intro-${Date.now()}`
    const introText = this.generateIntroText(options.tone)
    sections.push({
      id: introId,
      type: 'intro',
      durationSeconds: introDuration,
      segments: createSegmentsFromText(introId, introText, introDuration),
      guidanceText: introText,
    })
    remainingTime -= introDuration

    // Body (70% of remaining time)
    const bodyDuration = Math.floor(remainingTime * 0.7)
    const bodyId = `section-body-${Date.now()}`
    const bodyText = this.generateBodyText(options.tone, options.instructions)
    sections.push({
      id: bodyId,
      type: 'body',
      durationSeconds: bodyDuration,
      segments: createSegmentsFromText(bodyId, bodyText, bodyDuration),
      guidanceText: bodyText,
    })
    remainingTime -= bodyDuration

    // Silence (if requested, 15% of remaining)
    if (options.includeSilence) {
      const silenceDuration = Math.floor(remainingTime * 0.15)
      const silenceId = `section-silence-${Date.now()}`
      sections.push({
        id: silenceId,
        type: 'silence',
        durationSeconds: silenceDuration,
        segments: createSegmentsFromText(silenceId, '', silenceDuration),
        guidanceText: '',
        silenceDuration,
      })
      remainingTime -= silenceDuration
    }

    // Closing (remaining time)
    const closingId = `section-closing-${Date.now()}`
    const closingText = this.generateClosingText(options.tone)
    sections.push({
      id: closingId,
      type: 'closing',
      durationSeconds: remainingTime,
      segments: createSegmentsFromText(closingId, closingText, remainingTime),
      guidanceText: closingText,
    })

    return sections
  }

  /**
   * Generate title from instructions
   */
  private generateTitle(instructions: string): string {
    const keywords = instructions.toLowerCase()
    if (keywords.includes('calm')) return 'Finding Calm'
    if (keywords.includes('focus')) return 'Focus & Clarity'
    if (keywords.includes('sleep')) return 'Peaceful Sleep'
    if (keywords.includes('confidence')) return 'Inner Strength'
    if (keywords.includes('gratitude')) return 'Grateful Heart'
    return 'Mindful Meditation'
  }

  /**
   * Extract tags from instructions
   */
  private extractTags(instructions: string): string[] {
    const tags: string[] = []
    const keywords = instructions.toLowerCase()

    if (keywords.includes('calm') || keywords.includes('peace')) tags.push('calm')
    if (keywords.includes('focus') || keywords.includes('concentration')) tags.push('focus')
    if (keywords.includes('sleep') || keywords.includes('rest')) tags.push('sleep')
    if (keywords.includes('confident') || keywords.includes('strength')) tags.push('confidence')
    if (keywords.includes('gratitude') || keywords.includes('thankful')) tags.push('gratitude')
    if (keywords.includes('breath')) tags.push('breath')
    if (keywords.includes('body')) tags.push('body')

    return tags.length > 0 ? tags : ['mindfulness']
  }

  /**
   * Generate intro text based on tone
   */
  private generateIntroText(tone: RitualTone): string {
    const texts = {
      gentle: 'Welcome. Find a comfortable position. Let your eyes gently close, or soften your gaze. Take a moment to arrive here, just as you are.',
      neutral: 'Begin by finding a comfortable seated position. Close your eyes or lower your gaze. Notice that you have arrived in this moment.',
      coach: 'Let\'s begin. Sit up tall, shoulders relaxed. Close your eyes and commit to this practice. You\'ve shown up—that\'s what matters.',
    }
    return texts[tone]
  }

  /**
   * Generate body text based on tone and instructions
   */
  private generateBodyText(tone: RitualTone, instructions: string): string {
    const gentle = `Bring your attention to your breath. Notice the natural rhythm of breathing in... and breathing out. There's nothing to fix, nothing to change. Just notice. ${instructions}. Let each breath bring you closer to this intention.`

    const neutral = `Direct your attention to the breath. Observe the inhale. Observe the exhale. As thoughts arise, acknowledge them and return to the breath. ${instructions}. Stay present with what is.`

    const coach = `Focus on your breath. Breathe in fully. Breathe out completely. Stay with it. ${instructions}. This is your practice. You're building the skill of presence, one breath at a time.`

    const texts = { gentle, neutral, coach }
    return texts[tone]
  }

  /**
   * Generate closing text based on tone
   */
  private generateClosingText(tone: RitualTone): string {
    const texts = {
      gentle: 'As we close, take a moment to notice how you feel. Wiggle your fingers and toes. When you\'re ready, gently open your eyes. Carry this calm with you.',
      neutral: 'Begin to deepen your breath. Notice the space you\'re in. Slowly bring awareness back to your body. Open your eyes when ready.',
      coach: 'Strong work. Take a deep breath in. Let it out. Notice what you\'ve created here. Remember this feeling. Open your eyes and carry it forward.',
    }
    return texts[tone]
  }

  /**
   * Random delay between MOCK_DELAYS.MIN and MOCK_DELAYS.MAX
   */
  private randomDelay(): Promise<void> {
    const delay =
      MOCK_DELAYS.MIN + Math.random() * (MOCK_DELAYS.MAX - MOCK_DELAYS.MIN)
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
}
