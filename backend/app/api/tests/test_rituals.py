"""Tests for ritual API routes."""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.offline
class TestRitualsAPI:
    """Tests for /api/rituals endpoints."""

    def test_list_rituals_empty(self, client: TestClient):
        """Should return empty list initially."""
        response = client.get("/api/rituals")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_ritual(self, client: TestClient, sample_ritual_data: dict):
        """Should create a ritual."""
        response = client.post("/api/rituals", json=sample_ritual_data)
        assert response.status_code == 200

        data = response.json()
        assert "ritual" in data
        assert data["ritual"]["id"] == sample_ritual_data["id"]
        assert data["ritual"]["title"] == sample_ritual_data["title"]

    def test_get_ritual(self, client: TestClient, sample_ritual_data: dict):
        """Should get a ritual by ID."""
        # Create first
        client.post("/api/rituals", json=sample_ritual_data)

        # Get
        response = client.get(f"/api/rituals/{sample_ritual_data['id']}")
        assert response.status_code == 200

        data = response.json()
        assert data["id"] == sample_ritual_data["id"]

    def test_get_ritual_not_found(self, client: TestClient):
        """Should return 404 for nonexistent ritual."""
        response = client.get("/api/rituals/nonexistent")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_update_ritual(self, client: TestClient, sample_ritual_data: dict):
        """Should update a ritual."""
        # Create first
        client.post("/api/rituals", json=sample_ritual_data)

        # Update
        updated_data = sample_ritual_data.copy()
        updated_data["title"] = "Updated Title"

        response = client.put(
            f"/api/rituals/{sample_ritual_data['id']}",
            json=updated_data
        )
        assert response.status_code == 200
        assert response.json()["ritual"]["title"] == "Updated Title"

    def test_update_ritual_not_found(self, client: TestClient, sample_ritual_data: dict):
        """Should return 404 when updating nonexistent ritual."""
        response = client.put("/api/rituals/nonexistent", json=sample_ritual_data)
        assert response.status_code == 404

    def test_delete_ritual(self, client: TestClient, sample_ritual_data: dict):
        """Should delete a ritual."""
        # Create first
        client.post("/api/rituals", json=sample_ritual_data)

        # Delete
        response = client.delete(f"/api/rituals/{sample_ritual_data['id']}")
        assert response.status_code == 200
        assert "deleted" in response.json()["message"].lower()

        # Verify deleted
        get_response = client.get(f"/api/rituals/{sample_ritual_data['id']}")
        assert get_response.status_code == 404

    def test_delete_ritual_not_found(self, client: TestClient):
        """Should return 404 when deleting nonexistent ritual."""
        response = client.delete("/api/rituals/nonexistent")
        assert response.status_code == 404

    def test_list_rituals_after_create(self, client: TestClient, sample_ritual_data: dict):
        """Should list rituals after creation."""
        # Create
        client.post("/api/rituals", json=sample_ritual_data)

        # List
        response = client.get("/api/rituals")
        assert response.status_code == 200

        rituals = response.json()
        assert len(rituals) >= 1
        assert any(r["id"] == sample_ritual_data["id"] for r in rituals)
