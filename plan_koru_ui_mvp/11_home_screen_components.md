# Step 11: Home Screen Components

## Objective
Build components for the Home screen.

## Files to Create

```
src/components/cards/
├── GoalBox.tsx
├── QuickStartCard.tsx
└── RitualCard.tsx

src/components/generation/
├── GenerateButton.tsx
├── GenerationProgress.tsx
└── ClarifyingQuestionModal.tsx
```

## GoalBox

**Props:**
- goal: Goal | null
- onUpdate: (text: string) => void

**Features:**
- Displays current goal text
- Edit mode on tap or pencil icon click
- Auto-save on blur
- Textarea auto-resize
- Empty state: "Tap to set your goal"
- Helper text: "Short is fine. Clarity beats poetry."
- Card styling with warm background

## QuickStartCard

**Props:**
- ritual: Ritual
- onTap: () => void (future: start session)

**Features:**
- Title + duration (e.g., "Reset – 3 min")
- Benefit text (e.g., "For anxious moments")
- Tag badge (colored pill)
- Hover effect (elevation increase)
- Horizontal scrollable in carousel

**Styling:**
- Warm card background
- Rounded corners
- Minimum width: 280px
- Shadow on hover

## GenerateButton

**Props:**
- onGenerate: (options: AIGenerationOptions) => void
- isGenerating: boolean

**Features:**
- Primary CTA: "Generate today's ritual"
- Configuration dropdowns (collapsed by default):
  - Duration: 5/10/15/20 min
  - Tone: Gentle/Neutral/Coach
  - Include silence toggle
- Disabled state when generating
- Loading spinner when generating

## GenerationProgress

**Props:**
- progress: AIGenerationProgress
- onDismiss: () => void

**Features:**
- Full-width card
- Progress bar (0-100%)
- Current stage message
- Animated message transitions (fade)
- "Work in background" button to dismiss
- Stage icons (optional)

## ClarifyingQuestionModal

**Props:**
- question: AIClarifyingQuestion
- onAnswer: (answer: string) => void
- onCancel: () => void

**Features:**
- Modal overlay
- Question text (Lora serif, large)
- Multiple choice: Radio buttons
- "Other (type your own)" option with textarea
- Submit button (primary)
- Cancel button (ghost)

## Next Step

Proceed to **Step 12: HomeScreen Assembly**
