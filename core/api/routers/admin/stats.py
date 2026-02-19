"""Admin dashboard stats endpoint."""

from db.base import get_db
from db.models.user import User
from fastapi import APIRouter, Depends, Request
from schemas.api.admin import AdminDashboardStats
from sqlalchemy import func, select
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
    total_users = await db.scalar(select(func.count(User.id)).where(User.is_active())) or 0
    return AdminDashboardStats(total_users=total_users)
