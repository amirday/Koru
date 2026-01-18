/**
 * InsightTile - AI-generated insight card
 */

import { Card } from '@/components/ui'

export interface InsightTileProps {
  /** Insight text */
  text: string
  /** Emoji icon */
  icon: string
  /** Optional category */
  category?: string
}

/**
 * InsightTile - Single insight card
 */
export function InsightTile({ text, icon, category }: InsightTileProps) {
  return (
    <Card variant="flat" className="hover:bg-warm-100 transition-colors">
      <Card.Body className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-calm-800">{text}</p>
            {category && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-calm-100 text-calm-600 text-xs rounded-full">
                {category}
              </span>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
