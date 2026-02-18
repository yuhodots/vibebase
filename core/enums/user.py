from enum import Enum


class UserRole(str, Enum):
    """User role."""

    USER = "user"
    ADMIN = "admin"
