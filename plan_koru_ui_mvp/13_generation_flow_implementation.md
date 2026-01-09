# Step 13: Generation Flow Implementation

## Objective
Implement the complete end-to-end ritual generation flow in RitualContext with background execution, progress updates, clarifying questions, and notifications.

## Why This Matters
The generation flow is the core differentiator of Koru:
- **Non-blocking**: User can navigate away during generation
- **Interactive**: AI can ask clarifying questions mid-generation
- **Transparent**: Staged progress shows what's happening
- **Reliable**: Notifications ensure user knows when ritual is ready

---

## Key Tasks

### 13.1 Implement startGeneration Action

**In**: `src/contexts/RitualContext.tsx`

**Responsibilities**:
1. **Validate inputs**: Ensure goal exists, duration > 0
2. **Generate task ID**: Unique identifier for this generation
3. **Update state**: Set isGenerating = true
4. **Call background service**: Start async task
5. **Handle progress**: Update generationProgress state as callbacks arrive
6. **Handle questions**: Set clarifyingQuestion state if AI asks
7. **Handle completion**: Save ritual, show notification, update state

**Integration Points**:
- Use `backgroundTaskService.startTask()` for async execution
- Use `aiService.generateRitual()` for AI provider calls
- Use `storageService.saveRitual()` to persist result
- Use `notificationService.show()` to notify user

**Progress Callback**:
- Receives AIGenerationProgress objects (stage, message, progress %)
- Updates context state immediately
- UI reactively updates via state changes

**Clarifying Questions**:
- After "clarifying" stage (25% progress)
- Call `aiService.askClarifyingQuestion(context)`
- If question returned, set clarifyingQuestion state
- Pause generation (use Promise that resolves when answered)
- Store resolve function in ref to continue later

**Error Handling**:
- Network errors: Show error toast with retry option
- Validation errors: Show validation message
- Timeout (30s): Show warning with continue/cancel options

**See**: **UI_design.md §6.3** for complete 3-phase generation UX flow

### 13.2 Implement answerClarifyingQuestion Action

**Responsibilities**:
1. **Clear question**: Set clarifyingQuestion = null
2. **Continue generation**: Resolve paused Promise with answer
3. **Update state**: Generation continues from where it paused

**Implementation**:
- Store Promise resolve function in a ref when question appears
- When answer provided, call stored resolve function
- Generation resumes automatically

### 13.3 Implement Notification Integration

**Request Permission**:
- On first generation attempt, check notification permission
- If not granted and not denied, request permission
- Store permission state

**Show Notifications**:
- **Browser notification** (if permission granted and user not on page):
  - Title: "Koru"
  - Body: "Your ritual is ready!"
  - Icon: App icon
  - Tag: generation task ID
  - onClick: Navigate to /rituals/:id (future) or /home

- **In-app toast** (always shown):
  - Type: success
  - Message: "Ritual created: [ritual.title]"
  - Duration: 5000ms

### 13.4 Implement Background Execution

**Behavior**:
- Generation runs asynchronously (doesn't block UI thread)
- User can navigate to other tabs/screens
- Generation continues in background
- Progress stored in context (persists during navigation)
- Completion triggers notification

**Background Indicator** (Optional for MVP):
- Show small indicator in header or bottom tab bar
- Text: "Generating..." with spinner
- Only shows when isGenerating = true and user left /home

### 13.5 Handle State Persistence (Optional)

**For MVP**: Generation state is in-memory only
- If user refreshes page, generation is lost
- This is acceptable for MVP

**Future Enhancement**:
- Store generation state in localStorage
- Restore on page load
- Resume generation if incomplete

---

## State Flow Diagram

```
User clicks "Generate"
  ↓
Validate options
  ↓
Start background task
  ↓
Update state: isGenerating = true
  ↓
[Stage 1: Clarifying] progress = 25%
  ↓
AI asks question? → Show modal → Wait for answer → Continue
  ↓
[Stage 2: Structuring] progress = 50%
  ↓
[Stage 3: Writing] progress = 75%
  ↓
[Stage 4: Complete] progress = 100%
  ↓
Save ritual to storage
  ↓
Update state: isGenerating = false, new ritual added
  ↓
Show notifications (browser + toast)
  ↓
Done
```

---

## Mock AI Provider Integration

**File**: `src/services/ai/MockAIProvider.ts`

**generateRitual Implementation**:
- Simulate AI thinking with staged delays (~1.5s per stage)
- Call onProgress callback at each stage
- Return pre-crafted ritual from mocks based on options (tone, duration)
- Total generation time: ~5-6 seconds

**askClarifyingQuestion Implementation**:
- Return a sample question (e.g., "What time of day will you practice?")
- Options: "Morning", "Afternoon", "Evening", "Other"
- For MVP: Question is optional (can return null sometimes)

---

## Files to Modify

- `/Users/amirdaygmail.com/projects/Koru/src/contexts/RitualContext.tsx` - Main implementation
- `/Users/amirdaygmail.com/projects/Koru/src/services/ai/MockAIProvider.ts` - Mock generation logic
- `/Users/amirdaygmail.com/projects/Koru/src/services/background/background-task-service.ts` - Async task handling
- `/Users/amirdaygmail.com/projects/Koru/src/services/notification/notification-service.ts` - Notification logic

---

## Verification

Test complete generation flow:

**Basic Flow**:
- [ ] Click generate on home screen
- [ ] See progress: 0% → 25% → 50% → 75% → 100%
- [ ] Messages update at each stage
- [ ] After ~5 seconds, ritual completes
- [ ] Toast shows "Ritual created!"
- [ ] Ritual saved in RitualContext.state.rituals
- [ ] Ritual persisted to localStorage

**With Clarifying Question**:
- [ ] Start generation
- [ ] At 25%, modal appears with question
- [ ] Answer with radio button selection
- [ ] Submit answer
- [ ] Modal closes, generation continues
- [ ] Progress continues: 50% → 75% → 100%
- [ ] Ritual completes successfully

**Background Execution**:
- [ ] Start generation
- [ ] Navigate to /rituals tab
- [ ] Generation continues (check console logs or background indicator)
- [ ] After 5s, browser notification appears (if permission granted)
- [ ] Toast notification always appears
- [ ] Click notification → returns to /home or /rituals/:id

**Error Cases**:
- [ ] Try to generate without goal → validation error toast
- [ ] Simulate network error → error toast with retry
- [ ] Retry after error → works correctly

**User Can Dismiss**:
- [ ] Start generation
- [ ] Click "Work in background" button
- [ ] Progress UI hides
- [ ] Generation continues
- [ ] Toast shows "Working in background..."
- [ ] Notification appears when complete

---

## Next Step

Proceed to **Step 14: PWA Configuration**
