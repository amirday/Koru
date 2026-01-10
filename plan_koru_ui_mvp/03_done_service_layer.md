# Step 03: Service Layer

## Objective
Create abstraction layers for storage, AI, background tasks, and notifications.

## File Structure

```
src/services/
├── storage/
│   ├── LocalStorageAdapter.ts
│   └── storage-service.ts
├── ai/
│   ├── MockAIProvider.ts
│   └── ai-service.ts
├── background/
│   └── background-task-service.ts
├── notification/
│   └── notification-service.ts
└── index.ts (central exports)
```

Note: Interfaces defined in `src/types/services.ts` (completed in Step 02)

## Key Features

1. **Storage**: Key-value operations with JSON serialization, namespacing
2. **AI**: Pluggable provider pattern for easy swapping
3. **Background**: Non-blocking task execution with progress callbacks
4. **Notifications**: Browser permission management + fallback toasts

## Test Plan

**Automated Tests**:
- [✓] Storage: `set()` saves to localStorage, `get()` retrieves correctly
- [✓] Storage: JSON serialization/deserialization works for complex objects
- [✓] Storage: Keys use 'koru:' namespace prefix
- [✓] AI: MockAIProvider returns Ritual object matching interface
- [✓] AI: Progress callbacks fire at each stage (25%, 50%, 75%, 100%)
- [✓] Background: Task executes async without blocking
- [✓] Notification: Permission request called on first use
- [✓] TypeScript compilation passes with no errors
- [✓] Production build succeeds (206 KB bundle)

**Manual Verification** (User to test):
- [ ] Click "Test Storage Service" → check localStorage in DevTools → see 'koru:test-key'
- [ ] Click "Test AI Service" → see progress 0→25→50→75→100% → ritual generated with sections
- [ ] Click "Test Background Task" → wait 3s → alert shows "Background task complete"
- [ ] Click "Test Notification Service" → browser shows permission prompt → notification appears

**Expected**: Services work independently, interfaces enable swapping implementations, storage persists correctly, AI mock simulates realistic delays.

## Implementation Details

### LocalStorageAdapter
- Implements `StorageAdapter` interface from `@/types`
- Automatically prefixes all keys with 'koru:' namespace
- Handles JSON serialization/deserialization
- Async API over synchronous localStorage

### MockAIProvider
- Implements `AIProvider` interface from `@/types`
- Simulates realistic delays (1-3s per stage)
- Reports progress through 4 stages: clarifying, structuring, writing, complete
- Generates realistic ritual content with sections
- Creates Ritual objects with separate statistics entities
- 30% chance of returning clarifying questions (for future flows)

### BackgroundTaskService
- Implements `BackgroundTaskManager` interface
- Tracks tasks in-memory with unique IDs
- Supports cancellation via AbortController
- Updates task status: pending → running → completed/failed
- Includes utility method to clear old tasks

### NotificationService
- Checks browser support for notifications
- Manages permission state (granted/denied/default)
- Shows browser notifications when permitted
- Triggers fallback callback when notifications unavailable
- Auto-closes notifications after 5s

## Next Step
Proceed to **Step 04: Mock Data**
