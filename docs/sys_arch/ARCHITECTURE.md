# Koru Meditation App - Architecture Documentation

> **Version**: 1.0.0 (UI/UX Mock Phase)
> **Last Updated**: January 2026
> **Status**: Active Development

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Architecture](#4-data-architecture)
5. [Component Architecture](#5-component-architecture)
6. [State Management](#6-state-management)
7. [Service Layer](#7-service-layer)
8. [Routing & Navigation](#8-routing--navigation)
9. [Styling System](#9-styling-system)
10. [Key User Flows](#10-key-user-flows)
11. [Development Phases](#11-development-phases)
12. [Future Architecture](#12-future-architecture)

---

## 1. Overview

### 1.1 Product Vision

Koru is a **goal-driven meditation ritual generator** that creates personalized meditation sessions, guides users with minimal UI, captures reflection, and transforms it into insights for better future rituals.

### 1.2 Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Calm & Minimal** | Large whitespace, warm colors, reduced animations |
| **Reduce Friction** | Smart defaults, quick starts, one-tap actions |
| **Content > Controls** | Session screen hides all UI, sacred meditation space |
| **Reflection → Personalization** | Post-session captures feed future recommendations |
| **Smart Defaults + Override** | AI chooses, user can always change |

### 1.3 Current Phase

**UI/UX Mock Phase** - Building fully interactive screens with mocked data. No real backend, AI, or persistence beyond localStorage.

---

## 2. Technology Stack

### 2.1 Core Framework

```
┌─────────────────────────────────────────────────────────┐
│                    React 19.2.3                         │
│              (Concurrent features, StrictMode)          │
├─────────────────────────────────────────────────────────┤
│                   TypeScript 5.9.3                      │
│              (Strict mode, full type coverage)          │
├─────────────────────────────────────────────────────────┤
│                     Vite 7.3.1                          │
│              (ESM build, instant HMR)                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Dependencies

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| **Routing** | react-router | 7.12.0 | Client-side navigation |
| **Styling** | tailwindcss | 4.1.18 | Utility-first CSS |
| **Forms** | @tailwindcss/forms | 0.5.11 | Form component styles |
| **Animation** | tailwindcss-animate | 1.0.7 | Animation utilities |
| **PWA** | vite-plugin-pwa | 1.2.0 | Service worker, manifest |
| **PWA Runtime** | workbox-window | 7.4.0 | Service worker management |
| **Testing** | @playwright/test | 1.57.0 | E2E testing |

### 2.3 Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- PWA installable on iOS 14+ and Android 8+
- Offline support via service workers

---

## 3. Project Structure

```
koru/
├── public/                          # Static assets
│   ├── icons/                       # App icons (PWA)
│   ├── fonts/                       # Self-hosted fonts
│   └── voices/                      # Voice preview audio files (Planned)
│
├── src/
│   ├── components/                  # React components
│   │   ├── ui/                      # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── index.ts             # Barrel exports
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── ScreenContainer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── BottomTabBar.tsx
│   │   │
│   │   ├── cards/                   # Card components
│   │   │   ├── GoalBox.tsx
│   │   │   └── QuickStartCard.tsx
│   │   │
│   │   ├── feed/                    # Feed screen components
│   │   │   ├── FeedRitualCard.tsx    # Vertical card with tags, tone colors, Start button, "Created by you" annotation
│   │   │   ├── StickyCreateButton.tsx # Fixed bottom create button
│   │   │   └── index.ts
│   │   │
│   │   ├── generation/              # AI generation UI
│   │   │   ├── DurationPicker.tsx    # Duration selection buttons
│   │   │   ├── VoiceSelector.tsx     # Voice selection radio list
│   │   │   ├── SoundscapeSelector.tsx # Soundscape pill buttons
│   │   │   ├── GenerateButton.tsx
│   │   │   ├── GenerationProgress.tsx
│   │   │   ├── ClarifyingQuestionModal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── rituals/                 # Ritual library UI
│   │   │   ├── RitualCard.tsx
│   │   │   ├── RitualPreviewModal.tsx
│   │   │   └── SectionList.tsx
│   │   │
│   │   ├── editor/                  # Ritual editor
│   │   │   ├── EditorTabs.tsx
│   │   │   ├── StructureTab.tsx
│   │   │   ├── PromptTab.tsx
│   │   │   ├── VoicePacingTab.tsx
│   │   │   ├── AdvancedTab.tsx
│   │   │   └── SectionEditor.tsx
│   │   │
│   │   ├── session/                 # Session player
│   │   │   ├── GuidanceText.tsx
│   │   │   └── SessionControls.tsx
│   │   │
│   │   ├── reflection/              # Post-session
│   │   │   ├── ReflectionCheckboxes.tsx
│   │   │   └── MoodSlider.tsx
│   │   │
│   │   ├── dashboard/               # Analytics
│   │   │   ├── StatsOverview.tsx
│   │   │   ├── TrendsChart.tsx
│   │   │   ├── CalendarHeatmap.tsx
│   │   │   ├── InsightsFeed.tsx
│   │   │   └── InsightTile.tsx
│   │   │
│   │   └── profile/                 # Settings
│   │       ├── PreferencesSection.tsx
│   │       └── ReminderSettings.tsx
│   │
│   ├── screens/                     # Feature screens
│   │   ├── Onboarding/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   └── InitialGoalSetupScreen.tsx
│   │   ├── Feed/
│   │   │   ├── FeedScreen.tsx        # Main feed with ritual list
│   │   │   └── index.ts
│   │   ├── Generation/
│   │   │   ├── RitualGenerationScreen.tsx  # Form screen
│   │   │   ├── GenerationProgressScreen.tsx # Progress animation
│   │   │   ├── GenerationCompleteScreen.tsx # Success with actions
│   │   │   └── index.ts
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx        # Legacy (redirects to /feed)
│   │   ├── Rituals/
│   │   │   ├── RitualLibraryScreen.tsx
│   │   │   └── RitualEditorScreen.tsx
│   │   ├── Session/
│   │   │   ├── SessionScreen.tsx
│   │   │   └── ReflectionScreen.tsx
│   │   ├── Dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── SessionDetailScreen.tsx
│   │   └── Profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── contexts/                    # React contexts
│   │   ├── AppContext.tsx           # Goal, preferences, onboarding
│   │   └── RitualContext.tsx        # Rituals, generation, library
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useNotification.ts
│   │   ├── useRitual.ts
│   │   ├── useBackgroundTask.ts
│   │   ├── useSessionPlayer.ts
│   │   └── index.ts
│   │
│   ├── services/                    # Service layer
│   │   ├── storage/
│   │   │   └── LocalStorageAdapter.ts
│   │   ├── ai/
│   │   │   ├── MockAIProvider.ts
│   │   │   ├── prompts.ts           # AI prompt templates
│   │   │   └── parsers.ts           # Response parsers
│   │   ├── background/
│   │   │   └── BackgroundTaskService.ts
│   │   ├── notification/
│   │   │   └── NotificationService.ts
│   │   ├── tts/                     # TTS Service (Planned)
│   │   │   ├── TTSProvider.interface.ts
│   │   │   ├── MockTTSProvider.ts
│   │   │   ├── ElevenLabsProvider.ts
│   │   │   ├── tts-service.ts       # Provider selection
│   │   │   └── index.ts
│   │   ├── audio/                   # Audio Stitching Service (Planned)
│   │   │   ├── AudioStitcher.ts
│   │   │   ├── AudioCache.ts        # IndexedDB caching
│   │   │   ├── audio-utils.ts       # Duration detection
│   │   │   └── index.ts
│   │   └── ritual-audio/            # Ritual Audio Generator (Planned)
│   │       ├── RitualAudioGenerator.ts
│   │       └── index.ts
│   │
│   ├── types/                       # TypeScript definitions
│   │   ├── models.ts                # Domain models
│   │   ├── services.ts              # Service interfaces
│   │   ├── ui.ts                    # UI types
│   │   ├── segment.ts               # Segment type (Planned)
│   │   ├── voice.ts                 # Voice types (Planned)
│   │   └── elevenlabs.ts            # ElevenLabs API types (Planned)
│   │
│   ├── mocks/                       # Mock data
│   │   ├── rituals.ts
│   │   ├── quickStarts.ts
│   │   ├── dashboardData.ts
│   │   └── sessions.ts
│   │
│   ├── data/                        # Static data files (Planned)
│   │   └── voices.json              # Voice manifest (generated by script)
│   │
│   ├── router/                      # Routing
│   │   ├── index.tsx
│   │   ├── routes.tsx
│   │   ├── AppLayout.tsx
│   │   └── RequireOnboarding.tsx
│   │
│   ├── styles/                      # Global styles
│   │   └── globals.css
│   │
│   ├── App.tsx                      # Root component
│   └── main.tsx                     # Entry point
│
├── plan_koru_ui_mvp/                # Implementation plans
├── scripts/                         # Build/generation scripts (Planned)
│   └── generate-voice-samples.ts    # Generate voice previews from ElevenLabs
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

---

## 4. Data Architecture

### 4.1 Type System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Branded Types                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Timestamp = string & { __brand: 'Timestamp' }  │    │
│  │  - Compile-time safety                          │    │
│  │  - Runtime: ISO 8601 string                     │    │
│  │  - JSON/localStorage compatible                 │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Domain Models

#### Goal

```typescript
interface Goal {
  id: string
  instructions: string      // What user wants to achieve
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Ritual (Content + Statistics Separated)

```typescript
// Immutable content (shareable)
interface RitualContent {
  id: string
  title: string
  instructions: string
  duration: number          // seconds
  tone: RitualTone
  pace: RitualPace
  includeSilence: boolean
  soundscape: Soundscape
  sections: RitualSection[]
  tags: string[]
  isTemplate: boolean
  generatedFrom?: string    // AI prompt reference
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Mutable usage data (private)
interface RitualStatistics {
  id: string                // Own identity
  ritualId: string          // Reference
  isFavorite: boolean
  usageCount: number
  lastUsedAt?: Timestamp
}

// Combined for display
interface Ritual extends RitualContent {
  statistics: RitualStatistics | null

  // Audio generation state (added for TTS integration)
  audioStatus?: 'pending' | 'generating' | 'ready' | 'error'
  voiceId?: string               // Selected TTS voice ID
}
```

#### Segment (NEW - Core building block)

```typescript
/**
 * A segment is either text/speech or silence.
 * This same structure is used at all stages:
 * 1. Text generation (OpenAI) - creates segments with text
 * 2. Audio generation (TTS) - adds audioBlob to segments
 */
interface Segment {
  id: string
  type: 'text' | 'silence'

  // For text segments
  text?: string                  // The text content (filled by AI generation)

  // Duration
  durationSeconds: number        // Target duration for this segment

  // Audio (populated after TTS)
  audioBlob?: Blob               // Generated audio
  actualDurationSeconds?: number // Measured audio duration
}
```

#### Ritual Section (UPDATED)

```typescript
type RitualSectionType = 'intro' | 'body' | 'closing'

/**
 * A ritual section contains an ordered list of segments.
 * Each segment is either text (to be spoken) or silence (pause).
 */
interface RitualSection {
  id: string
  type: RitualSectionType
  durationSeconds: number        // Total target duration for section

  segments: Segment[]            // Ordered list of text/silence segments

  // Legacy compatibility (computed from segments)
  guidanceText?: string          // DEPRECATED: Concatenated text from all text segments

  // Audio (populated after TTS generation)
  audioUrl?: string              // Cached combined audio URL
  audioDurationSeconds?: number  // Actual combined audio duration
  audioGeneratedAt?: string      // Cache invalidation timestamp (ISO 8601)
}
```

#### Session (Data + Reflection Separated)

```typescript
type SessionStatus = 'in_progress' | 'completed' | 'abandoned'

// Session execution data
interface SessionData {
  id: string
  ritualId: string
  status: SessionStatus
  startedAt: Timestamp
  completedAt?: Timestamp
  progressSeconds: number
}

// User reflection (private)
interface SessionReflection {
  id: string                // Own identity
  sessionId: string         // Reference
  reflection: string
  rating: 1 | 2 | 3 | 4 | 5
  createdAt: Timestamp
}

// Combined for display
interface Session extends SessionData {
  reflection: SessionReflection | null
}
```

#### User Preferences (UPDATED)

```typescript
interface UserPreferences {
  defaultDuration: number     // seconds
  defaultTone: RitualTone     // 'gentle' | 'neutral' | 'coach'
  notifications: boolean
  soundscapesEnabled: boolean
  theme?: ThemeOption         // 'light' | 'dark' | 'auto'

  // Voice settings (added for TTS integration)
  selectedVoiceId?: string    // Currently selected TTS voice ID
  // Future: per-tone voice selection
  // gentleVoiceId?: string
  // neutralVoiceId?: string
  // coachVoiceId?: string
}
```

### 4.3 Enumerations

```typescript
type RitualTone = 'gentle' | 'neutral' | 'coach'
type RitualPace = 'slow' | 'medium' | 'fast'
type Soundscape = 'ocean' | 'forest' | 'rain' | 'fire' | 'none'
type VoiceOption = 'default' | 'male' | 'female' | 'neutral'
type ThemeOption = 'light' | 'dark' | 'auto'
```

### 4.4 Storage Schema

| Key | Type | Description |
|-----|------|-------------|
| `koru:goal` | Goal | Current user goal |
| `koru:preferences` | UserPreferences | User settings |
| `koru:onboarding_complete` | boolean | Onboarding status |
| `koru:rituals` | Ritual[] | User's ritual library |
| `koru:ritual:{id}` | RitualContent | Individual ritual |
| `koru:ritual-stats:{id}` | RitualStatistics | Ritual usage stats |
| `koru:session:{id}` | SessionData | Session record |
| `koru:session-reflection:{id}` | SessionReflection | Reflection record |
| `koru:voice-preferences` | UserVoicePreferences | Selected voice settings (Planned) |
| `koru:audio:{ritualId}:{sectionId}` | Blob (IndexedDB) | Cached section audio (Planned) |

---

## 5. Component Architecture

### 5.1 Component Hierarchy

```
App
├── ToastProvider
│   └── RouterProvider
│       ├── AppLayout (with nav)
│       │   ├── Header
│       │   ├── ScreenContainer
│       │   │   └── [Screen Component]
│       │   └── BottomTabBar
│       │
│       └── Fullscreen Routes (no nav)
│           └── [SessionScreen | ReflectionScreen]
```

### 5.2 Design System Components

#### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}
```

#### Card

```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Compound components
Card.Header  // Title + optional action
Card.Body    // Content area
```

#### Input

```typescript
interface InputProps {
  label?: string
  helperText?: string
  error?: string
  multiline?: boolean
  autoResize?: boolean
}
```

#### Modal

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}
```

#### Toast

```typescript
interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number  // ms, default 4000
}

// Usage via hook
const { showToast } = useToast()
showToast('success', 'Ritual saved!')
```

### 5.3 Component Design Patterns

#### Variant Pattern
All components use variant props for visual variations:

```typescript
<Button variant="primary" size="lg">Generate</Button>
<Card variant="elevated">...</Card>
```

#### Compound Components
Complex components use compound patterns:

```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

#### Controlled Components
Form components are fully controlled:

```typescript
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## 6. State Management

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Context                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐      ┌──────────────────┐          │
│  │   AppContext    │      │  RitualContext   │          │
│  ├─────────────────┤      ├──────────────────┤          │
│  │ • goal          │      │ • rituals        │          │
│  │ • preferences   │      │ • templates      │          │
│  │ • onboarding    │      │ • isGenerating   │          │
│  │ • bottomNav     │      │ • progress       │          │
│  │ • isLoading     │      │ • clarifying Q   │          │
│  └────────┬────────┘      └────────┬─────────┘          │
│           │                        │                     │
│           ▼                        ▼                     │
│  ┌─────────────────────────────────────────────┐        │
│  │            localStorage (persistence)        │        │
│  └─────────────────────────────────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 6.2 AppContext

**Purpose**: Application-level state (goal, preferences, onboarding)

```typescript
interface AppState {
  goal: Goal | null
  preferences: UserPreferences
  hasCompletedOnboarding: boolean
  bottomNavVisible: boolean
  isLoading: boolean
}

interface AppActions {
  updateGoal(instructions: string): Promise<void>
  updatePreferences(updates: Partial<UserPreferences>): Promise<void>
  completeOnboarding(): Promise<void>
  setBottomNavVisible(visible: boolean): void
}
```

**Persistence**: Syncs to localStorage on every update.

### 6.3 RitualContext

**Purpose**: Ritual library and AI generation state

```typescript
interface RitualState {
  rituals: Ritual[]
  templates: Ritual[]
  isGenerating: boolean
  generationProgress: AIGenerationProgress | null
  clarifyingQuestion: AIClarifyingQuestion | null
  editingRitual: Ritual | null
  generationTaskId: string | null
  isLoading: boolean
}

interface RitualActions {
  startGeneration(options: AIGenerationOptions): Promise<void>
  answerClarifyingQuestion(answer: string): Promise<void>
  saveRitual(ritual: Ritual): Promise<void>
  deleteRitual(id: string): Promise<void>
  duplicateRitual(id: string): Promise<Ritual>
  setEditingRitual(ritual: Ritual | null): void
  getRitual(id: string): Ritual | undefined
  cancelGeneration(): Promise<void>
}
```

**Persistence**: Rituals synced to localStorage. Generation state is transient.

### 6.4 ToastContext

**Purpose**: Notification queue management

```typescript
interface ToastState {
  toasts: Toast[]  // Max 3 active
}

interface ToastActions {
  showToast(type: ToastType, message: string, duration?: number): void
  removeToast(id: string): void
}
```

### 6.5 Custom Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useApp()` | Access AppContext | `AppState & AppActions` |
| `useRituals()` | Access RitualContext | `RitualState & RitualActions` |
| `useToast()` | Access ToastContext | `{ showToast, removeToast }` |
| `useLocalStorage(key, init)` | Synced localStorage | `[value, setValue]` |
| `useReducedMotion()` | Motion preference | `boolean` |
| `useNotification()` | Browser notifications | `{ isSupported, permission, notify }` |
| `useSessionPlayer(ritual)` | Session playback | `{ state, play, pause, ... }` |

---

## 7. Service Layer

### 7.1 Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Storage    │  │      AI      │  │  Background  │   │
│  │   Service    │  │   Service    │  │    Tasks     │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│  │ Interface:   │  │ Interface:   │  │ Interface:   │   │
│  │ StorageAdapter│ │ AIProvider   │  │ TaskManager  │   │
│  │              │  │              │  │              │   │
│  │ Current:     │  │ Current:     │  │ Current:     │   │
│  │ localStorage │  │ MockProvider │  │ In-memory    │   │
│  │              │  │              │  │              │   │
│  │ Future:      │  │ Future:      │  │ Future:      │   │
│  │ IndexedDB    │  │ Claude API   │  │ Web Workers  │   │
│  │ Cloud Sync   │  │ OpenAI API   │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Notification Service                 │   │
│  │  • Browser Notification API                       │   │
│  │  • Permission management                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Storage Service

**Interface**: `StorageAdapter`

```typescript
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  keys(prefix?: string): Promise<string[]>
}
```

**Current Implementation**: `LocalStorageAdapter`
- Namespace prefix: `koru:`
- JSON serialization
- Async API over sync localStorage

**Future**: IndexedDB adapter, cloud sync adapter

### 7.3 AI Service

**Interface**: `AIProvider`

```typescript
interface AIProvider {
  generateRitual(
    options: AIGenerationOptions,
    onProgress: (progress: AIGenerationProgress) => void
  ): Promise<Ritual>

  askClarifyingQuestion(
    context: { instructions: string; tone?: RitualTone }
  ): Promise<AIClarifyingQuestion | null>
}

interface AIGenerationOptions {
  instructions: string
  duration: number
  tone: RitualTone
  includeSilence: boolean
  soundscape?: Soundscape
}

interface AIGenerationProgress {
  stage: 'clarifying' | 'structuring' | 'writing' | 'complete'
  percent: number
  message: string
}
```

**Current Implementation**: `MockAIProvider`
- Simulates 4-stage generation with delays
- 30% chance of clarifying questions
- Returns pre-built ritual structure

**Future**: Claude API, OpenAI API adapters

### 7.4 Background Task Service

**Interface**: `BackgroundTaskManager`

```typescript
interface BackgroundTaskManager {
  run<T>(type: string, work: () => Promise<T>): Promise<string>
  getTask(taskId: string): Promise<BackgroundTask | null>
  cancel(taskId: string): Promise<void>
}

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

interface BackgroundTask {
  id: string
  type: string
  status: TaskStatus
  result?: unknown
  error?: Error
}
```

**Purpose**: Enables navigation during long-running tasks (generation).

### 7.5 Notification Service

```typescript
interface NotificationService {
  isSupported(): boolean
  getPermission(): NotificationPermission
  requestPermission(): Promise<NotificationPermission>
  notify(options: NotificationOptions): Promise<boolean>
}

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
}
```

### 7.6 TTS Service

**Architecture**: Provider abstraction with TTSService facade

```
┌─────────────────────────────────────────────────────────┐
│                    TTSService                            │
│          (Provider selection & management)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  MockTTS    │  │  GoogleTTS  │  │  ElevenLabsTTS  │  │
│  │  Provider   │  │  Provider   │  │    Provider     │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────┤  │
│  │ Silent audio│  │ Gemini 2.5  │  │ ElevenLabs API  │  │
│  │ for testing │  │ Pro TTS     │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Interface**: `TTSProvider`

```typescript
interface TTSProvider {
  synthesize(options: TTSOptions): Promise<TTSResult>
  getVoices(): Promise<Voice[]>
  getVoicePreview(voiceId: string): Promise<string>
  isAvailable(): Promise<boolean>
}

interface TTSOptions {
  text: string
  voiceId?: string
  speed?: number
}

interface TTSResult {
  audioBlob: Blob
  durationSeconds: number  // Actual TTS audio length - needed to calculate silence padding
}

interface Voice {
  id: string                // Provider voice_id (e.g., ElevenLabs voice_id)
  name: string              // Display name (e.g., "Rachel")
  description: string       // Short description
  labels: string[]          // Tags like ['calm', 'female', 'american']
  previewUrl: string        // Local path to bundled sample audio
  previewText: string       // What the preview audio says
}
```

> **Why durationSeconds in TTSResult?** We need the actual TTS audio length to calculate how much silence to add: `silence_needed = target_section_duration - tts_duration`. Without measuring TTS output, we can't hit the target duration.

**TTSService Configuration**:

```typescript
type TTSProviderType = 'mock' | 'google' | 'elevenlabs'

interface TTSServiceConfig {
  provider: TTSProviderType
  googleApiKey?: string       // Required for 'google' provider
  elevenLabsApiKey?: string   // Required for 'elevenlabs' provider
  defaultVoiceId?: string     // Optional voice override
}
```

**Environment Variables**:

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (for voices with `provider: "google"`) |
| `VITE_ELEVENLABS_API_KEY` | ElevenLabs API key (for voices with `provider: "elevenlabs"`) |

Note: Provider selection is automatic based on the `provider` field in each voice's manifest entry. Configure API keys only for the providers whose voices you want to use.

**Provider Implementations**:

1. **MockTTSProvider** (`mock`)
   - Returns silent audio for testing
   - No API calls required
   - Voice list from local manifest

2. **GoogleTTSProvider** (`google`)
   - Uses Gemini 2.5 Pro Preview TTS model
   - Supports meditation-style voice instructions
   - Rate limit handling with 60s cooldown wait
   - Voice manifest from `/src/data/voices.json`

3. **ElevenLabsTTSProvider** (`elevenlabs`)
   - ElevenLabs API integration
   - Meditation-optimized voices (Sarah, Daniel, Charlotte, Lily, Liam)
   - Rate limit handling with 60s cooldown wait
   - Voice settings: stability 0.75, style 0.5

**Important**: Never use mock fallbacks for real API providers. If rate limited, wait for cooldown and show clear errors to the user.

### 7.7 Audio Stitching Service (Planned)

**Interface**: `AudioStitcher`

```typescript
interface AudioStitcher {
  stitch(segments: AudioSegment[], targetDurationMs: number): Promise<Blob>
  getDuration(blob: Blob): Promise<number>
  generateSilence(durationMs: number): Promise<Blob>
}

interface AudioSegment {
  type: 'speech' | 'silence'
  blob?: Blob
  durationMs: number
}
```

**Implementation**: Web Audio API
- AudioContext for decoding and encoding audio
- Concatenate AudioBuffers from multiple sources
- Fade in/out support for smooth transitions
- Output as WAV or MP3 blob

**Post-Padding Algorithm**:
1. Generate plain text TTS → measure actual duration
2. Calculate: `silence_needed = target_duration - tts_duration`
3. Distribute silence naturally (intro pause, between sentences, outro)
4. Stitch all segments together

**Edge Cases**:
- TTS longer than target → trim silence, show warning if >10% over
- TTS much shorter → add ambient breathing room (more silence = more meditative)
- Minimum speech ratio → ensure at least 40% is speech

**Audio Cache**: IndexedDB
- Key: `koru:audio:{ritualId}:{sectionId}`
- Invalidate when section text changes
- Cache-first loading strategy

### 7.8 Ritual Audio Generator (Planned)

**Orchestrates TTS + Stitching**

```typescript
interface RitualAudioGenerator {
  generateRitualAudio(
    ritual: Ritual,
    onProgress?: (p: GenerationProgress) => void
  ): Promise<SectionAudio[]>

  generateSectionAudio(
    section: RitualSection,
    targetDuration: number
  ): Promise<SectionAudio>
}

interface GenerationProgress {
  currentSection: number
  totalSections: number
  sectionName: string
  percent: number
}

interface SectionAudio {
  sectionId: string
  audioBlob: Blob
  durationSeconds: number
  generatedAt: string
}
```

**Generation Flow**:
1. For each section in ritual:
   a. For each text segment: call TTS, measure actual duration
   b. Calculate silence adjustments (target - actual speech duration)
   c. Stitch all segments (speech + calculated silence) together
   d. Cache combined section audio in IndexedDB
2. Report progress to UI via callback
3. Return array of section audio blobs
4. Store audio URLs in ritual sections for playback

**Verification**: Full ritual audio matches target durations (±1 second tolerance)

### 7.9 Python Backend (Planned)

**Purpose**: Secure API key handling, centralized TTS/AI orchestration, and file-based audio storage.

```
React Frontend ──────► Python Backend ──────► External APIs
(no API keys)          (FastAPI)             (OpenAI, TTS)
                            │
                            ▼
                       File Storage
                  (rituals/, audio/)
```

**Key Features**:
- Ritual generation via OpenAI
- TTS synthesis (Google Gemini, ElevenLabs)
- File-based ritual and audio storage
- Centralized rate limiting

**API Endpoints**:
- `POST /api/generate/ritual` - Generate ritual text
- `POST /api/tts/synthesize` - Synthesize speech
- `GET/POST/DELETE /api/rituals` - Ritual CRUD
- `GET /api/audio/{ritual_id}/{filename}` - Serve audio

> **Full Plan**: See [`docs/plans/python_backend_plan.md`](../plans/python_backend_plan.md) for complete architecture, project structure, and implementation details.

---

## 8. Routing & Navigation

### 8.1 Route Structure

```
/welcome                    → WelcomeScreen (onboarding)
/setup                      → InitialGoalSetupScreen (onboarding)

/ (AppLayout wrapper)
├── /feed                   → FeedScreen (main feed)
├── /home                   → Redirect to /feed
├── /generate               → RitualGenerationScreen (form)
├── /rituals                → RitualLibraryScreen
├── /rituals/new            → RitualEditorScreen (create)
├── /rituals/:id/edit       → RitualEditorScreen (edit)
├── /dashboard              → DashboardScreen
├── /session-detail/:id     → SessionDetailScreen
└── /profile                → ProfileScreen

/session/:ritualId          → SessionScreen (fullscreen, no nav)
/reflection/:sessionId      → ReflectionScreen (fullscreen, no nav)
/generate/progress          → GenerationProgressScreen (fullscreen, no nav)
/generate/complete/:id      → GenerationCompleteScreen (fullscreen, no nav)
```

### 8.2 Navigation Guards

#### RequireOnboarding

Wraps protected routes. Redirects to `/welcome` if onboarding incomplete.

```typescript
function RequireOnboarding({ children }) {
  const { hasCompletedOnboarding } = useApp()

  if (!hasCompletedOnboarding) {
    return <Navigate to="/welcome" replace />
  }

  return children
}
```

### 8.3 Layout Strategy

| Route Pattern | Layout | Bottom Nav |
|---------------|--------|------------|
| `/welcome`, `/setup` | None | Hidden |
| `/feed`, `/generate`, `/rituals`, `/dashboard`, `/profile` | AppLayout | Visible |
| `/session/*`, `/reflection/*`, `/generate/progress`, `/generate/complete/*` | Fullscreen | Hidden |

### 8.4 Bottom Tab Bar

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   📱 Feed      📚 Rituals      📊 Dashboard      👤 Profile   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 9. Styling System

### 9.1 Design Tokens

#### Colors

```css
/* Primary Accent */
--color-peach-500: #FF9A54;

/* Backgrounds */
--color-warm-white: #FFFCF8;
--color-gentle-yellow: #FFF9E6;
--color-warm-cream: #FFF8F0;

/* Neutrals */
--color-calm-900: #252527;
--color-calm-600: #6B6B6D;
--color-calm-100: #F9F9F8;

/* Functional */
--color-success: #A3D9B1;
--color-warning: #FFD8B0;
--color-error: #FFB3BA;
```

#### Typography

```css
/* Font Families */
--font-serif: 'Lora', Georgia, serif;
--font-sans: 'Inter', system-ui, sans-serif;

/* Font Sizes */
--text-display: 2.5rem;   /* 40px - Welcome headlines */
--text-h1: 2rem;          /* 32px - Screen titles */
--text-h2: 1.5rem;        /* 24px - Section headers */
--text-h3: 1.25rem;       /* 20px - Card titles */
--text-body: 1rem;        /* 16px - Standard text */
--text-small: 0.875rem;   /* 14px - Helper text */
```

#### Spacing

```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### 9.2 Component Styling

**Approach**: Tailwind CSS with custom design tokens

```typescript
// Button example
<button className={cn(
  // Base
  'inline-flex items-center justify-center rounded-xl font-medium transition-colors',
  // Variant
  variant === 'primary' && 'bg-peach-500 text-white hover:bg-peach-600',
  variant === 'secondary' && 'bg-warm-100 text-calm-900 hover:bg-warm-200',
  // Size
  size === 'sm' && 'px-3 py-1.5 text-sm',
  size === 'md' && 'px-4 py-2 text-base',
  size === 'lg' && 'px-6 py-3 text-lg',
)}>
```

### 9.3 Accessibility

| Feature | Implementation |
|---------|----------------|
| Focus states | 3px solid outline with offset |
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Reduced motion | `prefers-reduced-motion` media query |
| Touch targets | 44px minimum |
| Screen readers | ARIA labels on interactive elements |

### 9.4 Responsive Design

**Breakpoints**:
- Mobile: 320px - 767px (primary target)
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Container**: Max-width 640px, centered

---

## 10. Key User Flows

### 10.1 First-Time User (Onboarding)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Welcome   │────▶│   Setup     │────▶│    Home     │
│   Screen    │     │   Goal      │     │   Screen    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │ "Start"            │ "Create"           │ Onboarding
     │                    │                    │ Complete
     ▼                    ▼                    ▼
  Goal prompt      Duration/Tone         Ritual library
```

### 10.2 Feed & Generate Flow

```
┌─────────────┐                         ┌─────────────┐
│    Feed     │───── Tap ritual card ──▶│  Generation │
│   Screen    │         or              │    Form     │
│             │   "Create your own"     │   Screen    │
└─────────────┘                         └─────────────┘
     │                                        │
     │ Vertical scroll                        │ Fill form
     │ Templates + saved                      │ (name, goals,
     │ rituals                                │  duration, voice,
     │                                        │  soundscape)
     │                                        ▼
     │                                  ┌─────────────┐
     │                                  │  Progress   │
     │                                  │   Screen    │
     │                                  └─────────────┘
     │                                        │
     │                                        │ 3-5s mock delay
     │                                        │ animated stages
     │                                        ▼
     │                                  ┌─────────────┐
     │                                  │  Complete   │
     │◀───── "Add to Gallery" ──────────│   Screen    │
     │                                  └─────────────┘
     │                                        │
     │                                        │ "Play Now"
     │                                        ▼
     │                                  ┌─────────────┐
     │                                  │   Session   │
     │                                  │   Player    │
     │                                  └─────────────┘
     │                                        │
     │                                        ▼
     │                                  ┌─────────────┐
     │                                  │ Reflection  │
     │                                  │   Screen    │
     │                                  └─────────────┘
```

### 10.3 Browse & Edit Rituals

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Rituals   │────▶│   Preview   │────▶│   Editor    │
│   Library   │     │   Modal     │     │   Screen    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │ Search/Filter      │ Tap ritual         │ 4 tabs
     │                    │                    │
     ▼                    ▼                    ▼
  Card actions      Start/Edit/Save      Structure, Prompt,
  (Start, Edit,                          Voice, Advanced
   Duplicate,
   Delete)
```

### 10.4 View Progress

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │────▶│   Session   │────▶│   Repeat    │
│   Screen    │     │   Detail    │     │   Ritual    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
     │ Stats, Trends      │ Tap calendar       │ "Repeat"
     │ Calendar, Insights │ day                │ action
     ▼                    ▼                    ▼
```

---

## 11. Development Phases

### 11.1 Phase Overview

```
┌────────────────────────────────────────────────────────────┐
│                    Development Phases                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: UI/UX Mock ◀─── CURRENT                          │
│  ├── Steps 1-15: Foundation (✅ Complete)                   │
│  └── Steps 16-25: Full Screens (🔄 In Progress)            │
│                                                             │
│  Phase 2: Backend Integration (📋 Planned)                  │
│  ├── Real database (Supabase/Firebase)                     │
│  ├── User authentication                                   │
│  └── Real AI integration (Claude API)                      │
│                                                             │
│  Phase 3: Audio & TTS (📋 Planned)                         │
│  ├── Step 12: Data model migration (segments)              │
│  ├── Step 13: Segment editor UI components                 │
│  ├── Step 14: Voice selection UI                           │
│  ├── Step 15: Voice data & Mock TTS provider               │
│  ├── Step 16: Audio stitcher service (Web Audio API)       │
│  ├── Step 17: ElevenLabs TTS integration                   │
│  ├── Step 18: Ritual audio generator orchestration         │
│  └── Step 19: Session player audio integration             │
│                                                             │
│  Phase 4: Production (📋 Planned)                          │
│  ├── Analytics & monitoring                                │
│  ├── Error tracking                                        │
│  └── Performance optimization                              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 11.2 Phase 1 Completion Status

| Step | Name | Status |
|------|------|--------|
| 1 | Project Setup | ✅ Done |
| 2 | Core Data Models | ✅ Done |
| 3 | Service Layer | ✅ Done |
| 4 | Mock Data | ✅ Done |
| 5 | Context Providers | ✅ Done |
| 6 | Custom Hooks | ✅ Done |
| 7 | Base UI Components | ✅ Done |
| 8 | Layout Components | ✅ Done |
| 9 | Routing Setup | ✅ Done |
| 10 | Onboarding Screens | ✅ Done |
| 11 | Home Screen Components | ✅ Done |
| 12 | Home Screen Assembly | ✅ Done |
| 13 | Generation Flow | ⚠️ Verification |
| 14 | PWA Configuration | ⚠️ Partial |
| 15 | Polish & Accessibility | ⚠️ Partial |
| 16 | Ritual Library | 🔄 Planned |
| 17 | Ritual Preview | 🔄 Planned |
| 18 | Ritual Editor | 🔄 Planned |
| 19 | Session Screen | 🔄 Planned |
| 20 | Reflection Screen | 🔄 Planned |
| 21 | Dashboard | 🔄 Planned |
| 22 | Session Detail | 🔄 Planned |
| 23 | Profile/Settings | 🔄 Planned |
| 24 | Route Updates | 🔄 Planned |
| 25 | Final Polish | 🔄 Planned |

---

## 12. Future Architecture

### 12.1 Evolution Roadmap

```
Phase 1 (Current)     Phase 2 (Next)        Phase 3 (Future)
─────────────────     ──────────────        ────────────────
React + Mock      →   Python Backend    →   Cloud Backend
localStorage          File Storage          Supabase/Firebase
No Auth               Token-based           Full Auth
```

### 12.2 Python Backend (Next Phase)

Python FastAPI backend for secure API key management and centralized TTS/AI orchestration.

> **Full Plan**: See [`docs/plans/python_backend_plan.md`](../plans/python_backend_plan.md)

**Summary**:
- Ritual generation via OpenAI
- TTS synthesis (Google Gemini, ElevenLabs)
- File-based storage for rituals and audio
- API keys secured on backend

### 12.3 Cloud Backend (Future Phase)

Full cloud integration with authentication, database, and multi-device sync.

| Component | Technology |
|-----------|------------|
| Auth | Supabase Auth / Firebase Auth |
| Database | Cloud DB (unlimited storage) |
| AI | Claude API / OpenAI |
| TTS | ElevenLabs with CDN caching |

### 12.4 Scalability Considerations

| Area | Current (Mock) | Python Backend | Cloud Backend |
|------|----------------|----------------|---------------|
| **Data** | localStorage (~5MB) | File JSON | Cloud DB |
| **Generation** | Mock (instant) | Real API + rate limiting | Queue system |
| **Audio** | Mock (no files) | File storage | CDN-hosted |
| **API Keys** | Frontend .env | Backend secured | Cloud secrets |
| **Sync** | Single device | Single device | Multi-device |

---

## Appendix A: File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `GoalBox.tsx` |
| Hook | camelCase with `use` prefix | `useLocalStorage.ts` |
| Service | PascalCase | `LocalStorageAdapter.ts` |
| Type file | camelCase | `models.ts` |
| Mock data | camelCase | `rituals.ts` |
| Screen | PascalCase with `Screen` suffix | `HomeScreen.tsx` |

## Appendix B: Import Aliases

```typescript
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/screens/*": ["./src/screens/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/services/*": ["./src/services/*"],
  "@/types/*": ["./src/types/*"],
  "@/mocks/*": ["./src/mocks/*"],
  "@/contexts/*": ["./src/contexts/*"]
}
```

## Appendix C: Scripts

```bash
# Development
pnpm dev              # Start dev server (port 5173)

# Build
pnpm build            # TypeScript check + Vite build
pnpm preview          # Preview production build

# Quality
pnpm type-check       # TypeScript validation
pnpm test             # Playwright E2E tests (when configured)
```

---

*This document is maintained as part of the Koru project. For implementation details, see the plan files in `/plan_koru_ui_mvp/`.*
