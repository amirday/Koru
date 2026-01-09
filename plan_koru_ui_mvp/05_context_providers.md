# Step 5: Context Providers

## Objective
Implement React Context for global state management.

## Files to Create

- `src/contexts/AppContext.tsx` - Goal, preferences, onboarding state
- `src/contexts/RitualContext.tsx` - Ritual generation, library, editing

## AppContext Structure

**State:**
- goal: Goal | null
- preferences: UserPreferences
- hasCompletedOnboarding: boolean
- bottomNavVisible: boolean

**Actions:**
- updateGoal(text: string)
- updatePreferences(prefs: Partial<UserPreferences>)
- completeOnboarding()
- setBottomNavVisible(visible: boolean)

**Persistence:**
- Load from localStorage on init
- Save to localStorage on every change

## RitualContext Structure

**State:**
- rituals: Ritual[]
- templates: Ritual[]
- isGenerating: boolean
- generationProgress: AIGenerationProgress | null
- clarifyingQuestion: AIClarifyingQuestion | null
- editingRitual: Ritual | null

**Actions:**
- startGeneration(options: AIGenerationOptions)
- answerClarifyingQuestion(answer: string)
- saveRitual(ritual: Ritual)
- deleteRitual(id: string)
- duplicateRitual(id: string)

**Integration:**
- Uses background-task-service for async generation
- Uses ai-service for ritual generation
- Uses storage-service for persistence

## Next Step

Proceed to **Step 6: Custom Hooks**
