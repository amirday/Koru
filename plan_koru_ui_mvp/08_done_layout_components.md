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

**Automated Tests** (TypeScript Verification):
- [x] TypeScript compilation passed with no errors
- [x] Production build succeeded (259.13 KB / 78.38 KB gzipped)
- [x] All components properly typed with TypeScript
- [x] All imports resolve correctly
- [x] No runtime errors on page load

**Component Test Page Created**:
Created comprehensive test page in `src/AppContent.tsx` demonstrating:
- [x] ScreenContainer: Wraps entire test page with safe area padding and max-width
- [x] BottomTabBar: Shows 4 tabs (Home, Rituals, Dashboard, Profile) with icons
- [x] BottomTabBar: Active state with peach-500 color and indicator
- [x] BottomTabBar: Click triggers navigation and shows toast
- [x] BottomTabBar: Can be toggled on/off for testing
- [x] Header: Sticky header with back button, centered title, actions slot
- [x] Header: Can be toggled on/off for testing

**Manual Verification** (User Testing Required):
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

## Implementation Results

**Files Created**:
- `src/components/layout/ScreenContainer.tsx` - Safe area padding, max-width 640px centered
- `src/components/layout/BottomTabBar.tsx` - 4 tabs with icons, active state, fixed bottom
- `src/components/layout/Header.tsx` - Optional back button, centered title (Lora serif), actions slot
- `src/components/layout/index.ts` - Central export point

**Files Modified**:
- `src/AppContent.tsx` - Added layout component tests with toggle controls

**Bundle Impact**:
- Previous: 252.99 KB (76.98 KB gzipped)
- Current: 259.13 KB (78.38 KB gzipped)
- Increase: +6.14 KB (+1.40 KB gzipped) - 3 new layout components

**Type Safety**:
- All components fully typed with TypeScript
- Props interfaces exported for reuse
- TabRoute type used for navigation
- No type errors, no runtime errors

**Design Features**:
- ScreenContainer: Safe area classes (safe-top, safe-left, safe-right, safe-bottom)
- BottomTabBar: Inline SVG icons (Home, Book, Chart, User)
- BottomTabBar: Active indicator line with peach-500 color
- Header: Sticky positioning with border-bottom
- All components use warm color scheme (warm-50, calm colors, peach-500)

## Next Step
Proceed to **Step 09: Routing Setup**
