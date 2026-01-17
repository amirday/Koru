# Koru UI Step 2: Full Mock Implementation Plan

## Overview
This plan covers implementing all remaining screens from UI_design.md as fully interactive mocked UI.

---

## Gap Analysis: Current State vs Full UI Mock

### What's Implemented (Steps 1-12)

| Area | Status | Details |
|------|--------|---------|
| Project Setup | ✅ Done | Vite + React 18 + TypeScript + Tailwind |
| Data Models | ✅ Done | Goal, Ritual, RitualSection, Session, Reflection types |
| Services | ✅ Done | StorageService, MockAIProvider, BackgroundTaskService, NotificationService |
| Mock Data | ✅ Done | 8 rituals, 6 quick starts in `src/mocks/` |
| Contexts | ✅ Done | AppContext (goal, prefs), RitualContext (generation, library) |
| Hooks | ✅ Done | useLocalStorage, useReducedMotion, useNotification, useRitual, useBackgroundTask |
| Base UI | ✅ Done | Button, Card, Input, Toggle, Toast, Modal, Slider |
| Layout | ✅ Done | ScreenContainer, BottomTabBar (4 tabs), Header |
| Routing | ✅ Done | React Router v6, RequireOnboarding guard, AppLayout |
| Onboarding | ✅ Done | WelcomeScreen, InitialGoalSetupScreen |
| Home Screen | ✅ Done | GoalBox, QuickStartCard, GenerateButton, GenerationProgress, ClarifyingQuestionModal |

### What's Partially Implemented (Steps 13-15)

| Step | Status | Gap |
|------|--------|-----|
| 13: Generation Flow | ⚠️ Needs verification | MockAIProvider exists but end-to-end flow untested |
| 14: PWA Configuration | ⚠️ Incomplete | Missing manifest.json, app icons, iOS meta tags |
| 15: Polish & Accessibility | ⚠️ Incomplete | Missing animations.css, ARIA audit, responsive testing |

### What's NOT Implemented (Screens)

| Screen | Route | Current State | UI_design.md Section |
|--------|-------|---------------|---------------------|
| Ritual Library | `/rituals` | Placeholder | §7 Screen 2 |
| Ritual Preview | Modal | Not started | §7.2 |
| Ritual Editor | `/rituals/:id/edit` | Not started | §8 Screen 2b |
| Session Player | `/session/:id` | Not started | §9 Screen 3 |
| Reflection | `/reflection/:id` | Not started | §10 Screen 4 |
| Dashboard | `/dashboard` | Placeholder | §11 Screen 5 |
| Session Detail | `/session-detail/:id` | Not started | §12 Screen 6 |
| Profile/Settings | `/profile` | Placeholder | §13 Screen 7 |

### What's NOT Implemented (Components)

| Component | Purpose | Needed For |
|-----------|---------|------------|
| SearchInput | Search with clear button | Ritual Library |
| FilterDropdown | Multi-option filter | Ritual Library |
| RitualCard (enhanced) | Card with action menu | Ritual Library |
| RitualPreviewModal | Full ritual overview | Ritual Library |
| SectionList | Collapsible section list | Preview, Editor |
| EditorTabs | 4-tab navigation | Ritual Editor |
| SectionEditor | Drag-reorderable sections | Ritual Editor |
| DragHandle | Reorder indicator | Ritual Editor |
| GuidanceText | Fading serif text | Session |
| SessionControls | Pause/restart (auto-hide) | Session |
| ReflectionCheckboxes | Multi-select observations | Reflection |
| MoodSlider | Before/after dual slider | Reflection |
| StatsOverview | Stat cards grid | Dashboard |
| TrendsChart | Line/bar chart | Dashboard |
| CalendarHeatmap | Monthly grid | Dashboard |
| InsightTile | AI observation card | Dashboard |
| TimePicker | Time selection | Profile |
| DaySelector | Multi-day toggle | Profile |
| PreferencesSection | Settings group | Profile |

### What's NOT Implemented (Mock Data)

| Data | File | Contents |
|------|------|----------|
| Dashboard stats | `src/mocks/dashboardData.ts` | Streak, minutes, mood deltas |
| Session history | `src/mocks/sessions.ts` | 10-15 past sessions with reflections |
| Insights | `src/mocks/insights.ts` | 4-5 AI-generated observation strings |

---

## Implementation Plan

### Step 16: Ritual Library Screen

**Objective**: Replace placeholder with full ritual library UI

**Files to create:**
- `src/screens/Rituals/RitualLibraryScreen.tsx`
- `src/components/rituals/RitualCard.tsx`
- `src/components/ui/SearchInput.tsx`
- `src/components/ui/FilterDropdown.tsx`

**Features (from UI_design.md §7):**
- Search bar (filters rituals by title/tags)
- Filter tabs: All | Saved | Recent | Templates
- Duration filter dropdown (Any, 5min, 10min, 15min, 20min+)
- Ritual cards showing:
  - Title, duration badge, tone indicator
  - Last used date
  - Action menu (Start, Edit, Duplicate, Delete)
- Empty state when no matches
- Tap card → open preview modal
- Tap "Start" → navigate to session

**Mock behavior:**
- Filter/search operates on in-memory ritual list from context
- Delete shows confirm modal, removes from state (not persisted)
- Duplicate creates copy with "(Copy)" suffix

---

### Step 17: Ritual Preview Modal

**Objective**: Show ritual details before starting session

**Files to create:**
- `src/components/rituals/RitualPreviewModal.tsx`
- `src/components/rituals/SectionList.tsx`

**Features (from UI_design.md §7.2):**
- Modal overlay with ritual details
- Collapsed section list (tap to expand)
- Shows: total duration, tone, soundscape setting
- CTAs:
  - "Start Session" → `/session/:id`
  - "Edit" → `/rituals/:id/edit`
  - "Save as New" → duplicate + edit
- Close button / tap outside to dismiss

---

### Step 18: Ritual Editor Screen

**Objective**: Full 4-tab ritual editor

**Files to create:**
- `src/screens/Rituals/RitualEditorScreen.tsx`
- `src/components/editor/EditorTabs.tsx`
- `src/components/editor/StructureTab.tsx`
- `src/components/editor/PromptTab.tsx`
- `src/components/editor/VoicePacingTab.tsx`
- `src/components/editor/AdvancedTab.tsx`
- `src/components/editor/SectionEditor.tsx`
- `src/components/ui/DragHandle.tsx`

**Features (from UI_design.md §8):**

**Top Bar:**
- Back button (with unsaved changes warning)
- Editable title (inline edit)
- Save status indicator ("Saved" / "Unsaved changes")

**Tab 1 - Structure:**
- Timeline list of sections
- Each section: name, duration slider, enable/disable toggle
- Drag handle for reordering
- "Add section" button (from templates)
- "Preview session" CTA

**Tab 2 - Prompt:**
- Master prompt textarea
- Read-only preview of generated text
- "Regenerate from prompt" button (mocked delay)

**Tab 3 - Voice & Pacing:**
- Tone selector: Gentle | Neutral | Coach
- Pace selector: Slow | Medium | Fast
- Silence selector: Off | Light | Heavy
- Soundscape dropdown: Auto | Rain | Ocean | Forest | White Noise | None
- Volume slider (when soundscape enabled)
- "Preview sound" button (shows toast in mock)

**Tab 4 - Advanced:**
- Language selector: EN | HE (disabled in mock)
- "Export ritual (JSON)" button (mocked download)
- Safety boundaries info (read-only)

**Mock behavior:**
- All changes update local state
- "Save" persists to RitualContext
- "Regenerate" shows progress, returns same content after delay

---

### Step 19: Session Screen (Sacred Mode)

**Objective**: Fullscreen distraction-free meditation player

**Files to create:**
- `src/screens/Session/SessionScreen.tsx`
- `src/components/session/GuidanceText.tsx`
- `src/components/session/SessionControls.tsx`
- `src/hooks/useSessionPlayer.ts`

**Features (from UI_design.md §9):**

**Visual:**
- Fullscreen (hides BottomTabBar)
- Warm solid background (#FFFCF8)
- Center-aligned guidance text (Lora serif, large)
- Text fades in (300ms) when guidance appears
- Text fades out when guidance ends (silence)

**Controls (minimal, auto-hide after 3s):**
- Pause button (toggle pause/resume)
- Restart button (confirm dialog: "Restart from beginning?")
- No progress bar (intentional per spec)
- No skip/forward buttons

**Gestures:**
- Tap on text: cycle text size (medium → large → extra-large → medium)
- Long press (2s) anywhere: show "End session?" confirm
- Swipe down from top: show exit confirm
- Tap controls area: show controls if hidden

**Session States:**
- Playing: text visible, controls auto-hide
- Paused: "Paused" indicator, controls stay visible
- Silence: no text, background only
- Ending: fade transition to reflection

**Mock behavior:**
- Load ritual sections, play through with timers
- Each section shows its guidance text for `durationSeconds`
- On complete → navigate to `/reflection/:sessionId`
- Create mock Session record in context

---

### Step 20: Reflection Screen

**Objective**: Post-session reflection capture

**Files to create:**
- `src/screens/Session/ReflectionScreen.tsx`
- `src/components/reflection/ReflectionCheckboxes.tsx`
- `src/components/reflection/MoodSlider.tsx`

**Features (from UI_design.md §10):**

**Header:**
- "Nice work."
- "What did you notice?"

**Checkboxes (multi-select):**
- [ ] I showed up despite resistance
- [ ] My mind was busy
- [ ] I felt calmer
- [ ] I gained clarity
- [ ] I felt gratitude
- [ ] I want to adjust the ritual

**Mood Sliders:**
- "Before session" (1-5 scale)
- "After session" (1-5 scale)
- Visual: horizontal slider with emoji/number indicators

**Free Text:**
- Textarea with placeholder: "One sentence is enough."

**Actions:**
- "Save reflection" → save to context, navigate home with toast
- "Edit ritual based on this" → navigate to editor
- "Skip" → navigate home without saving

**Smart Suggestions (shown when "adjust ritual" checked):**
- Chips: Shorter | More silence | More breath | Softer tone | More coaching
- Tapping chip → navigate to editor with suggestion applied

---

### Step 21: Dashboard Screen

**Objective**: Practice tracking and insights visualization

**Files to create:**
- `src/screens/Dashboard/DashboardScreen.tsx`
- `src/components/dashboard/StatsOverview.tsx`
- `src/components/dashboard/TrendsChart.tsx`
- `src/components/dashboard/CalendarHeatmap.tsx`
- `src/components/dashboard/InsightsFeed.tsx`
- `src/components/dashboard/InsightTile.tsx`
- `src/mocks/dashboardData.ts`
- `src/mocks/sessions.ts`

**Features (from UI_design.md §11):**

**5.1 At a Glance (4 stat cards):**
- Current streak: "7 days"
- Minutes this week: "45 min"
- Most used ritual: "Morning Focus"
- Avg mood delta: "+2.1"

**5.2 Trends:**
- Simple line chart showing minutes over past 2 weeks
- Implementation: SVG-based or lightweight chart (no heavy library)

**5.3 Calendar:**
- Monthly heatmap grid
- Days colored by practice (none/light/medium/heavy)
- Tap day → navigate to session detail

**5.4 Insights Feed:**
- 3-4 insight cards with AI observations
- Examples from spec:
  - "Morning sessions improve your mood most"
  - "Short rituals complete more often"
  - "Breath focus correlates with calm"

**Mock data:**
- 10-15 hardcoded past sessions
- Pre-calculated stats
- Static insights array

---

### Step 22: Session Detail Screen

**Objective**: View historical session details

**Files to create:**
- `src/screens/Dashboard/SessionDetailScreen.tsx`

**Features (from UI_design.md §12):**
- Header with date/time
- Ritual name and duration
- Completion status (completed/partial)
- Reflection display (if saved):
  - Checkboxes selected
  - Mood before/after
  - Free text note
- CTAs:
  - "Repeat this ritual" → `/session/:ritualId`
  - "Create ritual from session" → `/rituals/new` (mocked)
- Back button → dashboard

---

### Step 23: Profile/Settings Screen

**Objective**: User preferences and settings management

**Files to create:**
- `src/screens/Profile/ProfileScreen.tsx`
- `src/components/profile/ReminderSettings.tsx`
- `src/components/profile/PreferencesSection.tsx`
- `src/components/ui/TimePicker.tsx`
- `src/components/ui/DaySelector.tsx`

**Features (from UI_design.md §13):**

**Sections:**

1. **Goal** (card)
   - Current goal text display
   - "Edit" button → inline edit or modal

2. **Reminders** (card)
   - Enable/disable toggle
   - Time picker (hour:minute)
   - Day selector (S M T W T F S toggles)

3. **Defaults** (card)
   - Default duration dropdown (5/10/15/20 min)
   - Default tone dropdown (Gentle/Neutral/Coach)
   - Soundscapes enabled toggle

4. **Notifications** (toggle row)
   - Browser notifications enable/disable

5. **Appearance** (card)
   - Theme: Light (only option, disabled selector)
   - Language: EN (only option, disabled selector)

6. **Data** (card)
   - "Export my data" button → mocked JSON download
   - "Clear all data" button → confirm modal, clears localStorage

7. **About** (links)
   - Privacy Policy (external link placeholder)
   - Terms of Service (external link placeholder)
   - Version: "1.0.0 (Mock)"

**Persistence:**
- All settings save to AppContext → localStorage
- Changes apply immediately

---

### Step 24: Route Updates & Navigation

**Objective**: Wire up all new screens to router

**Files to modify:**
- `src/router/routes.tsx`
- `src/router/AppLayout.tsx` (conditionally hide nav for session)

**New routes:**
```tsx
/rituals                    → RitualLibraryScreen
/rituals/:id/edit           → RitualEditorScreen
/rituals/new                → RitualEditorScreen (new ritual mode)
/session/:ritualId          → SessionScreen (fullscreen, no nav)
/reflection/:sessionId      → ReflectionScreen
/dashboard                  → DashboardScreen
/session-detail/:sessionId  → SessionDetailScreen
/profile                    → ProfileScreen
```

**Navigation guards:**
- SessionScreen: Hide BottomTabBar completely
- ReflectionScreen: Hide BottomTabBar
- Others: Show standard AppLayout with nav

---

### Step 25: Final Polish & Testing

**Objective**: Ensure all flows work end-to-end

**Tasks:**
- [ ] Verify all navigation paths work
- [ ] Add loading states where appropriate
- [ ] Add empty states for lists
- [ ] Test responsive layouts (375px, 768px, 1024px)
- [ ] Keyboard navigation for all interactive elements
- [ ] Verify prefers-reduced-motion disables animations
- [ ] Run TypeScript check (`pnpm type-check`)
- [ ] Run build (`pnpm build`)
- [ ] Manual test all user flows

**Key User Flows to Test:**
1. Onboarding → Home → Generate → Session → Reflection → Home
2. Home → Rituals → Preview → Start Session
3. Home → Rituals → Edit → Save → Back
4. Dashboard → Calendar → Session Detail → Repeat
5. Profile → Edit settings → Verify persistence

---

## File Structure After Completion

```
src/
├── screens/
│   ├── Home/
│   │   └── HomeScreen.tsx ✅
│   ├── Onboarding/
│   │   ├── WelcomeScreen.tsx ✅
│   │   └── InitialGoalSetupScreen.tsx ✅
│   ├── Rituals/
│   │   ├── RitualLibraryScreen.tsx (NEW)
│   │   └── RitualEditorScreen.tsx (NEW)
│   ├── Session/
│   │   ├── SessionScreen.tsx (NEW)
│   │   └── ReflectionScreen.tsx (NEW)
│   ├── Dashboard/
│   │   ├── DashboardScreen.tsx (NEW)
│   │   └── SessionDetailScreen.tsx (NEW)
│   └── Profile/
│       └── ProfileScreen.tsx (NEW)
├── components/
│   ├── ui/ ✅ (+ SearchInput, FilterDropdown, TimePicker, DaySelector, DragHandle)
│   ├── layout/ ✅
│   ├── cards/ ✅
│   ├── generation/ ✅
│   ├── rituals/ (NEW)
│   │   ├── RitualCard.tsx
│   │   ├── RitualPreviewModal.tsx
│   │   └── SectionList.tsx
│   ├── editor/ (NEW)
│   │   ├── EditorTabs.tsx
│   │   ├── StructureTab.tsx
│   │   ├── PromptTab.tsx
│   │   ├── VoicePacingTab.tsx
│   │   ├── AdvancedTab.tsx
│   │   └── SectionEditor.tsx
│   ├── session/ (NEW)
│   │   ├── GuidanceText.tsx
│   │   └── SessionControls.tsx
│   ├── reflection/ (NEW)
│   │   ├── ReflectionCheckboxes.tsx
│   │   └── MoodSlider.tsx
│   ├── dashboard/ (NEW)
│   │   ├── StatsOverview.tsx
│   │   ├── TrendsChart.tsx
│   │   ├── CalendarHeatmap.tsx
│   │   ├── InsightsFeed.tsx
│   │   └── InsightTile.tsx
│   └── profile/ (NEW)
│       ├── ReminderSettings.tsx
│       └── PreferencesSection.tsx
├── hooks/
│   └── useSessionPlayer.ts (NEW)
├── mocks/
│   ├── rituals.ts ✅
│   ├── quickStarts.ts ✅
│   ├── dashboardData.ts (NEW)
│   ├── sessions.ts (NEW)
│   └── insights.ts (NEW)
└── router/
    └── routes.tsx (MODIFY)
```

---

## Estimated Effort

| Step | Complexity | New Files |
|------|------------|-----------|
| 16: Ritual Library | Medium | 4 |
| 17: Ritual Preview | Low | 2 |
| 18: Ritual Editor | High | 8 |
| 19: Session Screen | High | 4 |
| 20: Reflection | Medium | 3 |
| 21: Dashboard | High | 7 |
| 22: Session Detail | Low | 1 |
| 23: Profile | Medium | 5 |
| 24: Routes | Low | 0 (modify) |
| 25: Polish | Medium | 0 |

**Total new files**: ~34
**Total steps**: 10

---

## Success Criteria

- [ ] All 4 bottom nav tabs show real screens (no placeholders)
- [ ] Can complete full meditation flow: Generate → Session → Reflection
- [ ] Can browse, preview, and edit rituals
- [ ] Dashboard shows mocked stats and calendar
- [ ] Profile settings persist across refresh
- [ ] All interactions feel responsive and polished
- [ ] Design matches UI_design.md spec (warm colors, Lora/Inter fonts)
- [ ] No TypeScript errors
- [ ] No console errors in production build
