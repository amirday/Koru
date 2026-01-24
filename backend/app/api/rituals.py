"""Ritual CRUD API routes."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..logging_config import get_logger
from ..models.ritual import Ritual, RitualResponse
from ..services.storage import get_storage_service

logger = get_logger(__name__)

router = APIRouter()


@router.get("", response_model=List[Ritual])
async def list_rituals():
    """List all rituals."""
    logger.debug("Listing all rituals")
    storage = get_storage_service()
    rituals = storage.list_rituals()
    logger.info(f"Listed {len(rituals)} rituals")
    return rituals


@router.get("/{ritual_id}", response_model=Ritual)
async def get_ritual(ritual_id: str):
    """Get a specific ritual by ID."""
    logger.debug(f"Getting ritual: {ritual_id}")
    storage = get_storage_service()
    ritual = storage.load_ritual(ritual_id)
    if not ritual:
        logger.warning(f"Ritual not found: {ritual_id}")
        raise HTTPException(status_code=404, detail="Ritual not found")
    logger.debug(f"Found ritual: {ritual.title}")
    return ritual


@router.post("", response_model=RitualResponse)
async def create_ritual(ritual: Ritual):
    """Create a new ritual."""
    logger.info(f"Creating ritual: id={ritual.id}, title='{ritual.title}'")
    storage = get_storage_service()
    storage.save_ritual(ritual)
    logger.debug(f"Ritual saved: {ritual.id}")
    return RitualResponse(ritual=ritual)


@router.put("/{ritual_id}", response_model=RitualResponse)
async def update_ritual(ritual_id: str, ritual: Ritual):
    """Update an existing ritual."""
    logger.info(f"Updating ritual: {ritual_id}")
    storage = get_storage_service()

    # Verify ritual exists
    existing = storage.load_ritual(ritual_id)
    if not existing:
        logger.warning(f"Ritual not found for update: {ritual_id}")
        raise HTTPException(status_code=404, detail="Ritual not found")

    # Ensure ID matches
    ritual.id = ritual_id
    storage.save_ritual(ritual)
    logger.debug(f"Ritual updated: {ritual_id}")
    return RitualResponse(ritual=ritual)


@router.delete("/{ritual_id}")
async def delete_ritual(ritual_id: str):
    """Delete a ritual and its audio files."""
    logger.info(f"Deleting ritual: {ritual_id}")
    storage = get_storage_service()

    # Verify ritual exists
    existing = storage.load_ritual(ritual_id)
    if not existing:
        logger.warning(f"Ritual not found for deletion: {ritual_id}")
        raise HTTPException(status_code=404, detail="Ritual not found")

    storage.delete_ritual(ritual_id)
    logger.info(f"Ritual deleted: {ritual_id}")
    return {"message": "Ritual deleted", "id": ritual_id}
