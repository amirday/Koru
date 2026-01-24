"""ElevenLabs TTS provider."""

from typing import Optional

from elevenlabs.client import ElevenLabs

from ..config import get_settings
from ..models.tts import TTSResult, Voice

# Voice IDs mapping
ELEVENLABS_VOICES = {
    "sarah": {
        "id": "EXAVITQu4vr4xnSDxMaL",
        "name": "Sarah",
        "description": "Soft and calm American female",
        "labels": ["calm", "female", "american"],
    },
    "daniel": {
        "id": "onwK4e9ZLuTAKqWW03F9",
        "name": "Daniel",
        "description": "Warm British male",
        "labels": ["warm", "male", "british"],
    },
    "charlotte": {
        "id": "XB0fDUnXU5powFXDhCwa",
        "name": "Charlotte",
        "description": "Gentle and soothing female",
        "labels": ["gentle", "female", "soothing"],
    },
    "lily": {
        "id": "pFZP5JQG7iQjIQuC4Bku",
        "name": "Lily",
        "description": "Peaceful British female",
        "labels": ["peaceful", "female", "british"],
    },
    "liam": {
        "id": "TX3LPaxmHKxFdv7VOQHJ",
        "name": "Liam",
        "description": "Calm American male",
        "labels": ["calm", "male", "american"],
    },
}


class ElevenLabsTTSProvider:
    """ElevenLabs TTS provider implementation."""

    def __init__(self, api_key: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.elevenlabs_api_key
        self._client: Optional[ElevenLabs] = None

    @property
    def client(self) -> ElevenLabs:
        """Lazy-initialize ElevenLabs client."""
        if self._client is None:
            if not self.api_key:
                raise ValueError("ElevenLabs API key not configured")
            self._client = ElevenLabs(api_key=self.api_key)
        return self._client

    def get_voice_id(self, voice_name: str) -> str:
        """Get ElevenLabs voice ID from voice name."""
        voice_data = ELEVENLABS_VOICES.get(voice_name.lower())
        if voice_data:
            return voice_data["id"]
        # If it's already a voice ID, return as-is
        return voice_name

    async def synthesize(self, text: str, voice_id: str = "sarah", speed: float = 1.0) -> TTSResult:
        """Synthesize text to speech."""
        actual_voice_id = self.get_voice_id(voice_id)

        # Generate audio
        audio_generator = self.client.text_to_speech.convert(
            text=text,
            voice_id=actual_voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        # Collect audio bytes from generator
        audio_bytes = b""
        for chunk in audio_generator:
            audio_bytes += chunk

        # Calculate approximate duration (rough estimate for MP3)
        # For more accurate duration, we'd need to decode the audio
        duration_seconds = len(audio_bytes) / (44100 * 128 / 8)  # Rough estimate

        return TTSResult(
            audio_bytes=audio_bytes,
            duration_seconds=duration_seconds,
            content_type="audio/mpeg",
        )

    def get_voices(self) -> list[Voice]:
        """Get available voices."""
        return [
            Voice(
                id=name,
                name=data["name"],
                description=data["description"],
                labels=data["labels"],
                provider="elevenlabs",
            )
            for name, data in ELEVENLABS_VOICES.items()
        ]

    def is_available(self) -> bool:
        """Check if provider is available."""
        return bool(self.api_key)


# Singleton instance
_provider: Optional[ElevenLabsTTSProvider] = None


def get_elevenlabs_provider() -> ElevenLabsTTSProvider:
    """Get or create ElevenLabs provider instance."""
    global _provider
    if _provider is None:
        _provider = ElevenLabsTTSProvider()
    return _provider
