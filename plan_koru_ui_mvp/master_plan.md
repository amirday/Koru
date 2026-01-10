# Koru MVP - Master Plan

## Goal
Build mobile-responsive PWA for goal-driven meditation with AI ritual generation. **MVP Scope**: Onboarding + Home + Generate ritual flow

## Design Decisions
1. Platform: Mobile web PWA
2. Colors: Warm (peach #FF9A54, warm whites #FFFCF8)
3. Typography: Lora serif + Inter sans
4. Motion: Minimal, respect prefers-reduced-motion
5. Audio: Smart soundscapes with override
6. AI: Abstract interface, mock initially
7. State: React Context → backend (future)
8. Storage: localStorage → IndexedDB → cloud (progressive)
9. Philosophy: Smart defaults, user override everywhere

## Implementation Steps

| Step | Description | Key Deliverables |
|---|---|---|
| ✅ 01 | Project Setup | React+Vite+Tailwind+PWA, TypeScript strict, design tokens |
| ✅ 02 | Data Models & Types | Timestamp type, Goal (instructions), Ritual (Content+Statistics), Session (Data+Reflection), AI/Storage contracts |
| ✅ 03 | Service Layer | Storage (localStorage), AI (mock), background tasks, notifications |
| 04 | Mock Data | 6-8 rituals, 6 quick starts, varying tones/durations |
| 05 | Context Providers | AppContext (goal/prefs), RitualContext (generation/library) |
| 06 | Custom Hooks | useLocalStorage, useReducedMotion, useNotification, useRitual |
| 07 | Base UI Components | Button, Card, Input, Toggle, Toast, Modal (design system primitives) |
| 08 | Layout Components | ScreenContainer, BottomTabBar (4 tabs), Header |
| 09 | Routing | React Router v6, RequireOnboarding guard, AppLayout |
| 10 | Onboarding Screens | Welcome + Goal Setup, first generation trigger |
| 11 | Home Components | GoalBox, QuickStartCard, GenerateButton, Progress, Questions modal |
| 12 | HomeScreen Assembly | Combine all home components, state integration |
| 13 | Generation Flow | Background execution, progress callbacks, questions, notifications |
| 14 | PWA Configuration | Manifest, icons, service worker, offline support |
| 15 | Polish & Accessibility | Animations, ARIA, keyboard nav, responsive testing, Lighthouse 90+ |

## Success Criteria
✅ User completes onboarding
✅ User generates ritual with progress/questions
✅ Generation works in background (navigate away)
✅ Notifications work (browser + toast)
✅ Data persists across sessions
✅ PWA installable, works offline (except generation)
✅ Design matches spec (warm colors, Lora/Inter fonts)
✅ Accessible (WCAG AA, keyboard nav)
✅ Responsive (375px-1920px)

## Future Phases
- **Phase 2**: Ritual Library & Editor
- **Phase 3**: Session Player & Reflection
- **Phase 4**: Dashboard & Insights
- **Phase 5**: Profile & Settings
- **Phase 6**: Backend Integration

## File Structure
```
Koru/
├── public/ (manifest, icons)
├── src/
│   ├── main.tsx, App.tsx
│   ├── screens/ (Home, Onboarding, Placeholder)
│   ├── components/ (ui/, layout/, cards/, generation/)
│   ├── contexts/ (AppContext, RitualContext)
│   ├── hooks/ (useLocalStorage, useReducedMotion, etc.)
│   ├── services/ (storage, ai, background, notification)
│   ├── types/ (models, services, ui, constants)
│   ├── mocks/ (rituals, quickStarts)
│   ├── styles/ (globals.css, animations.css)
│   └── router/ (routes, guards, layouts)
├── plan_koru_ui_mvp/ (this directory)
├── tailwind.config.js, vite.config.ts, tsconfig.json
└── package.json
```

## Key Principles
- **Start simple, design for growth**: Local-first, abstract dependencies
- **Smart defaults everywhere**: Duration 10min, tone gentle, soundscapes enabled
- **Warm & minimal**: Peach sparingly, warm whites background, minimal animations
- **Accessible by default**: ARIA, keyboard nav, focus states, contrast
- **Sacred session space**: When implemented (Phase 3), fullscreen + minimal
