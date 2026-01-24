/**
 * FeedScreen - Main feed showing rituals in vertical scroll
 * Features: Templates + saved rituals, sticky create button
 */

import { useNavigate } from 'react-router-dom'
import { Header, ScreenContainer } from '@/components/layout'
import { FeedRitualCard, StickyCreateButton } from '@/components/feed'
import { useRituals } from '@/contexts'
import type { Ritual } from '@/types'

/**
 * Feed screen with vertical ritual list
 */
export function FeedScreen() {
  const navigate = useNavigate()
  const { rituals, templates, isLoading } = useRituals()

  // Combine templates and saved rituals for the feed
  // Templates first, then user's saved rituals
  const feedItems: Ritual[] = [...templates, ...rituals]

  /**
   * Handle ritual card click - navigate to generation screen
   * In the future, this could navigate directly to session for templates
   */
  const handleRitualClick = (ritual: Ritual) => {
    // Navigate to generation screen with ritual as template
    navigate('/generate', { state: { templateRitual: ritual } })
  }

  /**
   * Handle create button click
   */
  const handleCreateClick = () => {
    navigate('/generate')
  }

  return (
    <>
      <Header title="Feed" />
      <ScreenContainer className="pb-36">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-peach-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && feedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-calm-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-semibold text-calm-900 mb-2">
              No rituals yet
            </h2>
            <p className="text-calm-600 max-w-xs">
              Create your first personalized meditation ritual to get started.
            </p>
          </div>
        )}

        {/* Ritual feed */}
        {!isLoading && feedItems.length > 0 && (
          <div className="space-y-4">
            {/* Section: Discover */}
            {templates.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold text-calm-900 mb-3">
                  Discover
                </h2>
                <div className="space-y-3">
                  {templates.map((ritual) => (
                    <FeedRitualCard
                      key={ritual.id}
                      ritual={ritual}
                      onClick={() => handleRitualClick(ritual)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section: Your Rituals */}
            {rituals.length > 0 && (
              <section className={templates.length > 0 ? 'mt-8' : ''}>
                <h2 className="font-serif text-lg font-semibold text-calm-900 mb-3">
                  Your Rituals
                </h2>
                <div className="space-y-3">
                  {rituals.map((ritual) => (
                    <FeedRitualCard
                      key={ritual.id}
                      ritual={ritual}
                      onClick={() => handleRitualClick(ritual)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </ScreenContainer>

      {/* Sticky create button */}
      <StickyCreateButton onClick={handleCreateClick} />
    </>
  )
}
