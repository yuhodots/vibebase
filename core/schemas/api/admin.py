"""Admin API request/response schemas."""

from datetime import datetime
from typing import Literal

from schemas.common import CamelModel, DbModel


class AdminUserResponse(DbModel):
    """User response for admin view."""

    id: int
    email: str
    name: str
    image: str | None = None
    provider: str
    role: str = "user"
    bio: str | None = None
    created_at: datetime
    deleted_at: datetime | None = None


class AdminUserRoleRequest(CamelModel):
    """Request to update a user's role."""

    role: Literal["user", "admin"]


class AdminDashboardStats(CamelModel):
    """Dashboard statistics for admin view."""

    total_users: int = 0
