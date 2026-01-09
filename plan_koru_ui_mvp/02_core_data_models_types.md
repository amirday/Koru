# Step 02: Core Data Models & Types

## Objective
Define TypeScript interfaces for domain models (Goal, Ritual, Session, Preferences) and service contracts (AIProvider, StorageAdapter) to ensure type safety throughout the application.

## Key Tasks

### 2.1 Domain Models
**File**: `src/types/models.ts`

**Goal**: `id`, `text`, `createdAt`, `updatedAt`

**Ritual**: `id`, `title`, `intent`, `duration` (seconds), `tone` (gentle/neutral/coach), `pace` (slow/medium/fast), `includeSilence` (boolean), `soundscape` (optional), `sections` (array of RitualSection), `tags`, `isTemplate`, `isFavorite`, `usageCount`, `generatedFrom` (goal, prompt, modelVersion - optional), `createdAt`, `updatedAt`, `lastUsedAt`

**RitualSection**: `id`, `type` (intro/body/silence/transition/closing), `durationSeconds`, `guidanceText`, `silenceDuration` (for silence type), `soundscape` (optional per section)

**Session** (future - Phase 3): Links to Ritual, timing info, completion status, reflection, rating

**UserPreferences**: `defaultDuration` (seconds), `defaultTone`, `notifications` (boolean), `soundscapesEnabled`, `voice` (optional), `theme` (light/dark/auto - future)

**Reference**: UI_design.md §15 for data model overview and relationships

### 2.2 Service Interfaces
**File**: `src/types/services.ts`

**AIProvider** interface: `generateRitual(options: AIGenerationOptions, onProgress: (progress: AIGenerationProgress) => void): Promise<Ritual>`, `askClarifyingQuestion(context): Promise<AIClarifyingQuestion | null>`

**AIGenerationOptions**: `goal`, `duration`, `tone`, `includeSilence`, `soundscape`

**AIGenerationProgress**: `stage` (clarifying/structuring/writing/complete), `progress` (0-100), `message` (string)

**AIClarifyingQuestion**: `questionText`, `options` (string array), `allowCustomInput` (boolean)

**StorageAdapter** interface: `get<T>(key): Promise<T | null>`, `set<T>(key, value): Promise<void>`, `remove(key): Promise<void>`, `clear(): Promise<void>`

**Why**: Enables swapping AI providers (mock → Claude → OpenAI) and storage backends (localStorage → IndexedDB → cloud) without code changes

### 2.3 UI Types
**File**: `src/types/ui.ts`

**Component Variants**: ButtonVariant (primary/secondary/ghost/danger), ButtonSize (sm/md/lg), CardVariant (default/elevated/flat), ToastType (success/error/info/warning)

**Component Props**: ToastMessage (id, type, message, duration), ModalProps (isOpen, onClose, title, children, closeOnOutsideClick), FormFieldProps (label, error, helperText, required)

**Navigation**: TabRoute (home/rituals/dashboard/profile), GenerationState (isGenerating, progress, stage, message, taskId)

### 2.4 Constants
**File**: `src/types/constants.ts`

**Storage Keys**: Namespaced ('koru:goal', 'koru:preferences', 'koru:rituals') to prevent conflicts

**Option Arrays**: `RITUAL_TONES` (Gentle/Neutral/Coach), `RITUAL_DURATIONS` ([5, 10, 15, 20] min in seconds), `SOUNDSCAPES` (Ocean/Forest/Rain/Fire/None)

**Default Preferences**: Duration 10 min, tone gentle, soundscapes enabled, notifications disabled

**Generation Stages**: Array with 4 stages, messages, progress percentages (see UI_design.md §6.3)

## Files to Create
- `src/types/models.ts` - Domain models
- `src/types/services.ts` - Service interfaces
- `src/types/ui.ts` - UI types
- `src/types/constants.ts` - App constants

## Test Plan

**Automated Tests**:
- [ ] `pnpm type-check` passes with no errors
- [ ] Import models in test file, TypeScript resolves correctly
- [ ] Create mock objects that satisfy interfaces (compile-time check)
- [ ] Constants are readonly and properly typed
- [ ] No circular dependencies between type files

**Manual Verification**:
- [ ] Open `src/types/models.ts` in VS Code → no red squiggles
- [ ] Hover over Ritual type → shows full interface with all properties
- [ ] Use Ritual in component → autocomplete suggests all properties
- [ ] Try assign invalid tone value → TypeScript error prevents
- [ ] Check STORAGE_KEYS → all have 'koru:' prefix
- [ ] Import AIProvider interface → can implement mock class
- [ ] Use `@/types/...` path aliases → resolves correctly

**Expected**: All types compile, interfaces are strict (no `any`), constants prevent typos, models match UI_design.md §15 relationships, service interfaces enable pluggable implementations.

## Next Step
Proceed to **Step 03: Service Layer**
