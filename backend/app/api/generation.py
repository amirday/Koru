"""Ritual generation API routes."""

from fastapi import APIRouter, HTTPException

from ..logging_config import get_logger
from ..models.ritual import RitualCreate, RitualResponse
from ..services.openai_provider import get_openai_provider
from ..services.storage import get_storage_service

logger = get_logger(__name__)

router = APIRouter()


@router.post("/ritual", response_model=RitualResponse)
async def generate_ritual(request: RitualCreate):
    """Generate a meditation ritual from user intention."""
    logger.info(f"Generating ritual: intention='{request.intention}', duration={request.duration_minutes}min, tone={request.tone}")

    openai_provider = get_openai_provider()
    storage = get_storage_service()

    if not openai_provider.is_available():
        logger.error("OpenAI API not configured")
        raise HTTPException(
            status_code=503,
            detail="OpenAI API not configured. Set OPENAI_API_KEY environment variable.",
        )

    try:
        # Generate the ritual
        logger.debug("Calling OpenAI API...")
        ritual = await openai_provider.generate_ritual(request)
        logger.info(f"Ritual generated: id={ritual.id}, title='{ritual.title}', sections={len(ritual.sections)}")

        # Save to storage
        storage.save_ritual(ritual)
        logger.debug(f"Ritual saved to storage: {ritual.id}")

        return RitualResponse(ritual=ritual)

    except Exception as e:
        logger.exception(f"Failed to generate ritual: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ritual: {str(e)}",
        )
