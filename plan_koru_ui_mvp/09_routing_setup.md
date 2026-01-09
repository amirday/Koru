# Step 9: Routing Setup

## Objective
Configure React Router with navigation guards and layouts.

## Files to Create

- `src/router/routes.tsx` - Route definitions
- `src/router/index.tsx` - Router configuration
- Update `src/App.tsx` - Wrap with providers and router

## Route Structure

```typescript
/welcome           - WelcomeScreen (unauthenticated)
/setup             - InitialGoalSetupScreen (unauthenticated)
/                  - Redirect to /home
/home              - HomeScreen (with bottom nav)
/rituals           - Placeholder (with bottom nav)
/dashboard         - Placeholder (with bottom nav)
/profile           - Placeholder (with bottom nav)
```

## Navigation Guards

### RequireOnboarding
- Check `hasCompletedOnboarding` from AppContext
- If false, redirect to `/welcome`
- If true, render children

## App Layout

```typescript
<BrowserRouter>
  <Routes>
    {/* Onboarding */}
    <Route path="/welcome" element={<WelcomeScreen />} />
    <Route path="/setup" element={<InitialGoalSetupScreen />} />

    {/* Main app */}
    <Route element={<RequireOnboarding><AppLayout /></RequireOnboarding>}>
      <Route index element={<Navigate to="/home" />} />
      <Route path="home" element={<HomeScreen />} />
      <Route path="rituals" element={<PlaceholderScreen title="Rituals" />} />
      <Route path="dashboard" element={<PlaceholderScreen title="Dashboard" />} />
      <Route path="profile" element={<PlaceholderScreen title="Profile" />} />
    </Route>
  </Routes>
</BrowserRouter>
```

## AppLayout Component

- Renders Outlet (child routes)
- Includes BottomTabBar
- Conditional bottom nav visibility

## Next Step

Proceed to **Step 10: Onboarding Screens**
