"""File-based storage service for rituals and audio."""

import json
import shutil
from pathlib import Path
from typing import Optional

from ..models.ritual import Ritual
from ..config import get_settings


class StorageService:
    """Handles file-based storage for rituals and audio files."""

    def __init__(self, storage_path: Optional[Path] = None):
        settings = get_settings()
        self.storage_path = storage_path or settings.storage_path
        self.rituals_path = self.storage_path / "rituals"
        self.audio_path = self.storage_path / "audio"

        # Ensure directories exist
        self.rituals_path.mkdir(parents=True, exist_ok=True)
        self.audio_path.mkdir(parents=True, exist_ok=True)

    def save_ritual(self, ritual: Ritual) -> str:
        """Save ritual to JSON file."""
        file_path = self.rituals_path / f"{ritual.id}.json"
        with open(file_path, "w") as f:
            json.dump(ritual.model_dump(by_alias=True), f, indent=2)
        return ritual.id

    def load_ritual(self, ritual_id: str) -> Optional[Ritual]:
        """Load ritual from JSON file."""
        file_path = self.rituals_path / f"{ritual_id}.json"
        if not file_path.exists():
            return None
        with open(file_path, "r") as f:
            data = json.load(f)
        return Ritual(**data)

    def list_rituals(self) -> list[Ritual]:
        """List all rituals."""
        rituals = []
        for file_path in self.rituals_path.glob("*.json"):
            try:
                with open(file_path, "r") as f:
                    data = json.load(f)
                rituals.append(Ritual(**data))
            except Exception:
                continue  # Skip invalid files
        # Sort by created_at descending
        rituals.sort(key=lambda r: r.created_at, reverse=True)
        return rituals

    def delete_ritual(self, ritual_id: str) -> bool:
        """Delete ritual and all associated audio files."""
        # Delete ritual JSON
        ritual_file = self.rituals_path / f"{ritual_id}.json"
        if ritual_file.exists():
            ritual_file.unlink()

        # Delete audio directory for this ritual
        audio_dir = self.audio_path / ritual_id
        if audio_dir.exists():
            shutil.rmtree(audio_dir)

        return True

    def save_audio(
        self,
        ritual_id: str,
        segment_id: str,
        audio_bytes: bytes,
        extension: str = "mp3",
    ) -> str:
        """Save audio file and return the relative URL."""
        # Create ritual audio directory
        ritual_audio_path = self.audio_path / ritual_id
        ritual_audio_path.mkdir(parents=True, exist_ok=True)

        # Save audio file
        filename = f"{segment_id}.{extension}"
        file_path = ritual_audio_path / filename
        with open(file_path, "wb") as f:
            f.write(audio_bytes)

        # Return URL path
        return f"/api/audio/{ritual_id}/{filename}"

    def audio_exists(self, ritual_id: str, segment_id: str) -> bool:
        """Check if audio file exists for a segment (any supported format)."""
        ritual_audio_dir = self.audio_path / ritual_id
        if not ritual_audio_dir.exists():
            return False

        # Check for common audio extensions
        for ext in ["mp3", "wav"]:
            file_path = ritual_audio_dir / f"{segment_id}.{ext}"
            if file_path.exists():
                return True
        return False

    def get_ritual_audio_status(self, ritual_id: str) -> dict:
        """
        Get audio status for a ritual.
        Returns dict with segment IDs and whether audio exists.
        """
        ritual = self.load_ritual(ritual_id)
        if not ritual:
            return {"exists": False, "segments": {}}

        segments_status = {}
        total_text_segments = 0
        existing_audio = 0

        for section in ritual.sections:
            for segment in section.segments:
                if segment.type == "text" and segment.text:
                    total_text_segments += 1
                    exists = self.audio_exists(ritual_id, segment.id)
                    segments_status[segment.id] = exists
                    if exists:
                        existing_audio += 1

        return {
            "exists": True,
            "ritual_id": ritual_id,
            "segments": segments_status,
            "total": total_text_segments,
            "generated": existing_audio,
            "missing": total_text_segments - existing_audio,
        }


# Singleton instance
_storage_service: Optional[StorageService] = None


def get_storage_service() -> StorageService:
    """Get or create storage service instance."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
