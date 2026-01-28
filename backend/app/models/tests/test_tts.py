"""Tests for TTS models."""

import pytest
from pydantic import ValidationError

from app.models.tts import Voice, TTSRequest, TTSResponse, TTSResult


@pytest.mark.offline
class TestVoice:
    """Tests for Voice model."""

    def test_voice_creation(self):
        """Basic voice creation."""
        voice = Voice(
            id="sarah",
            name="Sarah",
            description="Calm voice",
            labels=["calm", "female"],
            provider="elevenlabs"
        )
        assert voice.id == "sarah"
        assert voice.name == "Sarah"
        assert voice.provider == "elevenlabs"
        assert "calm" in voice.labels

    def test_voice_providers(self):
        """Should accept valid providers."""
        for provider in ["elevenlabs", "google"]:
            voice = Voice(id="test", name="Test", provider=provider)
            assert voice.provider == provider

    def test_invalid_provider(self):
        """Should reject invalid provider."""
        with pytest.raises(ValidationError):
            Voice(id="test", name="Test", provider="invalid")


@pytest.mark.offline
class TestTTSRequest:
    """Tests for TTSRequest model."""

    def test_minimal_request(self):
        """Request with minimal fields."""
        req = TTSRequest(text="Hi.")
        assert req.text == "Hi."
        assert req.voice_id == "sarah"  # Default
        assert req.provider == "elevenlabs"  # Default
        assert req.speed == 1.0  # Default

    def test_full_request(self):
        """Request with all fields."""
        req = TTSRequest(
            text="Hi.",
            voiceId="daniel",
            provider="elevenlabs",
            ritualId="ritual-1",
            segmentId="seg-1",
            speed=0.9
        )
        assert req.voice_id == "daniel"
        assert req.ritual_id == "ritual-1"
        assert req.segment_id == "seg-1"
        assert req.speed == 0.9

    def test_google_provider(self):
        """Request with Google provider."""
        req = TTSRequest(text="Hi.", voiceId="aoede", provider="google")
        assert req.provider == "google"

    def test_invalid_provider(self):
        """Should reject invalid provider."""
        with pytest.raises(ValidationError):
            TTSRequest(text="Hi.", provider="invalid")


@pytest.mark.offline
class TestTTSResponse:
    """Tests for TTSResponse model."""

    def test_response(self):
        """Basic response creation."""
        resp = TTSResponse(audioUrl="/api/audio/r1/s1.mp3", durationSeconds=2.5)
        assert resp.audio_url == "/api/audio/r1/s1.mp3"
        assert resp.duration_seconds == 2.5

    def test_serialization(self):
        """Response should serialize with aliases."""
        resp = TTSResponse(audioUrl="/test.mp3", durationSeconds=1.0)
        data = resp.model_dump(by_alias=True)
        assert "audioUrl" in data
        assert "durationSeconds" in data


@pytest.mark.offline
class TestTTSResult:
    """Tests for internal TTSResult model."""

    def test_result(self):
        """Basic result creation."""
        result = TTSResult(
            audio_bytes=b"test audio data",
            duration_seconds=1.5,
            content_type="audio/mpeg"
        )
        assert result.audio_bytes == b"test audio data"
        assert result.duration_seconds == 1.5
        assert result.content_type == "audio/mpeg"

    def test_default_content_type(self):
        """Default content type is audio/mpeg."""
        result = TTSResult(audio_bytes=b"data", duration_seconds=1.0)
        assert result.content_type == "audio/mpeg"
