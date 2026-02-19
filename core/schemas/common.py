"""Common schemas shared across API endpoints."""

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelModel(BaseModel):
    """Base model with camelCase alias generation for frontend compatibility."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class DbModel(CamelModel):
    """CamelModel with ORM attribute reading enabled (for SQLAlchemy models)."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class PaginatedResponse(CamelModel, Generic[T]):
    """Generic paginated response."""

    items: list[T] = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items", ge=0)
    page: int = Field(..., description="Current page number", ge=1)
    limit: int = Field(..., description="Items per page", ge=1)


class SuccessResponse(CamelModel):
    """Generic success response."""

    success: bool = Field(True)
    message: str | None = Field(None)


def paginate(total: int, page: int, limit: int, items: list) -> dict:
    """Helper to build paginated response dict."""
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
    }
