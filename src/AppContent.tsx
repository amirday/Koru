import { useState } from 'react'
import { useApp, useRituals } from '@/contexts'
import { useLocalStorage, useReducedMotion, useNotification, useRitual } from '@/hooks'
import { Button, Card, Input, Slider, Toggle, Modal, useToast } from '@/components/ui'
import { ScreenContainer, BottomTabBar, Header } from '@/components/layout'
import { RITUAL_TONES, type TabRoute } from '@/types'

export function AppContent() {
  const app = useApp()
  const rituals = useRituals()
  const [newGoalText, setNewGoalText] = useState('')

  // Test custom hooks
  const [testValue, setTestValue] = useLocalStorage('test-value', 'default')
  const prefersReducedMotion = useReducedMotion()
  const notification = useNotification()
  const ritual = useRitual()

  // Test UI components
  const toast = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [sliderValue, setSliderValue] = useState(50)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(true)
  const [buttonLoading, setButtonLoading] = useState(false)

  // Test layout components
  const [activeTab, setActiveTab] = useState<TabRoute>('feed')
  const [showTabBar, setShowTabBar] = useState(true)
  const [showHeader, setShowHeader] = useState(false)

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

  // Test UI components
  const handleTestToasts = () => {
    toast.showToast('success', 'Success! This is a success toast.')
    setTimeout(() => toast.showToast('info', 'Info: This is an informational message.'), 500)
    setTimeout(() => toast.showToast('warning', 'Warning: This is a warning toast.'), 1000)
    setTimeout(() => toast.showToast('error', 'Error: This is an error toast.'), 1500)
  }

  const handleTestLoadingButton = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 2000)
  }

  if (app.isLoading || rituals.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <p className="text-calm-700 font-sans">Loading contexts...</p>
      </div>
    )
  }

  return (
    <>
      {/* Optional header */}
      {showHeader && (
        <Header
          title="Koru"
          onBack={() => alert('Back clicked')}
          actions={
            <button className="text-calm-700 hover:text-calm-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          }
        />
      )}

      {/* Screen container wraps all content */}
      <ScreenContainer showTabBarPadding={showTabBar}>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
            Koru
          </h1>
          <p className="text-lg text-calm-700 font-sans">
            Meditation Rituals
          </p>

          <div className="mt-8 px-6 py-3 bg-peach-500 text-white rounded-lg font-sans font-medium inline-block">
            Phase 8 Complete ✓ (Layout Components)
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

        {/* UI Components Test Section */}
        <div className="mt-6 text-left bg-warm-100 p-4 rounded-lg space-y-4">
          <p className="font-bold text-calm-800 text-sm">UI Components (Step 7):</p>

          {/* Button variants */}
          <Card variant="elevated">
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Button Component</h3>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary Small</Button>
                <Button variant="secondary" size="md">Secondary Medium</Button>
                <Button variant="ghost" size="lg">Ghost Large</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" loading={buttonLoading} onClick={handleTestLoadingButton}>
                  {buttonLoading ? 'Loading...' : 'Test Loading'}
                </Button>
                <Button variant="primary" icon={<span>🔥</span>}>With Icon</Button>
              </div>
            </Card.Body>
          </Card>

          {/* Input component */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Input Component</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Input
                  label="Text Input"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  helperText="This is helper text"
                />
                <Input
                  type="textarea"
                  label="Textarea (Auto-resize)"
                  placeholder="Type multiple lines..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  autoResize
                  maxRows={8}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Slider component */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Slider Component</h3>
            </Card.Header>
            <Card.Body>
              <Slider
                label="Duration"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(value) => setSliderValue(value)}
                showValue
                formatValue={(val) => `${val}%`}
              />
            </Card.Body>
          </Card>

          {/* Toggle components */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Toggle Component</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Toggle
                  variant="checkbox"
                  label="Checkbox Toggle"
                  checked={checkboxChecked}
                  onChange={(checked) => setCheckboxChecked(checked)}
                  helperText="This is a checkbox with helper text"
                />
                <Toggle
                  variant="switch"
                  label="Switch Toggle"
                  checked={switchChecked}
                  onChange={(checked) => setSwitchChecked(checked)}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Toast and Modal */}
          <Card variant="elevated">
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Toast & Modal</h3>
            </Card.Header>
            <Card.Body>
              <div className="flex gap-2">
                <Button variant="primary" onClick={handleTestToasts}>
                  Show Toasts (4 types)
                </Button>
                <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Test Modal"
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </>
            }
          >
            <p className="text-calm-700 text-sm">
              This modal has a backdrop blur, focus trap, Escape key handler, and close on outside click.
              Try pressing Tab to cycle through focusable elements, or Escape to close.
            </p>
          </Modal>
        </div>

        {/* Layout Components Test Section */}
        <div className="mt-6 text-left bg-warm-100 p-4 rounded-lg space-y-4">
          <p className="font-bold text-calm-800 text-sm">Layout Components (Step 8):</p>

          <Card variant="elevated">
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">ScreenContainer</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-xs text-calm-700 mb-3">
                Currently wrapping this entire test page. Features: safe area padding, max-width 640px centered, vertical scroll.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTabBar(!showTabBar)}
                >
                  {showTabBar ? 'Hide' : 'Show'} Tab Bar Padding
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">Header Component</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-xs text-calm-700 mb-3">
                Sticky header with back button, centered title (Lora serif), and actions slot.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHeader(!showHeader)}
              >
                {showHeader ? 'Hide' : 'Show'} Header
              </Button>
            </Card.Body>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <h3 className="font-semibold text-calm-800 text-sm">BottomTabBar</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-xs text-calm-700 mb-3">
                Fixed to bottom with 4 tabs. Active tab: <strong className="text-peach-500">{activeTab}</strong>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowTabBar(!showTabBar)}
                >
                  {showTabBar ? 'Hide' : 'Show'} Tab Bar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Architecture Info */}
        <div className="mt-6 text-xs text-calm-600 space-y-1">
          <p className="font-semibold text-calm-800">Architecture:</p>
          <p>✓ AppContext: Goal, preferences, onboarding state</p>
          <p>✓ RitualContext: Ritual library, generation, editing</p>
          <p>✓ Custom Hooks: localStorage, reduced motion, notification, ritual ops</p>
          <p>✓ UI Components: Button, Card, Input, Slider, Toggle, Toast, Modal</p>
          <p>✓ Layout Components: ScreenContainer, BottomTabBar, Header</p>
          <p>✓ Persistent storage via localStorage</p>
          <p>✓ Background task integration for generation</p>
          <p>✓ Type-safe context hooks (useApp, useRituals)</p>
          <p>✓ Available tones: {RITUAL_TONES.map((t) => t.label).join(', ')}</p>
        </div>
        </div>
      </ScreenContainer>

      {/* Bottom tab bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabClick={(tab) => {
          setActiveTab(tab)
          toast.showToast('info', `Navigating to ${tab}`)
        }}
        show={showTabBar}
      />
    </>
  )
}
