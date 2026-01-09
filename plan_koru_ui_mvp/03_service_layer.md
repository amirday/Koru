# Step 03: Service Layer

## Objective
Create abstraction layers for storage, AI, background tasks, and notifications.

## File Structure

```
src/services/
├── storage/
│   ├── StorageAdapter.interface.ts
│   ├── LocalStorageAdapter.ts
│   └── storage-service.ts
├── ai/
│   ├── AIProvider.interface.ts
│   ├── MockAIProvider.ts
│   └── ai-service.ts
├── background/
│   └── background-task-service.ts
└── notification/
    └── notification-service.ts
```

## Key Features

1. **Storage**: Key-value operations with JSON serialization, namespacing
2. **AI**: Pluggable provider pattern for easy swapping
3. **Background**: Non-blocking task execution with progress callbacks
4. **Notifications**: Browser permission management + fallback toasts

## Test Plan

**Automated Tests**:
- [ ] Storage: `set()` saves to localStorage, `get()` retrieves correctly
- [ ] Storage: JSON serialization/deserialization works for complex objects
- [ ] Storage: Keys use 'koru:' namespace prefix
- [ ] AI: MockAIProvider returns Ritual object matching interface
- [ ] AI: Progress callbacks fire at each stage (25%, 50%, 75%, 100%)
- [ ] Background: Task executes async without blocking
- [ ] Notification: Permission request called on first use

**Manual Verification**:
- [ ] Call `storageService.set('test', {data: 'value'})` → check localStorage in DevTools
- [ ] Call `aiService.generateRitual(options, onProgress)` → see progress logs in console
- [ ] Start background task → navigate away → task completes, notification shows
- [ ] Browser shows notification permission prompt (first time)

**Expected**: Services work independently, interfaces enable swapping implementations, storage persists correctly, AI mock simulates realistic delays.

## Next Step
Proceed to **Step 04: Mock Data**
