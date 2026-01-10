import { useState } from 'react'
import { useApp, useRituals } from '@/contexts'
import { useLocalStorage, useReducedMotion, useNotification, useRitual } from '@/hooks'
import { RITUAL_TONES } from '@/types'

export function AppContent() {
  const app = useApp()
  const rituals = useRituals()
  const [newGoalText, setNewGoalText] = useState('')

  // Test custom hooks
  const [testValue, setTestValue] = useLocalStorage('test-value', 'default')
  const prefersReducedMotion = useReducedMotion()
  const notification = useNotification()
  const ritual = useRitual()

  // Test updating goal
  const handleUpdateGoal = async () => {
    if (!newGoalText.trim()) return
    try {
      await app.updateGoal(newGoalText)
      setNewGoalText('')
      alert('Goal updated! Check localStorage.')
    } catch (error) {
      alert('Failed to update goal. Check console.')
    }
  }

  // Test updating preferences
  const handleToggleNotifications = async () => {
    try {
      await app.updatePreferences({
        notifications: !app.preferences.notifications,
      })
      alert(`Notifications: ${!app.preferences.notifications}`)
    } catch (error) {
      alert('Failed to update preferences. Check console.')
    }
  }

  // Test completing onboarding
  const handleCompleteOnboarding = async () => {
    try {
      await app.completeOnboarding()
      alert('Onboarding complete!')
    } catch (error) {
      alert('Failed to complete onboarding. Check console.')
    }
  }

  // Test ritual generation
  const handleGenerateRitual = async () => {
    try {
      await rituals.startGeneration({
        instructions: app.goal?.instructions || 'Find more calm and focus',
        duration: 5 * 60,
        tone: 'gentle',
        includeSilence: true,
        soundscape: 'ocean',
      })
      alert('Ritual generation started! Check console for progress.')
    } catch (error) {
      alert('Generation failed. Check console.')
    }
  }

  // Test deleting a ritual
  const handleDeleteFirstRitual = async () => {
    if (rituals.rituals.length === 0) {
      alert('No rituals to delete')
      return
    }
    try {
      await rituals.deleteRitual(rituals.rituals[0]!.id)
      alert('First ritual deleted!')
    } catch (error) {
      alert('Failed to delete ritual. Check console.')
    }
  }

  // Test useLocalStorage hook
  const handleTestLocalStorage = () => {
    const newValue = `Value at ${new Date().toLocaleTimeString()}`
    setTestValue(newValue)
    alert(`Set test value: ${newValue}`)
  }

  // Test useNotification hook
  const handleTestNotification = async () => {
    const success = await notification.notify({
      title: 'Hook Test',
      body: 'useNotification hook is working!',
      icon: '/icon-192.png',
    })
    if (!success) {
      alert('Notification blocked or not supported')
    }
  }

  // Test useRitual hook
  const handleToggleFavorite = async () => {
    if (rituals.rituals.length === 0) return
    try {
      await ritual.toggleFavorite(rituals.rituals[0]!.id)
      alert('Toggled favorite status!')
    } catch (error) {
      alert('Failed to toggle favorite. Check console.')
    }
  }

  if (app.isLoading || rituals.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <p className="text-calm-700 font-sans">Loading contexts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
          Koru
        </h1>
        <p className="text-lg text-calm-700 font-sans">
          Meditation Rituals
        </p>

        <div className="mt-8 px-6 py-3 bg-peach-500 text-white rounded-lg font-sans font-medium inline-block">
          Phase 6 Complete ✓ (Custom Hooks)
        </div>

        {/* AppContext Test Section */}
        <div className="mt-8 text-left bg-warm-100 p-4 rounded-lg space-y-3">
          <p className="font-bold text-calm-800 text-sm">AppContext State:</p>
          <div className="text-xs text-calm-700 space-y-2">
            <p>
              <strong>Goal:</strong> {app.goal?.instructions || '(not set)'}
            </p>
            <p>
              <strong>Onboarding Complete:</strong> {app.hasCompletedOnboarding ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Notifications:</strong> {app.preferences.notifications ? 'Enabled' : 'Disabled'}
            </p>
            <p>
              <strong>Default Tone:</strong> {app.preferences.defaultTone}
            </p>
            <p>
              <strong>Default Duration:</strong> {app.preferences.defaultDuration / 60} min
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <p className="font-semibold text-calm-800 text-xs">Test AppContext:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Enter new goal..."
                className="flex-1 px-3 py-2 text-sm border border-calm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-peach-500"
              />
              <button
                onClick={handleUpdateGoal}
                className="px-4 py-2 bg-peach-500 text-white text-sm rounded-lg hover:bg-peach-600 transition-colors"
              >
                Update Goal
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToggleNotifications}
                className="flex-1 px-4 py-2 bg-white border-2 border-peach-500 text-peach-500 text-sm rounded-lg hover:bg-peach-50 transition-colors"
              >
                Toggle Notifications
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="flex-1 px-4 py-2 bg-white border-2 border-peach-500 text-peach-500 text-sm rounded-lg hover:bg-peach-50 transition-colors"
                disabled={app.hasCompletedOnboarding}
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>

        {/* RitualContext Test Section */}
        <div className="mt-6 text-left bg-warm-100 p-4 rounded-lg space-y-3">
          <p className="font-bold text-calm-800 text-sm">RitualContext State:</p>
          <div className="text-xs text-calm-700 space-y-2">
            <p>
              <strong>Rituals in Library:</strong> {rituals.rituals.length}
            </p>
            <p>
              <strong>Templates Available:</strong> {rituals.templates.length}
            </p>
            <p>
              <strong>Generating:</strong> {rituals.isGenerating ? 'Yes' : 'No'}
            </p>
            {rituals.generationProgress && (
              <p>
                <strong>Progress:</strong> {rituals.generationProgress.progress}% -{' '}
                {rituals.generationProgress.message}
              </p>
            )}
            {rituals.clarifyingQuestion && (
              <p className="text-peach-600">
                <strong>Question:</strong> {rituals.clarifyingQuestion.questionText}
              </p>
            )}
          </div>

          <div className="max-h-32 overflow-y-auto border border-calm-200 rounded p-2 space-y-1">
            <p className="text-xs font-semibold text-calm-800 sticky top-0 bg-warm-100">
              Your Rituals:
            </p>
            {rituals.rituals.map((ritual) => (
              <p key={ritual.id} className="text-xs text-calm-700 pl-2">
                • {ritual.title} ({Math.floor(ritual.duration / 60)}min, {ritual.tone})
              </p>
            ))}
          </div>

          <div className="space-y-2 mt-4">
            <p className="font-semibold text-calm-800 text-xs">Test RitualContext:</p>
            <div className="flex gap-2">
              <button
                onClick={handleGenerateRitual}
                className="flex-1 px-4 py-2 bg-peach-500 text-white text-sm rounded-lg hover:bg-peach-600 transition-colors"
                disabled={rituals.isGenerating}
              >
                {rituals.isGenerating ? 'Generating...' : 'Generate Ritual'}
              </button>
              <button
                onClick={handleDeleteFirstRitual}
                className="flex-1 px-4 py-2 bg-white border-2 border-peach-500 text-peach-500 text-sm rounded-lg hover:bg-peach-50 transition-colors"
                disabled={rituals.rituals.length === 0}
              >
                Delete First Ritual
              </button>
            </div>
          </div>
        </div>

        {/* Custom Hooks Test Section */}
        <div className="mt-6 text-left bg-warm-100 p-4 rounded-lg space-y-3">
          <p className="font-bold text-calm-800 text-sm">Custom Hooks Status:</p>
          <div className="text-xs text-calm-700 space-y-2">
            <p>
              <strong>useLocalStorage:</strong> {testValue}
            </p>
            <p>
              <strong>useReducedMotion:</strong> {prefersReducedMotion ? 'Enabled' : 'Disabled'}
            </p>
            <p>
              <strong>useNotification:</strong> {notification.isSupported ? `Permission: ${notification.permission}` : 'Not supported'}
            </p>
            <p>
              <strong>useRitual:</strong> Available (toggle favorite, record usage, etc.)
            </p>
          </div>

          <div className="space-y-2 mt-4">
            <p className="font-semibold text-calm-800 text-xs">Test Custom Hooks:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestLocalStorage}
                className="px-3 py-2 bg-white border-2 border-peach-500 text-peach-500 text-xs rounded-lg hover:bg-peach-50 transition-colors"
              >
                Test useLocalStorage
              </button>
              <button
                onClick={handleTestNotification}
                className="px-3 py-2 bg-white border-2 border-peach-500 text-peach-500 text-xs rounded-lg hover:bg-peach-50 transition-colors"
              >
                Test useNotification
              </button>
              <button
                onClick={handleToggleFavorite}
                className="px-3 py-2 bg-white border-2 border-peach-500 text-peach-500 text-xs rounded-lg hover:bg-peach-50 transition-colors"
                disabled={rituals.rituals.length === 0}
              >
                Toggle First Favorite
              </button>
              <button
                onClick={() => alert(`Motion: ${prefersReducedMotion ? 'Reduced' : 'Full'}`)}
                className="px-3 py-2 bg-white border-2 border-peach-500 text-peach-500 text-xs rounded-lg hover:bg-peach-50 transition-colors"
              >
                Check Motion Pref
              </button>
            </div>
          </div>
        </div>

        {/* Architecture Info */}
        <div className="mt-6 text-xs text-calm-600 space-y-1">
          <p className="font-semibold text-calm-800">Architecture:</p>
          <p>✓ AppContext: Goal, preferences, onboarding state</p>
          <p>✓ RitualContext: Ritual library, generation, editing</p>
          <p>✓ Custom Hooks: localStorage, reduced motion, notification, ritual ops</p>
          <p>✓ Persistent storage via localStorage</p>
          <p>✓ Background task integration for generation</p>
          <p>✓ Type-safe context hooks (useApp, useRituals)</p>
          <p>✓ Available tones: {RITUAL_TONES.map((t) => t.label).join(', ')}</p>
        </div>
      </div>
    </div>
  )
}
