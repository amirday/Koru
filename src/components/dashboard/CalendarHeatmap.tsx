/**
 * CalendarHeatmap - Monthly practice heatmap
 */

export interface CalendarHeatmapProps {
  /** Sessions per day (YYYY-MM-DD -> count) */
  data: Record<string, number>
  /** Month to display (YYYY-MM) */
  month?: string
  /** Day click callback */
  onDayClick?: (date: string) => void
}

/**
 * Get days in month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Get first day of month (0 = Sunday)
 */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

/**
 * Get intensity class based on session count
 */
function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-calm-100'
  if (count === 1) return 'bg-peach-200'
  if (count === 2) return 'bg-peach-400'
  return 'bg-peach-500'
}

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * CalendarHeatmap - Monthly grid showing practice frequency
 */
export function CalendarHeatmap({
  data,
  month,
  onDayClick,
}: CalendarHeatmapProps) {
  // Parse month or use current
  const now = new Date()
  let year = now.getFullYear()
  let monthIndex = now.getMonth()

  if (month) {
    const parts = month.split('-').map(Number)
    year = parts[0] ?? year
    monthIndex = (parts[1] ?? (monthIndex + 1)) - 1
  }

  const daysInMonth = getDaysInMonth(year, monthIndex)
  const firstDay = getFirstDayOfMonth(year, monthIndex)

  // Build calendar grid
  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = Array(firstDay).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Pad last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDayClick?.(dateStr)
  }

  return (
    <div className="bg-warm-50 rounded-lg p-4">
      {/* Month header */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-calm-800">
          {monthNames[monthIndex]} {year}
        </h3>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name, i) => (
          <div key={i} className="text-center text-xs text-calm-500 font-medium">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={dayIndex} className="w-8 h-8" />
              }

              const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const count = data[dateStr] || 0
              const isToday = day === now.getDate() && monthIndex === now.getMonth() && year === now.getFullYear()

              return (
                <button
                  key={dayIndex}
                  onClick={() => handleDayClick(day)}
                  className={`w-8 h-8 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${
                    getIntensityClass(count)
                  } ${
                    count > 0 ? 'text-white' : 'text-calm-600'
                  } ${
                    isToday ? 'ring-2 ring-peach-500 ring-offset-1' : ''
                  } ${
                    onDayClick ? 'hover:ring-2 hover:ring-calm-300' : ''
                  }`}
                  disabled={!onDayClick}
                  aria-label={`${monthNames[monthIndex]} ${day}: ${count} sessions`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-xs text-calm-500">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-4 h-4 rounded ${getIntensityClass(level)}`}
            />
          ))}
        </div>
        <span className="text-xs text-calm-500">More</span>
      </div>
    </div>
  )
}
