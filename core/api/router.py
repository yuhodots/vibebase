"""
Main API router that includes all endpoint routers.
"""

from fastapi import APIRouter

from api.routers.admin import router as admin_router
from api.routers.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(admin_router)
