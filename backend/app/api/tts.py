"""TTS API routes."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..models.tts import TTSRequest, TTSResponse, Voice
from ..services.tts_service import get_tts_service

router = APIRouter()


@router.post("/synthesize", response_model=TTSResponse)
async def synthesize_text(request: TTSRequest):
    """Synthesize text to speech."""
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

        return TTSResponse(
            audioUrl=audio_url,
            durationSeconds=duration_seconds,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")


@router.get("/voices", response_model=List[Voice])
async def list_voices():
    """List all available TTS voices."""
    tts_service = get_tts_service()
    return tts_service.get_all_voices()


@router.get("/voices/{provider}", response_model=List[Voice])
async def list_provider_voices(provider: str):
    """List voices for a specific provider."""
    tts_service = get_tts_service()

    try:
        tts_provider = tts_service.get_provider(provider)
        return tts_provider.get_voices()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
