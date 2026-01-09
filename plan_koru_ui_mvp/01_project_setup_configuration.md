# Step 1: Project Setup & Configuration

## Objective
Set up the development environment with all necessary tooling and configuration.

## Tasks

### 1.1 Install Dependencies

```bash
# Core framework
pnpm add react react-dom react-router-dom

# TypeScript types
pnpm add -D @types/react @types/react-dom typescript

# Build tools
pnpm add -D @vitejs/plugin-react vite

# Styling
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/forms tailwindcss-animate

# PWA support
pnpm add -D vite-plugin-pwa workbox-window

# Utility libraries (optional for later)
# pnpm add date-fns
# pnpm add howler (for audio - Phase 3)
```

### 1.2 Configure TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.3 Configure Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fonts/**/*', 'icons/**/*'],
      manifest: {
        name: 'Koru - Meditation Rituals',
        short_name: 'Koru',
        description: 'Goal-driven meditation ritual generator',
        theme_color: '#FF9A54',
        background_color: '#FFFCF8',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

### 1.4 Configure Tailwind (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm & inviting palette
        peach: {
          50: '#FFF7F0',
          100: '#FFEEE0',
          200: '#FFD9BD',
          300: '#FFC49A',
          400: '#FFAF77',
          500: '#FF9A54', // Primary
          600: '#E67B3C',
          700: '#CC5C24',
          800: '#B33D0C',
          900: '#992000',
        },
        warm: {
          50: '#FFFCF8',  // Main background
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#FFE8D0',
          400: '#FFE0C0',
          500: '#FFD8B0',
        },
        gentle: {
          yellow: '#FFF9E6',
          gold: '#F5E6B3',
        },
        calm: {
          50: '#F9F9F8',
          100: '#F3F3F1',
          200: '#E8E8E6',
          300: '#D4D4D0',
          400: '#AFAFAB',
          500: '#8B8B86',
          600: '#6B6B66',
          700: '#4F4F4B',
          800: '#38383A',
          900: '#252527',
        },
        success: '#A3D9B1',
        warning: '#FFD8B0',
        error: '#FFB3BA',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'session-sm': ['1.125rem', '1.75'],
        'session-md': ['1.5rem', '2'],
        'session-lg': ['2rem', '2.25'],
        'session-xl': ['2.5rem', '2.5'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '1rem',
        'card-lg': '1.25rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
```

### 1.5 Initialize Tailwind

```bash
pnpm dlx tailwindcss init -p
```

### 1.6 Create Base Styles (`src/styles/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* CSS Reset & Base Styles */
@layer base {
  * {
    @apply border-calm-200;
  }

  html {
    @apply antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-warm-50 text-calm-900 font-sans;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }

  /* Remove default margins */
  h1, h2, h3, h4, h5, h6, p {
    @apply m-0;
  }

  /* Headings use serif font */
  h1, h2, h3 {
    @apply font-serif;
  }

  /* Focus visible styles */
  *:focus-visible {
    @apply outline-none ring-2 ring-peach-500 ring-offset-2;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

/* Utility classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .safe-top {
    padding-top: env(safe-area-inset-top);
  }

  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .safe-left {
    padding-left: env(safe-area-inset-left);
  }

  .safe-right {
    padding-right: env(safe-area-inset-right);
  }
}
```

### 1.7 Create Entry Point (`src/main.tsx`)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 1.8 Create Minimal App Component (`src/App.tsx`)

```typescript
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-serif text-peach-500">
        Koru
      </h1>
    </div>
  );
}

export default App;
```

### 1.9 Update index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/icon-192.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#FF9A54" />
    <meta name="description" content="Goal-driven meditation ritual generator" />
    <title>Koru - Meditation Rituals</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 1.10 Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  }
}
```

## Verification

Run the following commands to verify setup:

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Should open http://localhost:5173 with "Koru" displayed in peach color
```

## Expected Output

- Dev server runs on port 5173
- Page displays "Koru" in Lora serif font, peach color
- Hot reload works when editing files
- TypeScript compiles without errors
- Tailwind classes apply correctly

## Next Step

Proceed to **Step 2: Core Data Models & Types**
