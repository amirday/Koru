import { RITUAL_TONES, DEFAULT_PREFERENCES, Timestamp } from '@/types'
import type { Goal, RitualContent, RitualStatistics, Ritual } from '@/types'

function App() {
  // Example: Create a Goal with Timestamp
  const exampleGoal: Goal = {
    id: 'example-1',
    instructions: 'Find more calm in daily life',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  // Example: RitualContent (includes creation metadata)
  const exampleContent: RitualContent = {
    id: 'ritual-1',
    title: 'Morning Calm',
    instructions: 'Start the day with centered awareness',
    duration: 600,
    tone: 'gentle',
    pace: 'medium',
    includeSilence: true,
    sections: [],
    tags: ['morning', 'calm'],
    isTemplate: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  // Example: RitualStatistics (completely separate with own ID)
  const exampleStats: RitualStatistics = {
    id: 'stats-1',
    ritualId: 'ritual-1',
    isFavorite: true,
    usageCount: 3,
    lastUsedAt: Timestamp.now(),
  }

  // Example: Full Ritual with both content and statistics
  const fullRitual: Ritual = {
    ...exampleContent,
    statistics: exampleStats,
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
          Koru
        </h1>
        <p className="text-lg text-calm-700 font-sans">
          Meditation Rituals
        </p>
        <div className="mt-8 px-6 py-3 bg-peach-500 text-white rounded-lg font-sans font-medium inline-block">
          Phase 2 Complete ✓ (Refactored Types)
        </div>
        <div className="mt-6 text-sm text-calm-600 space-y-2">
          <p>Default tone: {DEFAULT_PREFERENCES.defaultTone}</p>
          <p>Available tones: {RITUAL_TONES.map(t => t.label).join(', ')}</p>
          <div className="mt-4 pt-4 border-t border-calm-200">
            <p className="font-semibold text-calm-800">New Type Features:</p>
            <p>✓ Branded Timestamp type for type safety</p>
            <p>✓ Separated Ritual: Content + Statistics (separate IDs)</p>
            <p>✓ Separated Session: Data + Reflection (separate IDs)</p>
            <p>✓ Goal uses "instructions" field</p>
            <p>✓ Creation metadata stays with content</p>
            <p>✓ Usage statistics managed separately</p>
          </div>
          <div className="mt-4 pt-4 border-t border-calm-200 text-xs font-mono text-left bg-warm-100 p-3 rounded space-y-1">
            <p className="font-bold text-calm-800">Example Goal:</p>
            <p>→ instructions: "{exampleGoal.instructions}"</p>
            <p>→ created: {Timestamp.parse(exampleGoal.createdAt).toLocaleString()}</p>

            <p className="font-bold text-calm-800 mt-3">Example Ritual Content (id: {exampleContent.id}):</p>
            <p>→ title: "{exampleContent.title}"</p>
            <p>→ instructions: "{exampleContent.instructions}"</p>
            <p>→ duration: {exampleContent.duration}s</p>

            <p className="font-bold text-calm-800 mt-3">Example Statistics (id: {exampleStats.id}):</p>
            <p>→ ritualId: {exampleStats.ritualId}</p>
            <p>→ isFavorite: {exampleStats.isFavorite ? 'true' : 'false'}</p>
            <p>→ usageCount: {exampleStats.usageCount}</p>

            <p className="font-bold text-calm-800 mt-3">Full Ritual:</p>
            <p>→ content + statistics.usageCount: {fullRitual.statistics?.usageCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
