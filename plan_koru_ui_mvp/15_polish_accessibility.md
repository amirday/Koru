# Step 15: Polish & Accessibility

## Objective
Add animations, ensure accessibility, and test across devices for production readiness.

## Key Tasks

### 15.1 Create Animations
**File**: `src/styles/animations.css`

**Animation types**: Page transitions (fade in, slide up), modal (fade + scale), toast (slide up from bottom). Durations: 200-250ms with ease-out easing. **CRITICAL**: Use `@media (prefers-reduced-motion: reduce)` to disable all animations with `animation: none !important`.

**Reference**: UI_design.md §3 "Animation & Motion" for philosophy (minimal approach, under 300ms, no continuous spinners)

### 15.2 Accessibility Requirements
- **Semantic HTML**: Proper heading hierarchy (h1/h2/h3), semantic elements (nav/main/section), buttons not divs, proper form labels
- **ARIA**: All interactive elements have labels, images have alt text, icons have aria-label, loading states announce to screen readers, error messages linked to fields (aria-describedby)
- **Keyboard nav**: All interactive elements focusable, visible focus indicators, modals trap focus, Escape closes modals, Enter/Space activate buttons
- **Color contrast**: Text on warm-50 meets WCAG AA (4.5:1), button text on peach-500 readable, links distinguishable, errors have sufficient contrast

### 15.3 Responsive Design
**Mobile (375px)**: No horizontal scroll, tap targets ≥44px, readable text without zoom, bottom nav accessible, modals fill viewport.
**Tablet (768px)**: Layout adapts (2-3 cards visible), content not stretched.
**Desktop (1024px+)**: Max-width 640px centered, quick starts wrap/show all, no awkward spacing.

### 15.4 Browser & Device Testing
Test in: Chrome (latest), Safari (desktop + iOS), Firefox, Edge, Samsung Internet (Android).

### 15.5 Error Handling & Validation
**Goal input**: 3-200 chars, trim whitespace, inline error message.
**Generation**: Network error handling, timeout (30s) handling, validation before submit, retry mechanism.
**Storage**: Handle quota exceeded, graceful degradation if localStorage unavailable, validate data on load.

### 15.6 Performance
Lazy load routes (React.lazy), optimize images (WebP), minimize bundle, enable gzip, Lighthouse score target: 90+.

## Test Plan

**Automated Tests**:
- [ ] Lighthouse: Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90
- [ ] axe accessibility scan: No violations (run in CI or DevTools)
- [ ] Bundle size: Main bundle < 200KB gzipped
- [ ] Page load: First Contentful Paint < 1.5s, Time to Interactive < 3s
- [ ] Type checking: `pnpm type-check` passes with no errors
- [ ] Build: `pnpm build` completes without warnings

**Manual Verification - Accessibility**:
- [ ] Test with VoiceOver (Mac/iOS): All content accessible, navigation announced
- [ ] Test with NVDA (Windows): Form validation read aloud
- [ ] Tab through entire app: Focus visible, logical order, no focus traps (except modals)
- [ ] Keyboard only: Can navigate, activate buttons (Enter/Space), close modals (Escape)
- [ ] Color contrast: Use DevTools or online checker for WCAG AA compliance
- [ ] Zoom to 200%: Layout doesn't break, text remains readable

**Manual Verification - Responsive**:
- [ ] Mobile (iPhone SE 375px): All content fits, no horizontal scroll, tap targets adequate
- [ ] Tablet (iPad 768px): Cards show 2-3, layout adapts properly
- [ ] Desktop (1920px): Content centered max-width 640px, not stretched
- [ ] Landscape orientation: Layout adjusts appropriately
- [ ] Dynamic Island (iOS): Content doesn't overlap notch area

**Manual Verification - Browser Compatibility**:
- [ ] Chrome: All features work, no console errors
- [ ] Safari (macOS): Fonts load, animations smooth, PWA installable
- [ ] Safari (iOS): Touch gestures work, Add to Home Screen works, status bar correct color
- [ ] Firefox: Layout consistent, service worker registers
- [ ] Edge: No compatibility issues
- [ ] Samsung Internet: PWA install works, layout correct

**Manual Verification - Full App QA**:
- [ ] **Onboarding**: Welcome → goal setup → home (completes successfully, doesn't re-show)
- [ ] **Goal**: Edit, save, persists after refresh
- [ ] **Quick starts**: Scroll horizontally, tap shows "coming soon"
- [ ] **Generate**: Configure options, click generate, see progress, ritual created, notification shown
- [ ] **Background**: Start generation, navigate away, returns, notification appears
- [ ] **Navigation**: Bottom tabs switch screens, active tab indicated, back button works
- [ ] **PWA**: Installable (all platforms), works offline (except generation), correct icon/splash
- [ ] **Data**: Goal/preferences/rituals persist across sessions, localStorage readable in DevTools
- [ ] **Errors**: No goal → validation, network error → retry, timeout → warning

**Manual Verification - Edge Cases**:
- [ ] Clear localStorage → app resets gracefully, shows onboarding
- [ ] Spam click generate → handles multiple requests gracefully
- [ ] Navigate during generation → state persists, completes correctly
- [ ] Dismiss progress UI → generation continues, notification works
- [ ] Extremely long goal text (200+ chars) → validation prevents
- [ ] No internet + generate → shows helpful offline message
- [ ] Refresh during generation → acceptable behavior (MVP: generation lost)

**Expected**: App is accessible (WCAG AA), performant (Lighthouse 90+), responsive (375px-1920px), works in all major browsers, handles errors gracefully, data persists correctly.

## Completion Criteria
All checklist items pass. MVP ready for user testing.

## Next Steps (Post-MVP)
See master_plan.md for Phase 2 (Ritual Library & Editor) and beyond.
