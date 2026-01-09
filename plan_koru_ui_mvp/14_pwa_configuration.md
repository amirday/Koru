# Step 14: PWA Configuration

## Objective
Make the app installable as a Progressive Web App and enable offline functionality for core features.

## Why This Matters
PWA capabilities provide:
- **Native-like experience**: Install on home screen, full-screen mode
- **Offline access**: View rituals and settings without connection
- **Fast loading**: Cached app shell for instant startup
- **Cross-platform**: Works on iOS, Android, and desktop with single codebase

---

## Key Tasks

### 14.1 Create Web App Manifest

**File**: `public/manifest.json`

**Required Properties**:
- **name**: "Koru - Meditation Rituals"
- **short_name**: "Koru"
- **description**: Brief app description for app stores
- **start_url**: "/" (entry point)
- **display**: "standalone" (full-screen, no browser UI)
- **orientation**: "portrait" (mobile-optimized)
- **theme_color**: Peach-500 from design system
- **background_color**: Warm-50 from design system

**Icon Configuration**:
- Array of icon objects with src, sizes, type, purpose
- Sizes needed: 192x192 and 512x512 (minimum)
- Purpose: "any maskable" for adaptive icons

**Color Values**: See **UI_design.md §3 "Color Palette"** for exact hex codes
- theme_color: Use peach-500
- background_color: Use warm-50

### 14.2 Generate App Icons

**Files to Create**:
- `public/icons/icon-192.png` (192x192) - Android small
- `public/icons/icon-512.png` (512x512) - Android large, splash screen
- `public/icons/apple-touch-icon.png` (180x180) - iOS home screen
- `public/icons/favicon.ico` - Browser tab

**Design Guidelines**:
- Simple, recognizable wordmark or symbol
- Peaceful, minimal aesthetic matching brand
- Peach accent color on warm/white background
- Clear at small sizes (192px)
- Safe area for maskable icons (80% center)

**Tool Recommendations**:
- Use Figma, Sketch, or design tool export
- Or use PWA icon generator service
- Ensure icons are optimized PNGs

### 14.3 Update HTML Meta Tags

**File**: `index.html`

**Add to `<head>`**:
- Link to manifest.json
- Apple touch icon link
- iOS web app capable meta tag
- iOS status bar style meta tag (default for light appearance)

**Purpose**:
- Manifest enables installation prompt
- Apple tags ensure proper iOS behavior
- Status bar style matches warm theme

### 14.4 Configure Service Worker Caching

**File**: `vite.config.ts`

**Already configured in Step 1**, but verify settings:

**Update Strategy**:
- Auto-update: App updates on next visit after new version
- Prompt user option: Show "Update available" toast (future enhancement)

**Precache Assets**:
- App shell: HTML, CSS, bundled JavaScript
- Static assets: Fonts (Lora, Inter), icons, images
- Exclude: Large files, external resources

**Caching Strategies**:
- **App shell**: Cache-first (fast, reliable)
- **Fonts/icons**: Cache-first (static resources)
- **API calls**: Network-first (future - when backend exists)
- **Runtime caching**: Cache visited routes dynamically

**Offline Fallback**:
- Show offline indicator if network unavailable
- Disable generation button when offline
- Allow viewing cached rituals and preferences

### 14.5 Test Installation Flow

**Chrome (Desktop)**:
1. Run dev server: `pnpm dev`
2. Look for install icon in address bar (⊕ or + symbol)
3. Click install → app opens in standalone window
4. Verify: No browser UI, custom window title

**Safari (iOS)**:
1. Open app in Safari
2. Tap Share button → "Add to Home Screen"
3. Tap Add → icon appears on home screen
4. Launch app → opens full-screen without Safari UI
5. Verify: Status bar matches theme color

**Chrome (Android)**:
1. Open app in Chrome
2. Chrome menu (⋮) → "Install app" or "Add to Home Screen"
3. Install → icon added to home screen
4. Launch app → opens standalone
5. Verify: Splash screen uses background_color and icon

---

## Offline Functionality

### What Works Offline (MVP)

**Available**:
- App shell loads from cache
- View saved rituals in library
- Edit and update goal
- Browse quick start rituals (pre-loaded)
- View and change preferences
- Navigate between screens

**Graceful Degradation**:
- "Generate" button shows disabled state with "Offline" message
- Attempt to generate shows toast: "Generation requires internet connection"
- Local changes sync when connection restored (future)

### What Requires Online

**Network-dependent features**:
- Generate new rituals (AI service required)
- Sync data to cloud (future - Phase 4)
- Download new quick starts (future updates)

---

## Files to Create/Modify

- `/Users/amirdaygmail.com/projects/Koru/public/manifest.json` - Web app manifest
- `/Users/amirdaygmail.com/projects/Koru/public/icons/icon-192.png` - Android small icon
- `/Users/amirdaygmail.com/projects/Koru/public/icons/icon-512.png` - Android large icon
- `/Users/amirdaygmail.com/projects/Koru/public/icons/apple-touch-icon.png` - iOS icon
- `/Users/amirdaygmail.com/projects/Koru/public/icons/favicon.ico` - Browser favicon
- `/Users/amirdaygmail.com/projects/Koru/index.html` - Add manifest and iOS meta tags
- `/Users/amirdaygmail.com/projects/Koru/vite.config.ts` - Verify PWA plugin config from Step 1

---

## Verification

Test PWA installation and offline functionality:

**Installation**:
- [ ] Chrome desktop shows install prompt
- [ ] Installation succeeds, opens in app window
- [ ] Safari iOS "Add to Home Screen" works
- [ ] iOS app opens full-screen without Safari UI
- [ ] Android Chrome shows install banner
- [ ] Android installation creates home screen icon

**App Behavior**:
- [ ] Installed app has correct name ("Koru")
- [ ] App icon displays properly
- [ ] Theme color applied to status bar (mobile)
- [ ] Splash screen shows on launch (Android)
- [ ] No browser UI visible when installed

**Offline Functionality**:
- [ ] Disconnect network
- [ ] App loads from cache (instant)
- [ ] Can navigate between /home, /rituals, /profile
- [ ] Can view saved rituals
- [ ] Can edit goal (saves to localStorage)
- [ ] Generate button shows disabled/"Offline" state
- [ ] Attempt to generate shows helpful error message

**Service Worker**:
- [ ] Check DevTools → Application → Service Workers
- [ ] Service worker registered and activated
- [ ] Cache storage populated with app assets
- [ ] Fonts and icons cached

**Updates**:
- [ ] Change app code and rebuild
- [ ] Reload app → updates automatically (or shows prompt)
- [ ] New version served correctly

---

## Next Step

Proceed to **Step 15: Polish & Accessibility**
