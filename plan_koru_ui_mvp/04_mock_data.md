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
- [ ] Import mocks: `rituals` and `quickStarts` arrays exist
- [ ] Each ritual has required fields (id, title, duration, sections)
- [ ] Sections array not empty for each ritual
- [ ] All rituals satisfy Ritual interface type
- [ ] Total duration matches sum of section durations
- [ ] Tags array contains valid tag names

**Manual Verification**:
- [ ] Import rituals in component → render title/duration correctly
- [ ] Check section guidance text → realistic, grammatically correct
- [ ] Quick starts: 6 distinct rituals with varying durations
- [ ] Tones vary across rituals (not all "gentle")
- [ ] Tags make sense for each ritual's instructions/purpose

**Expected**: Mock data realistic and complete, satisfies TypeScript interfaces, provides variety for testing UI components.

## Next Step
Proceed to **Step 05: Context Providers**
