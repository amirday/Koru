/**
 * WelcomeScreen - Temporary placeholder for onboarding welcome
 * Will be implemented in Step 10
 */

import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts'
import { Button, Card } from '@/components/ui'

/**
 * Temporary welcome screen for testing routing
 */
export function WelcomeScreen() {
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()

  const handleComplete = async () => {
    await completeOnboarding()
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <Card variant="elevated" className="max-w-md w-full">
        <Card.Body>
          <div className="text-center py-8 px-4">
            <h1 className="text-6xl font-serif font-bold text-peach-500 mb-4">
              Koru
            </h1>
            <p className="text-lg text-calm-700 mb-2">
              Meditation Rituals
            </p>
            <p className="text-sm text-calm-500 mb-8">
              Welcome! This is a temporary screen for testing routing.
            </p>
            <Button
              variant="primary"
              onClick={handleComplete}
              fullWidth
            >
              Complete Onboarding (Test)
            </Button>
            <p className="text-xs text-calm-400 mt-4">
              Full onboarding screens coming in Step 10
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
