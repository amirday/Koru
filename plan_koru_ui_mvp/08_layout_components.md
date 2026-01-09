# Step 8: Layout Components

## Objective
Create consistent page structure and navigation components that wrap all screens.

## Why This Matters
Layout components provide:
- **Consistent structure**: Every screen has safe padding and max-width
- **Navigation model**: Bottom tabs for primary navigation (mobile-first)
- **Safe areas**: Respects device notches and system UI
- **Responsive behavior**: Adapts layout from mobile to desktop

## Files to Create

```
src/components/layout/
├── ScreenContainer.tsx
├── BottomTabBar.tsx
└── Header.tsx
```

## Component Specifications

### ScreenContainer
- Safe area padding (top/bottom for notches)
- Max width constraint (640px centered on desktop)
- Vertical scroll container
- Background: warm-50
- Padding: px-4 py-6

### BottomTabBar

**4 Tabs** (See **UI_design.md §2 "Navigation Model"**):
1. **Home** - House icon - Primary entry point
2. **Rituals** - Book icon - Library of saved rituals
3. **Dashboard** - Chart icon - Usage insights (future Phase 4)
4. **Profile** - User icon - Settings and preferences

**Features:**
- Fixed to bottom with safe-area-inset-bottom (respects iOS notch)
- Active state: peach-500 color + subtle indicator line/underline
- Inactive state: calm-500 color (muted but readable)
- Icons + labels (both visible for clarity)
- Hide on certain routes (session screen, reflection screen)
- Smooth tab switch animation (respect prefers-reduced-motion)

**Icon Names** (for icon library):
- Home: "home" or "house"
- Rituals: "book" or "library"
- Dashboard: "chart" or "bar-chart"
- Profile: "user" or "person"

### Header
- Optional back button (left)
- Optional title (center, Lora serif)
- Optional actions slot (right)
- Sticky positioning (top: 0)
- Background: warm-50 with subtle border-bottom
- Safe area top padding

## Conditional Bottom Nav

**Navigation Philosophy**: See **UI_design.md §2** for context on when to show/hide navigation

**Hide bottom nav on**:
- `/session/:id` - Fullscreen immersive session player (no distractions)
- `/reflection/:id` - Focus mode for reflection entry

**Show bottom nav on**:
- `/home` - Primary screen
- `/rituals` - Library browsing
- `/dashboard` - Insights viewing (future)
- `/profile` - Settings and preferences

**Implementation**: Use `useLocation()` hook to check current path and conditionally render BottomTabBar

## Next Step

Proceed to **Step 9: Routing Setup**
