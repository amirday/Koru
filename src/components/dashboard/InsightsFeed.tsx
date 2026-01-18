/**
 * InsightsFeed - List of AI-generated insights
 */

import { InsightTile } from './InsightTile'

export interface Insight {
  id: string
  text: string
  icon: string
  category?: string
}

export interface InsightsFeedProps {
  insights: Insight[]
}

/**
 * InsightsFeed - List of insight cards
 */
export function InsightsFeed({ insights }: InsightsFeedProps) {
  if (insights.length === 0) {
    return (
      <div className="text-center py-8 text-calm-500">
        <p className="text-4xl mb-2">🔮</p>
        <p className="text-sm">Complete more sessions to unlock insights</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-calm-800">Insights</h3>
      <div className="space-y-2">
        {insights.map((insight) => (
          <InsightTile
            key={insight.id}
            text={insight.text}
            icon={insight.icon}
            category={insight.category}
          />
        ))}
      </div>
    </div>
  )
}
