"""Shared SQL query helper functions."""

import re


def escape_like(value: str) -> str:
    """Escape SQL LIKE wildcard characters."""
    return re.sub(r"([%_\\])", r"\\\1", value)
