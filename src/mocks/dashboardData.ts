/**
 * Mock dashboard data for development
 */

import type { Session, Timestamp } from '@/types'

// Mock session history (past 30 days)
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    ritualId: 'ritual-morning-calm',
    status: 'completed',
    startedAt: '2026-01-17T07:30:00Z' as Timestamp,
    completedAt: '2026-01-17T07:40:00Z' as Timestamp,
    progressSeconds: 600,
    reflection: {
      id: 'reflection-1',
      sessionId: 'session-1',
      reflection: 'Felt very centered today.',
      rating: 5,
      createdAt: '2026-01-17T07:41:00Z' as Timestamp,
    },
  },
  {
    id: 'session-2',
    ritualId: 'ritual-deep-focus',
    status: 'completed',
    startedAt: '2026-01-16T14:00:00Z' as Timestamp,
    completedAt: '2026-01-16T14:15:00Z' as Timestamp,
    progressSeconds: 900,
    reflection: {
      id: 'reflection-2',
      sessionId: 'session-2',
      reflection: 'Ready for deep work.',
      rating: 4,
      createdAt: '2026-01-16T14:16:00Z' as Timestamp,
    },
  },
  {
    id: 'session-3',
    ritualId: 'ritual-evening-release',
    status: 'completed',
    startedAt: '2026-01-15T21:30:00Z' as Timestamp,
    completedAt: '2026-01-15T21:42:00Z' as Timestamp,
    progressSeconds: 720,
    reflection: null,
  },
  {
    id: 'session-4',
    ritualId: 'ritual-midday-reset',
    status: 'completed',
    startedAt: '2026-01-15T12:30:00Z' as Timestamp,
    completedAt: '2026-01-15T12:35:00Z' as Timestamp,
    progressSeconds: 300,
    reflection: {
      id: 'reflection-4',
      sessionId: 'session-4',
      reflection: 'Quick but effective.',
      rating: 4,
      createdAt: '2026-01-15T12:36:00Z' as Timestamp,
    },
  },
  {
    id: 'session-5',
    ritualId: 'ritual-morning-calm',
    status: 'completed',
    startedAt: '2026-01-14T07:30:00Z' as Timestamp,
    completedAt: '2026-01-14T07:40:00Z' as Timestamp,
    progressSeconds: 600,
    reflection: null,
  },
  {
    id: 'session-6',
    ritualId: 'ritual-breath-foundation',
    status: 'completed',
    startedAt: '2026-01-13T09:00:00Z' as Timestamp,
    completedAt: '2026-01-13T09:07:00Z' as Timestamp,
    progressSeconds: 420,
    reflection: {
      id: 'reflection-6',
      sessionId: 'session-6',
      reflection: 'Building consistency.',
      rating: 3,
      createdAt: '2026-01-13T09:08:00Z' as Timestamp,
    },
  },
  {
    id: 'session-7',
    ritualId: 'ritual-inner-strength',
    status: 'completed',
    startedAt: '2026-01-12T08:00:00Z' as Timestamp,
    completedAt: '2026-01-12T08:10:00Z' as Timestamp,
    progressSeconds: 600,
    reflection: {
      id: 'reflection-7',
      sessionId: 'session-7',
      reflection: 'Felt empowered.',
      rating: 5,
      createdAt: '2026-01-12T08:11:00Z' as Timestamp,
    },
  },
  {
    id: 'session-8',
    ritualId: 'ritual-grateful-heart',
    status: 'completed',
    startedAt: '2026-01-11T18:00:00Z' as Timestamp,
    completedAt: '2026-01-11T18:08:00Z' as Timestamp,
    progressSeconds: 480,
    reflection: null,
  },
  {
    id: 'session-9',
    ritualId: 'ritual-morning-calm',
    status: 'completed',
    startedAt: '2026-01-10T07:30:00Z' as Timestamp,
    completedAt: '2026-01-10T07:40:00Z' as Timestamp,
    progressSeconds: 600,
    reflection: {
      id: 'reflection-9',
      sessionId: 'session-9',
      reflection: 'Great start to the week.',
      rating: 4,
      createdAt: '2026-01-10T07:41:00Z' as Timestamp,
    },
  },
  {
    id: 'session-10',
    ritualId: 'ritual-body-awareness',
    status: 'completed',
    startedAt: '2026-01-09T19:00:00Z' as Timestamp,
    completedAt: '2026-01-09T19:20:00Z' as Timestamp,
    progressSeconds: 1200,
    reflection: {
      id: 'reflection-10',
      sessionId: 'session-10',
      reflection: 'Very relaxing body scan.',
      rating: 5,
      createdAt: '2026-01-09T19:21:00Z' as Timestamp,
    },
  },
]

// Dashboard stats
export const mockStats = {
  currentStreak: 7,
  minutesThisWeek: 45,
  mostUsedRitual: 'Morning Calm',
  avgMoodDelta: 1.8,
  totalSessions: 42,
  totalMinutes: 380,
}

// Insights
export const mockInsights = [
  {
    id: 'insight-1',
    text: 'Morning sessions improve your mood most',
    icon: '🌅',
    category: 'timing',
  },
  {
    id: 'insight-2',
    text: 'Short rituals complete more often',
    icon: '⏱️',
    category: 'duration',
  },
  {
    id: 'insight-3',
    text: 'Breath focus correlates with calm',
    icon: '🌬️',
    category: 'technique',
  },
  {
    id: 'insight-4',
    text: "You're most consistent on weekdays",
    icon: '📅',
    category: 'consistency',
  },
]

// Weekly minutes data for chart (last 14 days)
export const mockWeeklyData = [
  { date: '2026-01-04', minutes: 15 },
  { date: '2026-01-05', minutes: 0 },
  { date: '2026-01-06', minutes: 10 },
  { date: '2026-01-07', minutes: 20 },
  { date: '2026-01-08', minutes: 0 },
  { date: '2026-01-09', minutes: 12 },
  { date: '2026-01-10', minutes: 10 },
  { date: '2026-01-11', minutes: 8 },
  { date: '2026-01-12', minutes: 10 },
  { date: '2026-01-13', minutes: 7 },
  { date: '2026-01-14', minutes: 10 },
  { date: '2026-01-15', minutes: 17 },
  { date: '2026-01-16', minutes: 15 },
  { date: '2026-01-17', minutes: 10 },
]

// Calendar data (sessions per day for current month)
export const mockCalendarData: Record<string, number> = {
  '2026-01-01': 1,
  '2026-01-03': 2,
  '2026-01-05': 1,
  '2026-01-07': 1,
  '2026-01-09': 1,
  '2026-01-10': 1,
  '2026-01-11': 1,
  '2026-01-12': 1,
  '2026-01-13': 1,
  '2026-01-14': 1,
  '2026-01-15': 2,
  '2026-01-16': 1,
  '2026-01-17': 1,
}
