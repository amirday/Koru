# Step 05: Context Providers

## Objective
Implement React Context for global state management.

## Files to Create
- `src/contexts/AppContext.tsx` - User goal/instructions, preferences, onboarding state
- `src/contexts/RitualContext.tsx` - Ritual generation, library, editing

## AppContext Structure
**State**: goal (Goal | null), preferences (UserPreferences), hasCompletedOnboarding (boolean), bottomNavVisible (boolean)
**Actions**: updateGoal(instructions), updatePreferences(prefs), completeOnboarding(), setBottomNavVisible(visible)
**Persistence**: Load from localStorage on init using STORAGE_KEYS, save on every change with Timestamp updates

## RitualContext Structure
**State**: rituals (Ritual[]), templates (Ritual[]), isGenerating (boolean), generationProgress (AIGenerationProgress | null), clarifyingQuestion (AIClarifyingQuestion | null), editingRitual (Ritual | null)
**Actions**: startGeneration(options), answerClarifyingQuestion(answer), saveRitual(ritual), deleteRitual(id), duplicateRitual(id)
**Integration**: Uses background-task-service, ai-service, storage-service

## Test Plan

**Automated Tests**:
- [ ] AppContext: updateGoal saves to localStorage
- [ ] AppContext: updatePreferences merges with existing
- [ ] AppContext: completeOnboarding sets flag, persists
- [ ] RitualContext: startGeneration updates isGenerating state
- [ ] RitualContext: saveRitual adds to rituals array, persists
- [ ] RitualContext: deleteRitual removes from array, updates storage

**Manual Verification**:
- [ ] Use AppContext in component → read goal.instructions value
- [ ] Call updateGoal('new instructions') → localStorage updated immediately with Timestamp
- [ ] Refresh page → goal persists with correct instructions field
- [ ] Start generation → isGenerating becomes true
- [ ] Generation completes → ritual added to rituals array
- [ ] Check DevTools localStorage → see 'koru:*' keys

**Expected**: Context state syncs with localStorage, actions trigger re-renders, persistence works across sessions.

## Next Step
Proceed to **Step 06: Custom Hooks**
