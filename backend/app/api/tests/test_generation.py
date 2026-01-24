"""Tests for generation API routes.

NOTE: Real API tests require OPENAI_API_KEY and use minimal prompts.
"""

import os
import pytest
from fastapi.testclient import TestClient


skip_no_openai = pytest.mark.skipif(
    not os.getenv("OPENAI_API_KEY"),
    reason="OPENAI_API_KEY not set"
)


class TestGenerationAPI:
    """Tests for /api/generate endpoints."""

    def test_generate_validation(self, client: TestClient):
        """Should validate request body."""
        # Missing intention
        response = client.post("/api/generate/ritual", json={})
        assert response.status_code == 422

    @skip_no_openai
    def test_generate_ritual(self, client: TestClient):
        """Test ritual generation via API."""
        response = client.post("/api/generate/ritual", json={
            "intention": "calm",
            "durationMinutes": 1,
            "tone": "gentle"
        })
        assert response.status_code == 200

        data = response.json()
        assert "ritual" in data

        ritual = data["ritual"]
        assert ritual["id"]
        assert ritual["title"]
        assert ritual["duration"] == 60
        assert ritual["tone"] == "gentle"
        assert len(ritual["sections"]) > 0

    @skip_no_openai
    def test_generate_ritual_saved(self, client: TestClient):
        """Generated ritual should be saved to storage."""
        # Generate
        gen_response = client.post("/api/generate/ritual", json={
            "intention": "focus",
            "durationMinutes": 1,
            "tone": "coach"
        })
        assert gen_response.status_code == 200

        ritual_id = gen_response.json()["ritual"]["id"]

        # Verify saved
        get_response = client.get(f"/api/rituals/{ritual_id}")
        assert get_response.status_code == 200
        assert get_response.json()["id"] == ritual_id

    @skip_no_openai
    def test_generate_with_focus_areas(self, client: TestClient):
        """Should include focus areas in generation."""
        response = client.post("/api/generate/ritual", json={
            "intention": "energy",
            "durationMinutes": 1,
            "focusAreas": ["breathing"],
            "tone": "neutral"
        })
        assert response.status_code == 200

        ritual = response.json()["ritual"]
        assert ritual["tone"] == "neutral"
