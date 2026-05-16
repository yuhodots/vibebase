"""Auth API endpoints."""

from db.base import get_db
from db.models.user import User
from domain.services.user_service import UserService
from fastapi import APIRouter, Depends, Request
from schemas.api.auth import (
    AuthCallbackRequest,
    AuthCallbackResponse,
    UserResponse,
    UserUpdateRequest,
)
from schemas.common import SuccessResponse
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies.auth import create_access_token, get_current_user, verify_internal_secret
from api.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/callback",
    response_model=AuthCallbackResponse,
    dependencies=[Depends(verify_internal_secret)],
)
@limiter.limit("10/minute")
async def auth_callback(
    body: AuthCallbackRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> AuthCallbackResponse:
    """OAuth callback — upsert user and return JWT."""
    service = UserService(db)
    user = await service.upsert_oauth(
        provider=body.provider,
        provider_id=body.provider_id,
        email=body.email,
        name=body.name,
        image=body.image,
    )

    token = create_access_token(user.id, user.role)
    return AuthCallbackResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        image=user.image,
        role=user.role,
        token=token,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(
    user: User = Depends(get_current_user),
) -> UserResponse:
    """Get current authenticated user profile."""
    return UserResponse.model_validate(user)


@router.put("/me", response_model=UserResponse)
async def update_me(
    request: UserUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Update current user profile."""
    service = UserService(db)
    updated = await service.update_profile(user, request.model_dump(exclude_unset=True))
    return UserResponse.model_validate(updated)


@router.delete("/me", response_model=SuccessResponse)
async def delete_me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Soft-delete current user account. Anonymizes name and clears personal data."""
    service = UserService(db)
    await service.delete_self(user)
    return SuccessResponse(message="Account deleted")
