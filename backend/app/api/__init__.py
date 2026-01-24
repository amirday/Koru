from .rituals import router as rituals_router
from .tts import router as tts_router
from .generation import router as generation_router

__all__ = ["rituals_router", "tts_router", "generation_router"]
