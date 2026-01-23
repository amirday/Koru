# Plan: TTS Integration and Audio Stitching Architecture

> **Status**: Planning Complete
> **Created**: January 2026
> **Dependencies**: Phase 1 (UI/UX Mock) completion

## Overview

Integrate text-to-speech (TTS) and audio stitching to align generated meditation text with user-selected section durations.

---

## 1. Approach: Post-Padding vs Embedded Silence

| Approach | Embedded Silence | Post-Padding (Recommended) |
|----------|-----------------|---------------------------|
| How | LLM adds `[silence:3s]` markers | Generate TTS → measure → add padding |
| Predictability | LLM guesses don't match TTS | Exact math after TTS |
| Flexibility | Locked to one voice/speed | Works with any voice |
| Simplicity | Complex prompt engineering | Simple audio math |

**Post-padding algorithm:**
1. Generate plain text TTS → measure actual duration
2. Calculate: `silence_needed = target_duration - tts_duration`
3. Distribute silence naturally (intro pause, between sentences, outro)
4. Stitch together

**Edge cases:**
- TTS longer than target → trim silence, show warning if >10% over
- TTS much shorter → add ambient breathing room (more silence = more meditative)
- Minimum speech ratio → ensure at least 40% is speech

---

## 2. Architecture Design

### Service Structure

```
src/services/
├── tts/
│   ├── index.ts
│   ├── tts-service.ts           # Provider selection
│   ├── TTSProvider.interface.ts
│   ├── MockTTSProvider.ts       # Development
│   └── ElevenLabsProvider.ts    # Production
├── audio/
│   ├── index.ts
│   ├── AudioStitcher.ts         # Combines audio + silence
│   ├── AudioCache.ts            # IndexedDB caching
│   └── audio-utils.ts           # Duration detection
└── ritual-audio/
    ├── index.ts
    └── RitualAudioGenerator.ts  # Orchestrates TTS + stitching
```

### Key Interfaces

**TTSProvider:**
```typescript
interface TTSProvider {
  synthesize(options: { text: string; voiceId?: string }): Promise<{
    audioBlob: Blob
    durationSeconds: number  // Actual TTS audio length - needed to calculate silence padding
  }>
  getVoices(): Promise<TTSVoice[]>
  getVoicePreview(voiceId: string): Promise<string>  // Returns preview audio URL
  isAvailable(): Promise<boolean>
}
```
> **Why durationSeconds?** We need the actual TTS audio length to calculate how much silence to add: `silence_needed = target_section_duration - tts_duration`. Without measuring TTS output, we can't hit the target duration.

**AudioStitcher:**
```typescript
interface AudioStitcher {
  stitch(segments: AudioSegment[], targetDurationMs: number): Promise<Blob>
  getDuration(blob: Blob): Promise<number>
  generateSilence(durationMs: number): Promise<Blob>
}
```

**RitualAudioGenerator:**
```typescript
interface RitualAudioGenerator {
  generateRitualAudio(ritual: Ritual, onProgress?: (p) => void): Promise<SectionAudio[]>
  generateSectionAudio(section: RitualSection, targetDuration: number): Promise<SectionAudio>
}
```

---

## 3. Data Model Updates

### Core Segment Type (Shared for Text and Audio)

```typescript
// /src/types/segment.ts

/**
 * A segment is either text/speech or silence.
 * This same structure is used at all stages:
 * 1. Text generation (OpenAI) - creates segments with text
 * 2. Audio generation (TTS) - adds audioBlob to segments
 */
interface Segment {
  id: string
  type: 'text' | 'silence'

  // For text segments
  text?: string                  // The text content (filled by OpenAI)

  // Duration
  durationSeconds: number        // Target duration for this segment

  // Audio (populated after TTS)
  audioBlob?: Blob               // Generated audio
  actualDurationSeconds?: number // Measured audio duration
}
```

### Updated RitualSection Model

```typescript
// /src/types/models.ts - REPLACE existing RitualSection

/**
 * A ritual section contains an ordered list of segments.
 * Each segment is either text (to be spoken) or silence (pause).
 */
interface RitualSection {
  id: string
  type: 'intro' | 'body' | 'closing'
  durationSeconds: number        // Total target duration for section

  segments: Segment[]            // Ordered list of text/silence segments

  // Legacy compatibility (computed from segments)
  guidanceText?: string          // Concatenated text from all text segments

  // Audio (populated after TTS generation)
  audioUrl?: string              // Cached combined audio URL
  audioDurationSeconds?: number  // Actual combined audio duration
  audioGeneratedAt?: string      // Cache invalidation timestamp
}
```

### Ritual Model (Full Structure)

```typescript
// /src/types/models.ts

interface Ritual {
  id: string
  title: string
  duration: number               // Total duration in seconds
  tone: RitualTone
  tags: string[]
  instructions: string           // User's original intention

  sections: RitualSection[]      // List of sections, each with segments

  // Audio generation state
  audioStatus?: 'pending' | 'generating' | 'ready' | 'error'
  voiceId?: string               // Selected voice for TTS

  // Metadata
  createdAt: string
  updatedAt: string
  statistics?: RitualStatistics | null
}
```

### Example: Full Ritual Structure

```json
{
  "id": "ritual-123",
  "title": "Morning Focus",
  "duration": 300,
  "tone": "gentle",
  "sections": [
    {
      "id": "section-intro",
      "type": "intro",
      "durationSeconds": 60,
      "segments": [
        { "id": "seg-1", "type": "silence", "durationSeconds": 2 },
        { "id": "seg-2", "type": "text", "text": "Welcome to your morning meditation.", "durationSeconds": 5 },
        { "id": "seg-3", "type": "silence", "durationSeconds": 3 },
        { "id": "seg-4", "type": "text", "text": "Find a comfortable position and close your eyes.", "durationSeconds": 8 },
        { "id": "seg-5", "type": "silence", "durationSeconds": 42 }
      ]
    },
    {
      "id": "section-body",
      "type": "body",
      "durationSeconds": 200,
      "segments": [
        { "id": "seg-6", "type": "text", "text": "Take a deep breath in...", "durationSeconds": 4 },
        { "id": "seg-7", "type": "silence", "durationSeconds": 5 },
        { "id": "seg-8", "type": "text", "text": "And slowly breathe out.", "durationSeconds": 3 },
        { "id": "seg-9", "type": "silence", "durationSeconds": 8 }
      ]
    },
    {
      "id": "section-closing",
      "type": "closing",
      "durationSeconds": 40,
      "segments": [
        { "id": "seg-10", "type": "text", "text": "Gently bring your awareness back.", "durationSeconds": 5 },
        { "id": "seg-11", "type": "silence", "durationSeconds": 3 },
        { "id": "seg-12", "type": "text", "text": "Open your eyes when you are ready.", "durationSeconds": 5 },
        { "id": "seg-13", "type": "silence", "durationSeconds": 27 }
      ]
    }
  ]
}
```

### After Audio Generation

Same structure, but segments have `audioBlob` and `actualDurationSeconds`:

```json
{
  "id": "seg-2",
  "type": "text",
  "text": "Welcome to your morning meditation.",
  "durationSeconds": 5,
  "audioBlob": "<Blob>",
  "actualDurationSeconds": 4.2
}
```

> The silence at the end of each section is adjusted based on actual TTS duration vs target.

### OpenAI Prompt Change

The OpenAI prompt will now request JSON with segments:

```json
{
  "title": "Morning Focus",
  "sections": [
    {
      "type": "intro",
      "durationSeconds": 60,
      "segments": [
        { "type": "silence", "durationSeconds": 2 },
        { "type": "text", "text": "Welcome...", "durationSeconds": 5 },
        { "type": "silence", "durationSeconds": 3 },
        { "type": "text", "text": "Find a comfortable...", "durationSeconds": 8 }
      ]
    }
  ],
  "tags": ["morning", "focus"]
}
```

---

## 4. Voice Data Structure

```typescript
// /src/types/voice.ts
interface Voice {
  id: string                     // ElevenLabs voice_id (e.g., "21m00Tcm4TlvDq8ikWAM")
  name: string                   // Display name (e.g., "Rachel")
  description: string            // Short description
  labels: string[]               // Tags like ['calm', 'female', 'american']
  previewUrl: string             // Local path to bundled sample audio
  previewText: string            // What the preview audio says
}

// /src/types/user-preferences.ts
interface UserVoicePreferences {
  selectedVoiceId: string        // Currently selected voice ID
  // Future: per-tone voice selection
  // gentleVoiceId?: string
  // neutralVoiceId?: string
  // coachVoiceId?: string
}

// /src/data/voices.json - Voice manifest (generated by script)
{
  "voices": [
    {
      "id": "21m00Tcm4TlvDq8ikWAM",
      "name": "Rachel",
      "description": "Calm and soothing American female voice",
      "labels": ["calm", "female", "american"],
      "previewUrl": "/voices/rachel-preview.mp3",
      "previewText": "Take a deep breath and let your shoulders relax."
    }
  ],
  "defaultVoiceId": "21m00Tcm4TlvDq8ikWAM",
  "generatedAt": "2026-01-20T10:00:00Z"
}
```

### Voice Sample Generation Script

Create `/scripts/generate-voice-samples.ts`:
```typescript
// Script to generate voice preview samples from ElevenLabs
// Run: npx tsx scripts/generate-voice-samples.ts

// 1. Define voices to include (curated list of meditation-appropriate voices)
// 2. For each voice:
//    - Call ElevenLabs API with sample meditation phrase
//    - Save audio to /public/voices/{voice-id}-preview.mp3
// 3. Generate /src/data/voices.json manifest

// Benefits:
// - Bundled samples work offline
// - Consistent preview text across all voices
// - Version controlled voice selection
// - No runtime API calls for previews
```

---

## 5. Environment Variables

```
VITE_ELEVENLABS_API_KEY=...
VITE_TTS_PROVIDER=elevenlabs  # or 'mock'
VITE_ELEVENLABS_VOICE_ID=...
```

---

## 6. Files to Create

| File | Purpose |
|------|---------|
| `/src/types/segment.ts` | Segment type (text/silence with duration) |
| `/src/services/tts/TTSProvider.interface.ts` | Interface definition |
| `/src/services/tts/MockTTSProvider.ts` | Returns silence/pre-recorded audio |
| `/src/services/tts/ElevenLabsProvider.ts` | ElevenLabs API integration |
| `/src/services/tts/tts-service.ts` | Provider selection |
| `/src/services/tts/index.ts` | Exports |
| `/src/services/audio/AudioStitcher.ts` | Web Audio API stitching |
| `/src/services/audio/AudioCache.ts` | IndexedDB caching |
| `/src/services/audio/audio-utils.ts` | Duration detection |
| `/src/services/audio/index.ts` | Exports |
| `/src/services/ritual-audio/RitualAudioGenerator.ts` | Orchestration |
| `/src/services/ritual-audio/index.ts` | Exports |
| `/src/types/elevenlabs.ts` | ElevenLabs API types |
| `/src/components/rituals/SectionSilenceEditor.tsx` | Silence config UI per section |
| `/src/components/settings/VoiceCard.tsx` | Voice selection card with preview |
| `/src/components/settings/VoicePreviewPlayer.tsx` | Audio preview playback |
| `/src/screens/Settings/VoiceSettingsScreen.tsx` | Voice selection screen |
| `/src/types/voice.ts` | Voice and UserVoicePreferences types |
| `/src/data/voices.json` | Voice manifest (generated by script) |
| `/scripts/generate-voice-samples.ts` | Script to generate preview audio from ElevenLabs |
| `/public/voices/` | Directory for bundled voice preview audio files |

---

## 7. Files to Modify

| File | Changes |
|------|---------|
| `/src/types/models.ts` | **Major**: Replace RitualSection.guidanceText with segments[] |
| `/src/types/index.ts` | Export Segment, Voice types |
| `/src/services/index.ts` | Export new services |
| `/src/services/ai/prompts.ts` | **Major**: Update prompt to request segments format |
| `/src/services/ai/parsers.ts` | **Major**: Parse segments instead of guidanceText |
| `/src/mocks/rituals.ts` | Update mock data to use segments format |
| `/src/hooks/useSessionPlayer.ts` | Use generated audio, iterate segments |
| `/src/contexts/SessionContext.tsx` | Add audio generation state |
| `/src/contexts/RitualContext.tsx` | Handle new segment structure |
| `/docs/sys_arch/ARCHITECTURE.md` | Document audio pipeline |
| `/.env` | Add ElevenLabs variables |
| `/src/screens/Rituals/RitualEditorScreen.tsx` | Add segment editing UI |
| `/src/components/rituals/RitualCard.tsx` | Display segments summary |
| `/src/components/rituals/RitualPreviewModal.tsx` | Show segments breakdown |

---

## 8. UI/UX Changes

### 8.1 Section Silence Editor (Ritual Editor)

Add controls to each section in the ritual editor to configure silence distribution:

```typescript
// Add to RitualSection in /src/types/models.ts
interface SilenceConfig {
  introSilenceMs: number    // Pause before speech starts (default: 2000)
  outroSilenceMs: number    // Pause after speech ends (default: calculated)
  // Total silence = target_duration - tts_duration
  // User can adjust intro/outro ratio
}

interface RitualSection {
  // ... existing fields
  silenceConfig?: SilenceConfig
}
```

**UI Design:**
- Each section card in ritual editor shows:
  - Duration slider (already exists)
  - Guidance text (already exists)
  - NEW: "Silence" expandable section with:
    - "Intro pause" slider (0-10 seconds)
    - "Outro pause" auto-calculated display
    - Visual timeline showing: [intro silence | speech | outro silence]
- Default: Auto-distribute silence (30% intro, 70% outro)
- Advanced: Let user manually set intro pause

### 8.2 Voice Selection & Preview (Settings)

New screen or modal for voice selection:

**UI Design:**
- Voice picker with cards for each available voice
- Each voice card shows:
  - Voice name and labels (e.g., "Rachel - calm, female")
  - Preview button (plays sample audio)
  - Select button
- Preview plays a short meditation phrase like "Take a deep breath..."
- Selected voice saved to user preferences
- Link from ritual editor: "Change voice" button

**Location:** `/settings/voice` or modal from ritual editor

**Components:**
- `VoiceCard` - displays voice info with preview button
- `VoicePreviewPlayer` - handles audio playback of samples
- `VoiceSettingsScreen` - list of voices with selection

---

## 9. Implementation Phases

### Phase 0: Data Model Migration
**Goal:** Update data structures to support segments

**Tasks:**
- [ ] Create `/src/types/segment.ts` with Segment type
- [ ] Update `RitualSection` in models.ts to use `segments[]`
- [ ] Update OpenAI prompts.ts to request segments format
- [ ] Update parsers.ts to parse segments
- [ ] Update mock data in `/src/mocks/rituals.ts`
- [ ] Update any components reading `guidanceText` to read from segments

**Verification:** App builds, existing features work with new data structure

---

### Phase 0.5: UI Components (Mock Phase)
**Goal:** Build segment editing and voice selection UI

**Tasks:**
- [ ] `SegmentEditor` - edit individual text/silence segments
- [ ] `SectionSegmentsEditor` - manage segments within a section
- [ ] `VoiceSettingsScreen` - voice picker with preview cards
- [ ] `VoiceCard` + `VoicePreviewPlayer` - voice preview components
- [ ] Update `RitualEditorScreen` to show segment list
- [ ] Add route for `/settings/voice`

**Verification:** All UI renders, can add/edit/remove segments

---

### Phase 1: Voice Data & Mock TTS Provider
**Goal:** Set up voice infrastructure with mock implementation

**Tasks:**
- [ ] Create Voice types (`/src/types/voice.ts`)
- [ ] Create `generate-voice-samples.ts` script
- [ ] Run script to generate preview samples → `/public/voices/`
- [ ] Generate `/src/data/voices.json` manifest
- [ ] Create TTSProvider interface
- [ ] Implement `MockTTSProvider` (uses bundled samples)

**Verification:** Script generates samples, mock returns audio, voice selection persists

---

### Phase 2: AudioStitcher Service
**Goal:** Implement audio combining with Web Audio API

**Tasks:**
- [ ] Create `AudioStitcher` class
- [ ] Implement `generateSilence()` - creates silent audio blob
- [ ] Implement `getDuration()` - measures audio blob duration
- [ ] Implement `stitch()` - combines multiple audio blobs
- [ ] Add fade in/out support
- [ ] Unit tests for duration accuracy

**Verification:** Stitch silence + audio to exact durations (±100ms)

---

### Phase 3: ElevenLabs Provider
**Goal:** Real TTS integration

**Tasks:**
- [ ] Create ElevenLabs API types (`/src/types/elevenlabs.ts`)
- [ ] Implement `ElevenLabsProvider`
- [ ] Add error handling (rate limits, API errors)
- [ ] Voice listing with real previews
- [ ] Environment variable configuration

**Verification:** Generate real speech, measure duration

---

### Phase 4: RitualAudioGenerator
**Goal:** Orchestrate end-to-end audio generation

**Tasks:**
- [ ] Create `RitualAudioGenerator` class
- [ ] Implement per-section audio generation
- [ ] Respect user's silence config (intro/outro distribution)
- [ ] Progress callbacks for UI
- [ ] IndexedDB caching via `AudioCache`
- [ ] Cache invalidation on section text change

**Verification:** Full ritual audio matches target durations (±1 second)

---

### Phase 5: Player Integration
**Goal:** Connect audio to session playback

**Tasks:**
- [ ] Update `useSessionPlayer` hook to use generated audio
- [ ] Show generation progress in session screen
- [ ] Cache-first loading strategy
- [ ] Fallback to text-only mode if audio fails
- [ ] Audio controls integration

**Verification:** End-to-end flow works - generate ritual → enter session → hear TTS audio

---

## 10. Verification Plan

### Unit Tests
- [ ] AudioStitcher produces correct duration
- [ ] Duration detection accuracy (±50ms)
- [ ] Cache invalidation logic
- [ ] Segment type guards and validation

### Integration Tests
- [ ] Full ritual generation with mock provider
- [ ] Cached audio reuse
- [ ] Progress callback firing at correct intervals

### Manual Tests
1. [ ] Generate ritual → enter session → hear TTS audio
2. [ ] Same ritual again → audio loads instantly (cached)
3. [ ] Edit ritual text → audio regenerates
4. [ ] Test all 3 tones with different voices
5. [ ] Voice preview plays correctly
6. [ ] Voice selection persists across sessions

---

## 11. Cost Estimate

**ElevenLabs:**
- ~$0.30 per 1,000 characters
- Average ritual ~1,500 chars = ~$0.45 per ritual
- First 10,000 chars/month free

**Optimization Strategies:**
- Cache aggressively, only regenerate changed sections
- Batch sections in single API call where possible
- Consider lower-cost TTS for development/testing

---

## 12. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| ElevenLabs API changes | High | Version lock API, abstract behind interface |
| Audio sync issues | Medium | Thorough duration testing, tolerance buffer |
| Large audio files | Medium | Compression, streaming, lazy loading |
| Browser audio support | Low | Web Audio API is widely supported, test on Safari |
| Cost overruns | Medium | Caching, rate limiting, usage monitoring |

---

## Appendix A: Sample Segment Timeline

```
Section: Intro (60 seconds total)
├── [silence: 2s]
├── [text: "Welcome..." ~5s]
├── [silence: 3s]
├── [text: "Find a comfortable..." ~8s]
└── [silence: 42s]  ← Auto-calculated to reach 60s total
```

## Appendix B: Audio Generation Flow

```
┌─────────────────────┐
│   User taps "Play"  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│  Check audio cache  │────▶│  Cache hit: Play    │
└─────────┬───────────┘     └─────────────────────┘
          │ Cache miss
          ▼
┌─────────────────────┐
│  Show "Preparing"   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  For each section:  │
│  ├── TTS text segs  │
│  ├── Measure time   │
│  ├── Calc silence   │
│  └── Stitch audio   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Cache in IndexedDB │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   Begin playback    │
└─────────────────────┘
```

---

*Document maintained as part of the Koru meditation app project.*
