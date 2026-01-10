
## Current phase (IMPORTANT)
We are in **UI/UX Mock Phase**.
- Build ONLY the UI and UX flows.
- Use mocked data only (static JSON or simple in-memory mocks).
- Do NOT implement real business logic, persistence, auth, payments, analytics, or external services.
- Any “generation” / “preview” / “player” behavior is simulated with placeholders.


## Primary objective
Produce a polished, calm, premium-feeling UI that supports:
1) Onboarding
2) Ritual Builder
3) Session Player
4) Library / History 

All screens must look real and feel interactive, even if the data is fake.

## Non-negotiables (UI/UX)
- Calm visual language: clear hierarchy, minimal noise.
- Mobile-first responsive layouts.
- Accessibility basics: focus states, readable contrast.
- Consistent components and spacing scale.
- Realistic empty/loading/error states (mocked).

## What “mocked” means here
Allowed:
- client-side state (local component state / zustand) for UI interactions
- fake delays to simulate loading, keep them short, a 5 seconds at maximum

Not allowed (until we switch phases):
- database schema/migrations
- server actions that persist user data
- real LLM calls
- real TTS providers
- authentication flows beyond static UI


## Collaboration rules (Claude)
- Optimize for UI fidelity and interaction clarity.
- Always implement screens with realistic mocked content.
- Prefer reusable components over repeated markup.
- Keep changes reviewable: one flow/screen at a time.
- No backend “stubs” unless needed to drive UI state.

## Definition of Done (UI phase)
A task is done only if:
- The screen renders and is navigable.
- Interactions look real (even if mocked).
- Empty/loading/error states exist.
- Styling matches the design system and stays consistent across screens.
- All test passed and plan (if availble) completion and test status is updated. your job is to update the atuomated tests, and I will update the manuale tests. 