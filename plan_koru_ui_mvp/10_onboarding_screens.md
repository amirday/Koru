# Step 10: Onboarding Screens

## Objective
Create the first-run experience (Welcome + Goal Setup).

## Files to Create

```
src/screens/Onboarding/
├── WelcomeScreen.tsx
└── InitialGoalSetupScreen.tsx
```

## WelcomeScreen

**Layout:**
- Full-height centered container
- Warm gradient background (warm-50 to gentle-yellow)
- Lora serif headline (text-4xl)
- Primary button CTA
- Secondary link below

**Content:**
- Headline: "Build a ritual you'll actually repeat."
- Subheading: "Goal-driven meditation that adapts to you."
- Primary CTA: "Start" (peach-500 bg, navigate to /setup)
- Secondary link: "I already have a ritual" (navigate to /home, skip onboarding)

## InitialGoalSetupScreen

**Layout:**
- ScreenContainer wrapper
- Progress indicator (step 1 of 1, or simple "Almost there...")
- Form sections with spacing

**Form Sections:**

### 1. Goal Input
- Prompt: "What do you want more of this month?"
- Multi-line textarea (auto-focus)
- Helper text: "Short is fine. Clarity beats poetry."
- Suggestion chips below:
  - Focus
  - Calm
  - Confidence
  - Gratitude
  - Better sleep
- Tapping chip populates goal with that text

### 2. Duration Preference
- Label: "How much time do you have?"
- Chip selector: 5 / 10 / 15 / 20 min
- Default: 10 min selected

### 3. Tone Preference
- Label: "What style feels right?"
- Chip selector with descriptions:
  - Gentle: "Soft, nurturing"
  - Neutral: "Clear, balanced"
  - Coach: "Direct, motivating"
- Default: Gentle selected

### 4. Submit
- Primary CTA: "Create my first ritual"
- Disabled if goal is empty

**Behavior:**
1. On submit:
   - Save goal to AppContext (updateGoal)
   - Save preferences to AppContext (updatePreferences)
   - Mark onboarding complete (completeOnboarding)
   - Start ritual generation in background (RitualContext)
   - Navigate to /home
2. Show loading state during submission
3. Validation: goal must have at least 3 characters

## Next Step

Proceed to **Step 11: Home Screen Components**
