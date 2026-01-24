# Plan: Python Backend for Koru

> **Status**: Planned
> **Created**: January 2026
> **Phase**: Backend Integration

---

## Overview

This plan documents the architecture for a Python FastAPI backend to handle:
1. Text generation (ritual generation using OpenAI)
2. TTS synthesis (Google Gemini and ElevenLabs)
3. File-based storage for rituals and audio
4. Fetching rituals and generated audio

---

## Architecture Changes

The current frontend-only architecture will evolve to include a Python backend:

```
┌─────────────────────────────────────────────────────────────┐
│                     Current Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  React Frontend ──────► External APIs                        │
│  (API keys in .env)     (OpenAI, Google TTS, ElevenLabs)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                            ▼

┌─────────────────────────────────────────────────────────────┐
│                     Target Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  React Frontend ──────► Python Backend ──────► External APIs │
│  (no API keys)          (FastAPI)             (secured)      │
│                              │                               │
│                              ▼                               │
│                         File Storage                         │
│                    (rituals/, audio/)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment/settings
│   ├── models/
│   │   ├── __init__.py
│   │   ├── ritual.py           # Ritual data models
│   │   └── tts.py              # TTS request/response models
│   ├── api/
│   │   ├── __init__.py
│   │   ├── rituals.py          # Ritual CRUD endpoints
│   │   ├── tts.py              # TTS endpoints
│   │   └── generation.py       # Text generation endpoints
│   └── services/
│       ├── __init__.py
│       ├── openai_provider.py  # OpenAI text generation
│       ├── google_tts.py       # Google Gemini TTS
│       ├── elevenlabs_tts.py   # ElevenLabs TTS
│       ├── tts_service.py      # TTS orchestration
│       └── storage.py          # File-based storage
├── storage/
│   ├── rituals/                # JSON files per ritual
│   └── audio/                  # Audio files organized by ritual
├── requirements.txt
└── .env.example
```

---

## API Endpoints

### 1. Text Generation

```
POST /api/generate/ritual
```

**Request**:
```json
{
  "intention": "I want to reduce stress before sleep",
  "durationMinutes": 10,
  "focusAreas": ["breathing", "relaxation"]
}
```

**Response**:
```json
{
  "ritual": {
    "id": "ritual_abc123",
    "title": "Evening Calm",
    "sections": [...],
    "createdAt": "2026-01-24T12:00:00Z"
  }
}
```

### 2. TTS Synthesis

```
POST /api/tts/synthesize
```

**Request**:
```json
{
  "text": "Take a deep breath and relax...",
  "voiceId": "sarah",
  "provider": "elevenlabs",
  "ritualId": "ritual_abc123",
  "segmentId": "segment_001"
}
```

**Response**:
```json
{
  "audioUrl": "/api/audio/ritual_abc123/segment_001.mp3",
  "durationSeconds": 12.5
}
```

### 3. Rituals CRUD

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rituals` | POST | Create ritual |
| `/api/rituals` | GET | List all rituals |
| `/api/rituals/{id}` | GET | Get specific ritual |
| `/api/rituals/{id}` | DELETE | Delete ritual and audio |

### 4. Audio Serving

```
GET /api/audio/{ritual_id}/{filename}
```

Returns the audio file with appropriate Content-Type headers.

---

## Backend Services

### Storage Service

```python
class StorageService:
    def save_ritual(self, ritual: Ritual) -> str:
        """Save ritual to storage/rituals/{id}.json"""

    def load_ritual(self, ritual_id: str) -> Ritual:
        """Load ritual from JSON file"""

    def list_rituals(self) -> List[Ritual]:
        """List all rituals"""

    def delete_ritual(self, ritual_id: str) -> None:
        """Remove ritual JSON and all associated audio files"""

    def save_audio(self, ritual_id: str, segment_id: str, audio_bytes: bytes) -> str:
        """Save audio to storage/audio/{ritual_id}/{segment_id}.mp3"""

    def get_audio_path(self, ritual_id: str, filename: str) -> Path:
        """Get file path for audio file"""
```

### TTS Service

```python
class TTSService:
    def __init__(self, providers: Dict[str, TTSProvider]):
        self.providers = providers

    async def synthesize(self, text: str, voice_id: str, provider: str) -> TTSResult:
        """Route to correct provider and handle rate limiting"""

    def get_provider(self, voice_id: str) -> TTSProvider:
        """Get provider based on voice configuration"""
```

### OpenAI Provider

```python
class OpenAIProvider:
    async def generate_ritual(self, options: GenerationOptions) -> Ritual:
        """Generate ritual using OpenAI with existing prompts from frontend"""
```

---

## Dependencies

```
# requirements.txt
fastapi>=0.109.0
uvicorn>=0.27.0
python-dotenv>=1.0.0
openai>=1.0.0
google-genai>=1.0.0
elevenlabs>=1.0.0
pydantic>=2.0.0
aiofiles>=23.0.0
python-multipart>=0.0.6
```

---

## Environment Variables

```bash
# .env.example
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ELEVENLABS_API_KEY=...

# Optional
STORAGE_PATH=./storage
CORS_ORIGINS=http://localhost:5173
```

---

## Benefits of Python Backend

| Benefit | Description |
|---------|-------------|
| **Security** | API keys never exposed to frontend |
| **Rate Limiting** | Centralized control across all providers |
| **Caching** | File-based audio caching reduces API costs |
| **Flexibility** | Easier provider switching and fallback logic |
| **Ecosystem** | Python libraries for audio processing if needed |

---

## Migration Path

### Phase 1: Python Backend (This Plan)

```
Frontend Direct Calls → Python Backend → External APIs
                             │
                             ▼
                      File-based Storage
```

### Phase 2: Cloud Backend (Future)

```
File Storage → Cloud Database (Supabase/Firebase)
Local Audio → CDN-hosted Audio
No Auth → User Authentication
```

---

## Implementation Checklist

- [ ] Set up FastAPI project structure
- [ ] Implement storage service
- [ ] Implement TTS endpoints (ElevenLabs, Google)
- [ ] Implement ritual generation endpoint (OpenAI)
- [ ] Implement ritual CRUD endpoints
- [ ] Add rate limiting and error handling
- [ ] Update frontend to use backend API
- [ ] Remove API keys from frontend

---

## Related Documentation

- Architecture: `docs/sys_arch/ARCHITECTURE.md` (Section 7.9, Section 12)
- Existing TTS tests: `scripts/test_elevenlabs.py`, `scripts/test_gemini_tts.py`
