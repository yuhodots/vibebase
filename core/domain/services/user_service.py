"""User domain service.

Encapsulates the business rules around user identity and lifecycle:
OAuth upsert, profile updates, soft-delete with anonymization, and
admin-driven role changes.
"""

from db.models.user import User
from db.repositories.user_repository import UserRepository
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession


class UserService:
    """Business logic for the User aggregate.

    Instantiate per-request with a session from `get_db()`:

        service = UserService(db)
        user = await service.upsert_oauth(...)
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.users = UserRepository(db)

    # --- read ----------------------------------------------------------------

    async def list_paginated(
        self,
        *,
        page: int,
        limit: int,
        search: str | None = None,
        role: str | None = None,
    ) -> tuple[list[User], int]:
        return await self.users.list_paginated(page=page, limit=limit, search=search, role=role)

    async def count_active(self) -> int:
        return await self.users.count_active()

    # --- auth lifecycle ------------------------------------------------------

    async def upsert_oauth(
        self,
        *,
        provider: str,
        provider_id: str,
        email: str,
        name: str,
        image: str | None,
    ) -> User:
        """Upsert a user from an OAuth callback.

        - If a deleted user matches the provider tuple, refuse (410 Gone).
        - If an existing user matches, update mutable profile fields.
        - Otherwise, create a new user.
        """
        user = await self.users.get_by_provider(provider, provider_id)

        if user and user.deleted_at is not None:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="This account has been deleted",
            )

        if user:
            user.name = name
            user.image = image
        else:
            user = User(
                email=email,
                name=name,
                image=image,
                provider=provider,
                provider_id=provider_id,
            )
            self.users.add(user)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_profile(self, user: User, fields: dict) -> User:
        """Apply a filtered profile update. Caller must have pre-validated fields."""
        if not fields:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update",
            )

        allowed = {"name", "bio"}
        for key, value in fields.items():
            if key in allowed:
                setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_self(self, user: User) -> None:
        """Anonymize and soft-delete the authenticated user's own account."""
        user.anonymize()
        await self.db.commit()

    # --- admin ---------------------------------------------------------------

    async def update_role(self, user_id: int, role: str) -> User:
        user = await self.users.get_active_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.role = role
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_by_admin(self, user_id: int) -> None:
        user = await self.users.get_active_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.anonymize()
        await self.db.commit()
