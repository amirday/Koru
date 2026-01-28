"""Integration tests for full backend flow.

NOTE: These tests use REAL APIs with minimal text/prompts.
Requires API keys in environment.
"""

import os
import pytest
from fastapi.testclient import TestClient


skip_no_apis = pytest.mark.skipif(
    not (os.getenv("OPENAI_API_KEY") and os.getenv("ELEVENLABS_API_KEY")),
    reason="Requires OPENAI_API_KEY and ELEVENLABS_API_KEY"
)


class TestFullFlow:
    """Integration tests for complete workflows."""

    @pytest.mark.audio
    @skip_no_apis
    def test_generate_and_synthesize_flow(self, client: TestClient):
        """
        Full flow: Generate ritual → Synthesize first segment.
        Uses minimal text to save API credits.
        """
        # 1. Generate ritual (1 minute, minimal)
        gen_response = client.post("/api/generate/ritual", json={
            "intention": "calm",
            "durationMinutes": 1,
            "tone": "gentle"
        })
        assert gen_response.status_code == 200

        ritual = gen_response.json()["ritual"]
        ritual_id = ritual["id"]

        # 2. Get first text segment
        first_section = ritual["sections"][0]
        text_segments = [s for s in first_section["segments"] if s["type"] == "text"]
        assert len(text_segments) > 0

        first_segment = text_segments[0]

        # 3. Synthesize with minimal text (not full segment text)
        synth_response = client.post("/api/tts/synthesize", json={
            "text": "Hi.",  # Minimal text to save credits
            "voiceId": "sarah",
            "provider": "elevenlabs",
            "ritualId": ritual_id,
            "segmentId": first_segment["id"]
        })
        assert synth_response.status_code == 200

        audio_data = synth_response.json()
        assert audio_data["audioUrl"]
        assert audio_data["durationSeconds"] > 0

        # 4. Verify audio accessible
        audio_response = client.get(audio_data["audioUrl"])
        assert audio_response.status_code == 200

        # 5. Verify ritual still exists
        get_response = client.get(f"/api/rituals/{ritual_id}")
        assert get_response.status_code == 200

        # 6. Cleanup
        delete_response = client.delete(f"/api/rituals/{ritual_id}")
        assert delete_response.status_code == 200

    @pytest.mark.offline
    def test_ritual_crud_flow(self, client: TestClient, sample_ritual_data: dict):
        """Full CRUD flow for rituals."""
        ritual_id = sample_ritual_data["id"]

        # 1. Create
        create_response = client.post("/api/rituals", json=sample_ritual_data)
        assert create_response.status_code == 200

        # 2. Read
        get_response = client.get(f"/api/rituals/{ritual_id}")
        assert get_response.status_code == 200
        assert get_response.json()["title"] == sample_ritual_data["title"]

        # 3. Update
        updated = sample_ritual_data.copy()
        updated["title"] = "Updated"
        update_response = client.put(f"/api/rituals/{ritual_id}", json=updated)
        assert update_response.status_code == 200
        assert update_response.json()["ritual"]["title"] == "Updated"

        # 4. List
        list_response = client.get("/api/rituals")
        assert any(r["id"] == ritual_id for r in list_response.json())

        # 5. Delete
        delete_response = client.delete(f"/api/rituals/{ritual_id}")
        assert delete_response.status_code == 200

        # 6. Verify deleted
        get_deleted = client.get(f"/api/rituals/{ritual_id}")
        assert get_deleted.status_code == 404

    @pytest.mark.audio
    @skip_no_apis
    def test_multi_provider_tts(self, client: TestClient, minimal_tts_text: str):
        """Test TTS with multiple providers."""
        # ElevenLabs
        el_response = client.post("/api/tts/synthesize", json={
            "text": minimal_tts_text,
            "voiceId": "sarah",
            "provider": "elevenlabs"
        })
        assert el_response.status_code == 200
        assert el_response.json()["durationSeconds"] > 0

        # Google (if available)
        if os.getenv("GEMINI_API_KEY"):
            google_response = client.post("/api/tts/synthesize", json={
                "text": minimal_tts_text,
                "voiceId": "aoede",
                "provider": "google"
            })
            assert google_response.status_code == 200


@pytest.mark.offline
class TestErrorHandling:
    """Tests for error scenarios."""

    def test_ritual_not_found(self, client: TestClient):
        """Should handle missing ritual gracefully."""
        response = client.get("/api/rituals/does-not-exist")
        assert response.status_code == 404
        assert "detail" in response.json()

    def test_invalid_json(self, client: TestClient):
        """Should handle invalid JSON."""
        response = client.post(
            "/api/rituals",
            content="not valid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

    def test_missing_required_field(self, client: TestClient):
        """Should validate required fields."""
        response = client.post("/api/rituals", json={
            "id": "test"
            # Missing title and duration
        })
        assert response.status_code == 422

    def test_invalid_provider(self, client: TestClient):
        """Should reject invalid TTS provider."""
        response = client.post("/api/tts/synthesize", json={
            "text": "Hi.",
            "provider": "not-a-provider"
        })
        assert response.status_code == 422
