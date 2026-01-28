"""Mock OpenAI provider for offline testing."""

import uuid
from datetime import datetime, timezone

from app.models.ritual import Ritual, RitualCreate, RitualSection, Segment


class MockOpenAIProvider:
    """Mock OpenAI provider that returns deterministic rituals without API calls."""

    def __init__(self, api_key: str | None = None):
        self.api_key = api_key or "mock-key"

    def is_available(self) -> bool:
        return True

    def _build_user_prompt(self, request: RitualCreate) -> str:
        duration_seconds = request.duration_minutes * 60
        prompt = f"Create a {request.duration_minutes}-minute meditation ritual.\n"
        prompt += f"Intention: {request.intention}\nTone: {request.tone}\n"
        if request.focus_areas:
            prompt += f"Focus areas: {', '.join(request.focus_areas)}\n"
        prompt += f"Total duration: {duration_seconds} seconds.\n"
        return prompt

    async def generate_ritual(self, request: RitualCreate) -> Ritual:
        """Return a deterministic ritual with 3 sections."""
        now = datetime.now(timezone.utc).isoformat()
        ritual_id = str(uuid.uuid4())
        duration_seconds = request.duration_minutes * 60

        # Intro section (~20%)
        intro_duration = int(duration_seconds * 0.2)
        intro = RitualSection(
            id=str(uuid.uuid4()),
            type="intro",
            durationSeconds=intro_duration,
            segments=[
                Segment(
                    id=str(uuid.uuid4()),
                    type="text",
                    text="Welcome. Find a comfortable position and close your eyes.",
                    durationSeconds=10,
                ),
                Segment(
                    id=str(uuid.uuid4()),
                    type="silence",
                    durationSeconds=5,
                ),
            ],
        )

        # Body section (~60%)
        body_duration = int(duration_seconds * 0.6)
        body = RitualSection(
            id=str(uuid.uuid4()),
            type="body",
            durationSeconds=body_duration,
            segments=[
                Segment(
                    id=str(uuid.uuid4()),
                    type="text",
                    text="Bring your attention to your breath. Notice the rise and fall.",
                    durationSeconds=15,
                ),
                Segment(
                    id=str(uuid.uuid4()),
                    type="silence",
                    durationSeconds=10,
                ),
                Segment(
                    id=str(uuid.uuid4()),
                    type="text",
                    text="Allow any thoughts to pass like clouds in the sky.",
                    durationSeconds=10,
                ),
            ],
        )

        # Closing section (~20%)
        closing_duration = int(duration_seconds * 0.2)
        closing = RitualSection(
            id=str(uuid.uuid4()),
            type="closing",
            durationSeconds=closing_duration,
            segments=[
                Segment(
                    id=str(uuid.uuid4()),
                    type="text",
                    text="Gently bring your awareness back. Open your eyes when ready.",
                    durationSeconds=10,
                ),
                Segment(
                    id=str(uuid.uuid4()),
                    type="silence",
                    durationSeconds=3,
                ),
            ],
        )

        tags = ["mock", request.tone]
        if request.focus_areas:
            tags.extend(request.focus_areas)

        return Ritual(
            id=ritual_id,
            title=f"Mock {request.tone.title()} Ritual",
            instructions=request.intention,
            duration=duration_seconds,
            tone=request.tone,
            pace="medium",
            includeSilence=request.include_silence,
            soundscape="none",
            sections=[intro, body, closing],
            tags=tags,
            isTemplate=False,
            generatedFrom=request.intention,
            audioStatus="pending",
            createdAt=now,
            updatedAt=now,
        )
