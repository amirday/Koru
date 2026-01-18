/**
 * RitualLibraryScreen - Browse and manage ritual library
 * Features: Search, filter, ritual cards with actions
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRituals } from '@/contexts'
import { ScreenContainer, Header } from '@/components/layout'
import { SearchInput, useToast } from '@/components/ui'
import { RitualCard, RitualPreviewModal } from '@/components/rituals'
import type { Ritual, RitualTone } from '@/types'

type FilterTab = 'all' | 'saved' | 'recent' | 'templates'
type DurationFilter = 'any' | '5' | '10' | '15' | '20+'

/**
 * RitualLibraryScreen - Main ritual library view
 */
export function RitualLibraryScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const { rituals, templates, deleteRitual, duplicateRitual, isLoading } = useRituals()

  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('any')
  const [toneFilter, setToneFilter] = useState<RitualTone | 'any'>('any')
  const [previewRitual, setPreviewRitual] = useState<Ritual | null>(null)

  // Filter rituals based on search and filters
  const filteredRituals = useMemo(() => {
    let results: Ritual[] = []

    // Select base list based on tab
    switch (activeTab) {
      case 'all':
        results = [...rituals]
        break
      case 'saved':
        results = rituals.filter((r) => r.statistics?.isFavorite)
        break
      case 'recent':
        results = [...rituals]
          .filter((r) => r.statistics?.lastUsedAt)
          .sort((a, b) => {
            const aDate = a.statistics?.lastUsedAt || ''
            const bDate = b.statistics?.lastUsedAt || ''
            return bDate.localeCompare(aDate)
          })
          .slice(0, 10)
        break
      case 'templates':
        results = [...templates]
        break
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.instructions.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      )
    }

    // Apply duration filter
    if (durationFilter !== 'any') {
      const minutes = parseInt(durationFilter)
      results = results.filter((r) => {
        const ritualMinutes = Math.round(r.duration / 60)
        if (durationFilter === '20+') {
          return ritualMinutes >= 20
        }
        // Allow ±2 minute tolerance
        return Math.abs(ritualMinutes - minutes) <= 2
      })
    }

    // Apply tone filter
    if (toneFilter !== 'any') {
      results = results.filter((r) => r.tone === toneFilter)
    }

    return results
  }, [rituals, templates, activeTab, searchQuery, durationFilter, toneFilter])

  // Handlers
  const handleStart = (ritual: Ritual) => {
    navigate(`/session/${ritual.id}`)
  }

  const handleEdit = (ritual: Ritual) => {
    navigate(`/rituals/${ritual.id}/edit`)
  }

  const handleDuplicate = async (ritual: Ritual) => {
    try {
      const duplicated = await duplicateRitual(ritual.id)
      toast.showToast('success', `Created "${duplicated.title}"`)
    } catch (error) {
      console.error('Failed to duplicate ritual:', error)
      toast.showToast('error', 'Failed to duplicate ritual')
    }
  }

  const handleDelete = async (ritual: Ritual) => {
    try {
      await deleteRitual(ritual.id)
      toast.showToast('success', `Deleted "${ritual.title}"`)
    } catch (error) {
      console.error('Failed to delete ritual:', error)
      toast.showToast('error', 'Failed to delete ritual')
    }
  }

  const handleCardClick = (ritual: Ritual) => {
    setPreviewRitual(ritual)
  }

  const handleSaveAsNew = async (ritual: Ritual) => {
    try {
      const duplicated = await duplicateRitual(ritual.id)
      toast.showToast('success', `Created "${duplicated.title}"`)
      navigate(`/rituals/${duplicated.id}/edit`)
    } catch (error) {
      console.error('Failed to save as new:', error)
      toast.showToast('error', 'Failed to create copy')
    }
  }

  // Filter tabs
  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'saved', label: 'Saved' },
    { id: 'recent', label: 'Recent' },
    { id: 'templates', label: 'Templates' },
  ]

  return (
    <>
      <Header title="Rituals" />

      <ScreenContainer>
        <div className="space-y-4">
          {/* Search */}
          <SearchInput
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Search rituals..."
          />

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-peach-500 text-white'
                    : 'bg-warm-100 text-calm-700 hover:bg-warm-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Additional filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Duration filter */}
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as DurationFilter)}
              className="px-3 py-1.5 text-sm rounded-lg border border-calm-300 bg-white text-calm-700 focus:outline-none focus:ring-2 focus:ring-peach-500"
              aria-label="Filter by duration"
            >
              <option value="any">Any duration</option>
              <option value="5">~5 min</option>
              <option value="10">~10 min</option>
              <option value="15">~15 min</option>
              <option value="20+">20+ min</option>
            </select>

            {/* Tone filter */}
            <select
              value={toneFilter}
              onChange={(e) => setToneFilter(e.target.value as RitualTone | 'any')}
              className="px-3 py-1.5 text-sm rounded-lg border border-calm-300 bg-white text-calm-700 focus:outline-none focus:ring-2 focus:ring-peach-500"
              aria-label="Filter by tone"
            >
              <option value="any">Any tone</option>
              <option value="gentle">Gentle</option>
              <option value="neutral">Neutral</option>
              <option value="coach">Coach</option>
            </select>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-peach-500 border-t-transparent rounded-full" />
            </div>
          )}

          {/* Ritual list */}
          {!isLoading && (
            <div className="grid gap-4">
              {filteredRituals.length > 0 ? (
                filteredRituals.map((ritual) => (
                  <RitualCard
                    key={ritual.id}
                    ritual={ritual}
                    onStart={handleStart}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onCardClick={handleCardClick}
                  />
                ))
              ) : (
                /* Empty state */
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">
                    {searchQuery ? '🔍' : '📿'}
                  </div>
                  <h3 className="text-lg font-semibold text-calm-800 mb-2">
                    {searchQuery ? 'No rituals found' : 'No rituals yet'}
                  </h3>
                  <p className="text-calm-600">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'Generate your first ritual from the Home screen'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* Preview Modal */}
      <RitualPreviewModal
        ritual={previewRitual}
        onClose={() => setPreviewRitual(null)}
        onStart={handleStart}
        onEdit={handleEdit}
        onSaveAsNew={handleSaveAsNew}
      />
    </>
  )
}
