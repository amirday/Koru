# Koru Debugging Manual

Complete guide for debugging the Koru meditation app.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Log Files](#log-files)
4. [Common Issues](#common-issues)
5. [Backend Debugging](#backend-debugging)
6. [Frontend Debugging](#frontend-debugging)
7. [API Reference](#api-reference)
8. [Service-Specific Debugging](#service-specific-debugging)

---

## Quick Start

### Start the App
```bash
./start.sh
```

### View Live Logs
```bash
# Backend logs (colored terminal output)
tail -f backend/logs/koru_$(date +%Y-%m-%d).log

# Or watch the backend process directly
cd backend && source venv/bin/activate && uvicorn app.main:app --reload
```

### Check Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","version":"1.0.0"}
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                   http://localhost:5173                      │
│                                                              │
│  React App ──► src/services/api/backend-api.ts ─────────────┼──┐
│                                                              │  │
└─────────────────────────────────────────────────────────────┘  │
                                                                  │
┌─────────────────────────────────────────────────────────────┐  │
│                        Backend                               │  │
│                   http://localhost:8000                      │◄─┘
│                                                              │
│  FastAPI ──► app/api/*.py ──► app/services/*.py             │
│                                    │                         │
│                                    ├── openai_provider.py    │
│                                    ├── elevenlabs_tts.py     │
│                                    ├── google_tts.py         │
│                                    └── storage.py            │
│                                                              │
│  Storage: backend/storage/                                   │
│  Logs:    backend/logs/                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Log Files

### Location
```
backend/logs/koru_YYYY-MM-DD.log
```

### Log Format (File)
```
TIMESTAMP | LEVEL | MODULE | MESSAGE | FILE:LINE (for warnings/errors)
```

Example:
```
2026-01-24 09:18:10.207 | INFO     | app.main                       | Koru Backend Starting
2026-01-24 09:18:13.200 | ERROR    | app.api.tts                    | TTS synthesis failed | tts.py:43
```

### Log Format (Console)
Colored output with:
- **Cyan**: DEBUG
- **Green**: INFO
- **Yellow**: WARNING
- **Red**: ERROR
- **Magenta**: CRITICAL

### Log Levels
| Level | When Used |
|-------|-----------|
| DEBUG | Detailed flow, variable values |
| INFO | Normal operations (requests, completions) |
| WARNING | Recoverable issues, missing optional config |
| ERROR | Failed operations, exceptions |
| CRITICAL | System failures |

### Useful Log Commands

```bash
# View today's logs
cat backend/logs/koru_$(date +%Y-%m-%d).log

# Watch live logs
tail -f backend/logs/koru_$(date +%Y-%m-%d).log

# Search for errors
grep -E "ERROR|CRITICAL" backend/logs/koru_*.log

# Search for specific ritual
grep "ritual_id_here" backend/logs/koru_*.log

# Count errors by type
grep ERROR backend/logs/koru_*.log | cut -d'|' -f4 | sort | uniq -c | sort -rn

# View last 100 lines
tail -100 backend/logs/koru_$(date +%Y-%m-%d).log

# Search with context (3 lines before/after)
grep -B3 -A3 "ERROR" backend/logs/koru_*.log
```

---

## Common Issues

### 1. Backend Not Starting

**Symptom**: `./start.sh` fails or backend doesn't respond

**Check**:
```bash
# Check if port 8000 is in use
lsof -i :8000

# Check Python environment
cd backend && source venv/bin/activate && python -c "import fastapi; print('OK')"

# Check .env file exists
cat backend/.env
```

**Fix**:
```bash
# Kill existing process
kill $(lsof -t -i:8000)

# Reinstall dependencies
cd backend && source venv/bin/activate && pip install -r requirements.txt
```

### 2. CORS Errors

**Symptom**: Browser console shows "CORS policy" errors

**Check**:
```bash
grep CORS backend/logs/koru_*.log
```

**Fix**: Ensure frontend URL is in `backend/.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. API Key Issues

**Symptom**: 503 errors, "API not configured" messages

**Check**:
```bash
# View startup log for API status
grep "configured" backend/logs/koru_*.log
```

Expected output:
```
OpenAI configured: Yes
ElevenLabs configured: Yes
Google TTS configured: Yes
```

**Fix**: Add keys to `backend/.env`:
```
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=sk_...
GEMINI_API_KEY=AI...
```

### 4. Ritual Generation Fails

**Symptom**: 500 error when generating ritual

**Check**:
```bash
grep "generate" backend/logs/koru_*.log | tail -20
```

**Common causes**:
- Invalid OpenAI API key
- OpenAI rate limit
- Malformed response from API

### 5. TTS Synthesis Fails

**Symptom**: Audio doesn't play, TTS errors

**Check**:
```bash
grep "TTS" backend/logs/koru_*.log | tail -20
```

**Common causes**:
- Invalid API key for provider
- Rate limit exceeded
- Unsupported voice ID

### 6. Frontend Can't Connect to Backend

**Symptom**: Network errors in browser console

**Check**:
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check frontend .env
cat .env
# Should have: VITE_BACKEND_URL=http://localhost:8000
```

---

## Backend Debugging

### Interactive API Testing

Visit: http://localhost:8000/docs

This provides Swagger UI to test all endpoints interactively.

### Manual API Testing

```bash
# Health check
curl http://localhost:8000/health

# List rituals
curl http://localhost:8000/api/rituals

# Get specific ritual
curl http://localhost:8000/api/rituals/RITUAL_ID

# Generate ritual
curl -X POST http://localhost:8000/api/generate/ritual \
  -H "Content-Type: application/json" \
  -d '{"intention": "calm", "durationMinutes": 1, "tone": "gentle"}'

# List TTS voices
curl http://localhost:8000/api/tts/voices

# Synthesize speech
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "voiceId": "sarah", "provider": "elevenlabs"}'
```

### Debug Mode

Run with more verbose output:
```bash
cd backend
source venv/bin/activate
LOG_LEVEL=DEBUG uvicorn app.main:app --reload
```

### Python REPL Debugging

```bash
cd backend
source venv/bin/activate
python

>>> from app.services.storage import get_storage_service
>>> storage = get_storage_service()
>>> rituals = storage.list_rituals()
>>> print(f"Found {len(rituals)} rituals")

>>> from app.services.openai_provider import get_openai_provider
>>> provider = get_openai_provider()
>>> print(f"OpenAI available: {provider.is_available()}")
```

### Check Storage

```bash
# List stored rituals
ls -la backend/storage/rituals/

# View a ritual's JSON
cat backend/storage/rituals/RITUAL_ID.json | python -m json.tool

# List audio files
find backend/storage/audio -name "*.mp3" -o -name "*.wav"

# Check storage size
du -sh backend/storage/
```

---

## Frontend Debugging

### Browser DevTools

1. **Console Tab**: JavaScript errors, network failures
2. **Network Tab**: API requests/responses
3. **Application Tab**: localStorage, cookies

### Common Console Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Backend not running | Start backend |
| `CORS error` | Origin not allowed | Add to CORS_ORIGINS |
| `401 Unauthorized` | Invalid API key | Check backend .env |
| `500 Internal Server Error` | Backend exception | Check backend logs |

### React DevTools

Install React DevTools browser extension to inspect:
- Component state
- Context values
- Re-renders

### Debug API Calls

In `src/services/api/backend-api.ts`, add logging:
```typescript
console.log('[API]', method, endpoint, body)
```

### Check Environment

```javascript
// In browser console
console.log(import.meta.env.VITE_BACKEND_URL)
```

---

## API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/rituals` | List all rituals |
| GET | `/api/rituals/{id}` | Get ritual by ID |
| POST | `/api/rituals` | Create ritual |
| PUT | `/api/rituals/{id}` | Update ritual |
| DELETE | `/api/rituals/{id}` | Delete ritual |
| POST | `/api/generate/ritual` | Generate ritual with AI |
| GET | `/api/tts/voices` | List TTS voices |
| POST | `/api/tts/synthesize` | Synthesize speech |
| GET | `/api/audio/{ritual_id}/{file}` | Serve audio file |

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid input) |
| 404 | Not found |
| 422 | Validation error |
| 500 | Server error |
| 503 | Service unavailable (API not configured) |

---

## Service-Specific Debugging

### OpenAI (Ritual Generation)

**Log prefix**: `app.services.openai_provider`

**Test**:
```bash
curl -X POST http://localhost:8000/api/generate/ritual \
  -H "Content-Type: application/json" \
  -d '{"intention": "test", "durationMinutes": 1, "tone": "gentle"}'
```

**Common errors**:
- `401`: Invalid API key
- `429`: Rate limit exceeded
- `500`: Invalid response format

### ElevenLabs TTS

**Log prefix**: `app.services.elevenlabs_tts`

**Voices**: sarah, daniel, charlotte, lily, liam

**Test**:
```bash
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hi", "voiceId": "sarah", "provider": "elevenlabs"}'
```

### Google TTS (Gemini)

**Log prefix**: `app.services.google_tts`

**Voices**: aoede, charon

**Test**:
```bash
curl -X POST http://localhost:8000/api/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hi", "voiceId": "aoede", "provider": "google"}'
```

### Storage Service

**Log prefix**: `app.services.storage`

**Locations**:
- Rituals: `backend/storage/rituals/*.json`
- Audio: `backend/storage/audio/{ritual_id}/*.mp3`

**Debug**:
```python
from app.services.storage import get_storage_service
storage = get_storage_service()
print(storage.storage_path)
print(storage.list_rituals())
```

---

## Troubleshooting Checklist

When something breaks:

1. [ ] Check backend is running: `curl localhost:8000/health`
2. [ ] Check logs: `tail -50 backend/logs/koru_$(date +%Y-%m-%d).log`
3. [ ] Search for errors: `grep ERROR backend/logs/koru_*.log`
4. [ ] Check browser console for frontend errors
5. [ ] Check Network tab for failed requests
6. [ ] Verify .env files have correct values
7. [ ] Test API directly with curl
8. [ ] Restart backend: kill and re-run `./start.sh`
9. [ ] Check storage permissions: `ls -la backend/storage/`
10. [ ] Review recent code changes

---

## Getting Help

1. Check this manual first
2. Search logs for the specific error
3. Test API endpoints directly
4. Check external API status (OpenAI, ElevenLabs)
5. Review recent git commits for breaking changes
