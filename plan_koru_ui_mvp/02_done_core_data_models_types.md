# Step 02: Core Data Models & Types

## Objective
Define TypeScript interfaces for domain models (Goal, Ritual, Session, Preferences) and service contracts (AIProvider, StorageAdapter) to ensure type safety throughout the application.

## Key Tasks

### 2.1 Domain Models
**File**: `src/types/models.ts`

**Timestamp**: Branded type (`string & { __brand: 'Timestamp' }`) for type-safe dates. Helpers: `Timestamp.now()`, `Timestamp.from(date)`, `Timestamp.parse(ts)`. Serializes as ISO 8601 string.

**Goal**: `id`, `instructions`, `createdAt` (Timestamp), `updatedAt` (Timestamp)

**RitualContent** (what the ritual IS + creation metadata): `id`, `title`, `instructions`, `duration` (seconds), `tone`, `pace`, `includeSilence`, `soundscape`, `sections`, `tags`, `isTemplate`, `generatedFrom`, `createdAt` (Timestamp), `updatedAt` (Timestamp)

**RitualStatistics** (usage stats - SEPARATE entity with own ID): `id`, `ritualId`, `isFavorite`, `usageCount`, `lastUsedAt` (Timestamp, optional)

**Ritual**: `extends RitualContent` + `statistics: RitualStatistics | null` - full ritual with content + separate statistics

**RitualSection**: `id`, `type` (intro/body/silence/transition/closing), `durationSeconds`, `guidanceText`, `silenceDuration` (for silence type), `soundscape` (optional per section)

**SessionData** (core tracking): `id`, `ritualId`, `status`, `startedAt` (Timestamp), `completedAt` (Timestamp, optional), `progressSeconds`

**SessionReflection** (post-session - SEPARATE entity with own ID): `id`, `sessionId`, `reflection` (string, optional), `rating` (1-5, optional), `createdAt` (Timestamp)

**Session**: `extends SessionData` + `reflection: SessionReflection | null` - full session with separate reflection

**UserPreferences**: `defaultDuration` (seconds), `defaultTone`, `notifications` (boolean), `soundscapesEnabled`, `voice` (optional), `theme` (light/dark/auto - future)

**Reference**: UI_design.md §15 for data model overview and relationships

### 2.2 Service Interfaces
**File**: `src/types/services.ts`

**AIProvider** interface: `generateRitual(options: AIGenerationOptions, onProgress: (progress: AIGenerationProgress) => void): Promise<Ritual>`, `askClarifyingQuestion(context): Promise<AIClarifyingQuestion | null>`

**AIGenerationOptions**: `instructions`, `duration`, `tone`, `includeSilence`, `soundscape`, `additionalPreferences` (optional)

**AIGenerationProgress**: `stage` (clarifying/structuring/writing/complete), `progress` (0-100), `message` (string)

**AIClarifyingQuestion**: `questionText`, `options` (string array), `allowCustomInput` (boolean)

**StorageAdapter** interface: `get<T>(key): Promise<T | null>`, `set<T>(key, value): Promise<void>`, `remove(key): Promise<void>`, `clear(): Promise<void>`, `keys(prefix?): Promise<string[]>`

**BackgroundTaskManager**: Manages async tasks with `run<T>(type, work)`, `getTask(id)`, `cancel(id)`. Tasks have Timestamp fields.

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
- `src/types/models.ts` - Domain models (Timestamp, Goal, RitualContent, RitualMetadata, Ritual, SessionData, SessionReflection, Session, etc.)
- `src/types/services.ts` - Service interfaces (AIProvider, StorageAdapter, BackgroundTaskManager)
- `src/types/ui.ts` - UI types (component variants, props, state types)
- `src/types/constants.ts` - App constants (STORAGE_KEYS, RITUAL_TONES, defaults)
- `src/types/index.ts` - Central export point for all types

## Test Plan

**Automated Tests**:
- [✓] `pnpm type-check` passes with no errors
- [✓] Import models in test file, TypeScript resolves correctly
- [✓] Create mock objects that satisfy interfaces (compile-time check)
- [✓] Constants are readonly and properly typed
- [✓] No circular dependencies between type files

**Manual Verification**:
- [✓] Open `src/types/models.ts` in VS Code → no red squiggles
- [✓] Hover over Ritual type → shows full interface with all properties
- [✓] Use Ritual in component → autocomplete suggests all properties
- [✓] Try assign invalid tone value → TypeScript error prevents
- [✓] Check STORAGE_KEYS → all have 'koru:' prefix
- [✓] Import AIProvider interface → can implement mock class
- [✓] Use `@/types/...` path aliases → resolves correctly (verified in App.tsx)

**Expected**: All types compile, interfaces are strict (no `any`), constants prevent typos, models match UI_design.md §15 relationships, service interfaces enable pluggable implementations.

## Next Step
Proceed to **Step 03: Service Layer**
