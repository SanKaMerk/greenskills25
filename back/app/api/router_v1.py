from fastapi import APIRouter

from api.endpoints import auth, presentation

router = APIRouter(prefix="/api/v1")
router.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
router.include_router(presentation.router, prefix="/presentation", tags=["presentation"])
