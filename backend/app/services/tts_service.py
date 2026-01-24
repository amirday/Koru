"""TTS service orchestration layer."""

import uuid
from typing import Literal, Optional

from ..models.tts import Voice
from .elevenlabs_tts import ElevenLabsTTSProvider, get_elevenlabs_provider
from .google_tts import GoogleTTSProvider, get_google_provider
from .storage import StorageService, get_storage_service


ProviderType = Literal["elevenlabs", "google"]


class TTSService:
    """Orchestrates TTS synthesis across providers."""

    def __init__(
        self,
        elevenlabs_provider: Optional[ElevenLabsTTSProvider] = None,
        google_provider: Optional[GoogleTTSProvider] = None,
        storage_service: Optional[StorageService] = None,
    ):
        self._elevenlabs = elevenlabs_provider
        self._google = google_provider
        self._storage = storage_service

    @property
    def elevenlabs(self) -> ElevenLabsTTSProvider:
        if self._elevenlabs is None:
            self._elevenlabs = get_elevenlabs_provider()
        return self._elevenlabs

    @property
    def google(self) -> GoogleTTSProvider:
        if self._google is None:
            self._google = get_google_provider()
        return self._google

    @property
    def storage(self) -> StorageService:
        if self._storage is None:
            self._storage = get_storage_service()
        return self._storage

    def get_provider(self, provider_type: ProviderType):
        """Get provider by type."""
        if provider_type == "elevenlabs":
            return self.elevenlabs
        elif provider_type == "google":
            return self.google
        else:
            raise ValueError(f"Unknown provider: {provider_type}")

    async def synthesize(
        self,
        text: str,
        voice_id: str,
        provider: ProviderType = "elevenlabs",
        ritual_id: Optional[str] = None,
        segment_id: Optional[str] = None,
        speed: float = 1.0,
    ) -> tuple[str, float]:
        """
        Synthesize text to speech and optionally save to storage.

        Returns:
            Tuple of (audio_url, duration_seconds)
        """
        # Get provider and synthesize
        tts_provider = self.get_provider(provider)
        result = await tts_provider.synthesize(text, voice_id, speed)

        # Determine file extension based on content type
        extension = "mp3" if result.content_type == "audio/mpeg" else "wav"

        # Save to storage if ritual_id and segment_id provided
        if ritual_id and segment_id:
            audio_url = self.storage.save_audio(
                ritual_id=ritual_id,
                segment_id=segment_id,
                audio_bytes=result.audio_bytes,
                extension=extension,
            )
        else:
            # Generate a temp ID and save for immediate use
            temp_id = str(uuid.uuid4())
            audio_url = self.storage.save_audio(
                ritual_id="temp",
                segment_id=temp_id,
                audio_bytes=result.audio_bytes,
                extension=extension,
            )

        return audio_url, result.duration_seconds

    def get_all_voices(self) -> list[Voice]:
        """Get voices from all providers (always returns static voice list)."""
        voices = []
        voices.extend(self.elevenlabs.get_voices())
        voices.extend(self.google.get_voices())
        return voices


# Singleton instance
_tts_service: Optional[TTSService] = None


def get_tts_service() -> TTSService:
    """Get or create TTS service instance."""
    global _tts_service
    if _tts_service is None:
        _tts_service = TTSService()
    return _tts_service
