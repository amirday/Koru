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
1. **Feed** – discover rituals, templates, quick starts
2. **Rituals** – ritual library + editor
3. **Dashboard** – trends, calendar, insights
4. **Profile** – settings, reminders, preferences

⚠️ **Fullscreen routes (no tab bar)**
- Session screen – sacred, distraction-free
- Generation flow – focused creation experience
- Reflection screen – post-session capture

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
- Ritual Card (title, instructions, duration, badges)
- Section Editor (accordion)
- Session Player (pause / restart only)
- Reflection Check-ins (checkboxes + slider)
- Insight Tile
- Calendar Heatmap
- Toast / Gentle feedback messages
- Status Badges (New, Favorite, Tone indicators)

### 4.1 Status Badges

Small, pill-shaped indicators that convey ritual metadata at a glance.

**"New" Badge**
- Shown on rituals created within the last 24 hours
- Style: Soft peach background (`bg-peach-100`), peach text (`text-peach-700`), subtle border (`border-peach-200`)
- Includes small star icon for visual interest
- Disappears automatically after 24 hours (no user action needed)
- Purpose: Help users quickly identify recently created rituals in their library

**Tone Badges**
- Gentle: Soft green (`bg-green-100 text-green-700`)
- Neutral: Calm gray (`bg-calm-100 text-calm-700`)
- Coach: Soft peach (`bg-peach-100 text-peach-700`)

**Duration Badge**
- Warm neutral (`bg-warm-100 text-calm-700`)
- Shows duration in minutes (e.g., "10 min")

**Favorite Indicator**
- Peach heart icon (`text-peach-500`)
- Shown when `statistics.isFavorite` is true

**Badge Design Principles**
- Keep badges small and unobtrusive (text-xs, py-0.5, px-2)
- Use rounded-full for pill shape
- Warm, muted colors that don't compete for attention
- Icons should be small (w-3 h-3 or w-4 h-4)
- Group badges in a horizontal row with consistent gap-2 spacing

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

## 6. Screen 1 – Feed

The Feed screen replaces the previous Home screen with a vertical, scrollable list of rituals.

### Layout (Top → Bottom)

#### Header
- Title: "Feed"
- Simple, clean header

#### 6.1 Ritual Feed (Vertical Scroll)
A continuous vertical list combining:
- **Discover section**: Template rituals (quick starts)
- **Your Rituals section**: User's saved rituals

Each **FeedRitualCard** includes:
- Title (serif, prominent)
- Description (2-line truncate)
- Badges: Duration, Tone, Soundscape icon
- Template badge (for quick starts)
- Favorite indicator (heart icon)
- Tap → Navigate to Generation screen (with template pre-filled)

**Card Design**:
- Full-width with rounded corners (16px radius)
- White background with subtle border
- Warm shadow on hover
- Subtle scale animation on tap

#### 6.2 Sticky Create Button
- Fixed position above bottom tab bar
- White card with left peach accent border
- Plus icon + "Create your own ritual"
- Sub-text: "Personalized meditation just for you"
- Tap → Navigate to Generation screen (blank form)

**Sticky Button Design**:
- Elevated with shadow-lg
- Always visible while scrolling
- Respects safe area insets

---

## 6.5 Screen 1b – Ritual Generation Flow

A dedicated multi-step flow for creating personalized rituals. Fullscreen (no bottom nav).

### 6.5.1 Generation Form Screen (`/generate`)

**Header**:
- Back button (left)
- Title: "Create Ritual"

**Form Fields** (vertical scroll):

1. **Ritual Name** (required)
   - Text input
   - Placeholder: "e.g., Morning Focus, Evening Wind-Down"

2. **Your Goals** (required)
   - Textarea (4 rows)
   - Placeholder: "What do you want to achieve with this meditation?"

3. **Duration**
   - Horizontal button group
   - Options: 5, 10, 15, 20, 30 min
   - Default: 10 min

4. **Meditation Guide** (Voice)
   - Radio-style list selection
   - Each option shows: name, provider badge, description
   - Loads from voices.json
   - Default: Aoede

5. **Background Audio** (Soundscape)
   - Horizontal pill buttons with icons
   - Options: Ocean, Forest, Rain, Fire, None
   - Default: None

**CTA**:
- Full-width "Generate" button
- Validates required fields before proceeding

**Backend Defaults** (not exposed in UI):
- tone: "gentle"
- includeSilence: true
- pace: "medium"

---

### 6.5.2 Generation Progress Screen (`/generate/progress`)

Fullscreen, centered layout. Immersive experience.

**Elements**:
- Animated pulsing circles (concentric, peach colors)
- Central sparkle icon
- Title: "Your ritual is being generated"
- Progress bar with percentage
- Stage message (italic, changes as progress advances)
- Cancel button (disabled near completion)

**Progress Stages** (mock 3-5 second total):
1. "Understanding your goals..." (10%)
2. "Crafting your meditation..." (25%)
3. "Writing guided passages..." (45%)
4. "Adding mindful pauses..." (65%)
5. "Generating audio..." (80%)
6. "Final touches..." (95%)
7. "Complete!" (100%)

**Behavior**:
- Auto-navigates to Complete screen when done
- Cancel returns to Feed
- Progress data stored in sessionStorage

---

### 6.5.3 Generation Complete Screen (`/generate/complete/:id`)

Fullscreen, centered layout. Celebration moment.

**Elements**:
- Success checkmark (green circle with check)
- Title: "Your ritual is ready!"
- Ritual preview card:
  - Name
  - Duration + Tone badges
  - Soundscape indicator
  - Goals preview (truncated)
- Primary CTA: "Play Now" (with play icon)
- Secondary CTA: "Add to Gallery"

**Actions**:
- **Play Now**: Navigate to Session player (`/session/:id`)
- **Add to Gallery**: Save ritual, show toast, navigate to Feed

---

### Generation Flow Navigation

```
Feed Screen
    │
    ├── Tap ritual card ──────────┐
    │                             │
    └── Tap "Create your own" ────┴──→ Generation Form
                                              │
                                              ├── Fill form
                                              │
                                              └── Tap "Generate"
                                                      │
                                                      ▼
                                            Progress Screen
                                                      │
                                                      ▼ (3-5s mock)
                                            Complete Screen
                                                      │
                                        ┌─────────────┴─────────────┐
                                        │                           │
                                   "Play Now"                "Add to Gallery"
                                        │                           │
                                        ▼                           ▼
                                  /session/:id               Save & → /feed
```

---

## 7. Screen 2 – Rituals

### 2.1 Ritual Library
- Search bar
- Filters: Duration, Goal tag, Last used
- Sections:
  - Saved rituals (sorted by creation date, newest first)
  - Recent
  - Templates
- Ritual card displays:
  - Title and instructions
  - Status badges: "New" (if < 24h old), duration, tone, favorite
  - Last used timestamp
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

### 8.5 Segment Editor (Structure Tab Enhancement)

Each section contains an ordered list of **segments** (text or silence). The Structure Tab displays these segments in a visual timeline.

**Segment Timeline**
- Visual bar showing: `[silence | text | silence | text | silence]`
- Color coded: text segments = `peach-100`, silence segments = `calm-100`
- Duration labels displayed under each segment
- Total section duration shown at timeline end

**Segment Types**
- **Text Segment**: Contains guidance text to be spoken by TTS
  - Editable text content
  - Estimated duration (actual determined by TTS)
- **Silence Segment**: A pause in the meditation
  - Duration slider (1-60 seconds)
  - Purpose selector: "Breathing space" / "Integration pause" / "Transition"

**Segment Actions**
- Tap segment → expand to edit text or duration
- Drag handles → adjust segment duration visually
- `+` button between segments → add new segment (text or silence)
- Long-press segment → delete with confirmation

**Auto-balance Behavior**
- When section total duration changes, silence segments auto-adjust proportionally
- Text segment durations are estimates (actual determined by TTS after generation)
- Warning shown if text content likely exceeds available time

**Visual Design**
- Timeline uses horizontal scroll on mobile for long sections
- Active segment highlighted with peach border
- Collapsed view shows segment count: "5 segments • 2 min"

---

### 8.6 Voice Settings

Accessible from:
- Ritual Editor → "Voice & Pacing" tab → "Change voice" button
- Profile → Settings → "Voice Settings"

**Voice Picker**
- Grid of voice cards (2 columns on mobile, 3 on tablet+)
- Each card shows:
  - Voice avatar/icon (visual representation)
  - Voice name (e.g., "Rachel", "James")
  - Labels/tags (e.g., "Calm", "Female", "American")
  - Preview button (plays 5-second sample)
  - Select button (checkmark when selected)
- Selected voice highlighted with peach border
- Default voice used if none selected

**Preview Samples**
- Pre-generated audio files bundled with app
- Consistent preview phrase: "Take a deep breath and let your shoulders relax."
- No API call needed for preview (offline-capable)
- Small play button with circular progress indicator

**Voice Card Layout**
```
┌─────────────────────────┐
│     [Avatar Icon]       │
│       "Rachel"          │
│  Calm • Female • US     │
│                         │
│   [▶ Preview]  [Select] │
└─────────────────────────┘
```

**Selected Voice Persistence**
- Choice saved to user preferences
- Applied to all new rituals by default
- Can override per-ritual in editor

---

## 9. Screen 3 – Session Screen (Sacred Mode)

**Fullscreen, minimal UI – Keep this sacred**

### Session Preparation (Pre-Session Audio Generation)

Before the session begins, if audio hasn't been generated:

**Preparation Screen**
- Calm background (same as session)
- Centered message: "Preparing your session..."
- Subtle breathing animation or pulse indicator
- Progress showing which section is being prepared:
  - "Generating intro..." → "Generating body..." → "Generating closing..."
- Estimated time remaining (optional, can be hidden for calmer experience)

**User Options During Preparation**
- "Cancel" → return to ritual preview
- "Start without audio" → text-only session mode (silent reading)

**Caching Behavior**
- Previously generated audio loads instantly
- Progress only shown for first-time generation
- Background generation option: user can browse while audio generates

**Edge Cases**
- Network error → offer retry or text-only mode
- Generation taking too long (>30s) → show "This is taking longer than expected" with options

---

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

**Segment** (NEW - Core building block)
- id, type ('text' | 'silence')
- text (for text segments - the guidance content)
- durationSeconds (target duration for this segment)
- audioBlob (populated after TTS generation)
- actualDurationSeconds (measured audio duration after TTS)

**RitualSection** (UPDATED - Now contains segments)
- id, type (intro/body/closing)
- durationSeconds (total target duration for section)
- segments[] (ordered list of Segment - replaces guidanceText)
- guidanceText (DEPRECATED: computed from segments for backwards compatibility)
- audioUrl (cached combined audio URL)
- audioDurationSeconds (actual combined audio duration)
- audioGeneratedAt (cache invalidation timestamp)

**Voice** (NEW)
- id (provider voice_id, e.g., ElevenLabs voice ID)
- name (display name, e.g., "Rachel")
- description (short description)
- labels[] (tags like ['calm', 'female', 'american'])
- previewUrl (local path to bundled sample audio)
- previewText (what the preview audio says)

**UserPreferences** (UPDATED)
- defaultDuration, defaultTone, notifications, soundscapesEnabled, theme
- selectedVoiceId (currently selected TTS voice ID)
- Future: per-tone voice selection (gentleVoiceId, neutralVoiceId, coachVoiceId)

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