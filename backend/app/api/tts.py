"""TTS API routes."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..logging_config import get_logger
from ..models.tts import TTSRequest, TTSResponse, Voice
from ..services.tts_service import get_tts_service

logger = get_logger(__name__)

router = APIRouter()


@router.post("/synthesize", response_model=TTSResponse)
async def synthesize_text(request: TTSRequest):
    """Synthesize text to speech."""
    text_preview = request.text[:50] + "..." if len(request.text) > 50 else request.text
    logger.info(f"TTS request: provider={request.provider}, voice={request.voice_id}, text='{text_preview}'")

    tts_service = get_tts_service()

    try:
        audio_url, duration_seconds = await tts_service.synthesize(
            text=request.text,
            voice_id=request.voice_id,
            provider=request.provider,
            ritual_id=request.ritual_id,
            segment_id=request.segment_id,
            speed=request.speed,
        )

        logger.info(f"TTS success: duration={duration_seconds:.2f}s, url={audio_url}")

        return TTSResponse(
            audioUrl=audio_url,
            durationSeconds=duration_seconds,
        )
    except ValueError as e:
        logger.warning(f"TTS bad request: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception(f"TTS synthesis failed: {e}")
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")


@router.get("/voices", response_model=List[Voice])
async def list_voices():
    """List all available TTS voices."""
    logger.debug("Listing all TTS voices")
    tts_service = get_tts_service()
    voices = tts_service.get_all_voices()
    logger.debug(f"Returning {len(voices)} voices")
    return voices


@router.get("/voices/{provider}", response_model=List[Voice])
async def list_provider_voices(provider: str):
    """List voices for a specific provider."""
    logger.debug(f"Listing voices for provider: {provider}")
    tts_service = get_tts_service()

    try:
        tts_provider = tts_service.get_provider(provider)
        voices = tts_provider.get_voices()
        logger.debug(f"Returning {len(voices)} voices for {provider}")
        return voices
    except ValueError as e:
        logger.warning(f"Invalid provider: {provider}")
        raise HTTPException(status_code=400, detail=str(e))
