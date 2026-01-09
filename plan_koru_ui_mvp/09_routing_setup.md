# Step 9: Routing Setup

## Objective
Configure React Router v6 with navigation guards and app layout for the Koru meditation app.

## Why This Matters
Proper routing enables:
- **Deep linking**: Direct navigation to specific screens
- **Navigation guards**: Redirect unauthenticated users to onboarding
- **Layout composition**: Shared layouts with bottom navigation
- **Code splitting**: Lazy load routes for better performance (future)

---

## Key Tasks

### 9.1 Define Route Structure

**File**: `src/router/routes.tsx`

Create route hierarchy:

**Onboarding Routes** (no authentication required):
- `/welcome` → WelcomeScreen
- `/setup` → InitialGoalSetupScreen

**Main App Routes** (requires completed onboarding):
- `/` → Redirect to /home
- `/home` → HomeScreen (with bottom nav)
- `/rituals` → Placeholder screen (with bottom nav)
- `/dashboard` → Placeholder screen (with bottom nav)
- `/profile` → Placeholder screen (with bottom nav)

**Future Routes** (Phase 2+):
- `/rituals/:id` → Ritual preview screen
- `/rituals/:id/edit` → Ritual editor
- `/session/:ritualId` → Session screen (fullscreen, no bottom nav)
- `/reflection/:sessionId` → Reflection screen

**Navigation model**: See **UI_design.md §2** for bottom tab bar structure

### 9.2 Create Navigation Guard

**Component**: `RequireOnboarding`

**Behavior**:
- Check `hasCompletedOnboarding` from AppContext
- If false → redirect to `/welcome`
- If true → render children (protected routes)

**Logic**:
- Use Navigate component from react-router-dom for redirects
- Set `replace={true}` to avoid back button issues

### 9.3 Create App Layout

**Component**: `AppLayout`

**Structure**:
- Renders `<Outlet />` for child routes
- Includes `<BottomTabBar />` at bottom
- Uses ScreenContainer for consistent padding

**Bottom Nav Visibility**:
- Show on: /home, /rituals, /dashboard, /profile
- Hide on: /session/:id, /reflection/:id (fullscreen screens)
- Use `useLocation` hook to determine current route

### 9.4 Setup Router Configuration

**File**: `src/router/index.tsx`

Configure BrowserRouter with:
- Route definitions wrapped in RequireOnboarding guard
- AppLayout for main app routes
- Standalone routes for onboarding

**Router Provider**:
- Export configured router
- Import and use in App.tsx

### 9.5 Update App Component

**File**: `src/App.tsx`

Transform from simple component to provider wrapper:

**Structure**:
1. AppContextProvider (outermost)
2. RitualContextProvider
3. Router (from src/router)

**Why this order**: AppContext must wrap RitualContext (goal/preferences needed for generation)

---

## Placeholder Screen Component

**For MVP**: Create simple placeholder for future screens

**Content**:
- Screen title (e.g., "Rituals", "Dashboard", "Profile")
- Message: "Coming in Phase [N]"
- Link back to Home

**Purpose**: Test navigation and bottom tab bar functionality

---

## Files to Create/Modify

- `/Users/amirdaygmail.com/projects/Koru/src/router/routes.tsx` - Route definitions
- `/Users/amirdaygmail.com/projects/Koru/src/router/index.tsx` - Router configuration
- `/Users/amirdaygmail.com/projects/Koru/src/router/AppLayout.tsx` - Layout wrapper with bottom nav
- `/Users/amirdaygmail.com/projects/Koru/src/router/RequireOnboarding.tsx` - Navigation guard
- `/Users/amirdaygmail.com/projects/Koru/src/screens/PlaceholderScreen.tsx` - Temporary screen component
- `/Users/amirdaygmail.com/projects/Koru/src/App.tsx` - Update with providers + router

---

## Verification

After implementing routing:

- [ ] Navigate to http://localhost:5173
- [ ] If onboarding not complete → redirects to /welcome
- [ ] Complete onboarding → redirects to /home
- [ ] Refresh page → stays on /home (persisted state)
- [ ] Click bottom nav tabs → navigate between screens
- [ ] Active tab has visual indicator
- [ ] Browser back button works correctly
- [ ] URL changes reflect current screen
- [ ] Direct navigation to /dashboard works
- [ ] Placeholder screens show proper content

**Test onboarding guard**:
- Clear localStorage
- Navigate to /home
- Should redirect to /welcome

---

## Next Step

Proceed to **Step 10: Onboarding Screens**
