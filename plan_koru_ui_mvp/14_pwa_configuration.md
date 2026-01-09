# Step 14: PWA Configuration

## Objective
Make app installable as a Progressive Web App and enable offline functionality for core features.

## Key Tasks

### 14.1 Create Web App Manifest
**File**: `public/manifest.json`

**Required properties**: name ("Koru - Meditation Rituals"), short_name ("Koru"), description, start_url ("/"), display ("standalone"), orientation ("portrait"), theme_color (peach-500), background_color (warm-50), icons array (192x192, 512x512).

**Reference**: UI_design.md §3 for exact color hex codes (theme_color, background_color)

### 14.2 Generate App Icons
Create icons:
- `public/icons/icon-192.png` (192×192) - Android small
- `public/icons/icon-512.png` (512×512) - Android large, splash
- `public/icons/apple-touch-icon.png` (180×180) - iOS
- `public/icons/favicon.ico` - Browser tab

**Design**: Simple wordmark/symbol, peaceful aesthetic, peach accent on warm background, clear at small sizes, safe area for maskable icons (80% center).

### 14.3 Update HTML Meta Tags
**File**: `index.html`

Add to `<head>`: manifest link, apple-touch-icon link, apple-mobile-web-app-capable meta, apple-mobile-web-app-status-bar-style meta (default).

### 14.4 Configure Service Worker
**File**: `vite.config.ts` (already configured in Step 01)

**Verify settings**: Auto-update strategy, precache app shell (HTML/CSS/JS), cache fonts/icons (cache-first), API calls use network-first (future), offline fallback (disable generate button when offline).

### 14.5 Test Installation Flow
**Chrome Desktop**: Install icon in address bar → click → opens in app window (no browser UI)
**Safari iOS**: Share → "Add to Home Screen" → full-screen launch
**Chrome Android**: Menu → "Install app" → home screen icon → splash screen on launch

## Offline Functionality

**Works offline**: App shell loads, view saved rituals, edit goal, browse quick starts, view/change preferences, navigate screens.

**Requires online**: Generate new rituals (AI service), sync data (future), download new quick starts (future).

**Graceful degradation**: Generate button shows "Offline" state with disabled appearance, attempt to generate shows toast: "Generation requires internet connection".

## Files to Modify
- `public/manifest.json` - Web app manifest
- `public/icons/*` - App icons (4 files)
- `index.html` - Manifest + iOS meta tags
- `vite.config.ts` - Verify PWA plugin (from Step 01)

## Test Plan

**Automated Tests**:
- [ ] Build process generates manifest.json in dist/
- [ ] Service worker registers on app load
- [ ] Cache storage populated with app shell assets
- [ ] PWA manifest validation passes (Chrome DevTools)
- [ ] Icons exist at specified paths and sizes

**Manual Verification**:
- [ ] Chrome desktop shows install prompt in address bar
- [ ] Click install → app opens in standalone window (no browser UI)
- [ ] Safari iOS "Add to Home Screen" works
- [ ] iOS app launches full-screen without Safari UI
- [ ] Android Chrome shows install banner
- [ ] Android installation creates home screen icon
- [ ] Installed app displays correct name ("Koru") and icon
- [ ] Theme color applied to status bar (mobile)
- [ ] Splash screen shows on launch (Android)
- [ ] Disconnect network → app loads instantly from cache
- [ ] Offline: Can navigate /home, /rituals, /profile
- [ ] Offline: Can view saved rituals and edit goal
- [ ] Offline: Generate button shows disabled/"Offline" state
- [ ] Offline: Attempt generate shows helpful error toast
- [ ] DevTools → Application → Service Workers shows active worker
- [ ] DevTools → Application → Cache Storage shows assets cached
- [ ] Change code, rebuild → app updates on next load

**Expected**: App installs on all platforms, works offline (except generation), caches assets properly, updates automatically.

## Next Step
Proceed to **Step 15: Polish & Accessibility**
