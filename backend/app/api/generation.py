"""Ritual generation API routes."""

from fastapi import APIRouter, HTTPException

from ..logging_config import get_logger
from ..models.ritual import RitualCreate, RitualResponse
from ..services.openai_provider import get_openai_provider
from ..services.storage import get_storage_service

logger = get_logger(__name__)

router = APIRouter()


@router.post("/ritual", response_model=RitualResponse)
async def generate_ritual(request: RitualCreate):
    """
    Generate a meditation ritual from user intention.

    This creates the ritual structure with pre-defined audio paths.
    Audio files are NOT generated here - they are generated later
    when the user triggers audio generation via /api/tts/generate-ritual-audio.
    """
    logger.info(
        f"Generating ritual: intention='{request.intention}', "
        f"duration={request.duration_minutes}min, tone={request.tone}, "
        f"voice={request.voice_id}, provider={request.tts_provider}"
    )

    openai_provider = get_openai_provider()
    storage = get_storage_service()

    if not openai_provider.is_available():
        logger.error("OpenAI API not configured")
        raise HTTPException(
            status_code=503,
            detail="OpenAI API not configured. Set OPENAI_API_KEY environment variable.",
        )

    try:
        # Generate ritual structure with OpenAI
        logger.debug("Calling OpenAI API...")
        ritual = await openai_provider.generate_ritual(request)
        logger.info(f"Ritual structure generated: id={ritual.id}, title='{ritual.title}', sections={len(ritual.sections)}")

        # Determine audio extension based on TTS provider
        # ElevenLabs produces mp3, Google produces wav
        audio_extension = "wav" if request.tts_provider == "google" else "mp3"

        # Pre-assign audio URLs for all text segments (files don't exist yet)
        text_segment_count = 0
        for section in ritual.sections:
            for segment in section.segments:
                if segment.type == "text" and segment.text:
                    # Pre-define the audio URL path
                    segment.audio_url = f"/api/audio/{ritual.id}/{segment.id}.{audio_extension}"
                    text_segment_count += 1

        logger.info(f"Pre-assigned {text_segment_count} audio URLs")

        # Set voice and audio status
        ritual.voice_id = request.voice_id
        ritual.audio_status = "pending"  # Audio not generated yet

        # Save ritual to storage
        storage.save_ritual(ritual)
        logger.debug(f"Ritual saved to storage: {ritual.id}")

        return RitualResponse(ritual=ritual)

    except Exception as e:
        logger.exception(f"Failed to generate ritual: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ritual: {str(e)}",
        )
