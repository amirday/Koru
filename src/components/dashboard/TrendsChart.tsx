/**
 * TrendsChart - Simple SVG line chart for practice trends
 */

export interface DataPoint {
  date: string
  minutes: number
}

export interface TrendsChartProps {
  data: DataPoint[]
  height?: number
}

/**
 * TrendsChart - Simple line chart visualization
 */
export function TrendsChart({ data, height = 120 }: TrendsChartProps) {
  if (data.length === 0) return null

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1)

  // Generate path
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - (d.minutes / maxMinutes) * 100
    return { x, y, ...d }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Fill path (closed at bottom)
  const fillD = `${pathD} L 100 100 L 0 100 Z`

  return (
    <div className="bg-warm-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-calm-800">Practice Trend</h3>
        <span className="text-xs text-calm-500">Last 14 days</span>
      </div>

      <div style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#E5E5E5"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Fill area */}
          <path
            d={fillD}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#FF9A54"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill={p.minutes > 0 ? '#FF9A54' : '#E5E5E5'}
              stroke="white"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF9A54" />
              <stop offset="100%" stopColor="#FF9A54" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-calm-500">
        <span>{formatDate(data[0]?.date)}</span>
        <span>{formatDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  )
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
