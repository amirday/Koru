/**
 * FeedScreen - Main feed showing rituals in a unified vertical scroll
 * Features: Single flat list, sorted by usage/creation, sticky create button
 */

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, ScreenContainer } from '@/components/layout'
import { FeedRitualCard, StickyCreateButton } from '@/components/feed'
import { useRituals } from '@/contexts'
import type { Ritual } from '@/types'

/**
 * Sort rituals for the feed:
 * 1. User ritual with most recent lastUsedAt
 * 2. User ritual with most recent createdAt (skip if same as #1)
 * 3. All remaining rituals
 */
function sortFeedRituals(rituals: Ritual[], templates: Ritual[]): Ritual[] {
  const allRituals = [...templates, ...rituals]
  if (allRituals.length === 0) return []

  const result: Ritual[] = []
  const used = new Set<string>()

  // 1. User ritual with most recent lastUsedAt
  const userRituals = rituals.filter((r) => !r.isTemplate)
  const mostRecentlyUsed = userRituals
    .filter((r) => r.statistics?.lastUsedAt)
    .sort((a, b) => {
      const aTime = a.statistics?.lastUsedAt ?? ''
      const bTime = b.statistics?.lastUsedAt ?? ''
      return bTime.localeCompare(aTime)
    })[0]

  if (mostRecentlyUsed) {
    result.push(mostRecentlyUsed)
    used.add(mostRecentlyUsed.id)
  }

  // 2. User ritual with most recent createdAt (skip if same as #1)
  const mostRecentlyCreated = userRituals
    .filter((r) => !used.has(r.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  if (mostRecentlyCreated) {
    result.push(mostRecentlyCreated)
    used.add(mostRecentlyCreated.id)
  }

  // 3. All remaining rituals
  const remaining = allRituals.filter((r) => !used.has(r.id))
  result.push(...remaining)

  return result
}

/**
 * Feed screen with unified ritual list
 */
export function FeedScreen() {
  const navigate = useNavigate()
  const { rituals, templates, isLoading } = useRituals()

  const feedItems = useMemo(
    () => sortFeedRituals(rituals, templates),
    [rituals, templates]
  )

  /**
   * Handle ritual card click - navigate to generation screen
   */
  const handleRitualClick = (ritual: Ritual) => {
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

        {/* Unified ritual feed */}
        {!isLoading && feedItems.length > 0 && (
          <div className="space-y-3">
            {feedItems.map((ritual) => (
              <FeedRitualCard
                key={ritual.id}
                ritual={ritual}
                onClick={() => handleRitualClick(ritual)}
              />
            ))}
          </div>
        )}
      </ScreenContainer>

      {/* Sticky create button */}
      <StickyCreateButton onClick={handleCreateClick} />
    </>
  )
}
