"""Offline tests for generation API using mocked OpenAI provider."""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.offline
class TestGenerationMocked:
    """Tests for /api/generate endpoints using mock OpenAI."""

    def test_generate_ritual_returns_200(self, mock_openai_client: TestClient):
        """POST /api/generate/ritual should return 200 with mocked provider."""
        response = mock_openai_client.post("/api/generate/ritual", json={
            "intention": "calm",
            "durationMinutes": 1,
            "tone": "gentle",
        })
        assert response.status_code == 200

        data = response.json()
        assert "ritual" in data
        ritual = data["ritual"]
        assert ritual["id"]
        assert ritual["title"]
        assert ritual["duration"] == 60
        assert ritual["tone"] == "gentle"
        assert len(ritual["sections"]) == 3

        # Verify section types
        section_types = [s["type"] for s in ritual["sections"]]
        assert "intro" in section_types
        assert "body" in section_types
        assert "closing" in section_types

    def test_generate_ritual_saved_to_storage(self, mock_openai_client: TestClient):
        """Generated ritual should be retrievable via GET."""
        gen_response = mock_openai_client.post("/api/generate/ritual", json={
            "intention": "focus",
            "durationMinutes": 2,
            "tone": "coach",
        })
        assert gen_response.status_code == 200

        ritual_id = gen_response.json()["ritual"]["id"]

        get_response = mock_openai_client.get(f"/api/rituals/{ritual_id}")
        assert get_response.status_code == 200
        assert get_response.json()["id"] == ritual_id

    def test_generate_assigns_audio_urls(self, mock_openai_client: TestClient):
        """Text segments should get audioUrl pre-assigned."""
        response = mock_openai_client.post("/api/generate/ritual", json={
            "intention": "relax",
            "durationMinutes": 1,
            "tone": "gentle",
        })
        assert response.status_code == 200

        ritual = response.json()["ritual"]
        for section in ritual["sections"]:
            for segment in section["segments"]:
                if segment["type"] == "text":
                    assert segment.get("audioUrl"), f"Text segment {segment['id']} missing audioUrl"
                    assert segment["audioUrl"].startswith("/api/audio/")

    def test_generate_validation(self, mock_openai_client: TestClient):
        """Missing required fields should return 422."""
        response = mock_openai_client.post("/api/generate/ritual", json={})
        assert response.status_code == 422
