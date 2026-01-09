# Step 12: HomeScreen Assembly

## Objective
Combine all Home screen components into a complete, functional interface that enables goal management and ritual generation.

## Why This Matters
The Home screen is the primary MVP interface where users:
- See and edit their current goal
- Access quick-start rituals for immediate use
- Generate custom rituals based on their goal
- Experience the hybrid generation flow with progress and questions

---

## Key Tasks

### 12.1 Create HomeScreen Component

**File**: `src/screens/Home/HomeScreen.tsx`

**Overall Structure**:
```
<ScreenContainer>
  <Header /> (optional greeting + streak indicator)
  <GoalBox />
  <QuickStartsSection />
  <GenerateSection />
  {isGenerating && <GenerationProgress />}
  {clarifyingQuestion && <ClarifyingQuestionModal />}
</ScreenContainer>
```

**Layout details**: See **UI_design.md §6 (Screen 1 - Home)** for complete specification

### 12.2 Header Section (Optional)

**Content**:
- Greeting: "Good [morning/afternoon/evening], [Name]" (if name available)
- Streak indicator: "[X] day streak" (future - Phase 4)
- For MVP: Can be minimal or omitted

**Styling**:
- Subtle, doesn't draw attention
- Inter sans, small text
- Calm-600 color

### 12.3 Goal Box Section

**Implementation**:
- Render GoalBox component
- Pass goal from AppContext
- Pass updateGoal handler from AppContext
- Section spacing: mb-6 or mb-8

**Read from Context**:
```
const { state: { goal }, updateGoal } = useAppContext();
```

### 12.4 Quick Starts Section

**Layout**:
- Section title: "Quick Starts" (h2, Lora serif)
- Horizontal scrollable container
- Render QuickStartCard for each quick start ritual
- Spacing between cards: gap-4

**Data Source**:
- Import quick start rituals from `@/mocks/quickStarts`
- 6 pre-made rituals with varying durations and intents

**Interaction**:
- onTap handler: For MVP, show toast "Session player coming soon"
- Future (Phase 3): Navigate to `/session/:ritualId`

**Responsive**:
- Mobile: Horizontal scroll with snap
- Tablet: Show 2-3 cards, scroll rest
- Desktop: Flex wrap, show all 6 cards

### 12.5 Generate Section

**Layout**:
- Section title: "Generate" or omit (button is self-explanatory)
- GenerateButton component
- GenerationProgress component (conditional)

**Generate Button Props**:
- onGenerate: startGeneration from RitualContext
- isGenerating: from RitualContext state
- defaultDuration: from AppContext preferences
- defaultTone: from AppContext preferences

**Generation Progress** (Conditional Rendering):
- Show when `RitualContext.state.isGenerating === true`
- Pass progress from RitualContext.state.generationProgress
- onDismiss: Hide progress UI, generation continues in background

### 12.6 Clarifying Question Modal

**Conditional Rendering**:
- Show when `RitualContext.state.clarifyingQuestion !== null`
- Modal overlays entire screen

**Props**:
- question: RitualContext.state.clarifyingQuestion
- onAnswer: RitualContext.answerClarifyingQuestion
- onCancel: Cancel generation, reset state

---

## State Management Integration

**From AppContext**:
```typescript
const {
  state: { goal, preferences },
  updateGoal
} = useAppContext();
```

**From RitualContext**:
```typescript
const {
  state: { isGenerating, generationProgress, clarifyingQuestion },
  startGeneration,
  answerClarifyingQuestion
} = useRitualContext();
```

**No Local State** needed - all managed in contexts

---

## Event Handlers

### handleGenerateClick
- Gather options: goal, duration (from preferences or UI), tone, includeSilence
- Validate goal exists and is not empty
- Call `startGeneration(options)`
- Progress updates handled automatically by context

### handleDismissProgress
- Hide progress UI (local state or context flag)
- Show toast: "Working in background..."
- Generation continues asynchronously

### handleAnswerQuestion
- Pass answer to `answerClarifyingQuestion(answer)`
- Context handles continuation of generation
- Modal closes automatically when clarifyingQuestion becomes null

### handleQuickStartTap
- For MVP: `toast.info("Session player coming in Phase 3")`
- Future: Navigate to `/session/${ritual.id}`

---

## Files to Create/Modify

- `/Users/amirdaygmail.com/projects/Koru/src/screens/Home/HomeScreen.tsx` - Main screen component

**Depends on**:
- All components from Step 11
- AppContext from Step 5
- RitualContext from Step 5
- ScreenContainer from Step 8
- Toast component from Step 7

---

## Verification

Test complete Home screen functionality:

- [ ] Navigate to /home after completing onboarding
- [ ] See goal box with onboarding goal
- [ ] Click goal → edit mode works
- [ ] Edit and blur → goal saves
- [ ] See 6 quick start cards in carousel
- [ ] Scroll quick starts horizontally (mobile)
- [ ] Click quick start → see "coming soon" toast
- [ ] See generate button with configuration
- [ ] Change duration/tone → updates immediately
- [ ] Click generate → progress appears
- [ ] Progress bar animates 0% → 25% → 50% → 75% → 100%
- [ ] Messages update at each stage
- [ ] After 25%, clarifying question modal appears
- [ ] Answer question → modal closes, generation continues
- [ ] Progress reaches 100% → toast "Ritual created!"
- [ ] Click dismiss during progress → UI hides, generation continues
- [ ] Navigate to other tab → generation continues
- [ ] Notification appears when complete (if permission granted)
- [ ] Refresh page during generation → state persists (if designed to)

**Test error states**:
- [ ] Try to generate without goal → validation error
- [ ] Network error during generation → error toast with retry

---

## Next Step

Proceed to **Step 13: Generation Flow Implementation**
