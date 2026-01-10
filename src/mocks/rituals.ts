/**
 * Mock ritual data for testing and development
 * Provides 8 complete rituals with varying tones, durations, and purposes
 */

import type { Ritual } from '@/types'
import { Timestamp } from '@/types'

/**
 * Complete mock rituals with content and statistics
 */
export const mockRituals: Ritual[] = [
  // 1. Morning Calm (gentle, 10 min)
  {
    id: 'ritual-morning-calm',
    title: 'Morning Calm',
    instructions: 'Start the day with centered awareness and gentle presence',
    duration: 600, // 10 minutes
    tone: 'gentle',
    pace: 'slow',
    includeSilence: true,
    soundscape: 'forest',
    sections: [
      {
        id: 'section-mc-intro',
        type: 'intro',
        durationSeconds: 60,
        guidanceText:
          'Welcome to this morning practice. Find a comfortable seat, allowing your body to settle. Let your eyes gently close, or soften your gaze downward. Take a moment to arrive here, just as you are.',
      },
      {
        id: 'section-mc-body',
        type: 'body',
        durationSeconds: 360,
        guidanceText:
          'Bring your attention to your breath. Notice the natural rhythm of breathing in... and breathing out. Feel the gentle rise and fall of your chest or belly. There\'s nothing to fix, nothing to change. Just notice. As you breathe, imagine breathing in calm, breathing out anything you don\'t need for this day. Let each breath settle you deeper into this moment.',
      },
      {
        id: 'section-mc-silence',
        type: 'silence',
        durationSeconds: 120,
        guidanceText: '',
        silenceDuration: 120,
      },
      {
        id: 'section-mc-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'As we close, take a moment to appreciate this time you\'ve given yourself. Wiggle your fingers and toes. When you\'re ready, gently open your eyes. Carry this calm presence with you into your day.',
      },
    ],
    tags: ['morning', 'calm', 'breath'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Help me start my day with calm and presence',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-08T08:00:00Z'),
    updatedAt: Timestamp.from('2026-01-08T08:00:00Z'),
    statistics: {
      id: 'stats-morning-calm',
      ritualId: 'ritual-morning-calm',
      isFavorite: true,
      usageCount: 12,
      lastUsedAt: Timestamp.from('2026-01-10T07:30:00Z'),
    },
  },

  // 2. Deep Focus (coach, 15 min)
  {
    id: 'ritual-deep-focus',
    title: 'Deep Focus',
    instructions: 'Clear mental clutter and sharpen concentration for focused work',
    duration: 900, // 15 minutes
    tone: 'coach',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'rain',
    sections: [
      {
        id: 'section-df-intro',
        type: 'intro',
        durationSeconds: 90,
        guidanceText:
          'Let\'s build your focus. Sit up tall, shoulders back. Close your eyes and commit to this practice. You\'ve shown up—that\'s what matters. In the next fifteen minutes, we\'ll clear the mental clutter and sharpen your attention.',
      },
      {
        id: 'section-df-body1',
        type: 'body',
        durationSeconds: 300,
        guidanceText:
          'Bring all your attention to your breath. Count each exhale. One... two... three... up to ten, then start again. When your mind wanders—and it will—notice without judgment and return to one. This is training. Every time you return, you\'re strengthening your focus muscle.',
      },
      {
        id: 'section-df-body2',
        type: 'body',
        durationSeconds: 390,
        guidanceText:
          'Now, bring to mind the work ahead. See yourself approaching it with clarity and purpose. Notice any resistance. Breathe into it. You have what you need. Your mind is sharp. Your attention is yours to direct. Stay with this vision. Feel the readiness building.',
      },
      {
        id: 'section-df-closing',
        type: 'closing',
        durationSeconds: 120,
        guidanceText:
          'Strong work. You\'ve trained your mind. Take a deep breath in. Let it out. Remember this clarity. You can return to it anytime. Open your eyes and bring this focus to your work.',
      },
    ],
    tags: ['focus', 'work', 'concentration'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'I need laser focus for deep work sessions',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-05T10:00:00Z'),
    updatedAt: Timestamp.from('2026-01-05T10:00:00Z'),
    statistics: {
      id: 'stats-deep-focus',
      ritualId: 'ritual-deep-focus',
      isFavorite: true,
      usageCount: 8,
      lastUsedAt: Timestamp.from('2026-01-09T14:00:00Z'),
    },
  },

  // 3. Evening Release (gentle, 12 min)
  {
    id: 'ritual-evening-release',
    title: 'Evening Release',
    instructions: 'Let go of the day and prepare for restful sleep',
    duration: 720, // 12 minutes
    tone: 'gentle',
    pace: 'slow',
    includeSilence: true,
    soundscape: 'ocean',
    sections: [
      {
        id: 'section-er-intro',
        type: 'intro',
        durationSeconds: 60,
        guidanceText:
          'Welcome to this evening ritual. You can lie down or sit comfortably. Let your body be heavy, supported. Close your eyes gently. This is your time to release the day.',
      },
      {
        id: 'section-er-body',
        type: 'body',
        durationSeconds: 420,
        guidanceText:
          'Scan through your body from your head down to your toes. Notice any tension. With each exhale, imagine releasing it. Let your jaw soften. Your shoulders drop. Your hands relax. There\'s nothing left to hold onto. The day is complete. You did what you could. Let it all soften and release.',
      },
      {
        id: 'section-er-silence',
        type: 'silence',
        durationSeconds: 180,
        guidanceText: '',
        silenceDuration: 180,
      },
      {
        id: 'section-er-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'As we close, know that rest is coming. You are safe. You are held. When you\'re ready, open your eyes softly, and let yourself drift toward sleep.',
      },
    ],
    tags: ['evening', 'sleep', 'release', 'body'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Help me wind down and prepare for restful sleep',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-06T20:00:00Z'),
    updatedAt: Timestamp.from('2026-01-06T20:00:00Z'),
    statistics: {
      id: 'stats-evening-release',
      ritualId: 'ritual-evening-release',
      isFavorite: false,
      usageCount: 5,
      lastUsedAt: Timestamp.from('2026-01-09T21:30:00Z'),
    },
  },

  // 4. Grateful Heart (neutral, 8 min)
  {
    id: 'ritual-grateful-heart',
    title: 'Grateful Heart',
    instructions: 'Cultivate appreciation and shift perspective to what\'s working',
    duration: 480, // 8 minutes
    tone: 'neutral',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'none',
    sections: [
      {
        id: 'section-gh-intro',
        type: 'intro',
        durationSeconds: 60,
        guidanceText:
          'Find a comfortable position. Close your eyes or soften your gaze. In this practice, we\'ll explore gratitude—not as a forced feeling, but as a gentle noticing of what\'s present.',
      },
      {
        id: 'section-gh-body',
        type: 'body',
        durationSeconds: 360,
        guidanceText:
          'Bring to mind something simple you\'re grateful for today. It might be a person, a moment, a breath of fresh air. Hold it lightly in your awareness. Notice how it feels in your body to recall this. Let yourself appreciate it. Now, gently bring to mind something else. And another. Let gratitude arise naturally, without forcing. Each acknowledgment is a gift you give yourself.',
      },
      {
        id: 'section-gh-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'As we close, notice if your perspective has shifted, even slightly. Gratitude is always available. Deepen your breath. When ready, open your eyes.',
      },
    ],
    tags: ['gratitude', 'perspective'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Help me cultivate gratitude when I\'m feeling stuck',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-07T12:00:00Z'),
    updatedAt: Timestamp.from('2026-01-07T12:00:00Z'),
    statistics: {
      id: 'stats-grateful-heart',
      ritualId: 'ritual-grateful-heart',
      isFavorite: false,
      usageCount: 3,
      lastUsedAt: Timestamp.from('2026-01-08T18:00:00Z'),
    },
  },

  // 5. Inner Strength (coach, 10 min)
  {
    id: 'ritual-inner-strength',
    title: 'Inner Strength',
    instructions: 'Build confidence and resilience before challenges',
    duration: 600, // 10 minutes
    tone: 'coach',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'fire',
    sections: [
      {
        id: 'section-is-intro',
        type: 'intro',
        durationSeconds: 60,
        guidanceText:
          'Sit tall. Feel your feet grounded. You\'re here to connect with your inner strength—it\'s already there. Close your eyes and let\'s access it.',
      },
      {
        id: 'section-is-body',
        type: 'body',
        durationSeconds: 480,
        guidanceText:
          'Recall a time you faced something difficult and came through it. See that version of yourself. Notice the strength there. That strength is still in you. It\'s here right now. Breathe into your chest, your core. Feel the solidity. You\'ve done hard things before. You can do them again. Bring to mind the challenge ahead. See yourself meeting it with this strength. Not perfectly—but with courage. Stay with this. You are capable.',
      },
      {
        id: 'section-is-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'You\'ve connected with your strength. It\'s not something you create—it\'s something you remember. Take a full breath. Let it out. Open your eyes. You\'re ready.',
      },
    ],
    tags: ['confidence', 'strength', 'courage'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Help me feel confident and strong before big challenges',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-04T09:00:00Z'),
    updatedAt: Timestamp.from('2026-01-04T09:00:00Z'),
    statistics: {
      id: 'stats-inner-strength',
      ritualId: 'ritual-inner-strength',
      isFavorite: true,
      usageCount: 6,
      lastUsedAt: Timestamp.from('2026-01-09T08:00:00Z'),
    },
  },

  // 6. Midday Reset (neutral, 5 min)
  {
    id: 'ritual-midday-reset',
    title: 'Midday Reset',
    instructions: 'Quick break to reset energy and clarity',
    duration: 300, // 5 minutes
    tone: 'neutral',
    pace: 'medium',
    includeSilence: true,
    soundscape: 'rain',
    sections: [
      {
        id: 'section-mr-intro',
        type: 'intro',
        durationSeconds: 30,
        guidanceText:
          'Pause everything. Close your eyes. This is a reset—five minutes to let go and return fresh.',
      },
      {
        id: 'section-mr-body',
        type: 'body',
        durationSeconds: 150,
        guidanceText:
          'Notice your breath. Follow it in. Follow it out. Let the morning fade. Let the afternoon wait. Just this breath. This moment. Nothing else needs your attention right now.',
      },
      {
        id: 'section-mr-silence',
        type: 'silence',
        durationSeconds: 90,
        guidanceText: '',
        silenceDuration: 90,
      },
      {
        id: 'section-mr-closing',
        type: 'closing',
        durationSeconds: 30,
        guidanceText:
          'You\'re reset. Take a breath. Open your eyes. Continue your day with fresh energy.',
      },
    ],
    tags: ['reset', 'breath', 'energy'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Quick midday reset when I feel scattered',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-03T13:00:00Z'),
    updatedAt: Timestamp.from('2026-01-03T13:00:00Z'),
    statistics: {
      id: 'stats-midday-reset',
      ritualId: 'ritual-midday-reset',
      isFavorite: false,
      usageCount: 15,
      lastUsedAt: Timestamp.from('2026-01-10T12:30:00Z'),
    },
  },

  // 7. Body Awareness (gentle, 20 min)
  {
    id: 'ritual-body-awareness',
    title: 'Body Awareness',
    instructions: 'Deep body scan for grounding and presence',
    duration: 1200, // 20 minutes
    tone: 'gentle',
    pace: 'slow',
    includeSilence: true,
    soundscape: 'ocean',
    sections: [
      {
        id: 'section-ba-intro',
        type: 'intro',
        durationSeconds: 90,
        guidanceText:
          'Lie down or sit comfortably. Let your body be fully supported. Close your eyes. For the next twenty minutes, you\'ll journey through your body with gentle attention.',
      },
      {
        id: 'section-ba-body',
        type: 'body',
        durationSeconds: 900,
        guidanceText:
          'Begin with your feet. Notice any sensations—warmth, coolness, tingling, or nothing at all. All of it is okay. Move your attention to your ankles, your calves, your knees. Slowly traveling up through your thighs, your hips. Notice your belly rising and falling with breath. Your chest, your shoulders. Down your arms to your fingertips. Your neck, your jaw, your face. Your whole head. Now feel your entire body at once. You are here. You are present. You are enough.',
      },
      {
        id: 'section-ba-silence',
        type: 'silence',
        durationSeconds: 150,
        guidanceText: '',
        silenceDuration: 150,
      },
      {
        id: 'section-ba-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'Slowly begin to deepen your breath. Wiggle your fingers and toes. Roll to one side and pause. When you\'re ready, gently come up to sitting. Thank yourself for this practice.',
      },
    ],
    tags: ['body', 'grounding', 'awareness'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Deep body scan to reconnect with physical presence',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-02T17:00:00Z'),
    updatedAt: Timestamp.from('2026-01-02T17:00:00Z'),
    statistics: {
      id: 'stats-body-awareness',
      ritualId: 'ritual-body-awareness',
      isFavorite: false,
      usageCount: 2,
      lastUsedAt: Timestamp.from('2026-01-07T19:00:00Z'),
    },
  },

  // 8. Breath Foundation (neutral, 7 min)
  {
    id: 'ritual-breath-foundation',
    title: 'Breath Foundation',
    instructions: 'Simple breath focus to anchor the mind',
    duration: 420, // 7 minutes
    tone: 'neutral',
    pace: 'medium',
    includeSilence: false,
    soundscape: 'none',
    sections: [
      {
        id: 'section-bf-intro',
        type: 'intro',
        durationSeconds: 45,
        guidanceText:
          'Sit comfortably. Close your eyes. This is a simple practice—just you and your breath.',
      },
      {
        id: 'section-bf-body',
        type: 'body',
        durationSeconds: 315,
        guidanceText:
          'Find your breath. Notice where you feel it most clearly—nose, chest, or belly. Keep your attention there. When your mind wanders, return to the breath. This is the practice. Breath in. Breath out. Again and again. The simplicity is the point.',
      },
      {
        id: 'section-bf-closing',
        type: 'closing',
        durationSeconds: 60,
        guidanceText:
          'You\'ve practiced the foundation of all meditation—returning to the breath. This skill builds over time. Open your eyes when ready.',
      },
    ],
    tags: ['breath', 'foundation', 'mindfulness'],
    isTemplate: false,
    generatedFrom: {
      instructions: 'Basic breath meditation to build consistency',
      modelVersion: 'mock-v1',
    },
    createdAt: Timestamp.from('2026-01-01T10:00:00Z'),
    updatedAt: Timestamp.from('2026-01-01T10:00:00Z'),
    statistics: {
      id: 'stats-breath-foundation',
      ritualId: 'ritual-breath-foundation',
      isFavorite: true,
      usageCount: 20,
      lastUsedAt: Timestamp.from('2026-01-10T09:00:00Z'),
    },
  },
]
