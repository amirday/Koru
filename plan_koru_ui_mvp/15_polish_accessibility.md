# Step 15: Polish & Accessibility

## Objective
Add animations, ensure accessibility, and test across devices.

## Tasks

### 15.1 Create Animations (`src/styles/animations.css`)

```css
/* Page transitions */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal animations */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Toast animations */
@keyframes toastSlideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply animations (respect reduced motion) */
.page-enter {
  animation: fadeIn 250ms ease-out;
}

.modal-enter {
  animation: modalFadeIn 200ms ease-out;
}

.toast-enter {
  animation: toastSlideUp 250ms ease-out;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .page-enter,
  .modal-enter,
  .toast-enter {
    animation: none !important;
  }
}
```

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
