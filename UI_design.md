# Meditation App – Full UI Design Specification
*(Senior UI Designer + Meditation Guide Perspective)*

This document defines the **full UI/UX design** for a goal-driven meditation app.
It is intended to be used as input for an AI UI generator (e.g. Claude) to produce screens, flows, and components.

---

## Design Decisions Summary

**Key choices made during design phase (January 2026):**

1. **Platform**: Mobile web (responsive PWA) - installable, works offline, cross-platform
2. **Color Palette**: Warm & inviting (soft peach #FF9A54, warm whites #FFFCF8, gentle yellows)
3. **Typography**: Lora (serif) for headlines/guidance + Inter (sans-serif) for UI/body text
4. **Motion**: Minimal animations only, respect prefers-reduced-motion by default
5. **Audio**: Smart soundscapes with user override (auto-select, user can always change)
6. **AI Generation**: Hybrid approach - background execution, progress messages, clarifying questions
7. **Session Controls**: Minimal only (pause/restart) - keep the experience sacred
8. **Architecture**: Start simple (localStorage, mock AI), design for growth (backend DB, real AI)
9. **Philosophy**: Smart defaults everywhere, user can override anything

These decisions prioritize **simplicity now, extensibility later**, with a focus on creating a calm, premium UI experience.

---

## 1. Product Vision

**One-liner:**
A goal-driven ritual generator that creates personalized meditation sessions, guides the user with minimal UI, captures reflection, and turns it into insights and better future rituals.

**Core principles**
- Calm, minimal, intentional
- Reduce friction → increase consistency
- Content > controls
- Reflection feeds personalization
- Smart defaults with user override everywhere

---

## 1.5 Platform & Technical Foundation

### Platform
**Mobile web (responsive PWA)**
- Progressive web app that works on all devices
- Installable like a native app
- Works offline with service worker caching
- Mobile-first design, scales to tablet and desktop

### Technical Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: React Router v6
- **State Management**: React Context initially, designed for future backend DB migration
- **Storage**: localStorage → IndexedDB → cloud sync (progressive migration)
- **AI Backend**: Abstract interface, pluggable providers (start with mock, swap to Claude/OpenAI later)
- **Audio**: Howler.js for soundscape management
- **PWA**: vite-plugin-pwa with Workbox for offline support

### Design Philosophy
- **Start simple, design for growth**: Begin with local-only, mock AI, migrate to backend/real AI later
- **Abstract external dependencies**: AI and storage behind interfaces for easy swapping
- **Progressive enhancement**: Each phase adds capability without breaking previous work
- **Local-first**: User data stored locally, with optional cloud sync in future

---

## 2. Navigation Model

### Bottom Tab Bar (persistent)
1. **Home** – goals, quick starts, generate
2. **Rituals** – ritual library + editor
3. **Dashboard** – trends, calendar, insights
4. **Profile** – settings, reminders, preferences

⚠️ **Session screen is fullscreen modal**  
- Hides navigation
- Sacred, distraction-free

---

## 3. Global Design Language

### Tone
- Calm, confident, soft authority
- Minimal cognitive load
- Encouraging, not preachy

### Visual Style
- Large whitespace
- Rounded cards (16–20px radius)
- Subtle elevation
- Warm, inviting, non-stimulating colors

### Color Palette (Warm & Inviting)
**Primary Accent**
- Peach: `#FF9A54` (primary CTAs, active states, accents)

**Backgrounds**
- Warm White: `#FFFCF8` (main background)
- Gentle Yellow: `#FFF9E6` (subtle highlights, cards)
- Warm tones: `#FFF8F0`, `#FFE8D0` (layered cards, sections)

**Neutrals**
- Calm Gray: `#F9F9F8` to `#252527` (text, borders, inactive states)
- Use warm-toned grays, not pure gray

**Functional**
- Success: `#A3D9B1` (soft green)
- Warning: `#FFD8B0` (warm amber)
- Error: `#FFB3BA` (soft coral)

**Usage Guidelines**
- Use peach sparingly for primary actions and active states
- Default to warm white backgrounds
- Text: dark warm grays on light backgrounds
- Avoid pure white (#FFFFFF) and pure black (#000000)
- All colors should feel warm and inviting, not clinical or cold

### Typography
**Typefaces**
- **Serif (Lora)**: Headlines, session guidance text, quotes
  - Brings warmth, authority, calm
  - Used for content that deserves attention
- **Sans-serif (Inter)**: Body text, UI controls, labels
  - Clean, readable, modern
  - Used for interface elements

**Scale**
- Display: 2.5rem / 40px (Lora) - Welcome headlines
- H1: 2rem / 32px (Lora) - Screen titles
- H2: 1.5rem / 24px (Lora) - Section headers
- H3: 1.25rem / 20px (Inter Semi-Bold) - Card titles
- Body: 1rem / 16px (Inter) - Standard text
- Small: 0.875rem / 14px (Inter) - Helper text, labels
- Session text: 1.5rem–2.5rem (Lora) - Adjustable by user

**Hierarchy**
- Use size and weight, not color, for hierarchy
- Maintain clear contrast between headline and body
- Line height: 1.5–2 for readability

### Animation & Motion
**Principle**: Minimal and respectful
- **Only animate**:
  - Page transitions (fade, subtle slide)
  - Modal enter/exit
  - Toast notifications
  - Loading states
- **Never animate**:
  - Content appearing on scroll
  - Decorative flourishes
  - Attention-grabbing effects

**Motion Settings**
- Duration: 200–300ms (fast, not distracting)
- Easing: ease-out (natural, settles quickly)
- Respect `prefers-reduced-motion`: disable ALL animations if user has this preference

### Accessibility
- 44px minimum tap targets
- High contrast text (WCAG AA: 4.5:1 for normal, 3:1 for large text)
- Reduced motion support (critical - respect OS preference)
- VoiceOver / screen reader labels on all interactive elements
- Keyboard navigation support (focus indicators, tab order)
- Large text option in session screen (user adjustable)
- Focus indicators visible and clear

---

## 4. Core Components (Reusable)

- Goal Box (editable, autosave)
- Quick Start Card (carousel)
- Primary CTA (Generate)
- Ritual Card (title, instructions, duration)
- Section Editor (accordion)
- Session Player (pause / restart only)
- Reflection Check-ins (checkboxes + slider)
- Insight Tile
- Calendar Heatmap
- Toast / Gentle feedback messages

---

## 5. Screen 0 – Onboarding (Added)

### 0.1 Welcome
- Headline: “Build a ritual you’ll actually repeat.”
- CTA: “Start”
- Secondary: “I already have a ritual”

### 0.2 Initial Goal Setup
- Prompt: “What do you want more of this month?”
- Multi-line text input
- Suggestion chips:
  - Focus
  - Calm
  - Confidence
  - Gratitude
  - Better sleep
- Duration preference: 5 / 10 / 15 / 20 min
- Tone preference: Gentle / Neutral / Coach
- CTA: “Create my first ritual”

---

## 6. Screen 1 – Home

### Layout (Top → Bottom)

#### Header
- Greeting (optional)
- Reminder / streak indicator

#### 1.1 Goal Box
- Title: “My goal”
- Editable text
- Inline edit (tap or pencil)
- Helper text: “Short is fine. Clarity beats poetry.”

#### 1.2 Quick Starts (Horizontal Carousel)
Each card includes:
- Title (e.g. “Reset – 3 min”)
- Benefit (“For anxious moments”)
- Tag (Breath / Body / Sleep)
- Tap → start session
- Long-press → preview / edit / save

Suggested quick starts:
- Reset (3)
- Focus Primer (5)
- Wind-Down (10)
- Gratitude (7)
- Confidence (8)
- Silent Timer (5–20)

#### 1.3 Generate Section
- Primary CTA: **"Generate today's ritual"**
- Optional configuration (smart defaults with user override):
  - Duration selector (dropdown: 5/10/15/20 min)
  - Tone selector (dropdown: Gentle/Neutral/Coach)
  - "Include silence" toggle
  - Soundscape selector (dropdown: auto-select based on ritual type, user can override)

**Generating Flow (Hybrid Approach)**

*The generation experience combines real-time feedback with non-blocking background execution:*

**Phase 1: Active Generation UI**
- Full-width card appears with progress indicator
- Shows staged messages as AI works:
  1. "Understanding your intention..." (0–25%, ~1.5s)
  2. "Choosing the right pace..." (25–50%, ~1.5s)
  3. "Crafting your guidance..." (50–75%, ~1.5s)
  4. "Your ritual is ready" (75–100%, ~1.5s)
- Progress bar animates smoothly between stages
- User can dismiss/background the task at any time

**Phase 2: Clarifying Questions (Optional)**
- During generation, AI may prompt for clarification
- Modal appears with question:
  - Question text (e.g., "What time of day will you practice?")
  - Multiple choice options (radio buttons)
  - "Other (type your own)" option with text input
  - Submit button
- Generation pauses until user responds
- Can happen at any stage (typically after "Understanding your intention")

**Phase 3: Background Generation**
- User can navigate away to other tabs/screens
- Generation continues in background (async task)
- Small indicator in header or bottom tab bar shows "Generating..."
- When complete:
  - Browser notification (if permission granted): "Your ritual is ready!"
  - In-app toast notification (always shown)
  - Tapping notification navigates to ritual preview/library

**Error Handling**
- If generation fails: show error toast with retry button
- Network errors: graceful fallback with "Try again" option
- Timeout after 30s: show warning, offer to continue waiting or cancel

#### 1.4 Bottom Navigation Bar

---

## 7. Screen 2 – Rituals

### 2.1 Ritual Library
- Search bar
- Filters: Duration, Goal tag, Last used
- Sections:
  - Saved rituals
  - Recent
  - Templates
- Ritual card actions:
  - Start
  - Edit
  - Duplicate
  - Delete

### 2.2 Ritual Preview
- Ritual overview
- Section list (collapsed)
- Total duration
- CTAs:
  - Start session
  - Edit
  - Save as new

---

## 8. Screen 2b – Ritual Editor

A **structured editor**, not a free document.

### Top Bar
- Back
- Editable ritual title
- Save status indicator

### Internal Tabs
1. Structure
2. Prompt
3. Voice & Pacing
4. Advanced

---

### 8.1 Structure Tab
- Timeline list of sections
- Drag & reorder
- Each section:
  - Name
  - Duration control
  - Enable/disable toggle
- Add section button (from templates)
- Preview session CTA

### Section Detail (Expanded)
- Text editor
- Quick actions:
  - Shorter
  - Softer
  - More direct
- Variables:
  - {instructions} (user's meditation goal/intent)
  - {duration}
  - {tone}
- Pause density slider

---

### 8.2 Prompt Tab
- Master ritual prompt (editable)
- Read-only preview of generated output
- CTA: “Regenerate from prompt”

---

### 8.3 Voice & Pacing Tab
- Tone: Gentle / Neutral / Coach
- Pace: Slow / Medium / Fast
- Silence: Off / Light / Heavy
- **Soundscape** (smart default with user override):
  - Auto-select: AI chooses based on ritual type and user preferences
  - User override: Dropdown with options (Rain, Ocean Waves, Forest, White Noise, None)
  - Volume control (when soundscape enabled)
  - Preview button to hear 5s sample
- Voice (future: TTS voice selection)

**Smart Defaults Philosophy**
- All settings have intelligent defaults chosen by the system
- User can always override any default
- Preferences are learned over time (future: personalization)

---

### 8.4 Advanced Tab
- Safety boundaries
- Language (EN / HE)
- Custom disclaimers
- Export ritual (JSON)

---

## 9. Screen 3 – Session Screen (Sacred Mode)

**Fullscreen, minimal UI – Keep this sacred**

### Design Philosophy
- **Distraction-free**: No navigation, no unnecessary UI
- **Minimal controls**: Only pause and restart (no skip, no scrubbing)
- **Respect the practice**: Don't allow interruptions or temptations to quit early
- **Simple adjustments**: Text size only (no mid-session ritual changes)

### Elements
- Calm warm background (solid color, no patterns)
- Center-aligned guidance text (Lora serif, large and readable)
  - Fades in as new guidance appears
  - Fades out when guidance ends (silence)
- Bottom controls (minimal, auto-hide after 3s):
  - **Pause button**: Pause guidance and timer
  - **Restart button**: Start ritual from beginning (confirm dialog)
- Hidden:
  - No progress bar (intentional - removes time pressure)
  - No back button (prevents accidental exit)
  - No skip/forward button (encourages completion)
  - No bottom tab bar

### Gestures
- **Tap anywhere on text**: Cycle through text sizes (medium → large → extra-large → medium)
- **Long press (2s) anywhere**: Show "End session?" confirmation dialog
- **Swipe down from top**: Alternative exit gesture (confirm dialog)
- **Tap controls area**: Show controls if auto-hidden

### Session States
1. **Playing**: Guidance text visible, controls auto-hide
2. **Paused**: "Paused" indicator, resume button, controls stay visible
3. **Silence**: No text, calm background, timer continues
4. **Ending**: Fade to reflection screen

### Soundscape Integration
- Soundscape (if enabled) plays throughout entire session
- Fades in at start (2s)
- Fades out at end (2s)
- Continues during pauses (user choice in settings)
- No mid-session volume adjustment (keep it simple, adjust before starting)

---

## 10. Screen 4 – Reflection

### Header
- “Nice work.”
- “What did you notice?”

### Checkboxes
- I showed up despite resistance
- My mind was busy
- I felt calmer
- I gained clarity
- I felt gratitude
- I want to adjust the ritual

### Mood Sliders
- Before session
- After session

### Free Text
- Prompt: “One sentence is enough.”

### Actions
- Save reflection
- Edit ritual based on this
- Skip

### Smart Suggestions (if adjustment selected)
- Shorter
- More silence
- More breath
- Softer tone
- More coaching

---

## 11. Screen 5 – Dashboard

### 5.1 At a Glance
- Current streak
- Minutes this week
- Most used ritual
- Avg mood delta

### 5.2 Trends
- Minutes over time
- Mood delta over time
- Top ritual tags

### 5.3 Calendar
- Monthly heatmap
- Tap day → session details

### 5.4 Insights Feed
Examples:
- “Morning sessions improve mood most”
- “Short rituals complete more often”
- “Breath focus correlates with calm”

---

## 12. Screen 6 – Session Detail (Added)
- Ritual used
- Duration
- Reflection
- Repeat ritual
- Create ritual from session

---

## 13. Screen 7 – Profile / Settings

- Edit goal
- Reminders (time + days)
- Notifications
- Theme
- Language
- Data export
- Privacy

---

## 14. UX Principles to Preserve

1. One clear action per screen
2. Fast path for returning users
3. Editor feels guided, not technical
4. Session screen is sacred
5. Reflection feeds personalization
6. Dashboard explains *why* it works

---

## 15. Suggested Data Model (Conceptual)

### Core Entities

**Timestamp**: Type-safe branded string type for all dates (ISO 8601 format, JSON-compatible)

**Goal**
- id, instructions (what the user wants to achieve), createdAt, updatedAt
- Storage key: `koru:goal`

**Ritual** = RitualContent + Statistics
- **RitualContent** (what it IS + creation metadata):
  - id, title, instructions, duration, tone, pace, includeSilence, soundscape, sections[], tags, isTemplate, generatedFrom
  - createdAt, updatedAt (metadata stays with content)
  - Storage key: `koru:ritual:{id}`
- **RitualStatistics** (usage stats - SEPARATE entity with OWN ID):
  - id (own identity!), ritualId (reference), isFavorite, usageCount, lastUsedAt
  - Storage key: `koru:ritual-stats:{id}`
- **Separation allows**:
  - Content immutable, statistics mutable
  - Share content without personal usage data
  - Different storage/sync strategies

**Session** = SessionData + Reflection
- **SessionData**:
  - id, ritualId, status, startedAt, completedAt, progressSeconds
  - Storage key: `koru:session:{id}`
- **SessionReflection** (SEPARATE entity with OWN ID):
  - id (own identity!), sessionId (reference), reflection, rating (1-5), createdAt
  - Storage key: `koru:session-reflection:{id}`
- **Separation allows**:
  - Complete session without reflection
  - Add/update reflection independently
  - Privacy: share sessions without reflections

**RitualSection**
- id, type (intro/body/silence/transition/closing), durationSeconds, guidanceText, silenceDuration, soundscape

**UserPreferences**
- defaultDuration, defaultTone, notifications, soundscapesEnabled, voice, theme

**Insight** (future)
- Derived from Session and Reflection data for dashboard

### Storage Strategy
- **Local-first**: localStorage → IndexedDB → cloud sync (progressive migration)
- **Namespaced keys**: All keys use 'koru:' prefix to prevent conflicts
- **JSON serialization**: All types serialize cleanly for localStorage/API

### Type Safety
- **Branded Timestamp**: Compile-time safety, runtime compatibility
- **Separated concerns**: Content vs metadata, data vs reflection
- **Generic naming**: "instructions" field works for goals, rituals, generation


**End of specification**