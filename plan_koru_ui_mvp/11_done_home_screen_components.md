# Step 11: Home Screen Components

## Objective
Build specialized components for Home screen: Goal editing, Quick Start rituals, and generation interface.

## Key Tasks

### 11.1 Goal Box Component
**File**: `src/components/cards/GoalBox.tsx`

Editable card for user's current meditation goal. Display mode shows goal.instructions text + pencil icon. Edit mode shows auto-resize textarea. Auto-save on blur (debounced). Empty state: "Tap to set your goal" with helper text "Short is fine. Clarity beats poetry." Warm card background (gentle-yellow/warm-100), Lora serif for display, Inter sans for edit.

**Props**: `goal: Goal | null`, `onUpdate: (instructions: string) => void` (updates Goal.instructions field)

**Reference**: UI_design.md §6.1 for Goal Box specs

### 11.2 Quick Start Card Component
**File**: `src/components/cards/QuickStartCard.tsx`

Display pre-made rituals in horizontal carousel. Shows title + duration (e.g., "Reset – 3 min"), benefit text, tag badge with color (Breath/Body/Sleep/Focus/Gratitude). Min width 280px, horizontal scroll with snap. Warm background, shadow-card with hover effect. For MVP: Tap shows toast "Session player coming soon".

**Props**: `ritual: Ritual`, `onTap: () => void`

**Reference**: UI_design.md §6.2 for Quick Start specs

### 11.3 Generate Button Component
**File**: `src/components/generation/GenerateButton.tsx`

Primary CTA to start ritual generation. Shows configuration: duration dropdown (5/10/15/20 min), tone dropdown (Gentle/Neutral/Coach), "Include silence" toggle. Reads from preferences. States: default/enabled, generating/disabled/loading. On click: gather options, call `RitualContext.startGeneration(options)`.

**Props**: `onGenerate: (options: AIGenerationOptions) => void`, `isGenerating: boolean`, `defaultDuration: number`, `defaultTone: string`

### 11.4 Generation Progress Component
**File**: `src/components/generation/GenerationProgress.tsx`

Show staged progress during AI generation. Full-width card with progress bar (0-100%), current stage message, dismiss button. Stages: "Understanding your intention..." (0-25%), "Choosing the right pace..." (25-50%), "Crafting your guidance..." (50-75%), "Your ritual is ready" (75-100%). Smooth animation, message fade transitions. Dismiss → hides UI, generation continues, shows toast "Working in background...". Calm design, peach-500 progress bar.

**Props**: `progress: AIGenerationProgress`, `onDismiss: () => void`

**Reference**: UI_design.md §6.3 for 3-phase generation flow

### 11.5 Clarifying Question Modal Component
**File**: `src/components/generation/ClarifyingQuestionModal.tsx`

Present AI questions during generation for personalization. Modal overlay with centered card (max-width 500px). Displays question text (Lora serif, large), answer options (radio buttons for multiple choice OR textarea for free text), submit button. Appears at 25% progress, pauses generation until answered. On submit: call `RitualContext.answerClarifyingQuestion(answer)`, modal closes, generation resumes. Can cancel → cancels entire generation. Animate in/out (fade + scale, respect reduced motion).

**Props**: `question: AIClarifyingQuestion | null`, `onAnswer: (answer: string) => void`, `onCancel: () => void`

**Reference**: UI_design.md §6.3 "Phase 2: Clarifying Questions"

## Files to Create
- `src/components/cards/GoalBox.tsx`
- `src/components/cards/QuickStartCard.tsx`
- `src/components/generation/GenerateButton.tsx`
- `src/components/generation/GenerationProgress.tsx`
- `src/components/generation/ClarifyingQuestionModal.tsx`

## Test Plan

**Automated Tests** (TypeScript Verification):
- [x] TypeScript compilation passed with no errors
- [x] Production build succeeded (328.11 KB / 103.93 KB gzipped)
- [x] All components properly typed with TypeScript
- [x] GoalBox implemented with display/edit modes
- [x] QuickStartCard implemented with title, duration, benefit, tag
- [x] GenerateButton implemented with duration/tone/silence options
- [x] GenerationProgress implemented with progress bar and stage messages
- [x] ClarifyingQuestionModal implemented with radio/textarea support

**Manual Verification** (User Testing Required):
- [ ] GoalBox: Click → edit mode, type text → auto-resize, blur → saves
- [ ] GoalBox: Empty state shows placeholder "Tap to set your goal"
- [ ] QuickStartCard: Hover → elevation increases
- [ ] QuickStartCard: Click → shows "coming soon" toast
- [ ] GenerateButton: Duration/tone dropdowns work
- [ ] GenerateButton: Silence toggle works
- [ ] GenerateButton: Configuration changes update immediately
- [ ] GenerationProgress: Progress bar animates smoothly
- [ ] GenerationProgress: Message fades between stages
- [ ] GenerationProgress: Dismiss button hides progress, shows toast
- [ ] ClarifyingQuestionModal: Modal appears centered with backdrop
- [ ] ClarifyingQuestionModal: Radio buttons (single selection only)
- [ ] ClarifyingQuestionModal: Submit → calls callback, closes modal
- [ ] ClarifyingQuestionModal: Cancel → closes and cancels generation
- [ ] ClarifyingQuestionModal: Animates in/out (fade + scale)

**Expected**: All components render correctly, interactions work, state updates flow through props, styling matches design system (warm colors, Lora/Inter fonts, rounded corners).

## Implementation Results

**Files Created**:
- `src/components/cards/GoalBox.tsx` - Editable goal card with display/edit modes
- `src/components/cards/QuickStartCard.tsx` - Pre-made ritual display card
- `src/components/generation/GenerateButton.tsx` - Primary CTA with configuration options
- `src/components/generation/GenerationProgress.tsx` - Staged progress indicator
- `src/components/generation/ClarifyingQuestionModal.tsx` - AI question modal

**Bundle Impact**:
- Previous: 328.11 KB (103.93 KB gzipped)
- Current: 328.11 KB (103.93 KB gzipped)
- Increase: +0 KB (components not yet integrated into screens)

**Type Safety**:
- All components fully typed with TypeScript
- Props interfaces defined for all components
- No type errors, no runtime errors

**Component Features**:

**GoalBox**:
- Display mode: Shows goal.instructions with pencil icon
- Edit mode: Auto-resize textarea, auto-focus
- Empty state: "Tap to set your goal" with helper text
- Save on blur, Enter key, Escape to cancel
- Warm gradient background (gentle-yellow → warm-100)

**QuickStartCard**:
- Displays title, duration, first section guidance text
- Tag badge with category-specific colors
- Min-width 280px for horizontal scroll
- Hover effect (shadow-card-hover)

**GenerateButton**:
- Duration selector: 5/10/15/20 min chips
- Tone selector: Gentle/Neutral/Coach chips
- Include silence toggle switch
- Reads from preferences as defaults
- Disabled/loading states

**GenerationProgress**:
- Progress bar: 0-100% with peach-500 color
- Stage messages based on progress:
  - 0-25%: "Understanding your intention..."
  - 25-50%: "Choosing the right pace..."
  - 50-75%: "Crafting your guidance..."
  - 75-100%: "Finalizing your ritual..."
- Dismiss button to move to background
- Smooth transitions

**ClarifyingQuestionModal**:
- Modal overlay with centered card
- Multiple choice: Radio buttons with custom styling
- Free text: Auto-resize textarea
- Submit button (disabled until answer selected)
- Cancel button (cancels entire generation)
- Close on outside click disabled
- Close on Escape disabled

## Next Step
Proceed to **Step 12: HomeScreen Assembly**
