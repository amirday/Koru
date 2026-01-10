import { AppProvider, RitualProvider } from '@/contexts'
import { ToastProvider } from '@/components/ui'
import { AppContent } from './AppContent'

function App() {
  return (
    <AppProvider>
      <RitualProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </RitualProvider>
    </AppProvider>
  )
}

export default App
