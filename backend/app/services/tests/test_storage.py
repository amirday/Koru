"""Tests for storage service."""

import json
import pytest
from pathlib import Path

from app.models.ritual import Ritual
from app.services.storage import StorageService


@pytest.mark.offline
class TestStorageService:
    """Tests for StorageService."""

    @pytest.fixture
    def storage(self, test_storage_path: Path) -> StorageService:
        """Create storage service with test path."""
        return StorageService(test_storage_path)

    @pytest.fixture
    def sample_ritual(self) -> Ritual:
        """Create a sample ritual."""
        return Ritual(
            id="test-1",
            title="Test Ritual",
            duration=60,
            sections=[]
        )

    def test_save_and_load_ritual(self, storage: StorageService, sample_ritual: Ritual):
        """Should save and load ritual."""
        # Save
        ritual_id = storage.save_ritual(sample_ritual)
        assert ritual_id == "test-1"

        # Load
        loaded = storage.load_ritual("test-1")
        assert loaded is not None
        assert loaded.id == "test-1"
        assert loaded.title == "Test Ritual"

    def test_load_nonexistent_ritual(self, storage: StorageService):
        """Should return None for nonexistent ritual."""
        result = storage.load_ritual("nonexistent")
        assert result is None

    def test_list_rituals(self, storage: StorageService):
        """Should list all rituals."""
        # Create multiple rituals
        for i in range(3):
            ritual = Ritual(id=f"list-{i}", title=f"Ritual {i}", duration=60)
            storage.save_ritual(ritual)

        rituals = storage.list_rituals()
        assert len(rituals) >= 3

        # Should be sorted by date (newest first)
        ids = [r.id for r in rituals if r.id.startswith("list-")]
        assert len(ids) == 3

    def test_delete_ritual(self, storage: StorageService, sample_ritual: Ritual):
        """Should delete ritual and audio."""
        # Save ritual
        storage.save_ritual(sample_ritual)

        # Save some audio
        storage.save_audio("test-1", "seg-1", b"audio data")

        # Delete
        result = storage.delete_ritual("test-1")
        assert result is True

        # Verify deleted
        assert storage.load_ritual("test-1") is None
        assert not (storage.audio_path / "test-1").exists()

    def test_save_audio(self, storage: StorageService):
        """Should save audio file and return URL."""
        audio_bytes = b"fake audio content"
        url = storage.save_audio("ritual-1", "segment-1", audio_bytes, "mp3")

        assert url == "/api/audio/ritual-1/segment-1.mp3"

        # Verify file exists
        file_path = storage.audio_path / "ritual-1" / "segment-1.mp3"
        assert file_path.exists()
        assert file_path.read_bytes() == audio_bytes

    def test_save_audio_wav(self, storage: StorageService):
        """Should save WAV audio file."""
        url = storage.save_audio("ritual-1", "segment-2", b"wav data", "wav")
        assert url == "/api/audio/ritual-1/segment-2.wav"

    def test_ritual_json_structure(self, storage: StorageService, sample_ritual: Ritual):
        """Saved JSON should use camelCase aliases."""
        storage.save_ritual(sample_ritual)

        # Read raw JSON
        file_path = storage.rituals_path / "test-1.json"
        with open(file_path) as f:
            data = json.load(f)

        # Check camelCase
        assert "createdAt" in data
        assert "updatedAt" in data
        assert "audioStatus" in data
