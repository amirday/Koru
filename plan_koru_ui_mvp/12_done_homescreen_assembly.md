# Step 12: HomeScreen Assembly

## Objective
Combine all Home screen components into a complete interface enabling goal management and ritual generation.

## Key Tasks

### 12.1 Create HomeScreen Component
**File**: `src/screens/Home/HomeScreen.tsx`

**Structure**: `ScreenContainer` wraps header (optional), `GoalBox`, quick starts section, generate section, conditionally render `GenerationProgress` (when `isGenerating`), conditionally render `ClarifyingQuestionModal` (when `clarifyingQuestion` exists).

**Reference**: UI_design.md §6 (Screen 1 - Home) for complete layout

### 12.2 Header (Optional for MVP)
Greeting: "Good [morning/afternoon/evening]", Streak: "[X] days" (future - Phase 4). Styling: Subtle, Inter sans, calm-600 color.

### 12.3 Goal Box Section
Render `GoalBox` component with `goal` from `AppContext`, pass `updateGoal` handler. Section spacing: mb-6 or mb-8.

### 12.4 Quick Starts Section
Section title "Quick Starts" (h2, Lora serif). Horizontal scrollable container with `QuickStartCard` for each ritual. Import from `@/mocks/quickStarts` (6 pre-made rituals). Gap-4 spacing. Responsive: mobile (horizontal scroll + snap), tablet (2-3 visible), desktop (flex wrap, show all). Tap handler: For MVP show toast "Session player coming soon", future navigate to `/session/:ritualId`.

### 12.5 Generate Section
Render `GenerateButton` with props: `onGenerate` (RitualContext.startGeneration), `isGenerating` (RitualContext state), `defaultDuration`/`defaultTone` (AppContext preferences). Conditionally render `GenerationProgress` when `isGenerating === true`, pass `progress` from RitualContext, `onDismiss` hides UI.

### 12.6 Clarifying Question Modal
Conditionally render when `clarifyingQuestion !== null`. Props: `question` (from RitualContext), `onAnswer` (RitualContext.answerClarifyingQuestion), `onCancel` (cancel generation, reset state).

## State Management

**AppContext**: Read `goal`, `preferences`; use `updateGoal` action

**RitualContext**: Read `isGenerating`, `generationProgress`, `clarifyingQuestion`; use `startGeneration`, `answerClarifyingQuestion` actions

**No local state needed** - all managed in contexts

## Event Handlers

**handleGenerateClick**: Gather options (goal, duration, tone, includeSilence), validate goal exists, call `startGeneration(options)`

**handleDismissProgress**: Hide progress UI, show toast "Working in background...", generation continues async

**handleAnswerQuestion**: Call `answerClarifyingQuestion(answer)`, modal closes when state clears

**handleQuickStartTap**: For MVP `toast.info("Session player coming in Phase 3")`

## Files to Create
- `src/screens/Home/HomeScreen.tsx`

**Depends on**: Components from Step 11, AppContext/RitualContext (Step 5), ScreenContainer (Step 8), Toast (Step 7)

## Test Plan

**Automated Tests**:
- [ ] HomeScreen renders without errors
- [ ] GoalBox receives correct props from AppContext
- [ ] GenerateButton receives correct props from both contexts
- [ ] Progress component conditionally renders based on isGenerating state
- [ ] Modal conditionally renders based on clarifyingQuestion state
- [ ] Quick starts map correctly (6 cards rendered)

**Manual Verification**:
- [ ] Navigate to /home after onboarding → see goal box with goal
- [ ] Click goal → edit mode, edit + blur → saves
- [ ] See 6 quick start cards, scroll horizontally (mobile)
- [ ] Click quick start → "coming soon" toast
- [ ] Generate button shows config (duration/tone dropdowns)
- [ ] Change duration/tone → updates immediately
- [ ] Click generate → progress appears, animates 0→100%
- [ ] Stage messages update ("Clarifying" → "Structuring" → "Writing" → "Complete")
- [ ] At 25%, clarifying modal appears (if enabled)
- [ ] Answer question → modal closes, generation continues
- [ ] Progress 100% → toast "Ritual created!"
- [ ] Click dismiss during progress → UI hides, generation continues
- [ ] Navigate to /rituals during generation → generation continues
- [ ] Notification appears when complete
- [ ] Try generate without goal → validation error
- [ ] Refresh during generation → acceptable behavior (MVP: state lost)

**Expected**: Complete Home screen works, all components integrate correctly, state flows through contexts, generation completes successfully with proper UI feedback.

## Next Step
Proceed to **Step 13: Generation Flow Implementation**
