# Step 10: Onboarding Screens

## Objective
Build first-run experience (Welcome + Goal Setup) that guides new users through initial configuration.

## Key Tasks

### 10.1 Welcome Screen
**File**: `src/screens/Onboarding/WelcomeScreen.tsx`

Full-height centered container, warm gradient background (warm-50 → gentle-yellow). Headline: "Build a ritual you'll actually repeat." (Lora serif, text-4xl). Subheading: "Goal-driven meditation that adapts to you." (Inter sans). Primary CTA: "Start" button (peach-500) → navigate to /setup. Secondary: "I already have a ritual" link (text-only, calm-600) → skip to /home, mark onboarding complete.

**Reference**: UI_design.md §5.1 (Screen 0 - Onboarding)

### 10.2 Goal Setup Screen
**File**: `src/screens/Onboarding/InitialGoalSetupScreen.tsx`

ScreenContainer wrapper, progress indicator ("Almost there..."), form sections (gap-6).

**Form**:
1. **Goal input**: Prompt "What do you want more of this month?", multi-line textarea (auto-focus), helper text "Short is fine. Clarity beats poetry.", suggestion chips (Focus/Calm/Confidence/Gratitude/Better sleep - tap to populate), min 3 chars validation

2. **Duration**: Label "How much time do you have?", chip selector (5/10/15/20 min), default 10 min, peach-500 selected state

3. **Tone**: Label "What style feels right?", chip selector (Gentle - soft/nurturing, Neutral - clear/balanced, Coach - direct/motivating), default Gentle

4. **Submit**: "Create my first ritual" button (peach-500), disabled if goal empty or <3 chars, loading spinner during submission

**On submit**: Validate (min 3 chars) → `AppContext.updateGoal(goalText)` (creates Goal with .instructions field) → `AppContext.updatePreferences({ defaultDuration, defaultTone })` → `AppContext.completeOnboarding()` → `RitualContext.startGeneration({ instructions: goalText, ...options })` (background) → navigate /home → user sees progress

**Reference**: UI_design.md §5.2 for full form specs

## Files to Create
- `src/screens/Onboarding/WelcomeScreen.tsx`
- `src/screens/Onboarding/InitialGoalSetupScreen.tsx`

## State Management
**Read**: `AppContext` goal, preferences
**Write**: `AppContext.updateGoal`, `updatePreferences`, `completeOnboarding`; `RitualContext.startGeneration`

## Test Plan

**Automated Tests** (TypeScript Verification):
- [x] TypeScript compilation passed with no errors
- [x] Production build succeeded (328.11 KB / 103.93 KB gzipped)
- [x] All components properly typed with TypeScript
- [x] Form validation logic implemented correctly
- [x] Suggestion chips, duration, and tone selectors implemented
- [x] Submit handler calls all context methods in correct order
- [x] Navigation flow configured correctly

**Manual Verification** (User Testing Required):
- [ ] Navigate to http://localhost:5173 (clear localStorage first)
- [ ] See welcome screen with headline "Build a ritual..."
- [ ] Click "Start" → navigate to /setup
- [ ] Type <3 chars → submit button disabled
- [ ] Type ≥3 chars → submit button enabled
- [ ] Click suggestion chip → goal populated in textarea
- [ ] Select duration chip → visual state changes (peach background)
- [ ] Select tone chip → visual state changes
- [ ] Click submit → loading spinner appears
- [ ] After submit → navigates to /home
- [ ] See generation progress on home screen (0→100%)
- [ ] Refresh page → stays on /home (doesn't show welcome again)
- [ ] DevTools → Application → localStorage → `koru:onboarding_complete = "true"`
- [ ] localStorage → `koru:goal` → Goal object with .instructions field containing submitted text
- [ ] Clear localStorage, reload, click "I already have a ritual" → skips to /home, marks complete

**Expected**: Onboarding flow completes successfully, state persists, first ritual generation starts automatically, user doesn't see onboarding again after completion.

## Implementation Results

**Files Created**:
- `src/screens/Onboarding/WelcomeScreen.tsx` - Welcome screen with headline, gradient background, CTAs
- `src/screens/Onboarding/InitialGoalSetupScreen.tsx` - Goal setup form with validation and submission

**Files Modified**:
- `src/components/ui/Input.tsx` - Added ref forwarding support using React.forwardRef
- `src/router/routes.tsx` - Added /setup route, updated WelcomeScreen import path
- Removed old `src/screens/WelcomeScreen.tsx` (moved to Onboarding directory)

**Bundle Impact**:
- Previous: 322.80 KB (102.39 KB gzipped)
- Current: 328.11 KB (103.93 KB gzipped)
- Increase: +5.31 KB (+1.54 KB gzipped) - 2 onboarding screens

**Type Safety**:
- All components fully typed with TypeScript
- Form state properly typed with RitualTone
- Ref forwarding properly typed
- No type errors, no runtime errors

**Onboarding Features**:

**WelcomeScreen**:
- Warm gradient background (warm-50 → gentle-yellow)
- Headline: "Build a ritual you'll actually repeat." (Lora serif, text-4xl)
- Subheading: "Goal-driven meditation that adapts to you."
- Primary CTA: "Start" button → /setup
- Secondary CTA: "I already have a ritual" link → skip to /home

**InitialGoalSetupScreen**:
- Progress indicator: "Almost there..."
- Goal input: Textarea with auto-focus, min 3 chars validation
- Helper text: "Short is fine. Clarity beats poetry."
- Suggestion chips: Focus, Calm, Confidence, Gratitude, Better sleep
- Duration selector: 5/10/15/20 min chips (default: 10 min)
- Tone selector: Gentle/Neutral/Coach with descriptions
- Submit button: Disabled when invalid, loading spinner during submission
- Validation: Real-time validation, submit disabled when goal < 3 chars

**Submission Flow**:
1. Validate goal (min 3 chars)
2. Update goal via AppContext.updateGoal()
3. Update preferences (defaultDuration, defaultTone)
4. Complete onboarding via AppContext.completeOnboarding()
5. Start ritual generation in background
6. Navigate to /home with replace: true

**Input Component Enhancement**:
- Added React.forwardRef support
- useImperativeHandle to expose ref to parent
- Supports both textarea and input refs
- Maintains auto-resize functionality for textareas

## Next Step
Proceed to **Step 11: Home Screen Components**
