# Step 8: Layout Components

## Objective
Create consistent page structure and navigation components.

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
**4 Tabs:**
1. Home - House icon
2. Rituals - Book icon
3. Dashboard - Chart icon
4. Profile - User icon

**Features:**
- Fixed to bottom with safe-area-inset-bottom
- Active state: peach-500 color + indicator line
- Inactive state: calm-500 color
- Icons + labels
- Hide on certain routes (session screen)
- Smooth tab switch animation

### Header
- Optional back button (left)
- Optional title (center, Lora serif)
- Optional actions slot (right)
- Sticky positioning (top: 0)
- Background: warm-50 with subtle border-bottom
- Safe area top padding

## Conditional Bottom Nav

Hide bottom nav on:
- /session/:id (fullscreen)
- /reflection/:id (focus)

Show on:
- /home
- /rituals
- /dashboard
- /profile

## Next Step

Proceed to **Step 9: Routing Setup**
