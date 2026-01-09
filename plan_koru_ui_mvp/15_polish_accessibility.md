# Step 15: Polish & Accessibility

## Objective
Add animations, ensure accessibility, and test across devices.

## Key Tasks

### 15.1 Create Animations

**File**: `src/styles/animations.css`

**Animation Types to Implement**:

**Page Transitions**:
- Fade in: Simple opacity 0 → 1 transition
- Slide up: Combine opacity with translateY for gentle entrance
- Duration: 200-250ms (quick but not jarring)
- Easing: ease-out for natural feel

**Modal Animations**:
- Fade in with subtle scale: opacity 0 → 1, scale 0.95 → 1
- Duration: 200ms
- Creates gentle "pop-in" effect

**Toast Notifications**:
- Slide up from bottom: translateY(100%) → 0 with opacity
- Duration: 250ms
- Positions toast entering from bottom edge

**CRITICAL: Respect Reduced Motion**:
- Use `@media (prefers-reduced-motion: reduce)` to disable animations
- Set `animation: none !important` for users who prefer no motion
- This is required for accessibility compliance

**Animation Guidelines**: See **UI_design.md §3 "Animation & Motion"** for philosophy:
- Minimal approach: Only animate when adding clarity
- Keep durations under 300ms
- Use subtle easing (ease-out, ease-in-out)
- Never animate continuously (no spinners during long operations)
- Provide immediate state feedback without waiting for animations

### 15.2 Accessibility Audit Checklist

**Semantic HTML:**
- [ ] Use proper heading hierarchy (h1, h2, h3)
- [ ] Use semantic elements (nav, main, section, article)
- [ ] Use button for clickable elements (not div)
- [ ] Use proper form elements (label, input, textarea)

**ARIA Labels:**
- [ ] All interactive elements have labels
- [ ] Images have alt text
- [ ] Icons have aria-label
- [ ] Loading states announce to screen readers
- [ ] Error messages linked to form fields

**Keyboard Navigation:**
- [ ] All interactive elements focusable (tabindex)
- [ ] Focus indicators visible and clear
- [ ] Modal traps focus (can't tab outside)
- [ ] Escape key closes modals
- [ ] Enter/Space activate buttons

**Color Contrast:**
- [ ] Text on warm-50 background meets WCAG AA (4.5:1)
- [ ] Button text on peach-500 meets contrast
- [ ] Link text distinguishable from body text
- [ ] Error messages have sufficient contrast

**Screen Reader Testing:**
- [ ] Test with VoiceOver (Mac/iOS)
- [ ] Test with NVDA (Windows)
- [ ] All content accessible
- [ ] Navigation announced correctly
- [ ] Form validation messages read aloud

### 15.3 Responsive Design Testing

**Mobile (375px):**
- [ ] All content visible, no horizontal scroll
- [ ] Tap targets minimum 44px
- [ ] Text readable without zoom
- [ ] Bottom nav accessible
- [ ] Modals fill viewport

**Tablet (768px):**
- [ ] Layout adapts (2-3 cards visible)
- [ ] Navigation remains accessible
- [ ] Content not too stretched

**Desktop (1024px+):**
- [ ] Content max-width constrained (640px)
- [ ] Centered layout
- [ ] Quick starts wrap or show all
- [ ] No awkward spacing

### 15.4 Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Safari (latest, desktop + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Samsung Internet (Android)

### 15.5 Error Handling & Validation

**Goal Input:**
- [ ] Minimum 3 characters
- [ ] Maximum 200 characters
- [ ] Trim whitespace
- [ ] Show error message

**Generation:**
- [ ] Network error handling
- [ ] Timeout handling (30s)
- [ ] Validation before submit
- [ ] Retry mechanism

**Storage:**
- [ ] Handle quota exceeded
- [ ] Graceful degradation if localStorage unavailable
- [ ] Data validation on load

### 15.6 Performance Optimization

- [ ] Lazy load routes (React.lazy)
- [ ] Optimize images (use WebP)
- [ ] Minimize bundle size
- [ ] Enable gzip compression
- [ ] Check Lighthouse score (target: 90+)

### 15.7 Final QA Checklist

**Onboarding Flow:**
- [ ] Welcome screen displays correctly
- [ ] Can complete goal setup
- [ ] Preferences save correctly
- [ ] Redirects to home after onboarding
- [ ] Doesn't show onboarding on refresh

**Home Screen:**
- [ ] Goal box editable and saves
- [ ] Quick starts scroll horizontally
- [ ] Generate button works
- [ ] Progress shows during generation
- [ ] Can navigate away during generation
- [ ] Notification shows when complete

**Navigation:**
- [ ] Bottom nav switches tabs
- [ ] Active tab indicated
- [ ] Back button works
- [ ] Deep links work

**PWA:**
- [ ] Installable on all platforms
- [ ] Works offline (app shell)
- [ ] Icon displays correctly
- [ ] Splash screen shows

**Data Persistence:**
- [ ] Goal persists across sessions
- [ ] Preferences persist
- [ ] Generated rituals saved
- [ ] Onboarding state remembered

## Completion Criteria

All checklist items above pass. MVP is ready for user testing.

## Next Steps (Post-MVP)

See master_plan.md for Phase 2 (Ritual Library & Editor) and beyond.
