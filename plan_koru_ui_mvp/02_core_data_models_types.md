# Step 2: Core Data Models & Types

## Objective
Define TypeScript interfaces for all domain models, service contracts, and UI types to ensure type safety throughout the application.

## Why This Matters
Strong typing provides:
- **Compile-time safety**: Catch errors before runtime
- **IDE support**: Autocomplete, inline documentation
- **Refactoring confidence**: Change detection across codebase
- **Service contracts**: Clear interfaces enable pluggable implementations
- **Documentation**: Types serve as living documentation

---

## Key Tasks

### 2.1 Define Domain Models

**File**: `src/types/models.ts`

Create TypeScript interfaces for core domain entities:

**Goal**:
- id, text, created/updated timestamps
- Simple structure for user's current meditation goal

**Ritual**:
- Basic info: id, title, intent, duration (seconds)
- Configuration: tone (gentle/neutral/coach), pace (slow/medium/fast), includeSilence, soundscape
- Structure: array of RitualSection
- Metadata: tags, isTemplate, isFavorite, usageCount
- AI context: generatedFrom (goal, prompt, modelVersion) - optional
- Timestamps: createdAt, updatedAt, lastUsedAt

**RitualSection**:
- id, name, duration, guidanceText, pauseDensity (0-100)
- enabled flag, order number
- variables object for runtime substitution (optional)

**Session** (future - Phase 3):
- Links to Ritual, timing info, context, completion status
- Snapshot of ritual at time of session

**Reflection** (future - Phase 4):
- Session link, checkboxes, mood sliders, notes
- Smart suggestions if user wants adjustments

**Insight** (future - Phase 4):
- Type (pattern/recommendation/achievement)
- Based on session/reflection data

**UserPreferences**:
- Defaults: duration, tone, pace
- Audio: soundscapeEnabled, defaultSoundscape, volume
- UI: theme, reducedMotion, largeText
- Notifications: remindersEnabled, time, days
- Privacy: analyticsEnabled

**Data model overview**: See **UI_design.md §15** for conceptual relationships

### 2.2 Define Service Interfaces

**File**: `src/types/services.ts`

Create interfaces for service abstraction layers:

**AIProvider Interface**:
- Methods:
  - `generateRitual(options, onProgress)` - Core generation with progress callbacks
  - `askClarifyingQuestion(context)` - Interactive question during generation
  - `refineRitualSection(section, instruction)` - Section-level adjustments
  - `generateInsights(sessions, reflections)` - Future: Pattern detection
- Input types: AIGenerationOptions, instruction types
- Output types: AIClarifyingQuestion, AIGenerationProgress
- Why: Enables swapping AI providers (mock → Claude → OpenAI) without code changes

**StorageAdapter Interface**:
- CRUD methods: `get<T>`, `set<T>`, `delete`
- Batch operations: `getMany<T>`, `setMany<T>`
- Collection operations (future): `getAllKeys`, `clear`
- Why: Supports migration path (localStorage → IndexedDB → cloud)

**BackgroundTask Types**:
- Task status tracking (pending/running/completed/failed)
- Callback types for success and error handling
- Why: Enables async ritual generation with notifications

**Generation flow details**: See **UI_design.md §6.3** for 3-phase generation UX

### 2.3 Define UI Types

**File**: `src/types/ui.ts`

Create types for UI components:

**Component Variants**:
- ButtonVariant: primary, secondary, ghost, danger
- ButtonSize: sm, md, lg
- CardVariant: default, elevated, flat
- ToastType: success, error, info, warning

**Component Props**:
- ToastMessage: id, type, message, duration
- ModalProps: isOpen, onClose, title, children, closeOnOutsideClick, showCloseButton
- FormFieldProps: label, error, helperText, required

**Navigation & State**:
- TabRoute: home, rituals, dashboard, profile
- GenerationState: isGenerating, progress, stage, message, taskId

**Design system**: See **UI_design.md §4** for component patterns

### 2.4 Create Type Utilities

**File**: `src/types/guards.ts`

Implement helper functions:

**Type Guards**:
- `isRitual(value)` - Runtime type checking for Ritual objects
- `isGoal(value)` - Runtime type checking for Goal objects
- Useful for validating data loaded from storage

**Serialization Helpers**:
- `serializeDate(date)` - Convert Date to ISO string for storage
- `deserializeDate(string)` - Parse ISO string back to Date
- `cloneDeep<T>(obj)` - Deep copy utility for immutable updates

### 2.5 Define Constants

**File**: `src/types/constants.ts`

Create application constants:

**Storage Keys**:
- Namespaced keys for localStorage (e.g., "koru:goal", "koru:rituals")
- Prevents conflicts with other apps

**Option Arrays**:
- DURATION_OPTIONS: [5, 10, 15, 20, 30] minutes
- TONE_OPTIONS: ['gentle', 'neutral', 'coach']
- PACE_OPTIONS: ['slow', 'medium', 'fast']
- SOUNDSCAPE_OPTIONS: Rain, Ocean, Forest, White Noise, None (with file paths)

**Default Preferences**:
- Complete UserPreferences object with sensible defaults
- Duration: 10 min, Tone: gentle, Pace: medium
- Soundscape: enabled with auto-select
- Theme: light, motion: normal
- Reminders: disabled initially
- Analytics: enabled

**Animation Durations**:
- FAST: 150ms, NORMAL: 250ms, SLOW: 350ms
- Used with prefers-reduced-motion checks

**Generation Stages**:
- Array defining 4 stages with messages and progress percentages
- See **UI_design.md §6.3** for staging details

---

## Type Relationships

```
Goal (1)
  ↓
Ritual (many) ← contains → RitualSection (many)
  ↓
Session (many) ← links to → Ritual snapshot
  ↓
Reflection (1:1)
  ↓
Insight (generated from many reflections)
```

**Preferences** are global and don't link to specific entities.

---

## Files to Create

- `/Users/amirdaygmail.com/projects/Koru/src/types/models.ts` - Domain models
- `/Users/amirdaygmail.com/projects/Koru/src/types/services.ts` - Service interfaces
- `/Users/amirdaygmail.com/projects/Koru/src/types/ui.ts` - UI component types
- `/Users/amirdaygmail.com/projects/Koru/src/types/guards.ts` - Type utilities
- `/Users/amirdaygmail.com/projects/Koru/src/types/constants.ts` - App constants

---

## Verification

Run TypeScript compiler to check types:

```bash
pnpm lint
```

**Expected Results**:
- [ ] All type files compile without errors
- [ ] No circular dependencies
- [ ] IDE provides autocomplete for all types
- [ ] Import statements resolve correctly (use `@/types/...` aliases)
- [ ] Exported types are available in other files

**Testing imports**:
Create a test file that imports each type to verify exports are correct.

---

## Next Step

Proceed to **Step 3: Service Layer**
