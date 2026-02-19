"""Admin API router — assembled from sub-modules."""

from fastapi import APIRouter, Depends

from api.dependencies.auth import get_admin_user

from .stats import router as stats_router
from .users import router as users_router

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_admin_user)])

router.include_router(stats_router)
router.include_router(users_router)
