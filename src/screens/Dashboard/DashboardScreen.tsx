/**
 * DashboardScreen - Practice tracking and insights
 * Features: Stats, trends chart, calendar heatmap, insights
 */

import { useNavigate } from 'react-router-dom'
import { ScreenContainer, Header } from '@/components/layout'
import {
  StatsOverview,
  TrendsChart,
  CalendarHeatmap,
  InsightsFeed,
} from '@/components/dashboard'
import { mockStats, mockWeeklyData, mockCalendarData, mockInsights } from '@/mocks/dashboardData'

/**
 * DashboardScreen - Main dashboard view
 */
export function DashboardScreen() {
  const navigate = useNavigate()

  // Build stats data
  const stats = [
    {
      label: 'Current Streak',
      value: `${mockStats.currentStreak} days`,
      icon: '🔥',
      trend: 'up' as const,
    },
    {
      label: 'This Week',
      value: `${mockStats.minutesThisWeek} min`,
      icon: '⏱️',
    },
    {
      label: 'Most Used',
      value: mockStats.mostUsedRitual,
      icon: '⭐',
    },
    {
      label: 'Avg Mood Change',
      value: `+${mockStats.avgMoodDelta}`,
      icon: '😊',
      trend: 'up' as const,
    },
  ]

  // Handle calendar day click
  const handleDayClick = (date: string) => {
    // In real app, would navigate to sessions for that day
    // For now, just navigate to session detail placeholder
    console.log('Clicked date:', date)
    const sessions = mockCalendarData[date]
    if (sessions && sessions > 0) {
      navigate('/session-detail/mock-session')
    }
  }

  return (
    <>
      <Header title="Dashboard" />

      <ScreenContainer>
        <div className="space-y-6 pb-6">
          {/* Stats Overview */}
          <section>
            <StatsOverview stats={stats} />
          </section>

          {/* Trends Chart */}
          <section>
            <TrendsChart data={mockWeeklyData} />
          </section>

          {/* Calendar Heatmap */}
          <section>
            <CalendarHeatmap
              data={mockCalendarData}
              onDayClick={handleDayClick}
            />
          </section>

          {/* Insights Feed */}
          <section>
            <InsightsFeed insights={mockInsights} />
          </section>
        </div>
      </ScreenContainer>
    </>
  )
}
