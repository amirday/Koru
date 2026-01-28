"""Tests for health and root endpoints."""

import pytest
from fastapi.testclient import TestClient


@pytest.mark.offline
class TestHealth:
    """Tests for health check endpoints."""

    def test_health_check(self, client: TestClient):
        """Should return healthy status."""
        response = client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_root(self, client: TestClient):
        """Should return API info."""
        response = client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert data["name"] == "Koru API"
        assert "version" in data
        assert "docs" in data
