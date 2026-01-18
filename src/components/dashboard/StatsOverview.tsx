/**
 * StatsOverview - At a glance stats cards
 */

import React from 'react'
import { Card } from '@/components/ui'

export interface StatItem {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export interface StatsOverviewProps {
  stats: StatItem[]
}

/**
 * StatsOverview - Grid of stat cards
 */
export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} variant="elevated">
          <Card.Body className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              {stat.trend && (
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    stat.trend === 'up'
                      ? 'bg-green-100 text-green-700'
                      : stat.trend === 'down'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-calm-100 text-calm-600'
                  }`}
                >
                  {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '–'}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-calm-900">{stat.value}</div>
            <div className="text-xs text-calm-600 mt-0.5">{stat.label}</div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}
