# Backend Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│                    (no API keys)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                            │
│                    (port 8000)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   /api/     │  │   /api/     │  │      /api/          │  │
│  │  generate   │  │    tts      │  │     rituals         │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         ▼                ▼                     ▼             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Services Layer                         ││
│  ├──────────────┬──────────────┬───────────────────────────┤│
│  │ OpenAI       │ TTS Service  │ Storage Service           ││
│  │ Provider     │              │                           ││
│  │              │ ┌──────────┐ │ ┌───────────────────────┐ ││
│  │              │ │ElevenLabs│ │ │  File System          │ ││
│  │              │ │  Google  │ │ │  storage/rituals/*.json││
│  │              │ └──────────┘ │ │  storage/audio/*/*.mp3│ ││
│  └──────────────┴──────────────┴───────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   External APIs                              │
├───────────────┬─────────────────┬───────────────────────────┤
│    OpenAI     │  ElevenLabs     │   Google Gemini           │
│   (GPT-4o)    │    TTS          │      TTS                  │
└───────────────┴─────────────────┴───────────────────────────┘
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point, CORS, routes
│   ├── config.py            # Settings from .env
│   │
│   ├── models/              # Pydantic models
│   │   ├── ritual.py        # Ritual, Section, Segment
│   │   └── tts.py           # TTSRequest, TTSResponse, Voice
│   │
│   ├── api/                 # Route handlers
│   │   ├── rituals.py       # CRUD: GET/POST/PUT/DELETE
│   │   ├── tts.py           # POST /synthesize, GET /voices
│   │   └── generation.py    # POST /ritual (OpenAI)
│   │
│   └── services/            # Business logic
│       ├── storage.py       # File I/O for rituals/audio
│       ├── tts_service.py   # Orchestrates TTS providers
│       ├── elevenlabs_tts.py
│       ├── google_tts.py
│       └── openai_provider.py
│
├── storage/                 # Data (gitignored)
│   ├── rituals/            # {id}.json
│   └── audio/              # {ritual_id}/{segment_id}.mp3
│
├── docs/
│   ├── architecture.md     # This file
│   └── test_plan.md
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |
| **Rituals** |
| GET | `/api/rituals` | List all rituals |
| GET | `/api/rituals/{id}` | Get ritual by ID |
| POST | `/api/rituals` | Create ritual |
| PUT | `/api/rituals/{id}` | Update ritual |
| DELETE | `/api/rituals/{id}` | Delete ritual + audio |
| **Generation** |
| POST | `/api/generate/ritual` | Generate ritual via OpenAI |
| **TTS** |
| POST | `/api/tts/synthesize` | Text to speech |
| GET | `/api/tts/voices` | List all voices |
| GET | `/api/tts/voices/{provider}` | List provider voices |
| **Audio** |
| GET | `/api/audio/{ritual_id}/{file}` | Serve audio file |

---

## Data Models

### Ritual
```
Ritual
├── id: string
├── title: string
├── instructions: string
├── duration: int (seconds)
├── tone: "gentle" | "neutral" | "coach"
├── pace: "slow" | "medium" | "fast"
├── sections: RitualSection[]
├── tags: string[]
├── audioStatus: "pending" | "generating" | "ready" | "error"
├── voiceId: string?
├── createdAt: string (ISO)
└── updatedAt: string (ISO)
```

### RitualSection
```
RitualSection
├── id: string
├── type: "intro" | "body" | "closing"
├── durationSeconds: float
├── segments: Segment[]
├── audioUrl: string?
└── audioDurationSeconds: float?
```

### Segment
```
Segment
├── id: string
├── type: "text" | "silence"
├── text: string? (for text type)
├── durationSeconds: float
└── audioUrl: string?
```

---

## Services

### StorageService
- `save_ritual(ritual)` → saves to `storage/rituals/{id}.json`
- `load_ritual(id)` → loads from JSON
- `list_rituals()` → all rituals sorted by date
- `delete_ritual(id)` → removes JSON + audio folder
- `save_audio(ritual_id, segment_id, bytes)` → saves MP3/WAV

### TTSService
- `synthesize(text, voice_id, provider)` → returns (audio_url, duration)
- `get_all_voices()` → voices from all providers
- Routes to ElevenLabs or Google based on provider param

### OpenAIProvider
- `generate_ritual(request)` → generates ritual structure via GPT-4o
- Uses JSON mode for reliable parsing
- System prompt defines meditation structure

---

## Configuration

Environment variables (`.env`):

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | For ritual generation |
| `ELEVENLABS_API_KEY` | For ElevenLabs | TTS provider |
| `GEMINI_API_KEY` | For Google | TTS provider |
| `STORAGE_PATH` | No | Default: `./storage` |
| `CORS_ORIGINS` | No | Default: localhost:5173,3000 |

---

## Request/Response Examples

### Generate Ritual
```bash
POST /api/generate/ritual
{
  "intention": "reduce stress",
  "durationMinutes": 5,
  "tone": "gentle"
}
```

### Synthesize TTS
```bash
POST /api/tts/synthesize
{
  "text": "Breathe deeply.",
  "voiceId": "sarah",
  "provider": "elevenlabs",
  "ritualId": "abc123",
  "segmentId": "seg1"
}
```

Response:
```json
{
  "audioUrl": "/api/audio/abc123/seg1.mp3",
  "durationSeconds": 2.5
}
```
