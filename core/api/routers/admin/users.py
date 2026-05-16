"""Admin user management endpoints."""

from db.base import get_db
from domain.services.user_service import UserService
from fastapi import APIRouter, Depends, Query, Request
from schemas.api.admin import AdminUserResponse, AdminUserRoleRequest
from schemas.common import PaginatedResponse, SuccessResponse, paginate
from sqlalchemy.ext.asyncio import AsyncSession

from api.rate_limit import limiter

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
    service = UserService(db)
    users, total = await service.list_paginated(page=page, limit=limit, search=search, role=role)
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
    service = UserService(db)
    user = await service.update_role(user_id, body.role)
    return AdminUserResponse.model_validate(user)


@router.delete("/users/{user_id}", response_model=SuccessResponse)
@limiter.limit("10/minute")
async def delete_user(
    request: Request,
    user_id: int,
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Soft-delete a user (anonymize email, name, clear image and bio)."""
    service = UserService(db)
    await service.delete_by_admin(user_id)
    return SuccessResponse(message="User deleted")
