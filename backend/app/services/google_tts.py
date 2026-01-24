"""Google Gemini TTS provider."""

import io
import wave
from typing import Optional

from google import genai
from google.genai import types

from ..config import get_settings
from ..models.tts import TTSResult, Voice

# Voice IDs mapping
GOOGLE_VOICES = {
    "aoede": {
        "id": "Aoede",
        "name": "Aoede",
        "description": "Warm, gentle female voice",
        "labels": ["warm", "gentle", "female"],
    },
    "charon": {
        "id": "Charon",
        "name": "Charon",
        "description": "Deep, grounding male voice",
        "labels": ["deep", "grounding", "male"],
    },
}


class GoogleTTSProvider:
    """Google Gemini TTS provider implementation."""

    def __init__(self, api_key: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.gemini_api_key
        self._client = None

    @property
    def client(self):
        """Lazy-initialize Google genai client."""
        if self._client is None:
            if not self.api_key:
                raise ValueError("Google Gemini API key not configured")
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def get_voice_id(self, voice_name: str) -> str:
        """Get Google voice ID from voice name."""
        voice_data = GOOGLE_VOICES.get(voice_name.lower())
        if voice_data:
            return voice_data["id"]
        # If it's already a voice ID, return as-is
        return voice_name

    def _pcm_to_wav(self, pcm_data: bytes, sample_rate: int = 24000) -> bytes:
        """Convert raw PCM data to WAV format."""
        buffer = io.BytesIO()
        with wave.open(buffer, 'wb') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_data)
        return buffer.getvalue()

    async def synthesize(self, text: str, voice_id: str = "aoede", speed: float = 1.0) -> TTSResult:
        """Synthesize text to speech."""
        actual_voice_id = self.get_voice_id(voice_id)

        # Build meditation-style prompt
        prompt = f'[meditative, slow, hushed, gentle, low pitch]\n\n"{text}"'

        response = self.client.models.generate_content(
            model="gemini-2.5-pro-preview-tts",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=1,
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=actual_voice_id
                        )
                    )
                )
            )
        )

        # Extract audio data
        audio_data = b""
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                audio_data += part.inline_data.data

        # Convert PCM to WAV
        wav_data = self._pcm_to_wav(audio_data)

        # Calculate duration (16-bit mono at 24kHz)
        duration_seconds = len(audio_data) / (24000 * 2)  # 2 bytes per sample

        return TTSResult(
            audio_bytes=wav_data,
            duration_seconds=duration_seconds,
            content_type="audio/wav",
        )

    def get_voices(self) -> list[Voice]:
        """Get available voices."""
        return [
            Voice(
                id=name,
                name=data["name"],
                description=data["description"],
                labels=data["labels"],
                provider="google",
            )
            for name, data in GOOGLE_VOICES.items()
        ]

    def is_available(self) -> bool:
        """Check if provider is available."""
        return bool(self.api_key)


# Singleton instance
_provider: Optional[GoogleTTSProvider] = None


def get_google_provider() -> GoogleTTSProvider:
    """Get or create Google TTS provider instance."""
    global _provider
    if _provider is None:
        _provider = GoogleTTSProvider()
    return _provider
