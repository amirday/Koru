"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .api import rituals_router, tts_router, generation_router

settings = get_settings()

app = FastAPI(
    title="Koru API",
    description="Backend API for Koru Meditation App",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(rituals_router, prefix="/api/rituals", tags=["rituals"])
app.include_router(tts_router, prefix="/api/tts", tags=["tts"])
app.include_router(generation_router, prefix="/api/generate", tags=["generation"])

# Serve audio files
audio_path = settings.storage_path / "audio"
audio_path.mkdir(parents=True, exist_ok=True)
app.mount("/api/audio", StaticFiles(directory=str(audio_path)), name="audio")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Koru API",
        "version": "1.0.0",
        "docs": "/docs",
    }
