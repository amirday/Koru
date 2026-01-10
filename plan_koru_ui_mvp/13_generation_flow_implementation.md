# Step 13: Generation Flow Implementation

## Objective
Implement end-to-end ritual generation in RitualContext with background execution, progress updates, clarifying questions, and notifications.

## Key Tasks

### 13.1 Implement startGeneration Action
**File**: `src/contexts/RitualContext.tsx`

**Core responsibilities**: Validate inputs (instructions, duration), generate task ID, update state (`isGenerating = true`), call background service, handle progress callbacks, handle clarifying questions, save ritual on completion, show notifications. Uses AIGenerationOptions with .instructions field.

**Integration points**:
- `backgroundTaskService.startTask()` - Async execution
- `aiService.generateRitual()` - AI provider
- `storageService.saveRitual()` - Persistence
- `notificationService.show()` - User feedback

**Progress flow**: Clarifying (25%) → Structuring (50%) → Writing (75%) → Complete (100%). At 25%, optionally show clarifying question modal, pause generation until answered.

**Error handling**: Network errors show toast with retry; validation errors show inline message; timeout (30s) shows warning.

**Reference**: UI_design.md §6.3 for 3-phase generation UX

### 13.2 Implement answerClarifyingQuestion Action
Clear `clarifyingQuestion` state, resolve paused Promise with answer, generation resumes from where it paused. Use ref to store resolve function when question appears.

### 13.3 Implement Notification Integration
Request browser notification permission on first generation. Show browser notification (if granted + user off-page): "Your ritual is ready!" with app icon. Always show in-app toast: "Ritual created: [title]" (5s duration).

### 13.4 Implement Background Execution
Generation runs async, doesn't block UI. User can navigate away, generation continues, progress persists in context. Optional: Show "Generating..." indicator in header when `isGenerating = true` and user not on /home.

### 13.5 Mock AI Provider
**File**: `src/services/ai/MockAIProvider.ts`

Simulate staged delays (~1.5s/stage), call `onProgress` callback at each stage, return pre-crafted ritual from mocks (vary by tone/duration). Total time: ~5-6s. `askClarifyingQuestion` returns sample question (e.g., "What time of day?") or null.

## Files to Modify
- `src/contexts/RitualContext.tsx` - Main implementation
- `src/services/ai/MockAIProvider.ts` - Mock generation
- `src/services/background/background-task-service.ts` - Async tasks
- `src/services/notification/notification-service.ts` - Notifications

## Test Plan

**Automated Tests**:
- [ ] Integration test: `startGeneration` updates state (`isGenerating = true`)
- [ ] Integration test: Progress callbacks fire at 25%, 50%, 75%, 100%
- [ ] Integration test: Clarifying question pauses, resumes on answer
- [ ] Mock test: AI service returns ritual after ~5s
- [ ] Unit test: `answerClarifyingQuestion` clears question state
- [ ] Unit test: Completed ritual saves to localStorage
- [ ] Unit test: Notification permission requested on first generation

**Manual Verification**:
- [ ] Click generate → progress bar animates 0→100%
- [ ] Stage messages update ("Clarifying..." → "Structuring..." → "Writing..." → "Complete")
- [ ] At 25%, clarifying question modal appears (if enabled)
- [ ] Answer question → modal closes, generation continues
- [ ] Navigate to /rituals tab during generation → background continues
- [ ] After ~5s, toast appears: "Ritual created: [title]"
- [ ] Browser notification appears (if permission granted, user off-page)
- [ ] Ritual appears in RitualContext.state.rituals
- [ ] Refresh page → ritual persisted in localStorage
- [ ] Click "Work in background" → progress UI hides, generation continues
- [ ] Try generate without instructions → validation error toast
- [ ] Simulate network error → retry option works

**Expected**: Background generation completes in ~5s, state updates reactively, progress shown, notifications appear, ritual saved and persisted.

## Next Step
Proceed to **Step 14: PWA Configuration**
