# Step 1: Project Setup & Configuration

## Objective
Set up the development environment with React 18+ TypeScript, Vite, Tailwind CSS, and PWA support for the Koru meditation app.

## Why This Matters
Proper configuration at the start ensures:
- Type safety with strict TypeScript settings
- Fast development with Vite's HMR
- Design consistency with Tailwind design tokens
- PWA capabilities (installable, offline-ready)
- Clear path aliases for clean imports

---

## Key Tasks

### 1.1 Install Core Dependencies

**Framework & Build**:
```bash
pnpm add react react-dom react-router-dom
pnpm add -D @vitejs/plugin-react vite typescript @types/react @types/react-dom
```

**Styling**:
```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @tailwindcss/forms tailwindcss-animate
```

**PWA**:
```bash
pnpm add -D vite-plugin-pwa workbox-window
```

**Optional (Future phases)**:
- `date-fns` - Date utilities
- `howler` - Audio management (Phase 3: Session Player)

### 1.2 Configure TypeScript

**File**: `tsconfig.json`

**Requirements**:
- Enable strict mode for type safety
- Set target to ES2020
- Configure JSX as `react-jsx`
- Add path alias `@/*` pointing to `./src/*`
- Include noUnusedLocals and noUnusedParameters

### 1.3 Configure Vite

**File**: `vite.config.ts`

**Requirements**:
- Add React plugin
- Configure PWA plugin with manifest settings (see §1.5 below)
- Set up path alias to match TypeScript config (`@` → `./src`)
- Configure dev server on port 5173 with auto-open

**PWA Workbox Configuration**:
- Runtime caching for Google Fonts (CacheFirst, 1 year expiration)
- Asset precaching for fonts and icons

### 1.4 Configure Tailwind CSS

**File**: `tailwind.config.js`

**Content paths**:
- `./index.html`
- `./src/**/*.{js,ts,jsx,tsx}`

**Theme Extensions**:
- **Colors**: Warm & inviting palette (peach, warm, calm, gentle, functional colors)
  - See **UI_design.md §3 "Color Palette (Warm & Inviting)"** for exact hex codes
- **Fonts**: Lora (serif) and Inter (sans-serif)
  - See **UI_design.md §3 "Typography"** for font configuration
- **Custom spacing**: Add 18 (4.5rem), 22 (5.5rem)
- **Border radius**: card (1rem), card-lg (1.25rem)
- **Box shadows**: card, card-hover, elevated
- **Session text sizes**: session-sm through session-xl (adjustable text)

**Plugins**:
- `@tailwindcss/forms` - Form styling
- `tailwindcss-animate` - Animation utilities

**Initialize Tailwind**:
```bash
pnpm dlx tailwindcss init -p
```

### 1.5 Create Base Styles

**File**: `src/styles/globals.css`

**Requirements**:
- Import Tailwind directives (@tailwind base, components, utilities)
- Import Lora and Inter fonts from Google Fonts
- Set base styles:
  - Background: `bg-warm-50`, text: `text-calm-900`, font: `font-sans`
  - Dynamic viewport height for mobile (`100dvh`)
  - Headings use `font-serif`
- Add focus-visible styles with peach ring
- **Critical**: Implement prefers-reduced-motion support
  - See **UI_design.md §3 "Animation & Motion"** for guidelines
  - Disable all animations when user has reduced motion preference
- Add utility classes for safe-area insets (top, bottom, left, right)

### 1.6 Create Entry Points

**File**: `src/main.tsx`
- Create React root with StrictMode
- Import App component and global styles

**File**: `src/App.tsx`
- Simple component showing "Koru" in peach color for verification
- Will be expanded with providers and router in later steps

**File**: `index.html`
- Set viewport with `viewport-fit=cover` for safe areas
- Add theme-color meta tag (#FF9A54 - peach)
- Add description meta tag
- Set title to "Koru - Meditation Rituals"

### 1.7 Update Package Scripts

**File**: `package.json` scripts section

Add:
- `dev`: Start Vite dev server
- `build`: TypeScript check + Vite build
- `preview`: Preview production build
- `lint`: TypeScript type checking without emit

---

## Configuration References

**Design tokens**: See **UI_design.md §3** for complete design language:
- Color Palette (Warm & Inviting)
- Typography (Lora + Inter)
- Animation & Motion guidelines
- Accessibility requirements

**Technical Foundation**: See **UI_design.md §1.5** for:
- Platform specifications (PWA)
- Tech stack decisions
- Design philosophy

---

## Files to Create/Modify

- `/Users/amirdaygmail.com/projects/Koru/package.json` - Dependencies and scripts
- `/Users/amirdaygmail.com/projects/Koru/tsconfig.json` - TypeScript configuration
- `/Users/amirdaygmail.com/projects/Koru/vite.config.ts` - Vite + PWA setup
- `/Users/amirdaygmail.com/projects/Koru/tailwind.config.js` - Design tokens
- `/Users/amirdaygmail.com/projects/Koru/postcss.config.js` - PostCSS (auto-generated)
- `/Users/amirdaygmail.com/projects/Koru/src/styles/globals.css` - Base styles
- `/Users/amirdaygmail.com/projects/Koru/src/main.tsx` - React entry point
- `/Users/amirdaygmail.com/projects/Koru/src/App.tsx` - Root component
- `/Users/amirdaygmail.com/projects/Koru/index.html` - HTML template

---

## Verification

Run these commands to verify setup:

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm dev
```

**Expected Results**:
- [ ] Dev server runs on http://localhost:5173
- [ ] Browser opens automatically
- [ ] Page displays "Koru" in Lora serif font, peach color (#FF9A54)
- [ ] Hot reload works when editing `src/App.tsx`
- [ ] TypeScript compiles without errors (`pnpm lint`)
- [ ] Tailwind classes apply correctly (inspect element shows compiled styles)
- [ ] Console shows no errors

---

## Next Step

Proceed to **Step 2: Core Data Models & Types**
