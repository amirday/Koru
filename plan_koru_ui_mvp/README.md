# Koru UI MVP - Implementation Plan

This directory contains the complete implementation plan for the Koru meditation app MVP.

## Directory Structure

```
plan_koru_ui_mvp/
├── README.md (this file)
├── master_plan.md (high-level overview)
├── 01_project_setup_configuration.md
├── 02_core_data_models_types.md
├── 03_service_layer.md
├── 04_mock_data.md
├── 05_context_providers.md
├── 06_custom_hooks.md
├── 07_base_ui_components.md
├── 08_layout_components.md
├── 09_routing_setup.md
├── 10_onboarding_screens.md
├── 11_home_screen_components.md
├── 12_homescreen_assembly.md
├── 13_generation_flow_implementation.md
├── 14_pwa_configuration.md
└── 15_polish_accessibility.md
```

## How to Use This Plan

### Start Here
1. Read **master_plan.md** for the high-level overview and context
2. Review the design decisions and success criteria
3. Understand the phased approach

### Implementation
Follow the steps in order (01-15):
- Each step builds on the previous
- Files created in earlier steps are used in later steps
- Each step has clear objectives and verification steps

### Step-by-Step Guide

| Step | Focus Area | Key Deliverables |
|------|-----------|------------------|
| 01 | Setup | Dependencies, TypeScript, Vite, Tailwind |
| 02 | Types | Data models, service interfaces |
| 03 | Services | Storage, AI, background tasks, notifications |
| 04 | Data | Mock rituals and quick starts |
| 05 | State | React Contexts for global state |
| 06 | Hooks | Reusable logic hooks |
| 07 | UI | Base components (Button, Card, Input, etc.) |
| 08 | Layout | Screen container, bottom nav, header |
| 09 | Routing | React Router setup with guards |
| 10 | Onboarding | Welcome + goal setup screens |
| 11 | Components | Home screen specific components |
| 12 | Assembly | Complete Home screen |
| 13 | Flow | End-to-end generation implementation |
| 14 | PWA | Manifest, icons, service worker |
| 15 | Polish | Animations, accessibility, testing |

## Quick Reference

### What's In Scope (MVP)
✅ Onboarding (welcome + goal setup)
✅ Home screen with goal box
✅ Quick starts carousel (6 rituals)
✅ Generate ritual flow
✅ Background generation with notifications
✅ Data persistence (localStorage)
✅ Bottom navigation (4 tabs)
✅ PWA (installable, offline-capable)

### What's Out of Scope (Future Phases)
❌ Ritual Library screen (placeholder only)
❌ Ritual Editor
❌ Session Player
❌ Reflection screen
❌ Dashboard & insights
❌ Profile & settings
❌ Real AI integration
❌ Backend database

## Testing & Verification

Each step includes verification instructions. The final step (15) has a comprehensive QA checklist.

## Design Principles

Throughout implementation, remember:
- **Start simple, design for growth**
- **Smart defaults everywhere** (user can override)
- **Warm colors** (peach for accents, warm whites for backgrounds)
- **Minimal motion** (respect prefers-reduced-motion)
- **Accessibility first** (keyboard nav, screen readers, contrast)
- **Mobile-first** (responsive up to desktop)

## Tech Stack Summary

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS (custom design tokens)
- **Routing**: React Router v6
- **State**: React Context
- **Storage**: localStorage (→ IndexedDB → cloud)
- **AI**: Mock provider (→ Claude/OpenAI)
- **PWA**: vite-plugin-pwa + Workbox

## Questions or Issues?

Refer to:
- `../UI_design.md` - Complete UI specification
- `../claude.md` - Development phase guidelines
- Master plan in this directory - High-level architecture

## Next Steps After MVP

1. **Phase 2**: Ritual Library & Editor
2. **Phase 3**: Session Player & Reflection
3. **Phase 4**: Dashboard & Insights
4. **Phase 5**: Profile & Settings
5. **Phase 6**: Backend Integration

See master_plan.md for details on future phases.

---

**Ready to start?** Begin with **01_project_setup_configuration.md**
