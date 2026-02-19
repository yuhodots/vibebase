"""Admin user management endpoints."""

from db.base import get_db
from db.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from schemas.api.admin import AdminUserResponse, AdminUserRoleRequest
from schemas.common import PaginatedResponse, SuccessResponse, paginate
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.rate_limit import limiter
from api.utils.query_helpers import escape_like

router = APIRouter()


@router.get("/users", response_model=PaginatedResponse[AdminUserResponse])
@limiter.limit("60/minute")
async def list_users(
    request: Request,
    search: str | None = Query(None),
    role: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[AdminUserResponse]:
    """List users with optional search and role filter (paginated)."""
    query = select(User)

    if search:
        safe = escape_like(search)
        query = query.where(User.name.ilike(f"%{safe}%") | User.email.ilike(f"%{safe}%"))
    if role:
        query = query.where(User.role == role)

    total = await db.scalar(select(func.count()).select_from(query.subquery())) or 0

    result = await db.execute(
        query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )
    users = list(result.scalars().unique().all())
    items = [AdminUserResponse.model_validate(user) for user in users]
    return PaginatedResponse(**paginate(total, page, limit, items))


@router.put("/users/{user_id}/role", response_model=AdminUserResponse)
@limiter.limit("30/minute")
async def update_user_role(
    request: Request,
    user_id: int,
    body: AdminUserRoleRequest,
    db: AsyncSession = Depends(get_db),
) -> AdminUserResponse:
    """Update a user's role."""
    result = await db.execute(select(User).where(User.id == user_id, User.is_active()))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.role = body.role
    await db.commit()
    await db.refresh(user)
    return AdminUserResponse.model_validate(user)


@router.delete("/users/{user_id}", response_model=SuccessResponse)
@limiter.limit("10/minute")
async def delete_user(
    request: Request,
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Soft-delete a user (anonymize email, name, clear image and bio)."""
    result = await db.execute(select(User).where(User.id == user_id, User.is_active()))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.anonymize()

    await db.commit()
    return SuccessResponse(message="User deleted")
