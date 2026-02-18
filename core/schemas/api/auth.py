"""Auth API request/response schemas."""

from datetime import datetime
from typing import Literal

from pydantic import EmailStr, Field

from schemas.common import CamelModel


class AuthCallbackRequest(CamelModel):
    """OAuth callback request from NextAuth."""

    provider: Literal["google", "kakao"] = Field(..., description="OAuth provider")
    provider_id: str = Field(
        ..., min_length=1, max_length=255, description="OAuth provider user ID"
    )
    email: EmailStr = Field(..., description="User email")
    name: str = Field(..., min_length=1, max_length=100, description="Display name")
    image: str | None = Field(None, max_length=2048, description="Profile image URL")


class AuthCallbackResponse(CamelModel):
    """OAuth callback response with JWT token."""

    id: int
    email: str
    name: str
    image: str | None = None
    role: str = Field("user", description="User role (user/admin)")
    token: str = Field(..., description="JWT access token")


class UserResponse(CamelModel):
    """User profile response."""

    model_config = CamelModel.model_config.copy()
    model_config["from_attributes"] = True

    id: int
    email: str
    name: str
    image: str | None = None
    provider: str
    role: str = "user"
    bio: str | None = None
    created_at: datetime


class UserUpdateRequest(CamelModel):
    """User profile update request."""

    name: str | None = Field(None, min_length=1, max_length=100)
    bio: str | None = Field(None, max_length=500)
