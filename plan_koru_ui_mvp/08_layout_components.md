# Step 08: Layout Components

## Objective
Create consistent page structure and navigation components that wrap all screens.

## Files to Create
`src/components/layout/`: ScreenContainer, BottomTabBar, Header

## Component Specs

**ScreenContainer**: Safe area padding (notches), max-width 640px centered (desktop), vertical scroll, bg warm-50, padding px-4 py-6

**BottomTabBar**: 4 tabs (Home/Rituals/Dashboard/Profile with icons), fixed bottom + safe-area-inset-bottom, active state (peach-500 + indicator), inactive (calm-500), icons + labels visible, hide on /session/:id + /reflection/:id, smooth animation

**Icon names**: home/house, book/library, chart/bar-chart, user/person

**Header**: Optional back button (left), title (center, Lora serif), actions slot (right), sticky top, bg warm-50 + border-bottom, safe area top padding

**Reference**: UI_design.md §2 (navigation model)

## Test Plan

**Automated Tests**:
- [ ] ScreenContainer: Renders children correctly
- [ ] ScreenContainer: Applies max-width constraint
- [ ] BottomTabBar: Renders 4 tabs
- [ ] BottomTabBar: Active tab has peach-500 color
- [ ] BottomTabBar: Click tab triggers navigation
- [ ] Header: Conditional back button renders when provided

**Manual Verification**:
- [ ] ScreenContainer: Content centered on desktop (1920px wide)
- [ ] ScreenContainer: Safe padding on iPhone notch
- [ ] BottomTabBar: Fixed to bottom, doesn't scroll
- [ ] BottomTabBar: Active tab visually distinct (peach color + indicator)
- [ ] BottomTabBar: Tap tab → navigate to screen
- [ ] BottomTabBar: Hidden on session screen (future)
- [ ] BottomTabBar: Safe area inset respects iOS notch
- [ ] Header: Sticky at top when scrolling
- [ ] Header: Back button works (navigates back)

**Expected**: Layout consistent across screens, bottom nav works reliably, safe areas respected on all devices, navigation intuitive.

## Next Step
Proceed to **Step 09: Routing Setup**
