"""Tests for TTS API routes.

NOTE: Real API tests require API keys and use minimal text.
"""

import os
import pytest
from fastapi.testclient import TestClient


skip_no_elevenlabs = pytest.mark.skipif(
    not os.getenv("ELEVENLABS_API_KEY"),
    reason="ELEVENLABS_API_KEY not set"
)

skip_no_google = pytest.mark.skipif(
    not os.getenv("GEMINI_API_KEY"),
    reason="GEMINI_API_KEY not set"
)


class TestTTSAPI:
    """Tests for /api/tts endpoints."""

    def test_list_voices(self, client: TestClient):
        """Should list available voices."""
        response = client.get("/api/tts/voices")
        assert response.status_code == 200

        voices = response.json()
        assert isinstance(voices, list)
        # Should have some voices
        assert len(voices) > 0

    def test_list_elevenlabs_voices(self, client: TestClient):
        """Should list ElevenLabs voices."""
        response = client.get("/api/tts/voices/elevenlabs")
        assert response.status_code == 200

        voices = response.json()
        assert all(v["provider"] == "elevenlabs" for v in voices)

    def test_list_google_voices(self, client: TestClient):
        """Should list Google voices."""
        response = client.get("/api/tts/voices/google")
        assert response.status_code == 200

        voices = response.json()
        assert all(v["provider"] == "google" for v in voices)

    def test_invalid_provider(self, client: TestClient):
        """Should return 400 for invalid provider."""
        response = client.get("/api/tts/voices/invalid")
        assert response.status_code == 400

    def test_synthesize_validation(self, client: TestClient):
        """Should validate request body."""
        # Missing text
        response = client.post("/api/tts/synthesize", json={})
        assert response.status_code == 422

        # Invalid provider
        response = client.post("/api/tts/synthesize", json={
            "text": "Hi.",
            "provider": "invalid"
        })
        assert response.status_code == 422

    @skip_no_elevenlabs
    def test_synthesize_elevenlabs(self, client: TestClient, minimal_tts_text: str):
        """Test ElevenLabs TTS via API."""
        response = client.post("/api/tts/synthesize", json={
            "text": minimal_tts_text,
            "voiceId": "sarah",
            "provider": "elevenlabs"
        })
        assert response.status_code == 200

        data = response.json()
        assert "audioUrl" in data
        assert "durationSeconds" in data
        assert data["durationSeconds"] > 0

        # Verify audio file accessible
        audio_response = client.get(data["audioUrl"])
        assert audio_response.status_code == 200

    @skip_no_google
    def test_synthesize_google(self, client: TestClient, minimal_tts_text: str):
        """Test Google TTS via API."""
        response = client.post("/api/tts/synthesize", json={
            "text": minimal_tts_text,
            "voiceId": "aoede",
            "provider": "google"
        })
        assert response.status_code == 200

        data = response.json()
        assert "audioUrl" in data
        assert data["durationSeconds"] > 0

    @skip_no_elevenlabs
    def test_synthesize_with_ritual(self, client: TestClient, sample_ritual_data: dict, minimal_tts_text: str):
        """Test TTS with ritual/segment IDs."""
        # Create ritual first
        client.post("/api/rituals", json=sample_ritual_data)

        response = client.post("/api/tts/synthesize", json={
            "text": minimal_tts_text,
            "voiceId": "sarah",
            "provider": "elevenlabs",
            "ritualId": sample_ritual_data["id"],
            "segmentId": "seg-1"
        })
        assert response.status_code == 200

        data = response.json()
        assert sample_ritual_data["id"] in data["audioUrl"]
        assert "seg-1" in data["audioUrl"]
