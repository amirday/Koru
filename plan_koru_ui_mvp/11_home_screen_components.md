# Step 11: Home Screen Components

## Objective
Build specialized components for the Home screen: Goal editing, Quick Start rituals, and generation interface.

## Why This Matters
These components form the core MVP experience:
- **GoalBox**: Users' primary interaction point for their meditation intention
- **Quick Starts**: Immediate value without generation wait
- **Generation UI**: The unique hybrid generation flow with progress and questions

---

## Key Tasks

### 11.1 Goal Box Component

**File**: `src/components/cards/GoalBox.tsx`

**Purpose**: Editable card displaying user's current goal

**Features**:
- Display mode: Shows goal text with pencil icon
- Edit mode: Textarea with auto-resize
- Auto-save on blur (debounced)
- Empty state: "Tap to set your goal" (if no goal)
- Helper text below: "Short is fine. Clarity beats poetry."

**Interaction**:
- Tap anywhere on card or pencil icon → enter edit mode
- Focus textarea
- On blur → save to AppContext.updateGoal
- Show subtle save indicator (fade-in/out)

**Styling**:
- Warm card background (gentle-yellow or warm-100)
- Lora serif for goal text when not editing
- Inter sans for edit textarea
- Card styling with shadow-card

**See**: **UI_design.md §6.1** for Goal Box specifications

### 11.2 Quick Start Card Component

**File**: `src/components/cards/QuickStartCard.tsx`

**Purpose**: Display pre-made rituals in horizontal carousel

**Content**:
- Title + duration (e.g., "Reset – 3 min")
- Benefit text (e.g., "For anxious moments")
- Tag badge with color (Breath/Body/Sleep/Focus/Gratitude)
- Card styling with rounded corners

**Interaction**:
- Tap → (Future Phase 3: start session)
- For MVP: Show toast "Session player coming soon"
- Hover effect: subtle elevation increase

**Layout**:
- Minimum width: 280px
- Horizontal scroll with snap points
- First card has left margin, last has right margin

**Styling**:
- Warm background (warm-50)
- shadow-card with shadow-card-hover on hover
- Tag badge with appropriate color per category

**See**: **UI_design.md §6.2** for Quick Start specifications

### 11.3 Generate Button Component

**File**: `src/components/generation/GenerateButton.tsx`

**Purpose**: Primary CTA to start ritual generation with optional configuration

**Layout**:
- Primary button: "Generate today's ritual"
- Configuration section (collapsible or always visible):
  - Duration dropdown (5/10/15/20 min) - reads from preferences
  - Tone dropdown (Gentle/Neutral/Coach) - reads from preferences
  - "Include silence" toggle
  - Future: Soundscape selector (auto + override)

**States**:
- Default: Enabled, shows configuration
- Generating: Disabled, shows loading spinner
- Configuration changes: Update immediately (no apply button)

**Behavior**:
- On click: Gather options (goal, duration, tone, silence)
- Call RitualContext.startGeneration(options)
- Button becomes disabled during generation

### 11.4 Generation Progress Component

**File**: `src/components/generation/GenerationProgress.tsx`

**Purpose**: Show staged progress while AI generates ritual

**Layout**:
- Full-width card below generate button
- Progress bar (0-100%)
- Current stage message
- Dismiss/"Work in background" button

**Progress Stages**:
1. "Understanding your intention..." (0-25%)
2. "Choosing the right pace..." (25-50%)
3. "Crafting your guidance..." (50-75%)
4. "Your ritual is ready" (75-100%)

**Features**:
- Smooth progress bar animation
- Message fades in/out between stages
- Dismiss button → hides progress UI, generation continues
- On dismiss → show toast "Working in background..."

**Styling**:
- Calm, minimal design
- Peach-500 progress bar
- Inter sans for messages

**See**: **UI_design.md §6.3** for generation flow details (3-phase approach)

### 11.5 Clarifying Question Modal Component

**File**: `src/components/generation/ClarifyingQuestionModal.tsx`

**Purpose**: Present AI questions during generation for personalization

**Layout**:
- Modal overlay with backdrop
- Centered card (max-width 500px)
- Question text (Lora serif, large)
- Answer options
- Submit button

**Question Types**:

**Multiple Choice**:
- Radio buttons with clear labels
- "Other (type your own)" option with text input
- Only one selection allowed

**Free Text**:
- Multi-line textarea
- No character limit
- Auto-focus

**Behavior**:
- Modal appears during "clarifying" stage (after 25% progress)
- Generation pauses until answered
- On submit → call RitualContext.answerClarifyingQuestion(answer)
- Modal closes, generation continues from where it paused
- Can cancel → cancels entire generation

**Styling**:
- Modal backdrop: semi-transparent calm-900
- Card: warm-50 background, rounded corners
- Animate in/out (fade + scale, respect reduced motion)

**See**: **UI_design.md §6.3** "Phase 2: Clarifying Questions" for UX details

---

## Component Props

**GoalBox**:
- goal: Goal | null
- onUpdate: (text: string) => void

**QuickStartCard**:
- ritual: Ritual
- onTap: () => void

**GenerateButton**:
- onGenerate: (options: AIGenerationOptions) => void
- isGenerating: boolean
- defaultDuration: number
- defaultTone: string

**GenerationProgress**:
- progress: AIGenerationProgress
- on Dismiss: () => void

**ClarifyingQuestionModal**:
- question: AIClarifyingQuestion | null
- onAnswer: (answer: string) => void
- onCancel: () => void

---

## Files to Create

- `/Users/amirdaygmail.com/projects/Koru/src/components/cards/GoalBox.tsx`
- `/Users/amirdaygmail.com/projects/Koru/src/components/cards/QuickStartCard.tsx`
- `/Users/amirdaygmail.com/projects/Koru/src/components/generation/GenerateButton.tsx`
- `/Users/amirdaygmail.com/projects/Koru/src/components/generation/GenerationProgress.tsx`
- `/Users/amirdaygmail.com/projects/Koru/src/components/generation/ClarifyingQuestionModal.tsx`

---

## Verification

Test each component in isolation:

**GoalBox**:
- [ ] Shows current goal from context
- [ ] Click → enters edit mode
- [ ] Type text → updates in real-time
- [ ] Blur → saves to context
- [ ] Empty state shows placeholder

**QuickStartCard**:
- [ ] Displays title, duration, benefit, tag
- [ ] Hover → elevation increases
- [ ] Click → shows "coming soon" toast

**GenerateButton**:
- [ ] Shows configuration options
- [ ] Duration dropdown works
- [ ] Tone dropdown works
- [ ] Silence toggle works
- [ ] Click → calls startGeneration
- [ ] Disabled during generation

**GenerationProgress**:
- [ ] Shows correct progress percentage
- [ ] Message updates at stage boundaries
- [ ] Dismiss button hides progress
- [ ] Toast shows on dismiss

**ClarifyingQuestionModal**:
- [ ] Modal appears centered
- [ ] Question text readable
- [ ] Radio buttons work (single selection)
- [ ] "Other" option shows text input
- [ ] Submit → calls callback
- [ ] Cancel → closes and cancels generation

---

## Next Step

Proceed to **Step 12: HomeScreen Assembly**
