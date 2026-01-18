/**
 * SessionDetailScreen - Historical session detail view
 */

import { useParams, useNavigate } from 'react-router-dom'
import { ScreenContainer, Header } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { useRituals } from '@/contexts'
import { mockSessions } from '@/mocks/dashboardData'

/**
 * Format date to readable string
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format time to readable string
 */
function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format duration in seconds to human-readable
 */
function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  return `${minutes} min`
}

/**
 * SessionDetailScreen - View details of a past session
 */
export function SessionDetailScreen() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { getRitual } = useRituals()

  // Find session (mock)
  const session = mockSessions.find((s) => s.id === sessionId) || mockSessions[0]
  const ritual = session ? getRitual(session.ritualId) : null

  const handleRepeat = () => {
    if (session) {
      navigate(`/session/${session.ritualId}`)
    }
  }

  const handleCreateRitual = () => {
    navigate('/rituals/new')
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  if (!session) {
    return (
      <>
        <Header title="Session" onBack={handleBack} />
        <ScreenContainer>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-semibold text-calm-900 mb-2">
              Session not found
            </h2>
            <Button variant="primary" onClick={handleBack}>
              Back to Dashboard
            </Button>
          </div>
        </ScreenContainer>
      </>
    )
  }

  return (
    <>
      <Header title="Session Details" onBack={handleBack} />

      <ScreenContainer>
        <div className="space-y-6 pb-6">
          {/* Session info */}
          <Card variant="elevated">
            <Card.Body>
              <div className="space-y-4">
                {/* Date and time */}
                <div>
                  <p className="text-lg font-serif font-bold text-calm-900">
                    {formatDate(session.startedAt)}
                  </p>
                  <p className="text-sm text-calm-600">
                    {formatTime(session.startedAt)}
                  </p>
                </div>

                {/* Ritual info */}
                {ritual && (
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-calm-900">{ritual.title}</p>
                      <p className="text-sm text-calm-600">{formatDuration(ritual.duration)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      ritual.tone === 'gentle' ? 'bg-green-100 text-green-700' :
                      ritual.tone === 'coach' ? 'bg-peach-100 text-peach-700' :
                      'bg-calm-100 text-calm-700'
                    }`}>
                      {ritual.tone}
                    </span>
                  </div>
                )}

                {/* Session status */}
                <div className="flex items-center justify-between py-2 border-t border-calm-100">
                  <span className="text-sm text-calm-600">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-700' :
                    session.status === 'abandoned' ? 'bg-red-100 text-red-700' :
                    'bg-calm-100 text-calm-700'
                  }`}>
                    {session.status === 'completed' ? 'Completed' :
                     session.status === 'abandoned' ? 'Abandoned' : 'In Progress'}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between py-2 border-t border-calm-100">
                  <span className="text-sm text-calm-600">Duration</span>
                  <span className="text-sm font-medium text-calm-900">
                    {formatDuration(session.progressSeconds)}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Reflection (if exists) */}
          {session.reflection && (
            <Card variant="flat">
              <Card.Body>
                <h3 className="text-sm font-semibold text-calm-800 mb-3">Reflection</h3>

                {/* Rating */}
                {session.reflection.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-calm-600">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= session.reflection!.rating! ? 'text-peach-500' : 'text-calm-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {session.reflection.reflection && (
                  <p className="text-calm-700 text-sm leading-relaxed">
                    "{session.reflection.reflection}"
                  </p>
                )}
              </Card.Body>
            </Card>
          )}

          {/* No reflection */}
          {!session.reflection && (
            <div className="text-center py-6 text-calm-500">
              <p className="text-sm">No reflection recorded for this session</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              fullWidth
              onClick={handleRepeat}
            >
              Repeat This Ritual
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleCreateRitual}
            >
              Create Ritual From Session
            </Button>
          </div>
        </div>
      </ScreenContainer>
    </>
  )
}
