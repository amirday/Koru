"""OpenAI provider for ritual text generation."""

import json
import uuid
from datetime import datetime, timezone
from typing import Literal, Optional

from openai import OpenAI

from ..config import get_settings
from ..models.ritual import Ritual, RitualSection, Segment, RitualCreate


# System prompt for ritual generation
SYSTEM_PROMPT = """You are a meditation ritual designer. Create personalized meditation rituals based on user intentions.

Output Format: Respond with valid JSON only. No markdown, no explanation.

Structure your ritual with 3 sections:
1. "intro" - Opening and settling in (15-20% of total duration)
2. "body" - Main meditation practice (60-70% of total duration)
3. "closing" - Integration and return (15-20% of total duration)

Each section has segments that are either:
- "text": spoken guidance (with the text field containing what to say)
- "silence": pause for reflection (with durationSeconds for how long)

Example response format:
{
  "title": "Morning Energy Ritual",
  "sections": [
    {
      "type": "intro",
      "durationSeconds": 60,
      "segments": [
        {"type": "text", "text": "Welcome. Find a comfortable position...", "durationSeconds": 15},
        {"type": "silence", "durationSeconds": 5},
        {"type": "text", "text": "Take a deep breath in...", "durationSeconds": 10}
      ]
    }
  ],
  "tags": ["morning", "energy", "focus"]
}

Guidelines:
- Use calming, supportive language appropriate for the tone
- For "gentle" tone: soft, nurturing, reassuring
- For "neutral" tone: balanced, clear, professional
- For "coach" tone: motivating, direct, encouraging
- Include breathing cues and body awareness
- Space out spoken segments with natural pauses
- Text segments should be 10-30 seconds when spoken aloud
- Silence segments should be 3-15 seconds for reflection"""


class OpenAIProvider:
    """OpenAI provider for ritual text generation."""

    def __init__(self, api_key: Optional[str] = None):
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.openai_api_key
        self._client: Optional[OpenAI] = None

    @property
    def client(self) -> OpenAI:
        """Lazy-initialize OpenAI client."""
        if self._client is None:
            if not self.api_key:
                raise ValueError("OpenAI API key not configured")
            self._client = OpenAI(api_key=self.api_key)
        return self._client

    def _build_user_prompt(self, request: RitualCreate) -> str:
        """Build the user prompt for ritual generation."""
        duration_seconds = request.duration_minutes * 60

        prompt = f"""Create a {request.duration_minutes}-minute meditation ritual.

Intention: {request.intention}
Tone: {request.tone}
Include silence pauses: {"Yes" if request.include_silence else "Minimal"}
"""

        if request.focus_areas:
            prompt += f"Focus areas: {', '.join(request.focus_areas)}\n"

        prompt += f"""
Total duration should be approximately {duration_seconds} seconds.
Distribute the time naturally across intro, body, and closing sections.

Remember: Output ONLY valid JSON, no other text."""

        return prompt

    async def generate_ritual(self, request: RitualCreate) -> Ritual:
        """Generate a meditation ritual based on the request."""
        user_prompt = self._build_user_prompt(request)

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )

        # Parse the response
        content = response.choices[0].message.content
        data = json.loads(content)

        # Build the ritual object
        now = datetime.now(timezone.utc).isoformat()
        ritual_id = str(uuid.uuid4())

        sections = []
        for section_data in data.get("sections", []):
            section_id = str(uuid.uuid4())

            segments = []
            for seg_data in section_data.get("segments", []):
                segment = Segment(
                    id=str(uuid.uuid4()),
                    type=seg_data.get("type", "text"),
                    text=seg_data.get("text"),
                    durationSeconds=seg_data.get("durationSeconds", 10),
                )
                segments.append(segment)

            section = RitualSection(
                id=section_id,
                type=section_data.get("type", "body"),
                durationSeconds=section_data.get("durationSeconds", 60),
                segments=segments,
            )
            sections.append(section)

        ritual = Ritual(
            id=ritual_id,
            title=data.get("title", "Meditation Ritual"),
            instructions=request.intention,
            duration=request.duration_minutes * 60,
            tone=request.tone,
            pace="medium",
            includeSilence=request.include_silence,
            soundscape="none",
            sections=sections,
            tags=data.get("tags", []),
            isTemplate=False,
            generatedFrom=request.intention,
            audioStatus="pending",
            createdAt=now,
            updatedAt=now,
        )

        return ritual

    def is_available(self) -> bool:
        """Check if provider is available."""
        return bool(self.api_key)


# Singleton instance
_provider: Optional[OpenAIProvider] = None


def get_openai_provider() -> OpenAIProvider:
    """Get or create OpenAI provider instance."""
    global _provider
    if _provider is None:
        _provider = OpenAIProvider()
    return _provider
