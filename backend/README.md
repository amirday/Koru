# Koru Backend

Python FastAPI backend for the Koru Meditation App.

## Features

- **Ritual Generation**: Generate meditation rituals using OpenAI GPT-4o
- **Text-to-Speech**: Convert ritual text to audio using ElevenLabs or Google Gemini TTS
- **Storage**: File-based storage for rituals and generated audio

## Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Endpoints

### Health Check
- `GET /health` - Check server status
- `GET /` - API info

### Ritual Generation
- `POST /api/generate/ritual` - Generate a new meditation ritual

### Rituals CRUD
- `GET /api/rituals` - List all rituals
- `GET /api/rituals/{id}` - Get a specific ritual
- `POST /api/rituals` - Create a ritual
- `PUT /api/rituals/{id}` - Update a ritual
- `DELETE /api/rituals/{id}` - Delete a ritual

### TTS
- `POST /api/tts/synthesize` - Convert text to speech
- `GET /api/tts/voices` - List all available voices
- `GET /api/tts/voices/{provider}` - List voices for a provider

### Audio
- `GET /api/audio/{ritual_id}/{filename}` - Serve audio files

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for ritual generation | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for TTS | Optional |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for TTS | Optional |
| `STORAGE_PATH` | Path to storage directory | No (default: ./storage) |
| `CORS_ORIGINS` | Comma-separated CORS origins | No |
| `DEFAULT_TTS_PROVIDER` | Default TTS provider | No (default: elevenlabs) |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment/settings
│   ├── models/              # Pydantic models
│   │   ├── ritual.py
│   │   └── tts.py
│   ├── api/                 # API routes
│   │   ├── rituals.py
│   │   ├── tts.py
│   │   └── generation.py
│   └── services/            # Business logic
│       ├── storage.py
│       ├── tts_service.py
│       ├── elevenlabs_tts.py
│       ├── google_tts.py
│       └── openai_provider.py
├── storage/                 # File storage
│   ├── rituals/            # Ritual JSON files
│   └── audio/              # Generated audio files
├── requirements.txt
├── .env.example
└── README.md
```
