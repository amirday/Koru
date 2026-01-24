# Feed Screen & Ritual Generation Flow UI Redesign

**Status**: COMPLETED
**Date**: January 2026

## Overview

Redesigned the Koru meditation app to replace the current Home screen with a Feed screen displaying rituals as a vertical feed, with a sticky "Create your own ritual" button, and a new multi-step ritual generation flow.

---

## Files Created

| File | Description |
|------|-------------|
| `src/screens/Feed/FeedScreen.tsx` | New Feed screen with vertical ritual list |
| `src/screens/Feed/index.ts` | Export barrel |
| `src/screens/Generation/RitualGenerationScreen.tsx` | Form screen for ritual creation |
| `src/screens/Generation/GenerationProgressScreen.tsx` | Progress during generation |
| `src/screens/Generation/GenerationCompleteScreen.tsx` | Post-generation with play/add options |
| `src/screens/Generation/index.ts` | Export barrel |
| `src/components/feed/FeedRitualCard.tsx` | Vertical card for feed display |
| `src/components/feed/StickyCreateButton.tsx` | Fixed bottom create button |
| `src/components/feed/index.ts` | Export barrel |
| `src/components/generation/VoiceSelector.tsx` | Voice selection component |
| `src/components/generation/SoundscapeSelector.tsx` | Soundscape picker |
| `src/components/generation/DurationPicker.tsx` | Duration picker |
| `src/components/generation/index.ts` | Export barrel |

## Files Modified

| File | Changes |
|------|---------|
| `src/router/routes.tsx` | Added `/feed`, `/generate/*` routes; redirect `/home` → `/feed` |
| `src/router/AppLayout.tsx` | Updated to handle `/feed` path |
| `src/components/layout/BottomTabBar.tsx` | Renamed "Home" tab to "Feed" |
| `src/types/ui.ts` | Updated TabRoute: `'home'` → `'feed'` |
| `src/AppContent.tsx` | Updated default tab to 'feed' |

---

## Implementation Summary

### 1. Feed Screen (`/feed`)
- Displays templates (quickStarts) and saved rituals in vertical feed
- Sections: "Discover" (templates) and "Your Rituals" (saved)
- Each card shows: title, description, duration/tone badges, favorite indicator
- Tapping card navigates to Generation screen with template pre-filled
- Sticky "Create your own ritual" button above tab bar

### 2. Ritual Generation Screen (`/generate`)
- Form with fields:
  - Ritual Name (required)
  - Your Goals (required)
  - Duration (5/10/15/20/30 min button group)
  - Meditation Guide (voice selector from voices.json)
  - Background Audio (soundscape selector)
- Validates required fields before proceeding
- Stores form data in sessionStorage for progress screen

### 3. Generation Progress Screen (`/generate/progress`)
- Fullscreen with animated pulsing circles
- Progress bar with 7 stages (~600ms each)
- Stage messages update as progress advances
- Cancel button (disabled near completion)
- Auto-navigates to Complete screen when done

### 4. Generation Complete Screen (`/generate/complete/:id`)
- Success checkmark animation
- Ritual preview card with metadata
- Primary action: "Play Now" → `/session/:id`
- Secondary action: "Add to Gallery" → save & navigate to `/feed`

---

## Navigation Flow

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

## Verification

- [x] TypeScript type-check passes
- [x] Build succeeds
- [x] Dev server starts without errors
- [x] Routes configured correctly
- [x] Tab bar shows "Feed" label
- [x] Documentation updated (UI_design.md, ARCHITECTURE.md)

---

## Testing Notes

Manual testing required:
- [ ] Feed screen loads with templates and saved rituals
- [ ] Tapping card navigates to generation with pre-filled data
- [ ] Sticky button navigates to blank generation form
- [ ] Form validates required fields
- [ ] Progress animation runs smoothly
- [ ] Complete screen shows correct ritual data
- [ ] "Play Now" navigates to session
- [ ] "Add to Gallery" saves and returns to feed
