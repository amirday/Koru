import { AppProvider, RitualProvider } from '@/contexts'
import { ToastProvider } from '@/components/ui'
import { Router } from '@/router'

function App() {
  return (
    <AppProvider>
      <RitualProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </RitualProvider>
    </AppProvider>
  )
}

export default App
