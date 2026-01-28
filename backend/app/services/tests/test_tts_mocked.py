"""Offline unit tests for TTSService with mock providers."""

import pytest
from pathlib import Path

from app.services.tts_service import TTSService
from app.services.storage import StorageService
from tests.mocks import MockElevenLabsTTSProvider, MockGoogleTTSProvider


@pytest.mark.offline
class TestTTSServiceMocked:
    """Unit tests for TTSService with injected mock providers."""

    @pytest.fixture
    def storage(self, test_storage_path: Path) -> StorageService:
        return StorageService(test_storage_path)

    @pytest.fixture
    def service(self, storage: StorageService) -> TTSService:
        return TTSService(
            elevenlabs_provider=MockElevenLabsTTSProvider(),
            google_provider=MockGoogleTTSProvider(),
            storage_service=storage,
        )

    @pytest.mark.asyncio
    async def test_synthesize_elevenlabs(self, service: TTSService, test_storage_path: Path):
        """Should synthesize with mock ElevenLabs and save to storage."""
        url, duration = await service.synthesize(
            text="Hello world.",
            voice_id="sarah",
            provider="elevenlabs",
            ritual_id="mock-ritual",
            segment_id="mock-seg-1",
        )

        assert url == "/api/audio/mock-ritual/mock-seg-1.mp3"
        assert duration > 0

        # Verify file saved
        file_path = test_storage_path / "audio" / "mock-ritual" / "mock-seg-1.mp3"
        assert file_path.exists()

    @pytest.mark.asyncio
    async def test_synthesize_google(self, service: TTSService, test_storage_path: Path):
        """Should synthesize with mock Google and save WAV."""
        url, duration = await service.synthesize(
            text="Hello world.",
            voice_id="aoede",
            provider="google",
            ritual_id="mock-ritual",
            segment_id="mock-seg-2",
        )

        assert url == "/api/audio/mock-ritual/mock-seg-2.wav"
        assert duration > 0

        # Verify file saved
        file_path = test_storage_path / "audio" / "mock-ritual" / "mock-seg-2.wav"
        assert file_path.exists()

    def test_get_all_voices(self, service: TTSService):
        """Should return combined voice list from both providers."""
        voices = service.get_all_voices()

        assert len(voices) == 4  # 2 ElevenLabs + 2 Google
        providers = {v.provider for v in voices}
        assert "elevenlabs" in providers
        assert "google" in providers
