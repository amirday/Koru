"""Offline tests for TTS API using mocked providers."""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.offline
class TestTTSMocked:
    """Tests for /api/tts endpoints using mock TTS providers."""

    def test_synthesize_elevenlabs_mocked(self, mock_tts_client: TestClient):
        """POST /api/tts/synthesize with mocked ElevenLabs."""
        response = mock_tts_client.post("/api/tts/synthesize", json={
            "text": "Hello world.",
            "voiceId": "sarah",
            "provider": "elevenlabs",
        })
        assert response.status_code == 200

        data = response.json()
        assert "audioUrl" in data
        assert data["durationSeconds"] > 0

    def test_synthesize_google_mocked(self, mock_tts_client: TestClient):
        """POST /api/tts/synthesize with mocked Google."""
        response = mock_tts_client.post("/api/tts/synthesize", json={
            "text": "Hello world.",
            "voiceId": "aoede",
            "provider": "google",
        })
        assert response.status_code == 200

        data = response.json()
        assert "audioUrl" in data
        assert data["durationSeconds"] > 0

    def test_synthesize_with_ritual_segment(self, mock_tts_client: TestClient):
        """Audio URL should include ritual/segment IDs."""
        # Create a ritual first
        mock_tts_client.post("/api/rituals", json={
            "id": "tts-test-ritual",
            "title": "TTS Test",
            "duration": 60,
            "sections": [],
            "tags": [],
        })

        response = mock_tts_client.post("/api/tts/synthesize", json={
            "text": "Test segment.",
            "voiceId": "sarah",
            "provider": "elevenlabs",
            "ritualId": "tts-test-ritual",
            "segmentId": "seg-001",
        })
        assert response.status_code == 200

        data = response.json()
        assert "tts-test-ritual" in data["audioUrl"]
        assert "seg-001" in data["audioUrl"]


@pytest.mark.offline
class TestFullFlowMocked:
    """Full flow tests with both OpenAI and TTS mocked."""

    def test_generate_ritual_audio_full_flow(self, mock_all_client: TestClient):
        """Generate ritual (mocked) → generate audio (mocked) → verify."""
        # 1. Generate ritual
        gen_response = mock_all_client.post("/api/generate/ritual", json={
            "intention": "calm",
            "durationMinutes": 1,
            "tone": "gentle",
        })
        assert gen_response.status_code == 200

        ritual = gen_response.json()["ritual"]
        ritual_id = ritual["id"]

        # 2. Generate audio for the ritual
        audio_response = mock_all_client.post("/api/tts/generate-ritual-audio", json={
            "ritualId": ritual_id,
            "voiceId": "sarah",
            "provider": "elevenlabs",
        })
        assert audio_response.status_code == 200

        audio_data = audio_response.json()
        assert audio_data["ritualId"] == ritual_id
        assert audio_data["segmentsGenerated"] > 0
        assert audio_data["status"] == "ready"

    def test_generate_audio_ritual_not_found(self, mock_all_client: TestClient):
        """Should return 404 for nonexistent ritual."""
        response = mock_all_client.post("/api/tts/generate-ritual-audio", json={
            "ritualId": "nonexistent-ritual",
            "voiceId": "sarah",
            "provider": "elevenlabs",
        })
        assert response.status_code == 404
