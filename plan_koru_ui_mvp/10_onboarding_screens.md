# Step 10: Onboarding Screens

## Objective
Build the first-run experience (Welcome + Goal Setup) that guides new users through initial configuration.

## Why This Matters
Effective onboarding:
- **Sets expectations**: Clear value proposition
- **Captures intent**: Goal-driven approach from the start
- **Reduces friction**: Quick setup with smart defaults
- **Starts generation**: First ritual created during onboarding

---

## Key Tasks

### 10.1 Create Welcome Screen

**File**: `src/screens/Onboarding/WelcomeScreen.tsx`

**Layout**:
- Full-height centered container
- Warm gradient background (warm-50 → gentle-yellow)
- Vertical stack with spacing

**Content**:
- **Headline**: "Build a ritual you'll actually repeat."
- **Subheading**: "Goal-driven meditation that adapts to you."
- **Primary CTA**: "Start" button → navigate to /setup
- **Secondary action**: "I already have a ritual" link → skip to /home (marks onboarding complete)

**Styling**:
- Use Lora serif for headline (text-4xl)
- Inter sans for subheading
- Primary button uses peach-500 background
- Secondary link is text-only, calm-600 color

**Complete specifications**: See **UI_design.md §5.1 (Screen 0 - Onboarding)**

### 10.2 Create Goal Setup Screen

**File**: `src/screens/Onboarding/InitialGoalSetupScreen.tsx`

**Layout**:
- ScreenContainer wrapper
- Progress indicator: "Almost there..." or simple step counter
- Form sections with consistent spacing (gap-6)

**Form Sections**:

**1. Goal Input**:
- Prompt: "What do you want more of this month?"
- Multi-line textarea with auto-focus
- Helper text: "Short is fine. Clarity beats poetry."
- Suggestion chips below input:
  - "Focus", "Calm", "Confidence", "Gratitude", "Better sleep"
  - Tap chip → populates textarea with that word
- Min 3 characters validation

**2. Duration Preference**:
- Label: "How much time do you have?"
- Chip selector (single choice): 5 / 10 / 15 / 20 min
- Default: 10 min selected
- Use peach-500 for selected state

**3. Tone Preference**:
- Label: "What style feels right?"
- Chip selector with descriptions:
  - "Gentle" - Soft, nurturing
  - "Neutral" - Clear, balanced
  - "Coach" - Direct, motivating
- Default: Gentle selected

**4. Submit Button**:
- Text: "Create my first ritual"
- Primary button (peach-500)
- Disabled if goal is empty or < 3 characters
- Shows loading spinner during submission

**Behavior on Submit**:
1. Validate goal (min 3 characters)
2. Call `AppContext.updateGoal(goalText)`
3. Call `AppContext.updatePreferences({ defaultDuration, defaultTone })`
4. Call `AppContext.completeOnboarding()`
5. Call `RitualContext.startGeneration(options)` - starts in background
6. Navigate to `/home`
7. User sees generation progress on home screen

**Complete specifications**: See **UI_design.md §5.2** for full form details

---

## State Management

**Read from AppContext**:
- goal (if re-entering screen)
- preferences (to show defaults)

**Write to AppContext**:
- updateGoal
- updatePreferences
- completeOnboarding

**Trigger in RitualContext**:
- startGeneration (with goal, duration, tone from form)

---

## Files to Create

- `/Users/amirdaygmail.com/projects/Koru/src/screens/Onboarding/WelcomeScreen.tsx`
- `/Users/amirdaygmail.com/projects/Koru/src/screens/Onboarding/InitialGoalSetupScreen.tsx`

---

## Verification

After implementing onboarding:

- [ ] Navigate to http://localhost:5173 (with no onboarding state)
- [ ] See welcome screen with headline and CTA
- [ ] Click "Start" → navigate to goal setup
- [ ] Type goal text → see it update in textarea
- [ ] Goal < 3 chars → submit button disabled
- [ ] Click suggestion chip → goal populated
- [ ] Select duration chip → visual state changes
- [ ] Select tone chip → visual state changes
- [ ] Click submit → shows loading state
- [ ] After submit → navigates to /home
- [ ] See generation progress on home screen
- [ ] Refresh page → stays on /home (not back to welcome)
- [ ] localStorage has `koru:onboarding_complete = true`
- [ ] localStorage has `koru:goal` with submitted text

**Test skip onboarding**:
- On welcome screen, click "I already have a ritual"
- Should navigate to /home
- Should mark onboarding as complete

---

## Next Step

Proceed to **Step 11: Home Screen Components**
