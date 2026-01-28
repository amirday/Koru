"""Tests for TTS services.

NOTE: These tests use REAL APIs with minimal text to save credits.
Requires API keys in environment.
"""

import os
import pytest

from app.services.elevenlabs_tts import ElevenLabsTTSProvider, ELEVENLABS_VOICES
from app.services.google_tts import GoogleTTSProvider, GOOGLE_VOICES
from app.services.tts_service import TTSService


# Skip if no API key
skip_no_elevenlabs = pytest.mark.skipif(
    not os.getenv("ELEVENLABS_API_KEY"),
    reason="ELEVENLABS_API_KEY not set"
)

skip_no_google = pytest.mark.skipif(
    not os.getenv("GEMINI_API_KEY"),
    reason="GEMINI_API_KEY not set"
)


class TestElevenLabsProvider:
    """Tests for ElevenLabs TTS provider."""

    @pytest.mark.offline
    def test_voice_mapping(self):
        """Should map voice names to IDs."""
        provider = ElevenLabsTTSProvider(api_key="fake")
        assert provider.get_voice_id("sarah") == "EXAVITQu4vr4xnSDxMaL"
        assert provider.get_voice_id("daniel") == "onwK4e9ZLuTAKqWW03F9"

    @pytest.mark.offline
    def test_unknown_voice_passthrough(self):
        """Unknown voice name should pass through as-is."""
        provider = ElevenLabsTTSProvider(api_key="fake")
        assert provider.get_voice_id("custom-id") == "custom-id"

    @pytest.mark.offline
    def test_get_voices(self):
        """Should return list of voices."""
        provider = ElevenLabsTTSProvider(api_key="fake")
        voices = provider.get_voices()
        assert len(voices) == len(ELEVENLABS_VOICES)
        assert all(v.provider == "elevenlabs" for v in voices)

    @pytest.mark.offline
    def test_is_available(self):
        """Should check API key availability."""
        provider_with_key = ElevenLabsTTSProvider(api_key="test-key")
        assert provider_with_key.is_available() is True

        provider_no_key = ElevenLabsTTSProvider(api_key="")
        assert provider_no_key.is_available() is False

    @pytest.mark.audio
    @skip_no_elevenlabs
    @pytest.mark.asyncio
    async def test_synthesize_real_api(self, minimal_tts_text):
        """Test real ElevenLabs API with minimal text."""
        provider = ElevenLabsTTSProvider()
        result = await provider.synthesize(minimal_tts_text, "sarah")

        assert result.audio_bytes
        assert len(result.audio_bytes) > 0
        assert result.duration_seconds > 0
        assert result.content_type == "audio/mpeg"


class TestGoogleTTSProvider:
    """Tests for Google Gemini TTS provider."""

    @pytest.mark.offline
    def test_voice_mapping(self):
        """Should map voice names to IDs."""
        provider = GoogleTTSProvider(api_key="fake")
        assert provider.get_voice_id("aoede") == "Aoede"
        assert provider.get_voice_id("charon") == "Charon"

    @pytest.mark.offline
    def test_get_voices(self):
        """Should return list of voices."""
        provider = GoogleTTSProvider(api_key="fake")
        voices = provider.get_voices()
        assert len(voices) == len(GOOGLE_VOICES)
        assert all(v.provider == "google" for v in voices)

    @pytest.mark.offline
    def test_is_available(self):
        """Should check API key availability."""
        provider_with_key = GoogleTTSProvider(api_key="test-key")
        assert provider_with_key.is_available() is True

        provider_no_key = GoogleTTSProvider(api_key="")
        assert provider_no_key.is_available() is False

    @pytest.mark.audio
    @skip_no_google
    @pytest.mark.asyncio
    async def test_synthesize_real_api(self, minimal_tts_text):
        """Test real Google TTS API with minimal text."""
        provider = GoogleTTSProvider()
        result = await provider.synthesize(minimal_tts_text, "aoede")

        assert result.audio_bytes
        assert len(result.audio_bytes) > 0
        assert result.duration_seconds > 0
        assert result.content_type == "audio/wav"


class TestTTSService:
    """Tests for TTS orchestration service."""

    @pytest.mark.offline
    def test_get_provider(self):
        """Should return correct provider."""
        service = TTSService()

        elevenlabs = service.get_provider("elevenlabs")
        assert isinstance(elevenlabs, ElevenLabsTTSProvider)

        google = service.get_provider("google")
        assert isinstance(google, GoogleTTSProvider)

    @pytest.mark.offline
    def test_invalid_provider(self):
        """Should raise for invalid provider."""
        service = TTSService()
        with pytest.raises(ValueError, match="Unknown provider"):
            service.get_provider("invalid")

    @pytest.mark.offline
    def test_get_all_voices(self):
        """Should combine voices from all providers."""
        service = TTSService()
        voices = service.get_all_voices()

        # Should have voices from both providers
        assert len(voices) == len(ELEVENLABS_VOICES) + len(GOOGLE_VOICES)
        providers = {v.provider for v in voices}
        assert "elevenlabs" in providers
        assert "google" in providers

    @pytest.mark.audio
    @skip_no_elevenlabs
    @pytest.mark.asyncio
    async def test_synthesize_with_storage(self, test_storage_path, minimal_tts_text):
        """Test synthesis with file storage."""
        from app.services.storage import StorageService

        storage = StorageService(test_storage_path)
        service = TTSService(storage_service=storage)

        url, duration = await service.synthesize(
            text=minimal_tts_text,
            voice_id="sarah",
            provider="elevenlabs",
            ritual_id="test-ritual",
            segment_id="test-segment"
        )

        assert url == "/api/audio/test-ritual/test-segment.mp3"
        assert duration > 0

        # Verify file exists
        file_path = test_storage_path / "audio" / "test-ritual" / "test-segment.mp3"
        assert file_path.exists()
