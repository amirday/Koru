function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
          Koru
        </h1>
        <p className="text-lg text-calm-700 font-sans">
          Meditation Rituals
        </p>
        <div className="mt-8 px-6 py-3 bg-peach-500 text-white rounded-lg font-sans font-medium inline-block">
          Setup Complete ✓
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <button className="px-4 py-2 bg-white border-2 border-calm-200 rounded-lg font-sans text-calm-900 hover:border-peach-500 transition-colors">
            Test Focus
          </button>
          <a href="#" className="px-4 py-2 bg-white border-2 border-calm-200 rounded-lg font-sans text-calm-900 hover:border-peach-500 transition-colors inline-block">
            Test Link
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
