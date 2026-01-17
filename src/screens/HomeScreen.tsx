/**
 * HomeScreen - Temporary placeholder for home screen
 * Will be implemented in Step 12
 */

import { ScreenContainer, Header } from '@/components/layout'
import { Card } from '@/components/ui'
import { useApp } from '@/contexts'

/**
 * Temporary home screen for testing routing
 */
export function HomeScreen() {
  const { goal } = useApp()

  return (
    <>
      <Header title="Home" />
      <ScreenContainer>
        <div className="space-y-6">
          <Card variant="elevated">
            <Card.Header>
              <h2 className="text-xl font-serif font-bold text-calm-900">
                Welcome to Koru
              </h2>
            </Card.Header>
            <Card.Body>
              <p className="text-calm-700 mb-4">
                This is a temporary home screen for testing routing.
              </p>
              {goal && (
                <p className="text-sm text-calm-600">
                  Your goal: <strong>{goal.instructions}</strong>
                </p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-semibold text-calm-800">Navigation Test</h3>
            </Card.Header>
            <Card.Body>
              <p className="text-sm text-calm-600 mb-4">
                Try clicking the bottom navigation tabs to test routing.
              </p>
              <div className="space-y-2 text-xs text-calm-500">
                <p>✓ Routing configured (Step 9)</p>
                <p>🚧 Full home screen coming in Step 12</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </ScreenContainer>
    </>
  )
}
