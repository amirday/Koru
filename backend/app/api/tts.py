"""TTS API routes."""

from fastapi import APIRouter, HTTPException
from typing import List, Literal
from pydantic import BaseModel, Field

from ..logging_config import get_logger
from ..models.tts import TTSRequest, TTSResponse, Voice
from ..services.tts_service import get_tts_service
from ..services.storage import get_storage_service

logger = get_logger(__name__)

router = APIRouter()


class GenerateRitualAudioRequest(BaseModel):
    """Request to generate audio for a ritual."""
    ritual_id: str = Field(alias="ritualId")
    voice_id: str = Field("sarah", alias="voiceId")
    provider: Literal["elevenlabs", "google"] = "elevenlabs"

    class Config:
        populate_by_name = True


class GenerateRitualAudioResponse(BaseModel):
    """Response after generating ritual audio."""
    ritual_id: str = Field(alias="ritualId")
    segments_generated: int = Field(alias="segmentsGenerated")
    segments_total: int = Field(alias="segmentsTotal")
    segments_skipped: int = Field(0, alias="segmentsSkipped")
    status: Literal["ready", "partial", "error"]

    class Config:
        populate_by_name = True


class RitualAudioStatusResponse(BaseModel):
    """Response for ritual audio status check."""
    ritual_id: str = Field(alias="ritualId")
    total: int
    generated: int
    missing: int
    status: Literal["none", "partial", "ready"]

    class Config:
        populate_by_name = True


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


@router.get("/audio-status/{ritual_id}", response_model=RitualAudioStatusResponse)
async def get_ritual_audio_status(ritual_id: str):
    """
    Check audio generation status for a ritual.
    Returns count of total, generated, and missing audio files.
    """
    logger.debug(f"Checking audio status for ritual {ritual_id}")
    storage = get_storage_service()

    status_info = storage.get_ritual_audio_status(ritual_id)
    if not status_info.get("exists"):
        raise HTTPException(status_code=404, detail="Ritual not found")

    total = status_info["total"]
    generated = status_info["generated"]
    missing = status_info["missing"]

    if generated == 0:
        status = "none"
    elif missing == 0:
        status = "ready"
    else:
        status = "partial"

    logger.debug(f"Audio status for {ritual_id}: {generated}/{total} ({status})")

    return RitualAudioStatusResponse(
        ritual_id=ritual_id,
        total=total,
        generated=generated,
        missing=missing,
        status=status,
    )


@router.post("/generate-ritual-audio", response_model=GenerateRitualAudioResponse)
async def generate_ritual_audio(request: GenerateRitualAudioRequest):
    """
    Generate TTS audio for text segments in a ritual.

    Only generates audio for segments that don't already have audio files.
    Skips segments where audio already exists.
    """
    logger.info(f"Generating audio for ritual {request.ritual_id} (voice={request.voice_id}, provider={request.provider})")

    storage = get_storage_service()
    tts_service = get_tts_service()

    # Load the ritual
    ritual = storage.load_ritual(request.ritual_id)
    if not ritual:
        logger.warning(f"Ritual not found: {request.ritual_id}")
        raise HTTPException(status_code=404, detail="Ritual not found")

    # Check TTS provider availability
    try:
        tts_provider = tts_service.get_provider(request.provider)
        if not tts_provider.is_available():
            logger.error(f"TTS provider {request.provider} not configured")
            raise HTTPException(
                status_code=503,
                detail=f"TTS provider {request.provider} not configured.",
            )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Count segments and generate audio (skip existing)
    total_segments = 0
    generated_count = 0
    skipped_count = 0

    for section in ritual.sections:
        for segment in section.segments:
            if segment.type == "text" and segment.text:
                total_segments += 1

                # Skip if audio already exists
                if storage.audio_exists(ritual.id, segment.id):
                    skipped_count += 1
                    logger.debug(f"Skipping segment {segment.id}: audio already exists")
                    continue

                try:
                    # Generate audio and save to the pre-defined path
                    audio_url, duration = await tts_service.synthesize(
                        text=segment.text,
                        voice_id=request.voice_id,
                        provider=request.provider,
                        ritual_id=ritual.id,
                        segment_id=segment.id,
                    )
                    # Update segment with actual duration
                    segment.actual_duration_seconds = duration
                    generated_count += 1
                    logger.debug(f"Generated audio for segment {segment.id}: {duration:.1f}s")
                except Exception as e:
                    logger.warning(f"Failed to generate audio for segment {segment.id}: {e}")
                    # Continue with other segments

    # Update ritual status and save
    ritual.voice_id = request.voice_id
    total_existing = skipped_count + generated_count
    if total_existing == total_segments:
        ritual.audio_status = "ready"
        status = "ready"
    elif total_existing > 0:
        ritual.audio_status = "ready"  # Partial is still usable
        status = "partial"
    else:
        ritual.audio_status = "error"
        status = "error"

    storage.save_ritual(ritual)
    logger.info(f"Audio generation for ritual {ritual.id}: generated={generated_count}, skipped={skipped_count}, total={total_segments}")

    return GenerateRitualAudioResponse(
        ritual_id=ritual.id,
        segments_generated=generated_count,
        segments_total=total_segments,
        segments_skipped=skipped_count,
        status=status,
    )
