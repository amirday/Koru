/**
 * ProfileScreen - User preferences and settings
 */

import { useState } from 'react'
import { useApp } from '@/contexts'
import { ScreenContainer, Header } from '@/components/layout'
import { Button, Toggle, Input, useToast } from '@/components/ui'
import { PreferencesSection, SettingRow, ReminderSettings } from '@/components/profile'
import type { RitualTone } from '@/types'

/**
 * ProfileScreen - Settings and preferences management
 */
export function ProfileScreen() {
  const { goal, preferences, updateGoal, updatePreferences } = useApp()
  const toast = useToast()

  // Local state for editing
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalText, setGoalText] = useState(goal?.instructions || '')

  // Reminder state (local, would persist to preferences in real app)
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('08:00')
  const [reminderDays, setReminderDays] = useState([1, 2, 3, 4, 5]) // Weekdays

  const handleSaveGoal = async () => {
    if (!goalText.trim()) {
      toast.showToast('error', 'Please enter a goal')
      return
    }

    try {
      await updateGoal(goalText)
      setEditingGoal(false)
      toast.showToast('success', 'Goal updated')
    } catch (error) {
      console.error('Failed to update goal:', error)
      toast.showToast('error', 'Failed to update goal')
    }
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(e.target.value)
    updatePreferences({ defaultDuration: duration })
  }

  const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tone = e.target.value as RitualTone
    updatePreferences({ defaultTone: tone })
  }

  const handleNotificationsChange = (enabled: boolean) => {
    updatePreferences({ notifications: enabled })
    if (enabled) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }

  const handleSoundscapesChange = (enabled: boolean) => {
    updatePreferences({ soundscapesEnabled: enabled })
  }

  const handleExportData = () => {
    try {
      const data = {
        goal,
        preferences,
        exportedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'koru-data-export.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.showToast('success', 'Data exported')
    } catch (error) {
      console.error('Export failed:', error)
      toast.showToast('error', 'Failed to export data')
    }
  }

  const handleClearData = () => {
    if (window.confirm('This will delete all your data. This cannot be undone. Continue?')) {
      localStorage.clear()
      window.location.href = '/welcome'
    }
  }

  return (
    <>
      <Header title="Profile" />

      <ScreenContainer>
        <div className="space-y-6 pb-6">
          {/* Goal Section */}
          <PreferencesSection title="Your Goal">
            {editingGoal ? (
              <div className="py-2 space-y-3">
                <Input
                  type="textarea"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="What do you want more of?"
                  autoResize
                  maxRows={3}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleSaveGoal}>
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingGoal(false)
                      setGoalText(goal?.instructions || '')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <SettingRow label="Current goal" description={goal?.instructions || 'No goal set'}>
                <Button variant="ghost" size="sm" onClick={() => setEditingGoal(true)}>
                  Edit
                </Button>
              </SettingRow>
            )}
          </PreferencesSection>

          {/* Reminders */}
          <PreferencesSection title="Reminders">
            <div className="py-2">
              <ReminderSettings
                enabled={reminderEnabled}
                time={reminderTime}
                days={reminderDays}
                onEnabledChange={setReminderEnabled}
                onTimeChange={setReminderTime}
                onDaysChange={setReminderDays}
              />
            </div>
          </PreferencesSection>

          {/* Defaults */}
          <PreferencesSection title="Defaults">
            <SettingRow label="Default duration" description="For generated rituals">
              <select
                value={preferences.defaultDuration}
                onChange={handleDurationChange}
                className="px-3 py-1.5 text-sm rounded-lg border border-calm-300 bg-white text-calm-700 focus:outline-none focus:ring-2 focus:ring-peach-500"
              >
                <option value={300}>5 min</option>
                <option value={600}>10 min</option>
                <option value={900}>15 min</option>
                <option value={1200}>20 min</option>
              </select>
            </SettingRow>
            <SettingRow label="Default tone" description="For generated rituals">
              <select
                value={preferences.defaultTone}
                onChange={handleToneChange}
                className="px-3 py-1.5 text-sm rounded-lg border border-calm-300 bg-white text-calm-700 focus:outline-none focus:ring-2 focus:ring-peach-500"
              >
                <option value="gentle">Gentle</option>
                <option value="neutral">Neutral</option>
                <option value="coach">Coaching</option>
              </select>
            </SettingRow>
            <SettingRow label="Soundscapes" description="Background sounds during sessions">
              <Toggle
                checked={preferences.soundscapesEnabled}
                onChange={handleSoundscapesChange}
              />
            </SettingRow>
          </PreferencesSection>

          {/* Notifications */}
          <PreferencesSection title="Notifications">
            <SettingRow label="Push notifications" description="Get notified when rituals are ready">
              <Toggle
                checked={preferences.notifications}
                onChange={handleNotificationsChange}
              />
            </SettingRow>
          </PreferencesSection>

          {/* Appearance */}
          <PreferencesSection title="Appearance">
            <SettingRow label="Theme" description="Light mode only for now">
              <span className="text-sm text-calm-500">Light</span>
            </SettingRow>
            <SettingRow label="Language" description="English only for now">
              <span className="text-sm text-calm-500">English</span>
            </SettingRow>
          </PreferencesSection>

          {/* Data */}
          <PreferencesSection title="Data">
            <SettingRow label="Export data" description="Download your data as JSON">
              <Button variant="ghost" size="sm" onClick={handleExportData}>
                Export
              </Button>
            </SettingRow>
            <SettingRow label="Clear all data" description="Delete everything and start fresh">
              <Button variant="ghost" size="sm" onClick={handleClearData}>
                <span className="text-red-600">Clear</span>
              </Button>
            </SettingRow>
          </PreferencesSection>

          {/* About */}
          <div className="text-center pt-4 text-sm text-calm-500">
            <p>Koru v1.0.0 (Mock)</p>
            <div className="flex justify-center gap-4 mt-2">
              <button className="hover:text-calm-700 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-calm-700 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </ScreenContainer>
    </>
  )
}
