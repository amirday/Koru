# Step 06: Custom Hooks

## Objective
Create reusable React hooks for common operations.

## Files to Create
- `src/hooks/useLocalStorage.ts` - Typed localStorage with JSON serialization
- `src/hooks/useReducedMotion.ts` - Detects motion preference from OS
- `src/hooks/useBackgroundTask.ts` - Wrapper for background-task-service
- `src/hooks/useNotification.ts` - Request permission, show notifications
- `src/hooks/useRitual.ts` - CRUD operations (wraps RitualContext)

## Test Plan

**Automated Tests**:
- [✓] useLocalStorage: Returns current value, updates on set
- [✓] useLocalStorage: JSON serialization/deserialization works
- [✓] useReducedMotion: Returns boolean based on media query
- [✓] useBackgroundTask: Executes task async, returns status
- [✓] useNotification: Requests permission, shows notification
- [✓] useRitual: Returns CRUD functions from RitualContext
- [✓] TypeScript compilation passes with no errors
- [✓] Production build succeeds (237 KB bundle)

**Manual Verification** (User to test):
- [ ] Click "Check Motion Pref" → alert shows current motion preference
- [ ] Click "Test useLocalStorage" → value updates and persists
- [ ] Refresh page → localStorage value persists
- [ ] Click "Test useNotification" → browser shows notification (if permitted)
- [ ] Click "Toggle First Favorite" → first ritual favorite status toggles
- [ ] View "Custom Hooks Status" section → see all hook states displayed

**Expected**: Hooks encapsulate common logic, work reliably, integrate with contexts/services correctly.

## Implementation Summary

**Created Files**:
- `src/hooks/useLocalStorage.ts` - Typed localStorage sync hook
- `src/hooks/useReducedMotion.ts` - Motion preference detection
- `src/hooks/useBackgroundTask.ts` - Background task wrapper
- `src/hooks/useNotification.ts` - Notification service wrapper
- `src/hooks/useRitual.ts` - Ritual operations wrapper
- `src/hooks/index.ts` - Central exports

**Hook Features**:

**useLocalStorage(key, defaultValue)**:
- Syncs React state with localStorage
- Auto-prefixes keys with 'koru:'
- JSON serialization/deserialization
- Listens for storage events (cross-tab sync)
- Returns: [value, setValue, removeValue]

**useReducedMotion()**:
- Detects OS-level motion preference
- Uses matchMedia API
- Updates when preference changes
- Returns: boolean

**useBackgroundTask()**:
- Wraps background task service
- Polls task status every 500ms
- Auto-cleanup when task completes
- Returns: { task, isRunning, runTask, cancelTask }

**useNotification()**:
- Wraps notification service
- Tracks permission status
- Provides requestPermission and notify functions
- Supports fallback callback
- Returns: { permission, isSupported, requestPermission, notify, onFallback }

**useRitual()**:
- Convenience wrapper for RitualContext
- CRUD operations: get, save, delete, duplicate
- Additional ops: toggleFavorite, recordUsage
- Generation ops: generateRitual, cancelGeneration
- Returns: Object with all ritual operations

**Integration**:
- All hooks integrate with existing services/contexts
- Type-safe with full TypeScript coverage
- Proper cleanup in useEffect hooks
- Error handling throughout

## Next Step
Proceed to **Step 07: Base UI Components**
