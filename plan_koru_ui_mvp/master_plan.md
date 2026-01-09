# Koru Meditation App - MVP Implementation Master Plan

## Project Overview

**Goal**: Build a mobile-responsive PWA for a goal-driven meditation app with AI ritual generation

**MVP Scope**: Onboarding + Home + Generate ritual flow

**Timeline**: Phased implementation starting with foundation, building to complete MVP

---

## Design Decisions Summary

1. **Platform**: Mobile web (responsive PWA)
2. **Colors**: Warm & inviting (peach #FF9A54, warm whites #FFFCF8)
3. **Typography**: Lora (serif) + Inter (sans-serif)
4. **Motion**: Minimal animations, respect prefers-reduced-motion
5. **Audio**: Smart soundscapes with user override
6. **AI**: Abstract interface, mock implementation initially
7. **State**: React Context (start simple, plan for backend)
8. **Storage**: localStorage → IndexedDB → cloud (progressive)
9. **Philosophy**: Smart defaults everywhere, user can override

---

## Implementation Steps

### Step 1: Project Setup & Configuration
- Install dependencies (React, Vite, Tailwind, Router, PWA plugin)
- Configure TypeScript (strict mode, path aliases)
- Configure Vite (plugins, dev server, PWA)
- Configure Tailwind (custom colors, typography, design tokens)
- Create base styles (CSS reset, fonts, reduced motion)

**Files**: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `src/styles/globals.css`

---

### Step 2: Core Data Models & Types
- Define TypeScript interfaces for all data structures
- Goal, Ritual, RitualSection models
- Session, Reflection models (future)
- Service interfaces (AI, Storage)
- UI component types

**Files**: `src/types/models.ts`, `src/types/services.ts`, `src/types/ui.ts`

---

### Step 3: Service Layer
- Storage abstraction (interface + localStorage implementation)
- AI abstraction (interface + mock implementation)
- Background task service (async execution, notifications)
- Notification service (Web API + in-app toast)

**Files**: `src/services/storage/*`, `src/services/ai/*`, `src/services/background/*`, `src/services/notification/*`

---

### Step 4: Mock Data
- Create realistic ritual data (6-8 rituals)
- Create quick start rituals (6 items)
- Multiple tones, durations, sections
- Complete guidance text

**Files**: `src/mocks/rituals.ts`, `src/mocks/quickStarts.ts`

---

### Step 5: Context Providers
- AppContext (goal, preferences, onboarding state)
- RitualContext (generation, library, editing)
- localStorage persistence
- Action dispatchers

**Files**: `src/contexts/AppContext.tsx`, `src/contexts/RitualContext.tsx`

---

### Step 6: Custom Hooks
- useLocalStorage (typed persistence)
- useReducedMotion (accessibility)
- useBackgroundTask (async operations)
- useNotification (permission + display)
- useRitual (CRUD operations)

**Files**: `src/hooks/*.ts`

---

### Step 7: Base UI Components
- Button (variants, sizes, loading state)
- Card (compound component with Header/Body/Footer)
- Input (text, textarea, validation)
- Slider (range with value display)
- Toggle (checkbox, switch)
- Toast (notifications with auto-dismiss)
- Modal (overlay, focus trap, animations)

**Files**: `src/components/ui/*.tsx`

---

### Step 8: Layout Components
- ScreenContainer (safe areas, max width, scroll)
- BottomTabBar (4 tabs, active state, icons)
- Header (title, back button, actions)

**Files**: `src/components/layout/*.tsx`

---

### Step 9: Routing Setup
- Define routes (onboarding, home, placeholders)
- Router configuration
- Navigation guards (RequireOnboarding)
- App layout wrapper

**Files**: `src/router/routes.tsx`, `src/router/index.tsx`, `src/App.tsx`

---

### Step 10: Onboarding Screens
- WelcomeScreen (headline, CTA)
- InitialGoalSetupScreen (goal input, preferences, first generation)
- Integration with AppContext
- Navigate to home on complete

**Files**: `src/screens/Onboarding/*.tsx`

---

### Step 11: Home Screen Components
- GoalBox (editable text, autosave)
- QuickStartCard (title, duration, benefit, tap action)
- GenerateButton (CTA with configuration)
- GenerationProgress (staged messages, progress bar)
- ClarifyingQuestionModal (multi-choice + free text)

**Files**: `src/components/cards/*.tsx`, `src/components/generation/*.tsx`

---

### Step 12: HomeScreen Assembly
- Combine all components
- Header with greeting
- Goal Box
- Quick Starts carousel
- Generate section
- Generation state management
- Bottom navigation

**Files**: `src/screens/Home/HomeScreen.tsx`

---

### Step 13: Generation Flow Implementation
- Start generation in RitualContext
- Background task execution
- Progress updates
- Clarifying questions
- Notification on complete
- Navigate away support

**Files**: Updated `src/contexts/RitualContext.tsx`

---

### Step 14: PWA Configuration
- Create manifest.json
- Generate app icons
- Configure service worker
- Asset caching strategy
- Offline support

**Files**: `public/manifest.json`, `public/icons/*`, `vite.config.ts`

---

### Step 15: Polish & Accessibility
- Add animations (page transitions, modals, toasts)
- Respect prefers-reduced-motion
- Accessibility audit (ARIA, keyboard, focus)
- Responsive testing (mobile, tablet, desktop)
- Error handling and validation

**Files**: `src/styles/animations.css`, various component updates

---

## Success Criteria

✅ User completes onboarding (welcome → goal setup)
✅ User sees home screen with goal box and quick starts
✅ User generates ritual (with progress and questions)
✅ Generation works in background (navigate away)
✅ Notifications work (browser + in-app)
✅ Data persists across sessions
✅ Bottom navigation works
✅ PWA is installable and works offline
✅ Design matches UI spec
✅ Accessibility basics met
✅ Responsive on all screen sizes

---

## Future Phases

- **Phase 2**: Ritual Library & Editor
- **Phase 3**: Session Player & Reflection
- **Phase 4**: Dashboard & Insights
- **Phase 5**: Profile & Settings
- **Phase 6**: Backend Integration

---

## File Structure Overview

```
/Users/amirdaygmail.com/projects/Koru/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sounds/ (future)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── screens/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── mocks/
│   ├── styles/
│   └── router/
├── plan_koru_ui_mvp/ (this directory)
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Notes

- Keep it simple: build MVP first, design for future expansion
- Smart defaults: every setting has intelligent default
- Abstract dependencies: AI and storage behind interfaces
- Local-first: design for localStorage → IndexedDB → cloud migration
- Warm colors: use peach sparingly, warm whites for backgrounds
- Minimal motion: only essential animations
- Sacred session: when implemented (Phase 3), keep it fullscreen and minimal
