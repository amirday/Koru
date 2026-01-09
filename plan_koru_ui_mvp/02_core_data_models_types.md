# Step 2: Core Data Models & Types

## Objective
Define TypeScript interfaces for all data structures and service contracts.

## Tasks

### 2.1 Create Data Models (`src/types/models.ts`)

```typescript
// Goal
export interface Goal {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

// Ritual
export interface Ritual {
  id: string;
  title: string;
  intent: string; // Short description
  duration: number; // Total duration in seconds
  tone: 'gentle' | 'neutral' | 'coach';
  pace: 'slow' | 'medium' | 'fast';
  includeSilence: boolean;
  soundscape: string | null;

  // Structure
  sections: RitualSection[];

  // Metadata
  tags: string[];
  isTemplate: boolean;
  isFavorite: boolean;
  usageCount: number;

  // AI generation context
  generatedFrom?: {
    goal: string;
    prompt: string;
    modelVersion: string;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
}

// Ritual Section
export interface RitualSection {
  id: string;
  name: string;
  duration: number; // seconds
  guidanceText: string;
  pauseDensity: number; // 0-100
  enabled: boolean;
  order: number;

  // Variables (replaced at runtime)
  variables?: Record<string, string>;
}

// Session (future)
export interface Session {
  id: string;
  ritualId: string;
  ritualSnapshot: Ritual; // Version at time of session

  // Timing
  startedAt: Date;
  completedAt: Date | null;
  duration: number; // Actual duration in seconds

  // Context
  goal: string; // Goal at time of session
  soundscapeUsed: string | null;

  // Completion
  completed: boolean;
  endedEarly: boolean;

  // Reflection (linked)
  reflectionId: string | null;
}

// Reflection (future)
export interface Reflection {
  id: string;
  sessionId: string;

  // Check-ins
  showedUpDespiteResistance: boolean;
  mindWasBusy: boolean;
  feltCalmer: boolean;
  gainedClarity: boolean;
  feltGratitude: boolean;
  wantToAdjust: boolean;

  // Mood
  moodBefore: number; // 1-10
  moodAfter: number; // 1-10

  // Free text
  notes: string;

  // Smart suggestions (if wantToAdjust)
  suggestedAdjustments?: string[];

  // Timestamp
  createdAt: Date;
}

// Insight (future)
export interface Insight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement';
  title: string;
  description: string;

  // Evidence
  basedOn: {
    sessionIds: string[];
    dateRange: { start: Date; end: Date };
  };

  // Presentation
  priority: number; // 1-10
  isRead: boolean;

  // Timestamp
  createdAt: Date;
}

// User Preferences
export interface UserPreferences {
  // Defaults
  defaultDuration: number; // minutes
  defaultTone: 'gentle' | 'neutral' | 'coach';
  defaultPace: 'slow' | 'medium' | 'fast';

  // Audio
  soundscapeEnabled: boolean;
  defaultSoundscape: string | null;
  volume: number; // 0-100

  // UI
  theme: 'light' | 'dark' | 'auto';
  reducedMotion: boolean;
  largeText: boolean;

  // Notifications
  remindersEnabled: boolean;
  reminderTime: string; // HH:MM format
  reminderDays: number[]; // 0-6 (Sun-Sat)

  // Privacy
  analyticsEnabled: boolean;
}
```

### 2.2 Create Service Interfaces (`src/types/services.ts`)

```typescript
import type { Ritual, RitualSection, Session, Reflection, Insight } from './models';

// AI Service Types
export interface AIGenerationOptions {
  goal: string;
  duration: number; // minutes
  tone: 'gentle' | 'neutral' | 'coach';
  includeSilence?: boolean;
  previousReflections?: Reflection[];
}

export interface AIGenerationProgress {
  stage: 'clarifying' | 'structuring' | 'writing' | 'complete';
  message: string;
  progress: number; // 0-100
}

export interface AIClarifyingQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'free-text';
  options?: string[]; // for multiple-choice
}

export interface AIProvider {
  // Core generation
  generateRitual(
    options: AIGenerationOptions,
    onProgress?: (progress: AIGenerationProgress) => void
  ): Promise<Ritual>;

  // Interactive clarification
  askClarifyingQuestion(
    context: AIGenerationOptions
  ): Promise<AIClarifyingQuestion | null>;

  // Refinement
  refineRitualSection(
    section: RitualSection,
    instruction: 'shorter' | 'softer' | 'more-direct'
  ): Promise<RitualSection>;

  // Insight generation (future)
  generateInsights(
    sessions: Session[],
    reflections: Reflection[]
  ): Promise<Insight[]>;
}

// Storage Service Types
export interface StorageAdapter {
  // CRUD operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;

  // Batch operations
  getMany<T>(keys: string[]): Promise<(T | null)[]>;
  setMany<T>(items: Array<{ key: string; value: T }>): Promise<void>;

  // Collection operations (future)
  getAllKeys(prefix: string): Promise<string[]>;
  clear(prefix: string): Promise<void>;
}

// Background Task Types
export interface BackgroundTask {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: Error;
}

export type BackgroundTaskCallback<T> = (result: T) => void;
export type BackgroundTaskErrorCallback = (error: Error) => void;
```

### 2.3 Create UI Types (`src/types/ui.ts`)

```typescript
// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Card variants
export type CardVariant = 'default' | 'elevated' | 'flat';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // ms
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}

// Navigation
export type TabRoute = 'home' | 'rituals' | 'dashboard' | 'profile';

// Generation state
export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  stage: string;
  message: string;
  taskId?: string;
}

// Form field types
export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}
```

### 2.4 Create Type Guards & Utilities (`src/types/guards.ts`)

```typescript
import type { Ritual, RitualSection, Goal } from './models';

// Type guard for Ritual
export function isRitual(value: unknown): value is Ritual {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'sections' in value &&
    Array.isArray((value as any).sections)
  );
}

// Type guard for Goal
export function isGoal(value: unknown): value is Goal {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'text' in value &&
    'createdAt' in value
  );
}

// Serialization helpers (for localStorage)
export function serializeDate(date: Date): string {
  return date.toISOString();
}

export function deserializeDate(dateString: string): Date {
  return new Date(dateString);
}

// Deep clone utility
export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
```

### 2.5 Create Constants (`src/types/constants.ts`)

```typescript
// Storage keys
export const STORAGE_KEYS = {
  GOAL: 'koru:goal',
  RITUALS: 'koru:rituals',
  PREFERENCES: 'koru:preferences',
  ONBOARDING_COMPLETE: 'koru:onboarding_complete',
  SESSIONS: 'koru:sessions',
  REFLECTIONS: 'koru:reflections',
} as const;

// Duration options (minutes)
export const DURATION_OPTIONS = [5, 10, 15, 20, 30] as const;

// Tone options
export const TONE_OPTIONS = ['gentle', 'neutral', 'coach'] as const;

// Pace options
export const PACE_OPTIONS = ['slow', 'medium', 'fast'] as const;

// Soundscape options
export const SOUNDSCAPE_OPTIONS = [
  { id: 'rain', name: 'Rain', file: '/sounds/rain.mp3' },
  { id: 'ocean', name: 'Ocean Waves', file: '/sounds/ocean.mp3' },
  { id: 'forest', name: 'Forest', file: '/sounds/forest.mp3' },
  { id: 'white-noise', name: 'White Noise', file: '/sounds/white-noise.mp3' },
  { id: 'none', name: 'None', file: null },
] as const;

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultDuration: 10,
  defaultTone: 'gentle',
  defaultPace: 'medium',
  soundscapeEnabled: true,
  defaultSoundscape: null, // Auto-select
  volume: 50,
  theme: 'light',
  reducedMotion: false,
  largeText: false,
  remindersEnabled: false,
  reminderTime: '09:00',
  reminderDays: [1, 2, 3, 4, 5], // Mon-Fri
  analyticsEnabled: true,
};

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
} as const;

// Generation stages
export const GENERATION_STAGES = [
  { stage: 'clarifying', message: 'Understanding your intention...', progress: 25 },
  { stage: 'structuring', message: 'Choosing the right pace...', progress: 50 },
  { stage: 'writing', message: 'Crafting your guidance...', progress: 75 },
  { stage: 'complete', message: 'Your ritual is ready', progress: 100 },
] as const;
```

## Verification

```bash
# Type check
pnpm lint

# Should compile without errors
```

## Next Step

Proceed to **Step 3: Service Layer**
