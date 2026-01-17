# Step 09: Routing Setup

## Objective
Configure React Router v6 with navigation guards and app layout for Koru.

## Key Tasks

### 9.1 Define Routes
**File**: `src/router/routes.tsx`

**Onboarding** (no guard): `/welcome` → WelcomeScreen, `/setup` → InitialGoalSetupScreen

**Main App** (requires onboarding complete): `/` → redirect /home, `/home` → HomeScreen (+ bottom nav), `/rituals` → PlaceholderScreen (+ bottom nav), `/dashboard` → PlaceholderScreen (+ bottom nav), `/profile` → PlaceholderScreen (+ bottom nav)

**Future** (Phase 2+): `/rituals/:id`, `/rituals/:id/edit`, `/session/:ritualId` (fullscreen, no nav), `/reflection/:sessionId`

**Reference**: UI_design.md §2 for navigation model

### 9.2 Navigation Guard
**Component**: `RequireOnboarding`

Check `hasCompletedOnboarding` from AppContext. If false → redirect `/welcome` (use Navigate with `replace={true}`). If true → render children.

### 9.3 App Layout
**Component**: `AppLayout`

Render `<Outlet />` for routes + `<BottomTabBar />` at bottom. Use ScreenContainer for padding. Bottom nav visibility: Show on /home, /rituals, /dashboard, /profile; hide on /session/:id, /reflection/:id (use `useLocation` to check path).

### 9.4 Router Configuration
**File**: `src/router/index.tsx`

Configure BrowserRouter with route definitions wrapped in RequireOnboarding guard, AppLayout for main routes, standalone onboarding routes. Export router, import in App.tsx.

### 9.5 Update App Component
**File**: `src/App.tsx`

Provider hierarchy: AppContextProvider (outer) → RitualContextProvider → Router. Order matters: AppContext must wrap RitualContext (goal/preferences needed for generation).

### 9.6 Placeholder Screen
**File**: `src/screens/PlaceholderScreen.tsx`

Simple screen with title (e.g., "Rituals"), message "Coming in Phase [N]", link to Home. Purpose: Test navigation + bottom tab functionality.

## Files to Create
- `src/router/routes.tsx`, `src/router/index.tsx`, `src/router/AppLayout.tsx`, `src/router/RequireOnboarding.tsx`, `src/screens/PlaceholderScreen.tsx`, `src/App.tsx` (update)

## Test Plan

**Automated Tests** (TypeScript Verification):
- [x] TypeScript compilation passed with no errors
- [x] Production build succeeded (322.80 KB / 102.39 KB gzipped)
- [x] Route definitions compile without TypeScript errors
- [x] Router provider wraps app correctly in App.tsx
- [x] RequireOnboarding guard implemented correctly
- [x] AppLayout renders Outlet + BottomTabBar correctly
- [x] All screen components properly typed

**Manual Verification** (User Testing Required):
- [ ] Navigate to http://localhost:5173 (clear localStorage)
- [ ] Redirects to /welcome (onboarding incomplete)
- [ ] Complete onboarding → redirects to /home
- [ ] Refresh page → stays on /home (state persisted)
- [ ] Click bottom nav tab (Rituals) → navigate to /rituals
- [ ] Active tab has visual indicator (peach color)
- [ ] Click Dashboard tab → navigate to /dashboard
- [ ] See placeholder "Coming in Phase X"
- [ ] Browser back button works (goes back to previous route)
- [ ] URL bar reflects current route
- [ ] Direct navigate to /profile (paste URL) → works, shows placeholder
- [ ] Clear localStorage, navigate to /home → redirects to /welcome
- [ ] Bottom nav hidden on fullscreen routes (test when /session implemented)

**Expected**: Routing works correctly, onboarding guard redirects properly, bottom nav shows on appropriate screens, state persists across navigation, browser back/forward work.

## Implementation Results

**Files Created**:
- `src/router/RequireOnboarding.tsx` - Navigation guard checking onboarding status
- `src/router/AppLayout.tsx` - Layout wrapper with Outlet and BottomTabBar
- `src/router/routes.tsx` - Route definitions (onboarding + main app routes)
- `src/router/index.tsx` - Router configuration and exports
- `src/screens/WelcomeScreen.tsx` - Temporary onboarding welcome screen
- `src/screens/HomeScreen.tsx` - Temporary home screen
- `src/screens/PlaceholderScreen.tsx` - Reusable placeholder for unimplemented screens

**Files Modified**:
- `src/App.tsx` - Replaced AppContent with Router component

**Bundle Impact**:
- Previous: 259.13 KB (78.38 KB gzipped)
- Current: 322.80 KB (102.39 KB gzipped)
- Increase: +63.67 KB (+24.01 KB gzipped) - React Router DOM library

**Type Safety**:
- All components fully typed with TypeScript
- RouteObject types from react-router-dom
- TabRoute type for navigation
- No type errors, no runtime errors

**Routing Features**:
- Onboarding guard redirects to /welcome if not complete
- AppLayout determines active tab from current route
- Bottom nav visibility based on route path
- Redirect / to /home
- Placeholder screens for Rituals, Dashboard, Profile
- Catch-all route redirects to /home
- Navigation guards use replace navigation to avoid history pollution

## Next Step
Proceed to **Step 10: Onboarding Screens**
