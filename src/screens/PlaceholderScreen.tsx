/**
 * PlaceholderScreen - Generic placeholder for unimplemented screens
 * Used during development to test navigation
 */

import { useNavigate } from 'react-router-dom'
import { ScreenContainer, Header } from '@/components/layout'
import { Button, Card } from '@/components/ui'

export interface PlaceholderScreenProps {
  /** Screen title */
  title: string
  /** Phase when this will be implemented */
  phase?: string
  /** Optional description */
  description?: string
}

/**
 * Placeholder screen for routes not yet implemented
 */
export function PlaceholderScreen({
  title,
  phase = '2',
  description,
}: PlaceholderScreenProps) {
  const navigate = useNavigate()

  return (
    <>
      <Header title={title} />
      <ScreenContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Card variant="elevated" className="max-w-md w-full">
            <Card.Body>
              <div className="py-8 px-4">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-serif font-bold text-calm-900 mb-3">
                  {title}
                </h2>
                <p className="text-calm-600 mb-2">
                  Coming in Phase {phase}
                </p>
                {description && (
                  <p className="text-sm text-calm-500 mb-6">
                    {description}
                  </p>
                )}
                <Button
                  variant="primary"
                  onClick={() => navigate('/home')}
                  className="mt-4"
                >
                  Back to Home
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </ScreenContainer>
    </>
  )
}
