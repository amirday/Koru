/**
 * Quick Start rituals - Short, focused practices for specific moments
 * Ready-to-use rituals for common situations throughout the day
 */

import type { Ritual } from '@/types'
import { Timestamp } from '@/types'

/**
 * Quick start rituals (3-10 minutes)
 * Designed for immediate use without customization
 */
export const quickStarts: Ritual[] = [
  // 1. Reset (3 min) - For anxious moments
  {
    id: 'quick-reset',
    title: 'Reset',
    instructions: 'Quick breath practice for anxious moments',
    duration: 180, // 3 minutes
    tone: 'gentle',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'none',
    sections: [
      {
        id: 'section-reset-intro',
        type: 'intro',
        durationSeconds: 20,
        guidanceText:
          'Pause. Close your eyes. You\'re safe. Let\'s reset together.',
      },
      {
        id: 'section-reset-body',
        type: 'body',
        durationSeconds: 130,
        guidanceText:
          'Place one hand on your chest, one on your belly. Feel your breath. Breathe in slowly for four counts... hold for four... out for six. Again. In for four... hold... out for six. Let each exhale release the tension. You\'re here. You\'re okay.',
      },
      {
        id: 'section-reset-closing',
        type: 'closing',
        durationSeconds: 30,
        guidanceText:
          'You\'ve reset. Take one more full breath. When you open your eyes, notice how you feel. You can do this anytime.',
      },
    ],
    tags: ['breath', 'anxiety', 'reset'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null, // Template rituals don't have usage stats until used
  },

  // 2. Focus Primer (5 min) - Before deep work
  {
    id: 'quick-focus-primer',
    title: 'Focus Primer',
    instructions: 'Sharpen attention before deep work',
    duration: 300, // 5 minutes
    tone: 'coach',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'rain',
    sections: [
      {
        id: 'section-fp-intro',
        type: 'intro',
        durationSeconds: 30,
        guidanceText:
          'Time to prime your focus. Sit tall. Close your eyes. Let\'s clear the mental clutter.',
      },
      {
        id: 'section-fp-body',
        type: 'body',
        durationSeconds: 240,
        guidanceText:
          'Count your breaths. One... two... three... up to ten, then start again. Each time your mind wanders, return to one. This is the work. You\'re training attention. Stay with it. Your focus is sharpening with each return.',
      },
      {
        id: 'section-fp-closing',
        type: 'closing',
        durationSeconds: 30,
        guidanceText:
          'Your mind is clear. Your attention is ready. Open your eyes and bring this focus to your work.',
      },
    ],
    tags: ['focus', 'work', 'concentration'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null,
  },

  // 3. Wind-Down (10 min) - End your day
  {
    id: 'quick-wind-down',
    title: 'Wind-Down',
    instructions: 'Gentle transition from day to rest',
    duration: 600, // 10 minutes
    tone: 'gentle',
    pace: 'slow',
    includeSilence: true,
    soundscape: 'ocean',
    sections: [
      {
        id: 'section-wd-intro',
        type: 'intro',
        durationSeconds: 45,
        guidanceText:
          'The day is done. You can lie down or sit comfortably. Close your eyes. It\'s time to wind down.',
      },
      {
        id: 'section-wd-body',
        type: 'body',
        durationSeconds: 300,
        guidanceText:
          'Scan through your body. Release any remaining tension. Let your jaw soften. Shoulders drop. Hands open. Each exhale, let go a little more. The day is complete. You did enough. Rest is coming.',
      },
      {
        id: 'section-wd-silence',
        type: 'silence',
        durationSeconds: 180,
        guidanceText: '',
        silenceDuration: 180,
      },
      {
        id: 'section-wd-closing',
        type: 'closing',
        durationSeconds: 75,
        guidanceText:
          'Let yourself drift. Sleep will come. When you\'re ready, open your eyes softly, or let them stay closed and rest.',
      },
    ],
    tags: ['sleep', 'evening', 'release'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null,
  },

  // 4. Gratitude (7 min) - Shift perspective
  {
    id: 'quick-gratitude',
    title: 'Gratitude',
    instructions: 'Quick gratitude practice to shift perspective',
    duration: 420, // 7 minutes
    tone: 'neutral',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'none',
    sections: [
      {
        id: 'section-grat-intro',
        type: 'intro',
        durationSeconds: 40,
        guidanceText:
          'Find a comfortable seat. Close your eyes. In the next few minutes, we\'ll explore what\'s going well.',
      },
      {
        id: 'section-grat-body',
        type: 'body',
        durationSeconds: 320,
        guidanceText:
          'Bring to mind one thing you\'re grateful for today. It can be small—a warm cup of coffee, a kind word, a moment of quiet. Notice how it feels to remember this. Now bring to mind another. And another. Let gratitude arise naturally. Each acknowledgment is a gift. Notice if your perspective is shifting, even slightly.',
      },
      {
        id: 'section-grat-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'Gratitude is always available. You can return to this practice anytime. Take a breath. Open your eyes.',
      },
    ],
    tags: ['gratitude', 'perspective', 'positive'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null,
  },

  // 5. Confidence (8 min) - Before challenges
  {
    id: 'quick-confidence',
    title: 'Confidence',
    instructions: 'Access inner strength before challenges',
    duration: 480, // 8 minutes
    tone: 'coach',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'fire',
    sections: [
      {
        id: 'section-conf-intro',
        type: 'intro',
        durationSeconds: 45,
        guidanceText:
          'Sit up straight. Feel your feet on the ground. You\'re here to connect with your strength. Close your eyes.',
      },
      {
        id: 'section-conf-body',
        type: 'body',
        durationSeconds: 375,
        guidanceText:
          'Recall a time you overcame something difficult. See that moment. Feel the strength that carried you through. That strength is still in you. It\'s here now. Breathe into your chest. Feel the solidity. You\'ve done hard things before. You can do them again. Bring to mind what\'s ahead. See yourself meeting it with courage. Not perfectly—but with strength. You are ready.',
      },
      {
        id: 'section-conf-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'Your strength is always with you. Take a full breath. Open your eyes. Step forward with confidence.',
      },
    ],
    tags: ['confidence', 'courage', 'strength'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null,
  },

  // 6. Silent Timer (varies 5-20 min) - Pure silence
  {
    id: 'quick-silent-timer',
    title: 'Silent Timer',
    instructions: 'Pure silent meditation with gentle bookends',
    duration: 600, // 10 minutes default (user can adjust)
    tone: 'neutral',
    pace: 'medium',
    includeSilence: true,
    soundscape: 'none',
    sections: [
      {
        id: 'section-st-intro',
        type: 'intro',
        durationSeconds: 30,
        guidanceText:
          'Sit comfortably. Close your eyes. The timer is set. Just sit.',
      },
      {
        id: 'section-st-silence',
        type: 'silence',
        durationSeconds: 540,
        guidanceText: '',
        silenceDuration: 540,
      },
      {
        id: 'section-st-closing',
        type: 'closing',
        durationSeconds: 30,
        guidanceText:
          'Gently deepen your breath. When you\'re ready, open your eyes.',
      },
    ],
    tags: ['silence', 'meditation', 'timer'],
    isTemplate: true,
    createdAt: Timestamp.from('2026-01-01T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T08:00:00Z'),
    statistics: null,
  },
]

/**
 * Get quick start ritual by ID
 */
export function getQuickStart(id: string): Ritual | undefined {
  return quickStarts.find((qs) => qs.id === id)
}

/**
 * Get all quick starts with a specific tag
 */
export function getQuickStartsByTag(tag: string): Ritual[] {
  return quickStarts.filter((qs) => qs.tags.includes(tag))
}
