"""Repository for the User aggregate."""

from api.utils.query_helpers import escape_like
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.user import User


class UserRepository:
    """Query helpers for `users` table.

    The repository never commits — callers (typically a Service) own the
    transaction boundary.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        """Return user by id regardless of soft-delete status."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_active_by_id(self, user_id: int) -> User | None:
        """Return user by id, excluding soft-deleted rows."""
        result = await self.db.execute(select(User).where(User.id == user_id, User.is_active()))
        return result.scalar_one_or_none()

    async def get_by_provider(self, provider: str, provider_id: str) -> User | None:
        """Return user by OAuth provider tuple regardless of soft-delete status."""
        result = await self.db.execute(
            select(User).where(
                User.provider == provider,
                User.provider_id == provider_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_paginated(
        self,
        *,
        page: int,
        limit: int,
        search: str | None = None,
        role: str | None = None,
    ) -> tuple[list[User], int]:
        """Return (users, total) for the given filters. Includes soft-deleted rows."""
        query = select(User)
        if search:
            safe = escape_like(search)
            query = query.where(User.name.ilike(f"%{safe}%") | User.email.ilike(f"%{safe}%"))
        if role:
            query = query.where(User.role == role)

        total = await self.db.scalar(select(func.count()).select_from(query.subquery())) or 0

        result = await self.db.execute(
            query.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit)
        )
        users = list(result.scalars().unique().all())
        return users, total

    async def count_active(self) -> int:
        """Count active (non-soft-deleted) users."""
        return await self.db.scalar(select(func.count(User.id)).where(User.is_active())) or 0

    def add(self, user: User) -> None:
        """Stage a new user to the session. Call `db.commit()` to persist."""
        self.db.add(user)
