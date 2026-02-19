"""Auth API endpoints."""

from db.base import get_db
from db.models.user import User
from fastapi import APIRouter, Depends, HTTPException, Request, status
from schemas.api.auth import (
    AuthCallbackRequest,
    AuthCallbackResponse,
    UserResponse,
    UserUpdateRequest,
)
from schemas.common import SuccessResponse
from sqlalchemy import select
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
    result = await db.execute(
        select(User).where(
            User.provider == body.provider,
            User.provider_id == body.provider_id,
        )
    )
    user = result.scalar_one_or_none()

    if user and user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="This account has been deleted",
        )

    if user:
        user.name = body.name
        user.image = body.image
    else:
        user = User(
            email=body.email,
            name=body.name,
            image=body.image,
            provider=body.provider,
            provider_id=body.provider_id,
        )
        db.add(user)

    await db.commit()
    await db.refresh(user)

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
    update_data = request.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    allowed_fields = {"name", "bio"}
    for field, value in update_data.items():
        if field in allowed_fields:
            setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return UserResponse.model_validate(user)


@router.delete("/me", response_model=SuccessResponse)
async def delete_me(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SuccessResponse:
    """Soft-delete current user account. Anonymizes name and clears personal data."""
    user.anonymize()

    await db.commit()
    return SuccessResponse(message="Account deleted")
