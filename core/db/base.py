"""SQLAlchemy database configuration and base model."""

import ssl
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from typing import Any

from configs.db import db_settings
from sqlalchemy import DateTime, MetaData, func
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.pool import NullPool

# Naming convention for constraints
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base class for all database models."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)


class TimestampMixin:
    """Mixin for created_at and updated_at timestamps (UTC, DB server-side)."""

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class SoftDeleteMixin:
    """Mixin that adds soft-delete capability via a deleted_at timestamp."""

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )

    @classmethod
    def is_active(cls):
        """SQLAlchemy clause: WHERE deleted_at IS NULL."""
        return cls.deleted_at.is_(None)

    def soft_delete(self) -> None:
        """Mark this record as soft-deleted."""
        self.deleted_at = datetime.now(UTC)


def get_database_url() -> str:
    """Get async database URL from settings.

    Prefers `DATABASE_URL` (e.g. Neon, managed Postgres) when provided,
    otherwise assembles from individual host/port/user/name/password fields.
    """
    if db_settings.database_url:
        return db_settings.database_url
    return (
        f"postgresql+asyncpg://{db_settings.db_user}:{db_settings.db_password}"
        f"@{db_settings.db_host}:{db_settings.db_port}/{db_settings.db_name}"
    )


def _engine_kwargs() -> dict[str, Any]:
    """Engine kwargs optimized for the current environment.

    - Serverless / managed DBs (DATABASE_URL set): use NullPool. Connection
      pooling is delegated to the DB-side pooler (e.g. Neon, PgBouncer).
    - Local / long-running: use the default async pool with pre-ping.
    """
    if db_settings.database_url:
        return {"poolclass": NullPool}
    return {"pool_pre_ping": True, "pool_size": 5, "max_overflow": 10}


def _connect_args() -> dict[str, Any]:
    """Extra connect args — TLS for managed Postgres providers."""
    if db_settings.database_url:
        ctx = ssl.create_default_context()
        # Most managed providers (Neon, Supabase) are fine with default verification.
        # Loosen only if your provider requires it by overriding in your fork.
        return {"ssl": ctx}
    return {}


# Create async engine
engine = create_async_engine(
    get_database_url(),
    echo=db_settings.db_echo,
    connect_args=_connect_args(),
    **_engine_kwargs(),
)

# Create async session factory
async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
)


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Context manager for database session with rollback on error."""
    session = async_session()
    try:
        yield session
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session for FastAPI."""
    async with get_db_session() as session:
        yield session
