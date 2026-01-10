import { useState } from 'react'
import { RITUAL_TONES, DEFAULT_PREFERENCES } from '@/types'
import { storageService, aiService, backgroundTaskService, notificationService } from '@/services'
import { mockRituals, quickStarts } from '@/mocks'

function App() {
  const [progress, setProgress] = useState(0)
  const [taskId, setTaskId] = useState<string | null>(null)

  // Test Storage Service
  const testStorage = async () => {
    console.log('🗄️ Testing Storage Service...')

    // Set a value
    await storageService.set('test-key', { message: 'Hello from storage!', timestamp: Date.now() })
    console.log('✓ Set test-key')

    // Get the value
    const value = await storageService.get<{ message: string; timestamp: number }>('test-key')
    console.log('✓ Get test-key:', value)

    // Get all keys
    const keys = await storageService.keys()
    console.log('✓ All koru keys:', keys)

    alert('Storage test complete! Check console for details.')
  }

  // Test AI Service
  const testAI = async () => {
    console.log('🤖 Testing AI Service...')
    setProgress(0)

    try {
      const ritual = await aiService.generateRitual(
        {
          instructions: 'Find more calm and focus in my daily work',
          duration: 5 * 60, // 5 minutes
          tone: 'gentle',
          includeSilence: true,
          soundscape: 'ocean',
        },
        (progressUpdate) => {
          console.log(`Progress: ${progressUpdate.progress}% - ${progressUpdate.message}`)
          setProgress(progressUpdate.progress)
        }
      )

      console.log('✓ Generated ritual:', ritual)
      alert(`Ritual generated: "${ritual.title}" with ${ritual.sections.length} sections!`)
    } catch (error) {
      console.error('✗ AI generation failed:', error)
      alert('AI generation failed. Check console.')
    }
  }

  // Test Background Task Service
  const testBackgroundTask = async () => {
    console.log('⏱️ Testing Background Task Service...')

    const id = await backgroundTaskService.run('test-task', async () => {
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('✓ Background task completed!')
      return { result: 'Task successful' }
    })

    setTaskId(id)
    console.log('✓ Task started with ID:', id)

    // Check status after 1 second
    setTimeout(async () => {
      const task = await backgroundTaskService.getTask(id)
      console.log('Task status after 1s:', task)
    }, 1000)

    // Check status after completion
    setTimeout(async () => {
      const task = await backgroundTaskService.getTask(id)
      console.log('Task status after 3s:', task)
      alert('Background task complete! Check console.')
    }, 3500)
  }

  // Test Notification Service
  const testNotification = async () => {
    console.log('🔔 Testing Notification Service...')

    const supported = notificationService.isSupported()
    console.log('✓ Notifications supported:', supported)

    const permission = notificationService.getPermission()
    console.log('✓ Current permission:', permission)

    const success = await notificationService.notify({
      title: 'Koru Test',
      body: 'Notification service is working! 🎉',
      icon: '/icon-192.png',
    })

    if (success) {
      console.log('✓ Notification shown')
    } else {
      console.log('✗ Notification blocked or not supported')
      alert('Notification blocked or not supported. Check console.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
          Koru
        </h1>
        <p className="text-lg text-calm-700 font-sans">
          Meditation Rituals
        </p>

        <div className="mt-8 px-6 py-3 bg-peach-500 text-white rounded-lg font-sans font-medium inline-block">
          Phase 4 Complete ✓ (Mock Data)
        </div>

        {/* Service Test Buttons */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-semibold text-calm-800 mb-4">Test Services (Check Console):</p>

          <button
            onClick={testStorage}
            className="w-full px-4 py-3 bg-white border-2 border-peach-500 text-peach-500 rounded-lg font-sans font-medium hover:bg-peach-50 transition-colors"
          >
            🗄️ Test Storage Service
          </button>

          <button
            onClick={testAI}
            className="w-full px-4 py-3 bg-white border-2 border-peach-500 text-peach-500 rounded-lg font-sans font-medium hover:bg-peach-50 transition-colors"
          >
            🤖 Test AI Service {progress > 0 && `(${progress}%)`}
          </button>

          <button
            onClick={testBackgroundTask}
            className="w-full px-4 py-3 bg-white border-2 border-peach-500 text-peach-500 rounded-lg font-sans font-medium hover:bg-peach-50 transition-colors"
          >
            ⏱️ Test Background Task Service
          </button>

          <button
            onClick={testNotification}
            className="w-full px-4 py-3 bg-white border-2 border-peach-500 text-peach-500 rounded-lg font-sans font-medium hover:bg-peach-50 transition-colors"
          >
            🔔 Test Notification Service
          </button>
        </div>

        {/* Service Info */}
        <div className="mt-8 text-xs text-left bg-warm-100 p-4 rounded-lg space-y-2 text-calm-700">
          <p className="font-bold text-calm-800">Services Available:</p>
          <p>✓ <strong>Storage:</strong> LocalStorageAdapter with namespace (koru:)</p>
          <p>✓ <strong>AI:</strong> MockAIProvider with progress callbacks</p>
          <p>✓ <strong>Background Tasks:</strong> Async task execution with status tracking</p>
          <p>✓ <strong>Notifications:</strong> Browser notifications with permission handling</p>
          {taskId && <p className="mt-3 text-peach-600">Last task ID: {taskId}</p>}
        </div>

        {/* Mock Data Info */}
        <div className="mt-8 text-left bg-warm-100 p-4 rounded-lg space-y-3">
          <p className="font-bold text-calm-800 text-sm">Mock Data Available:</p>

          <div className="space-y-2 text-xs text-calm-700">
            <div>
              <p className="font-semibold text-calm-800">Rituals ({mockRituals.length}):</p>
              <div className="pl-3 space-y-1 mt-1">
                {mockRituals.slice(0, 4).map(ritual => (
                  <p key={ritual.id}>
                    • <strong>{ritual.title}</strong> ({Math.floor(ritual.duration / 60)}min, {ritual.tone})
                    - {ritual.sections.length} sections, {ritual.tags.join(', ')}
                  </p>
                ))}
                {mockRituals.length > 4 && (
                  <p className="text-peach-600">+ {mockRituals.length - 4} more...</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-calm-200">
              <p className="font-semibold text-calm-800">Quick Starts ({quickStarts.length}):</p>
              <div className="pl-3 space-y-1 mt-1">
                {quickStarts.map(qs => (
                  <p key={qs.id}>
                    • <strong>{qs.title}</strong> ({Math.floor(qs.duration / 60)}min)
                    - {qs.tags.join(', ')}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Type System Info */}
        <div className="mt-6 text-xs text-calm-600 space-y-1">
          <p className="font-semibold text-calm-800">Architecture:</p>
          <p>✓ Pluggable services (easy to swap implementations)</p>
          <p>✓ Type-safe interfaces from @/types</p>
          <p>✓ Async/Promise-based APIs</p>
          <p>✓ Mock data with realistic content</p>
          <p>✓ Default tone: {DEFAULT_PREFERENCES.defaultTone}</p>
          <p>✓ Available tones: {RITUAL_TONES.map(t => t.label).join(', ')}</p>
        </div>
      </div>
    </div>
  )
}

export default App
