"""Tests for ritual models."""

import pytest
from pydantic import ValidationError

from app.models.ritual import Ritual, RitualSection, Segment, RitualCreate


@pytest.mark.offline
class TestSegment:
    """Tests for Segment model."""

    def test_text_segment(self):
        """Text segment should have text field."""
        seg = Segment(type="text", text="Hi.", durationSeconds=2)
        assert seg.type == "text"
        assert seg.text == "Hi."
        assert seg.duration_seconds == 2
        assert seg.id  # Auto-generated

    def test_silence_segment(self):
        """Silence segment doesn't need text."""
        seg = Segment(type="silence", durationSeconds=5)
        assert seg.type == "silence"
        assert seg.text is None
        assert seg.duration_seconds == 5

    def test_segment_alias(self):
        """Should accept camelCase alias."""
        seg = Segment(type="text", text="Hi.", durationSeconds=3)
        data = seg.model_dump(by_alias=True)
        assert "durationSeconds" in data
        assert data["durationSeconds"] == 3

    def test_invalid_type(self):
        """Should reject invalid segment type."""
        with pytest.raises(ValidationError):
            Segment(type="invalid", durationSeconds=2)


@pytest.mark.offline
class TestRitualSection:
    """Tests for RitualSection model."""

    def test_section_with_segments(self):
        """Section should contain segments."""
        section = RitualSection(
            type="intro",
            durationSeconds=30,
            segments=[
                Segment(type="text", text="Hi.", durationSeconds=2),
                Segment(type="silence", durationSeconds=3),
            ]
        )
        assert section.type == "intro"
        assert len(section.segments) == 2
        assert section.id  # Auto-generated

    def test_section_types(self):
        """Should accept valid section types."""
        for stype in ["intro", "body", "closing"]:
            section = RitualSection(type=stype, durationSeconds=10)
            assert section.type == stype

    def test_invalid_section_type(self):
        """Should reject invalid section type."""
        with pytest.raises(ValidationError):
            RitualSection(type="invalid", durationSeconds=10)


@pytest.mark.offline
class TestRitual:
    """Tests for Ritual model."""

    def test_minimal_ritual(self):
        """Ritual with minimal required fields."""
        ritual = Ritual(title="Test", duration=60)
        assert ritual.title == "Test"
        assert ritual.duration == 60
        assert ritual.id  # Auto-generated
        assert ritual.created_at  # Auto-generated
        assert ritual.tone == "gentle"  # Default

    def test_full_ritual(self, sample_ritual_data):
        """Ritual with all fields."""
        ritual = Ritual(**sample_ritual_data)
        assert ritual.id == "test-ritual-1"
        assert ritual.title == "Test Ritual"
        assert len(ritual.sections) == 1
        assert len(ritual.sections[0].segments) == 2

    def test_ritual_serialization(self, sample_ritual_data):
        """Ritual should serialize with aliases."""
        ritual = Ritual(**sample_ritual_data)
        data = ritual.model_dump(by_alias=True)
        assert "includeSilence" in data
        assert "createdAt" in data
        assert "audioStatus" in data

    def test_ritual_tones(self):
        """Should accept valid tones."""
        for tone in ["gentle", "neutral", "coach"]:
            ritual = Ritual(title="Test", duration=60, tone=tone)
            assert ritual.tone == tone


@pytest.mark.offline
class TestRitualCreate:
    """Tests for RitualCreate request model."""

    def test_minimal_request(self):
        """Request with minimal fields."""
        req = RitualCreate(intention="relax")
        assert req.intention == "relax"
        assert req.duration_minutes == 10  # Default
        assert req.tone == "gentle"  # Default

    def test_full_request(self):
        """Request with all fields."""
        req = RitualCreate(
            intention="focus",
            durationMinutes=5,
            focusAreas=["breathing"],
            tone="coach",
            includeSilence=False
        )
        assert req.intention == "focus"
        assert req.duration_minutes == 5
        assert req.focus_areas == ["breathing"]
        assert req.tone == "coach"
        assert req.include_silence is False
