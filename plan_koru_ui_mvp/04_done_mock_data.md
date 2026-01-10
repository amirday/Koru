# Step 04: Mock Data

## Objective
Create realistic mock data for rituals and quick starts.

## Files to Create
- `src/mocks/rituals.ts` - 6-8 complete rituals
- `src/mocks/quickStarts.ts` - 6 quick start rituals

## Requirements

Each ritual: Complete metadata (title, instructions, duration, tone, pace), 3-5 sections with guidance text, realistic durations (5-20 min), various tones (gentle/neutral/coach), tags (Focus/Calm/Confidence/Gratitude/Sleep/Breath/Body), separated content and metadata (RitualContent + RitualMetadata)

**Example Quick Starts**:
1. **Reset** (3 min) - "For anxious moments" - Breath
2. **Focus Primer** (5 min) - "Before deep work" - Focus
3. **Wind-Down** (10 min) - "End your day" - Sleep
4. **Gratitude** (7 min) - "Shift perspective" - Gratitude
5. **Confidence** (8 min) - "Before challenges" - Confidence
6. **Silent Timer** (5-20 min) - "Pure silence" - Meditation

## Test Plan

**Automated Tests**:
- [✓] Import mocks: `rituals` and `quickStarts` arrays exist
- [✓] Each ritual has required fields (id, title, duration, sections)
- [✓] Sections array not empty for each ritual (3-5 sections each)
- [✓] All rituals satisfy Ritual interface type
- [✓] Total duration matches sum of section durations (±5s tolerance)
- [✓] Tags array contains valid tag names
- [✓] Statistics properly separated with own IDs (for non-templates)
- [✓] Quick starts marked as templates with null statistics
- [✓] TypeScript compilation passes
- [✓] Production build succeeds (225 KB bundle)

**Manual Verification** (User to test):
- [ ] View App in browser → see "Mock Data Available" section listing rituals and quick starts
- [ ] Check ritual titles display correctly (Morning Calm, Deep Focus, etc.)
- [ ] Verify durations shown (3-20 min range)
- [ ] Verify tone variety (gentle, neutral, coach)
- [ ] Open DevTools console → check section guidance text is realistic and grammatically correct
- [ ] Verify 6 quick starts appear: Reset, Focus Primer, Wind-Down, Gratitude, Confidence, Silent Timer

**Expected**: Mock data realistic and complete, satisfies TypeScript interfaces, provides variety for testing UI components.

## Implementation Summary

**Created Files**:
- `src/mocks/rituals.ts` - 8 complete rituals (5-20 min, varied tones/tags)
- `src/mocks/quickStarts.ts` - 6 quick start rituals (3-10 min)
- `src/mocks/index.ts` - Central exports
- `src/mocks/test-mocks.ts` - Automated test script

**Mock Rituals (8)**:
1. **Morning Calm** (10min, gentle) - Start day with presence
2. **Deep Focus** (15min, coach) - Clear mental clutter
3. **Evening Release** (12min, gentle) - Let go and prepare for sleep
4. **Grateful Heart** (8min, neutral) - Cultivate appreciation
5. **Inner Strength** (10min, coach) - Build confidence before challenges
6. **Midday Reset** (5min, neutral) - Quick energy reset
7. **Body Awareness** (20min, gentle) - Deep body scan
8. **Breath Foundation** (7min, neutral) - Simple breath focus

**Quick Starts (6)**:
1. **Reset** (3min) - For anxious moments
2. **Focus Primer** (5min) - Before deep work
3. **Wind-Down** (10min) - End your day
4. **Gratitude** (7min) - Shift perspective
5. **Confidence** (8min) - Before challenges
6. **Silent Timer** (10min) - Pure silence

**Data Quality**:
- All rituals have 3-5 sections with realistic guidance text
- Durations range from 3-20 minutes
- Tone variety: gentle (4), neutral (3), coach (2)
- 29 total sections across all rituals
- Tags include: calm, focus, sleep, gratitude, confidence, breath, body
- Content separated from statistics (content has createdAt/updatedAt, statistics have own IDs)

## Next Step
Proceed to **Step 05: Context Providers**
