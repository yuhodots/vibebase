"""Authentication dependencies for FastAPI."""

import hmac
from datetime import UTC, datetime, timedelta

import jwt
from configs.base import settings
from db.base import get_db
from db.models.user import User
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

security = HTTPBearer(auto_error=True)
optional_security = HTTPBearer(auto_error=False)


async def verify_internal_secret(
    x_internal_secret: str = Header(..., description="Internal API shared secret"),
) -> None:
    """Verify that the request comes from a trusted internal service (e.g. NextAuth)."""
    if not hmac.compare_digest(x_internal_secret, settings.internal_api_secret):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal API secret",
        )


def create_access_token(user_id: int, role: str = "user") -> str:
    """Create a JWT access token for a user."""
    expire = datetime.now(UTC) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": str(user_id), "role": role, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


async def _get_user_by_id(db: AsyncSession, user_id: int) -> User:
    """Fetch user from DB by ID, raise 401 if not found or deleted."""
    result = await db.execute(select(User).where(User.id == user_id, User.is_active()))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the currently authenticated user. Raises 401 if not authenticated."""
    payload = _decode_token(credentials.credentials)
    user_id = int(payload["sub"])
    return await _get_user_by_id(db, user_id)


async def get_admin_user(
    user: User = Depends(get_current_user),
) -> User:
    """Get the current user, ensuring they have admin role. Raises 403 if not admin."""
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_security),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    """Get the current user if authenticated, None otherwise."""
    if credentials is None:
        return None
    try:
        payload = _decode_token(credentials.credentials)
        user_id = int(payload["sub"])
        result = await db.execute(select(User).where(User.id == user_id, User.is_active()))
        return result.scalar_one_or_none()
    except HTTPException:
        return None
