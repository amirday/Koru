"""Shared test fixtures for all backend tests."""

import os
import shutil
import tempfile
from pathlib import Path
from typing import Generator

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def test_storage_path() -> Generator[Path, None, None]:
    """Create a temporary storage directory for tests."""
    path = Path(tempfile.mkdtemp())
    (path / "rituals").mkdir()
    (path / "audio").mkdir()
    yield path
    shutil.rmtree(path, ignore_errors=True)


@pytest.fixture
def client(test_storage_path: Path) -> Generator[TestClient, None, None]:
    """Create a test client with isolated storage."""
    os.environ["STORAGE_PATH"] = str(test_storage_path)

    # Import after setting env vars
    from app.main import app
    import app.services.storage as storage_module
    from app.services.storage import StorageService

    # Reset singleton to use test storage
    storage_module._storage_service = StorageService(test_storage_path)

    with TestClient(app) as c:
        yield c


@pytest.fixture
def storage_service(test_storage_path: Path):
    """Create a storage service with test path."""
    from app.services.storage import StorageService
    return StorageService(test_storage_path)


@pytest.fixture
def sample_ritual_data() -> dict:
    """Sample ritual data for testing."""
    return {
        "id": "test-ritual-1",
        "title": "Test Ritual",
        "instructions": "Test instructions",
        "duration": 60,
        "tone": "gentle",
        "pace": "medium",
        "includeSilence": True,
        "soundscape": "none",
        "sections": [
            {
                "id": "section-1",
                "type": "intro",
                "durationSeconds": 20,
                "segments": [
                    {
                        "id": "seg-1",
                        "type": "text",
                        "text": "Hi.",
                        "durationSeconds": 2
                    },
                    {
                        "id": "seg-2",
                        "type": "silence",
                        "durationSeconds": 3
                    }
                ]
            }
        ],
        "tags": ["test"],
        "isTemplate": False
    }


@pytest.fixture
def minimal_tts_text() -> str:
    """Minimal text for TTS to save API credits."""
    return "Hi."
