"""Data-access repositories.

Repositories encapsulate query logic for a single aggregate/model.
They expose domain-friendly methods (e.g. `get_by_provider`) so that
higher-level services and API routers do not assemble SQLAlchemy queries
inline.
"""
