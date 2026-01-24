"""Tests for OpenAI provider.

NOTE: These tests use REAL OpenAI API with minimal prompts.
Requires OPENAI_API_KEY in environment.
"""

import os
import pytest

from app.models.ritual import RitualCreate
from app.services.openai_provider import OpenAIProvider


skip_no_openai = pytest.mark.skipif(
    not os.getenv("OPENAI_API_KEY"),
    reason="OPENAI_API_KEY not set"
)


class TestOpenAIProvider:
    """Tests for OpenAI ritual generation."""

    def test_is_available_with_key(self):
        """Should return True when API key is provided."""
        provider = OpenAIProvider(api_key="test-key")
        assert provider.is_available() is True

    def test_is_available_without_key(self):
        """Should return False when API key is empty."""
        provider = OpenAIProvider(api_key="")
        assert provider.is_available() is False

    def test_build_prompt(self):
        """Should build user prompt correctly."""
        provider = OpenAIProvider(api_key="fake")
        request = RitualCreate(
            intention="relax",
            durationMinutes=5,
            focusAreas=["breathing"],
            tone="gentle"
        )
        prompt = provider._build_user_prompt(request)

        assert "5-minute" in prompt
        assert "relax" in prompt
        assert "gentle" in prompt
        assert "breathing" in prompt
        assert "300 seconds" in prompt  # 5 * 60

    @skip_no_openai
    @pytest.mark.asyncio
    async def test_generate_ritual_real_api(self):
        """Test real OpenAI API with minimal request."""
        provider = OpenAIProvider()

        # Minimal request to save tokens
        request = RitualCreate(
            intention="calm",
            durationMinutes=1,  # Shortest duration
            tone="gentle"
        )

        ritual = await provider.generate_ritual(request)

        # Verify structure
        assert ritual.id
        assert ritual.title
        assert ritual.duration == 60  # 1 minute
        assert ritual.tone == "gentle"
        assert len(ritual.sections) > 0

        # Verify sections have segments
        for section in ritual.sections:
            assert section.type in ["intro", "body", "closing"]
            assert len(section.segments) > 0

        # Verify segments
        for section in ritual.sections:
            for segment in section.segments:
                assert segment.type in ["text", "silence"]
                assert segment.duration_seconds > 0
                if segment.type == "text":
                    assert segment.text
