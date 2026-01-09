# Step 7: Base UI Components

## Objective
Build the design system's primitive components.

## Files to Create

```
src/components/ui/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Slider.tsx
├── Toggle.tsx
├── Toast.tsx
└── Modal.tsx
```

## Component Specifications

### Button
- Variants: primary (peach bg), secondary (warm outline), ghost (transparent), danger (error)
- Sizes: sm, md, lg
- States: default, hover, active, disabled, loading
- Icon support (left/right)

### Card
- Compound component: Card, Card.Header, Card.Body, Card.Footer
- Variants: default, elevated (shadow), flat (no shadow)
- Hover effect (subtle elevation increase)
- Clickable variant (cursor pointer)

### Input
- Types: text, textarea, search
- Label, helper text, error message
- Auto-resize for textarea
- Focus states with peach ring

### Slider
- Range input with styled track
- Value display (optional)
- Min/max/step props
- Warm color scheme

### Toggle
- Checkbox and switch variants
- Label positioning (left/right)
- Indeterminate state support

### Toast
- Types: success (green), error (coral), info (peach), warning (amber)
- Auto-dismiss with configurable duration
- Position: bottom-center
- Queue management (max 3 visible)
- Slide-up animation (respect reduced motion)

### Modal
- Backdrop with blur effect
- Close on outside click (configurable)
- Escape key to close
- Focus trap
- Animate in/out (fade + scale)
- Scrollable content area

## Design Tokens Usage

All components use Tailwind classes with design tokens:
- Colors: peach-*, warm-*, calm-*
- Spacing: p-4, p-6, gap-4
- Border radius: rounded-card
- Shadows: shadow-card, shadow-elevated
- Font: font-serif (headings), font-sans (body)

## Next Step

Proceed to **Step 8: Layout Components**
