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
- [✓] AppContext: updateGoal saves to localStorage
- [✓] AppContext: updatePreferences merges with existing
- [✓] AppContext: completeOnboarding sets flag, persists
- [✓] RitualContext: startGeneration updates isGenerating state
- [✓] RitualContext: saveRitual adds to rituals array, persists
- [✓] RitualContext: deleteRitual removes from array, updates storage
- [✓] TypeScript compilation passes with no errors
- [✓] Production build succeeds (229 KB bundle)

**Manual Verification** (User to test):
- [ ] View app → see current goal and preferences displayed
- [ ] Enter new goal text → click "Update Goal" → see goal updated immediately
- [ ] Refresh page → goal persists with correct value
- [ ] Click "Toggle Notifications" → preference updates immediately
- [ ] Click "Complete Onboarding" → button disables, state updates
- [ ] Click "Generate Ritual" → see isGenerating become true, progress updates
- [ ] Open DevTools → Application → Local Storage → see 'koru:goal', 'koru:preferences', 'koru:rituals'
- [ ] Click "Delete First Ritual" → ritual count decreases, localStorage updates

**Expected**: Context state syncs with localStorage, actions trigger re-renders, persistence works across sessions.

## Implementation Summary

**Created Files**:
- `src/contexts/AppContext.tsx` - Application state provider
- `src/contexts/RitualContext.tsx` - Ritual management provider
- `src/contexts/index.ts` - Central exports
- `src/AppContent.tsx` - Test component using both contexts

**AppContext Features**:
- Manages goal (with instructions field), user preferences, onboarding state
- Loads initial state from localStorage on mount
- Updates persist immediately to localStorage with Timestamp
- Provides hooks: `useApp()` with type-safe access
- Default preferences loaded from constants

**RitualContext Features**:
- Manages ritual library (user rituals + templates)
- Integrates with AI service for generation
- Integrates with background task service for async generation
- Supports clarifying questions from AI
- Full CRUD operations: save, delete, duplicate rituals
- Persists rituals to localStorage
- Provides hook: `useRituals()` with type-safe access
- Loads mock rituals on first run as starting library

**Integration Points**:
- Uses `storageService` for persistence
- Uses `aiService` for ritual generation
- Uses `backgroundTaskService` for non-blocking generation
- All actions are async and properly handle errors
- Context updates trigger component re-renders automatically

## Next Step
Proceed to **Step 06: Custom Hooks**
