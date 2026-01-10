import { AppProvider, RitualProvider } from '@/contexts'
import { AppContent } from './AppContent'

function App() {
  return (
    <AppProvider>
      <RitualProvider>
        <AppContent />
      </RitualProvider>
    </AppProvider>
  )
}

export default App
