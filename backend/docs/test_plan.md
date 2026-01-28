# Backend Test Plan

> **Note**: Tests use real APIs with minimal text to save tokens/credits.

---

## Prerequisites

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure `.env`:
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

3. Start the server (for manual curl tests only):
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## Automated Test Tiers

All automated tests are tagged with pytest markers organized into three tiers:

| Tier | Marker | API keys needed | Purpose |
|------|--------|----------------|---------|
| **Offline** | `@pytest.mark.offline` | None | Runs in CI. All external APIs mocked. |
| **AI** | `@pytest.mark.ai` | `OPENAI_API_KEY` | Real text generation via OpenAI. |
| **Audio** | `@pytest.mark.audio` | `ELEVENLABS_API_KEY` and/or `GEMINI_API_KEY` | Real TTS audio synthesis. |

### Running each tier

```bash
# Offline only — no API keys needed, safe for CI
cd backend && python -m pytest -m offline -v

# Offline + AI — requires OPENAI_API_KEY
cd backend && python -m pytest -m "offline or ai" -v

# Offline + Audio — requires TTS API keys
cd backend && python -m pytest -m "offline or audio" -v

# All tiers — requires all API keys
cd backend && python -m pytest -m "offline or ai or audio" -v

# Everything (unfiltered) — skipif decorators still protect missing keys
cd backend && python -m pytest -v

# Collect-only (see what would run without executing)
cd backend && python -m pytest --co -m offline
```

### Test file breakdown by tier

**Offline (78 tests)**:
- `tests/test_health.py` — health endpoints
- `tests/test_integration.py` — error handling, CRUD flow
- `app/models/tests/test_ritual.py` — model validation
- `app/models/tests/test_tts.py` — TTS model validation
- `app/api/tests/test_rituals.py` — CRUD endpoints
- `app/api/tests/test_generation.py` — validation only
- `app/api/tests/test_generation_mocked.py` — full generation with mocked OpenAI
- `app/api/tests/test_tts.py` — voice listing, validation
- `app/api/tests/test_tts_mocked.py` — TTS synthesis with mocks, full flow
- `app/services/tests/test_storage.py` — storage operations
- `app/services/tests/test_openai.py` — availability, prompt building
- `app/services/tests/test_tts.py` — voice mapping, provider selection
- `app/services/tests/test_tts_mocked.py` — TTSService unit tests with mocks

**AI (4 tests)**: `test_generation.py`, `test_openai.py` — real OpenAI calls

**Audio (8 tests)**: `test_integration.py`, `test_tts.py` (API + service) — real TTS calls

### Mock providers

Mock providers live in `tests/mocks/` and are injected via conftest fixtures:
- `MockOpenAIProvider` — deterministic 3-section ritual
- `MockElevenLabsTTSProvider` — fake MP3 bytes
- `MockGoogleTTSProvider` — fake WAV bytes

See `docs/plans/test_tiers.md` for full details on mock injection and adding new tests.

---

## Manual Tests (curl)

The tests below are manual curl-based tests for verifying the running server.

---

## Test 1: Health Check

```bash
curl http://localhost:8000/health
```

**Expected**:
```json
{"status": "healthy", "version": "1.0.0"}
```

---

## Test 2: List Voices

```bash
curl http://localhost:8000/api/tts/voices
```

**Expected**: Array of voice objects with id, name, provider

---

## Test 3: ElevenLabs TTS

Minimal text to save credits:

```bash
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hi.",
    "voiceId": "sarah",
    "provider": "elevenlabs"
  }'
```

**Expected**:
```json
{
  "audioUrl": "/api/audio/temp/...",
  "durationSeconds": 0.5
}
```

**Verify audio**:
```bash
curl -o test.mp3 http://localhost:8000<audioUrl from response>
# Play test.mp3
```

---

## Test 4: Google Gemini TTS

```bash
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hi.",
    "voiceId": "aoede",
    "provider": "google"
  }'
```

**Expected**: Similar response with WAV file

---

## Test 5: Generate Ritual (OpenAI)

Short ritual to minimize tokens:

```bash
curl -X POST http://localhost:8000/api/generate/ritual \
  -H "Content-Type: application/json" \
  -d '{
    "intention": "relax",
    "durationMinutes": 1,
    "tone": "gentle"
  }'
```

**Expected**: Ritual object with title, sections, segments

---

## Test 6: Ritual CRUD

### Create
```bash
curl -X POST http://localhost:8000/api/rituals \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "title": "Test",
    "duration": 60,
    "sections": []
  }'
```

### List
```bash
curl http://localhost:8000/api/rituals
```

### Get
```bash
curl http://localhost:8000/api/rituals/test-1
```

### Delete
```bash
curl -X DELETE http://localhost:8000/api/rituals/test-1
```

---

## Test 7: TTS with Ritual Storage

Create ritual, generate audio for segment:

```bash
# 1. Create ritual
curl -X POST http://localhost:8000/api/rituals \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ritual-test",
    "title": "Test Ritual",
    "duration": 60,
    "sections": [{
      "id": "sec1",
      "type": "intro",
      "durationSeconds": 10,
      "segments": [{
        "id": "seg1",
        "type": "text",
        "text": "Hi.",
        "durationSeconds": 2
      }]
    }]
  }'

# 2. Generate audio for segment
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hi.",
    "voiceId": "sarah",
    "provider": "elevenlabs",
    "ritualId": "ritual-test",
    "segmentId": "seg1"
  }'

# 3. Verify audio stored
ls storage/audio/ritual-test/

# 4. Cleanup
curl -X DELETE http://localhost:8000/api/rituals/ritual-test
```

---

## Test 8: Full Flow

End-to-end test:

```bash
# 1. Generate ritual
RITUAL=$(curl -s -X POST http://localhost:8000/api/generate/ritual \
  -H "Content-Type: application/json" \
  -d '{"intention": "calm", "durationMinutes": 1, "tone": "gentle"}')

RITUAL_ID=$(echo $RITUAL | jq -r '.ritual.id')
echo "Created ritual: $RITUAL_ID"

# 2. Get first text segment
SEGMENT_TEXT=$(echo $RITUAL | jq -r '.ritual.sections[0].segments[0].text')
SEGMENT_ID=$(echo $RITUAL | jq -r '.ritual.sections[0].segments[0].id')

# 3. Generate audio (short)
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"Hi.\",
    \"voiceId\": \"sarah\",
    \"provider\": \"elevenlabs\",
    \"ritualId\": \"$RITUAL_ID\",
    \"segmentId\": \"$SEGMENT_ID\"
  }"

# 4. Verify
curl http://localhost:8000/api/rituals/$RITUAL_ID

# 5. Cleanup
curl -X DELETE http://localhost:8000/api/rituals/$RITUAL_ID
```

---

## Error Cases

### Missing API Key
```bash
# Unset ELEVENLABS_API_KEY, then:
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hi.", "voiceId": "sarah", "provider": "elevenlabs"}'
```
**Expected**: 500 error with "API key not configured"

### Invalid Ritual ID
```bash
curl http://localhost:8000/api/rituals/nonexistent
```
**Expected**: 404 "Ritual not found"

### Invalid Provider
```bash
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hi.", "voiceId": "sarah", "provider": "invalid"}'
```
**Expected**: 422 validation error

---

## Checklist

| Test | Status |
|------|--------|
| Health check | ⬜ |
| List voices | ⬜ |
| ElevenLabs TTS | ⬜ |
| Google TTS | ⬜ |
| Generate ritual | ⬜ |
| Create ritual | ⬜ |
| List rituals | ⬜ |
| Get ritual | ⬜ |
| Delete ritual | ⬜ |
| TTS with storage | ⬜ |
| Full flow | ⬜ |
| Error: missing key | ⬜ |
| Error: invalid ID | ⬜ |
| Error: invalid provider | ⬜ |
