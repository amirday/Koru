/**
 * ReminderSettings - Time and day reminder configuration
 */

import { Toggle } from '@/components/ui'

export interface ReminderSettingsProps {
  /** Whether reminders are enabled */
  enabled: boolean
  /** Reminder time (HH:MM format) */
  time: string
  /** Selected days (0 = Sunday, 6 = Saturday) */
  days: number[]
  /** Toggle enabled callback */
  onEnabledChange: (enabled: boolean) => void
  /** Time change callback */
  onTimeChange: (time: string) => void
  /** Days change callback */
  onDaysChange: (days: number[]) => void
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * ReminderSettings - Configure reminder time and days
 */
export function ReminderSettings({
  enabled,
  time,
  days,
  onEnabledChange,
  onTimeChange,
  onDaysChange,
}: ReminderSettingsProps) {
  const handleDayToggle = (dayIndex: number) => {
    if (days.includes(dayIndex)) {
      onDaysChange(days.filter((d) => d !== dayIndex))
    } else {
      onDaysChange([...days, dayIndex].sort())
    }
  }

  return (
    <div className="space-y-4">
      {/* Enable toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-calm-900">Daily Reminder</p>
          <p className="text-xs text-calm-500">Get reminded to meditate</p>
        </div>
        <Toggle checked={enabled} onChange={onEnabledChange} />
      </div>

      {/* Time and days (shown when enabled) */}
      {enabled && (
        <div className="space-y-4 pt-2 border-t border-calm-100">
          {/* Time picker */}
          <div>
            <label className="block text-xs text-calm-600 mb-1.5">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-calm-300 bg-white text-calm-900 focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-peach-500"
            />
          </div>

          {/* Day selector */}
          <div>
            <label className="block text-xs text-calm-600 mb-1.5">Days</label>
            <div className="flex gap-1">
              {dayLabels.map((label, index) => {
                const isSelected = days.includes(index)
                return (
                  <button
                    key={index}
                    onClick={() => handleDayToggle(index)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-peach-500 text-white'
                        : 'bg-calm-100 text-calm-600 hover:bg-calm-200'
                    }`}
                    aria-label={dayNames[index]}
                    aria-pressed={isSelected}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
