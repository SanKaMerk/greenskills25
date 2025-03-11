from fastapi import APIRouter

from api.endpoints import auth, presentation, auth_v2

router = APIRouter(prefix="/api/v1")
router.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
router.include_router(presentation.router, prefix="/presentation", tags=["presentation"])
router.include_router(auth_v2.router, prefix="/auth_v2", tags=["auth_v2"])