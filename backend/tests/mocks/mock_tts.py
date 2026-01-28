"""Mock TTS providers for offline testing."""

from app.models.tts import TTSResult, Voice


class MockElevenLabsTTSProvider:
    """Mock ElevenLabs TTS provider that returns fake MP3 bytes."""

    VOICES = {
        "sarah": {"name": "Sarah", "description": "Soft and calm American female", "labels": ["calm", "female"]},
        "daniel": {"name": "Daniel", "description": "Warm British male", "labels": ["warm", "male"]},
    }

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or "mock-key"

    def is_available(self) -> bool:
        return True

    def get_voice_id(self, voice_name: str) -> str:
        return voice_name

    def get_voices(self) -> list[Voice]:
        return [
            Voice(id=vid, name=data["name"], description=data["description"], labels=data["labels"], provider="elevenlabs")
            for vid, data in self.VOICES.items()
        ]

    async def synthesize(self, text: str, voice_id: str = "sarah", speed: float = 1.0) -> TTSResult:
        # Generate fake MP3 bytes proportional to text length
        fake_size = max(100, len(text) * 50)
        fake_bytes = b"\xff\xfb\x90\x00" + b"\x00" * fake_size  # Fake MP3 header + padding
        duration = len(text) * 0.06  # ~60ms per character
        return TTSResult(
            audio_bytes=fake_bytes,
            duration_seconds=max(0.1, duration),
            content_type="audio/mpeg",
        )


class MockGoogleTTSProvider:
    """Mock Google TTS provider that returns fake WAV bytes."""

    VOICES = {
        "aoede": {"name": "Aoede", "description": "Warm, gentle female voice", "labels": ["warm", "gentle"]},
        "charon": {"name": "Charon", "description": "Deep, grounding male voice", "labels": ["deep", "grounding"]},
    }

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or "mock-key"

    def is_available(self) -> bool:
        return True

    def get_voice_id(self, voice_name: str) -> str:
        return voice_name

    def get_voices(self) -> list[Voice]:
        return [
            Voice(id=vid, name=data["name"], description=data["description"], labels=data["labels"], provider="google")
            for vid, data in self.VOICES.items()
        ]

    async def synthesize(self, text: str, voice_id: str = "aoede", speed: float = 1.0) -> TTSResult:
        # Generate fake WAV bytes proportional to text length
        fake_size = max(100, len(text) * 50)
        # Minimal WAV header (44 bytes) + padding
        fake_bytes = b"RIFF" + fake_size.to_bytes(4, "little") + b"WAVE" + b"\x00" * (fake_size - 4)
        duration = len(text) * 0.06
        return TTSResult(
            audio_bytes=fake_bytes,
            duration_seconds=max(0.1, duration),
            content_type="audio/wav",
        )
