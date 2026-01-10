/**
 * Test script to verify mock data integrity
 * Run with: tsx src/mocks/test-mocks.ts
 */

import { mockRituals } from './rituals'
import { quickStarts } from './quickStarts'
import type { Ritual } from '@/types'

console.log('🧪 Testing Mock Data...\n')

// Test helper
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`)
    throw new Error(message)
  }
  console.log(`✓ ${message}`)
}

// Test rituals
console.log('Testing mockRituals:')
assert(mockRituals.length >= 6, `Has at least 6 rituals (found ${mockRituals.length})`)
assert(mockRituals.length <= 8, `Has at most 8 rituals (found ${mockRituals.length})`)

mockRituals.forEach((ritual: Ritual) => {
  const name = ritual.title
  assert(!!ritual.id, `[${name}] Has id`)
  assert(!!ritual.title, `[${name}] Has title`)
  assert(!!ritual.instructions, `[${name}] Has instructions`)
  assert(ritual.duration > 0, `[${name}] Has duration > 0`)
  assert(['gentle', 'neutral', 'coach'].includes(ritual.tone), `[${name}] Has valid tone`)
  assert(ritual.sections.length >= 3, `[${name}] Has at least 3 sections (${ritual.sections.length})`)
  assert(ritual.sections.length <= 5, `[${name}] Has at most 5 sections (${ritual.sections.length})`)
  assert(ritual.tags.length > 0, `[${name}] Has tags`)
  assert(!!ritual.createdAt, `[${name}] Has createdAt timestamp`)
  assert(!!ritual.updatedAt, `[${name}] Has updatedAt timestamp`)

  // Verify total duration matches sum of sections
  const sectionSum = ritual.sections.reduce((sum, s) => sum + s.durationSeconds, 0)
  assert(
    Math.abs(sectionSum - ritual.duration) < 5,
    `[${name}] Total duration (${ritual.duration}s) matches sections sum (${sectionSum}s)`
  )

  // Check statistics structure
  if (ritual.statistics) {
    assert(!!ritual.statistics.id, `[${name}] Statistics has own id`)
    assert(ritual.statistics.ritualId === ritual.id, `[${name}] Statistics references correct ritual`)
    assert(typeof ritual.statistics.usageCount === 'number', `[${name}] Statistics has usageCount`)
  }
})

// Check tone variety
const tones = mockRituals.map(r => r.tone)
const uniqueTones = new Set(tones)
assert(uniqueTones.size >= 2, `Rituals have variety of tones (${uniqueTones.size} unique)`)

console.log('\nTesting quickStarts:')
assert(quickStarts.length === 6, `Has exactly 6 quick starts (found ${quickStarts.length})`)

quickStarts.forEach((qs: Ritual) => {
  const name = qs.title
  assert(!!qs.id, `[${name}] Has id`)
  assert(!!qs.title, `[${name}] Has title`)
  assert(qs.duration >= 180, `[${name}] Duration >= 3 minutes`)
  assert(qs.duration <= 1200, `[${name}] Duration <= 20 minutes`)
  assert(qs.sections.length > 0, `[${name}] Has sections`)
  assert(qs.isTemplate === true, `[${name}] Is marked as template`)
  assert(qs.statistics === null, `[${name}] Has no statistics (template)`)
})

// Verify specific quick starts exist
const quickStartTitles = quickStarts.map(qs => qs.title)
assert(quickStartTitles.includes('Reset'), 'Has "Reset" quick start')
assert(quickStartTitles.includes('Focus Primer'), 'Has "Focus Primer" quick start')
assert(quickStartTitles.includes('Wind-Down'), 'Has "Wind-Down" quick start')
assert(quickStartTitles.includes('Gratitude'), 'Has "Gratitude" quick start')
assert(quickStartTitles.includes('Confidence'), 'Has "Confidence" quick start')
assert(quickStartTitles.includes('Silent Timer'), 'Has "Silent Timer" quick start')

console.log('\n✅ All tests passed!')
console.log(`\nSummary:`)
console.log(`- ${mockRituals.length} full rituals`)
console.log(`- ${quickStarts.length} quick starts`)
console.log(`- ${mockRituals.reduce((sum, r) => sum + r.sections.length, 0)} total sections in rituals`)
console.log(`- Tone variety: ${Array.from(new Set(mockRituals.map(r => r.tone))).join(', ')}`)
