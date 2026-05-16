"""Admin dashboard stats endpoint."""

from db.base import get_db
from domain.services.user_service import UserService
from fastapi import APIRouter, Depends, Request
from schemas.api.admin import AdminDashboardStats
from sqlalchemy.ext.asyncio import AsyncSession

from api.rate_limit import limiter

router = APIRouter()


@router.get("/stats", response_model=AdminDashboardStats)
@limiter.limit("60/minute")
async def get_dashboard_stats(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> AdminDashboardStats:
    """Get admin dashboard statistics."""
    service = UserService(db)
    total_users = await service.count_active()
    return AdminDashboardStats(total_users=total_users)
