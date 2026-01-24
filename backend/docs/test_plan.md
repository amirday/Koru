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

3. Start the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

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
