"""Ritual CRUD API routes."""

from fastapi import APIRouter, HTTPException
from typing import List

from ..models.ritual import Ritual, RitualResponse
from ..services.storage import get_storage_service

router = APIRouter()


@router.get("", response_model=List[Ritual])
async def list_rituals():
    """List all rituals."""
    storage = get_storage_service()
    return storage.list_rituals()


@router.get("/{ritual_id}", response_model=Ritual)
async def get_ritual(ritual_id: str):
    """Get a specific ritual by ID."""
    storage = get_storage_service()
    ritual = storage.load_ritual(ritual_id)
    if not ritual:
        raise HTTPException(status_code=404, detail="Ritual not found")
    return ritual


@router.post("", response_model=RitualResponse)
async def create_ritual(ritual: Ritual):
    """Create a new ritual."""
    storage = get_storage_service()
    storage.save_ritual(ritual)
    return RitualResponse(ritual=ritual)


@router.put("/{ritual_id}", response_model=RitualResponse)
async def update_ritual(ritual_id: str, ritual: Ritual):
    """Update an existing ritual."""
    storage = get_storage_service()

    # Verify ritual exists
    existing = storage.load_ritual(ritual_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Ritual not found")

    # Ensure ID matches
    ritual.id = ritual_id
    storage.save_ritual(ritual)
    return RitualResponse(ritual=ritual)


@router.delete("/{ritual_id}")
async def delete_ritual(ritual_id: str):
    """Delete a ritual and its audio files."""
    storage = get_storage_service()

    # Verify ritual exists
    existing = storage.load_ritual(ritual_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Ritual not found")

    storage.delete_ritual(ritual_id)
    return {"message": "Ritual deleted", "id": ritual_id}
