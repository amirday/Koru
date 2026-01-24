"""TTS data models."""

from typing import Literal, Optional
from pydantic import BaseModel, Field


class Voice(BaseModel):
    """Voice configuration model."""

    id: str
    name: str
    description: str = ""
    labels: list[str] = []
    provider: Literal["elevenlabs", "google"] = "elevenlabs"


class TTSRequest(BaseModel):
    """Request model for TTS synthesis."""

    text: str
    voice_id: str = Field(alias="voiceId", default="sarah")
    provider: Literal["elevenlabs", "google"] = "elevenlabs"
    ritual_id: Optional[str] = Field(None, alias="ritualId")
    segment_id: Optional[str] = Field(None, alias="segmentId")
    speed: float = 1.0

    class Config:
        populate_by_name = True


class TTSResponse(BaseModel):
    """Response model for TTS synthesis."""

    audio_url: str = Field(alias="audioUrl")
    duration_seconds: float = Field(alias="durationSeconds")

    class Config:
        populate_by_name = True


class TTSResult(BaseModel):
    """Internal TTS result from providers."""

    audio_bytes: bytes
    duration_seconds: float
    content_type: str = "audio/mpeg"
