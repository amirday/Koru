"""Ritual generation API routes."""

from fastapi import APIRouter, HTTPException

from ..models.ritual import RitualCreate, RitualResponse
from ..services.openai_provider import get_openai_provider
from ..services.storage import get_storage_service

router = APIRouter()


@router.post("/ritual", response_model=RitualResponse)
async def generate_ritual(request: RitualCreate):
    """Generate a meditation ritual from user intention."""
    openai_provider = get_openai_provider()
    storage = get_storage_service()

    if not openai_provider.is_available():
        raise HTTPException(
            status_code=503,
            detail="OpenAI API not configured. Set OPENAI_API_KEY environment variable.",
        )

    try:
        # Generate the ritual
        ritual = await openai_provider.generate_ritual(request)

        # Save to storage
        storage.save_ritual(ritual)

        return RitualResponse(ritual=ritual)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ritual: {str(e)}",
        )
