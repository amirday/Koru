# Step 14: PWA Configuration

## Objective
Make the app installable and work offline.

## Tasks

### 14.1 Create Manifest (`public/manifest.json`)

```json
{
  "name": "Koru - Meditation Rituals",
  "short_name": "Koru",
  "description": "Goal-driven meditation ritual generator",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#FF9A54",
  "background_color": "#FFFCF8",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 14.2 Create App Icons

Generate icons at:
- `public/icons/icon-192.png` (192x192)
- `public/icons/icon-512.png` (512x512)
- `public/icons/apple-touch-icon.png` (180x180)
- `public/icons/favicon.ico`

**Design:**
- Simple, recognizable logo
- Peaceful, minimal aesthetic
- Peach accent on warm background

### 14.3 Update index.html

```html
<head>
  <!-- ... existing tags ... -->
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
</head>
```

### 14.4 Configure Service Worker (vite.config.ts)

Already configured in Step 1, but verify:
- Auto-update strategy
- Precache app shell (HTML, CSS, JS)
- Cache fonts and icons
- Network-first for API (future)

### 14.5 Test Installation

**Chrome (Desktop):**
- Install button in address bar
- Opens in app window

**Safari (iOS):**
- Share → Add to Home Screen
- Opens in standalone mode

**Android:**
- Chrome menu → Install app
- Creates home screen icon

## Offline Capabilities

**What works offline:**
- App shell loads
- View saved rituals
- Edit goal
- Browse quick starts
- View preferences

**What requires online:**
- Generate new rituals (AI)
- Sync data (future)

## Next Step

Proceed to **Step 15: Polish & Accessibility**
