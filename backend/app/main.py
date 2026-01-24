"""FastAPI application entry point."""

import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from .config import get_settings
from .logging_config import setup_logging, get_logger, RequestLogger
from .api import rituals_router, tts_router, generation_router

# Initialize logging first
setup_logging(level="DEBUG", enable_file_logging=True)
logger = get_logger(__name__)
request_logger = RequestLogger(get_logger("requests"))

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


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests with timing."""
    start_time = time.time()

    # Log request
    logger.debug(f"→ {request.method} {request.url.path}")

    try:
        response = await call_next(request)
        duration_ms = (time.time() - start_time) * 1000

        # Log response
        request_logger.log_request(
            request.method,
            request.url.path,
            response.status_code,
            duration_ms
        )

        return response

    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        request_logger.log_error(request.method, request.url.path, e)
        logger.exception(f"Unhandled exception in {request.method} {request.url.path}")

        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )


@app.on_event("startup")
async def startup_event():
    """Log startup information."""
    logger.info("=" * 60)
    logger.info("Koru Backend Starting")
    logger.info("=" * 60)
    logger.info(f"Storage path: {settings.storage_path}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    logger.info(f"OpenAI configured: {'Yes' if settings.openai_api_key else 'No'}")
    logger.info(f"ElevenLabs configured: {'Yes' if settings.elevenlabs_api_key else 'No'}")
    logger.info(f"Google TTS configured: {'Yes' if settings.gemini_api_key else 'No'}")
    logger.info("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    """Log shutdown."""
    logger.info("Koru Backend Shutting Down")


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
