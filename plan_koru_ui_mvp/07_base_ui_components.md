# Step 07: Base UI Components

## Objective
Build design system's primitive components that form the foundation of all screens.

## Files to Create
`src/components/ui/`: Button, Card, Input, Slider, Toggle, Toast, Modal

## Component Specs
**Button**: Variants (primary/secondary/ghost/danger), sizes (sm/md/lg), states (default/hover/active/disabled/loading), icon support
**Card**: Compound (Card.Header/Body/Footer), variants (default/elevated/flat), hover effect, clickable
**Input**: Types (text/textarea/search), label/helper/error, auto-resize textarea, focus peach ring
**Slider**: Styled track, value display, min/max/step, warm colors
**Toggle**: Checkbox/switch variants, label positioning, indeterminate support
**Toast**: Types (success/error/info/warning), auto-dismiss, bottom-center, queue (max 3), slide-up animation
**Modal**: Backdrop blur, close on outside click, Escape key, focus trap, animate in/out

**Design Tokens**: See UI_design.md §3 (colors, spacing, typography), §4 (component patterns)

## Test Plan

**Automated Tests**:
- [ ] Button: Renders with correct variant class
- [ ] Button: Disabled state prevents onClick
- [ ] Card: Compound components render correctly
- [ ] Input: Focus triggers peach ring style
- [ ] Toggle: Checked state updates correctly
- [ ] Toast: Auto-dismisses after duration
- [ ] Modal: Escape key closes modal

**Manual Verification**:
- [ ] Button: Click triggers handler, loading shows spinner
- [ ] Button: Hover/active states visible
- [ ] Card: Hover increases elevation
- [ ] Input: Textarea auto-resizes as typing
- [ ] Slider: Dragging updates value
- [ ] Toggle: Click toggles state visually
- [ ] Toast: Multiple toasts stack (max 3)
- [ ] Toast: Slide-up animation smooth (or disabled if reduced motion)
- [ ] Modal: Focus trapped inside, clicking backdrop closes
- [ ] All components: Match warm color scheme (peach-500, warm-50)

**Expected**: Components reusable, accessible (keyboard nav, ARIA), styled consistently with design tokens, work across all screens.

## Next Step
Proceed to **Step 08: Layout Components**
