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
- [ ] useLocalStorage: Returns current value, updates on set
- [ ] useLocalStorage: JSON serialization/deserialization works
- [ ] useReducedMotion: Returns boolean based on media query
- [ ] useBackgroundTask: Executes task async, returns status
- [ ] useNotification: Requests permission, shows notification
- [ ] useRitual: Returns CRUD functions from RitualContext

**Manual Verification**:
- [ ] Use `useReducedMotion()` → returns true when OS setting enabled
- [ ] Use `useLocalStorage('key', defaultValue)` → persists across refreshes
- [ ] Use `useNotification()` → browser shows permission prompt
- [ ] Use `useRitual().saveRitual(ritual)` → ritual saved successfully

**Expected**: Hooks encapsulate common logic, work reliably, integrate with contexts/services correctly.

## Next Step
Proceed to **Step 07: Base UI Components**
