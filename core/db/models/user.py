"""User database model."""

import uuid

from sqlalchemy import Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from db.base import Base, SoftDeleteMixin, TimestampMixin


class User(Base, TimestampMixin, SoftDeleteMixin):
    """User database model.

    Represents an authenticated user via OAuth (Google, Kakao).
    """

    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("provider", "provider_id", name="uq_users_provider_provider_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    image: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    provider: Mapped[str] = mapped_column(String(20), nullable=False)
    provider_id: Mapped[str] = mapped_column(String(255), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="user", server_default="user"
    )

    def anonymize(self) -> None:
        """Anonymize personal data and soft-delete the user."""
        anonymous_id = uuid.uuid4().hex[:8]
        self.email = f"deleted_{anonymous_id}@anonymized.local"
        self.name = f"user{anonymous_id}"
        self.image = None
        self.bio = None
        self.soft_delete()

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', provider='{self.provider}')>"
