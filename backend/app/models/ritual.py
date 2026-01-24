"""Ritual data models."""

from datetime import datetime, timezone
from typing import Literal, Optional
from pydantic import BaseModel, Field
import uuid


class Segment(BaseModel):
    """A segment is either text/speech or silence."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: Literal["text", "silence"]
    text: Optional[str] = None
    duration_seconds: float = Field(alias="durationSeconds")
    audio_url: Optional[str] = Field(None, alias="audioUrl")
    actual_duration_seconds: Optional[float] = Field(None, alias="actualDurationSeconds")

    class Config:
        populate_by_name = True


class RitualSection(BaseModel):
    """A ritual section contains an ordered list of segments."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: Literal["intro", "body", "closing"]
    duration_seconds: float = Field(alias="durationSeconds")
    segments: list[Segment] = []
    audio_url: Optional[str] = Field(None, alias="audioUrl")
    audio_duration_seconds: Optional[float] = Field(None, alias="audioDurationSeconds")
    audio_generated_at: Optional[str] = Field(None, alias="audioGeneratedAt")

    class Config:
        populate_by_name = True


class Ritual(BaseModel):
    """Complete ritual model."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    instructions: str = ""
    duration: int  # seconds
    tone: Literal["gentle", "neutral", "coach"] = "gentle"
    pace: Literal["slow", "medium", "fast"] = "medium"
    include_silence: bool = Field(True, alias="includeSilence")
    soundscape: Literal["ocean", "forest", "rain", "fire", "none"] = "none"
    sections: list[RitualSection] = []
    tags: list[str] = []
    is_template: bool = Field(False, alias="isTemplate")
    generated_from: Optional[str] = Field(None, alias="generatedFrom")
    voice_id: Optional[str] = Field(None, alias="voiceId")
    audio_status: Literal["pending", "generating", "ready", "error"] = Field(
        "pending", alias="audioStatus"
    )
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        alias="createdAt",
    )
    updated_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        alias="updatedAt",
    )

    class Config:
        populate_by_name = True


class RitualCreate(BaseModel):
    """Request model for creating a ritual via generation."""

    intention: str
    duration_minutes: int = Field(alias="durationMinutes", default=10)
    focus_areas: list[str] = Field(alias="focusAreas", default=[])
    tone: Literal["gentle", "neutral", "coach"] = "gentle"
    include_silence: bool = Field(True, alias="includeSilence")
    voice_id: str = Field("sarah", alias="voiceId")
    tts_provider: Literal["elevenlabs", "google"] = Field("elevenlabs", alias="provider")

    class Config:
        populate_by_name = True


class RitualResponse(BaseModel):
    """Response model for ritual operations."""

    ritual: Ritual
