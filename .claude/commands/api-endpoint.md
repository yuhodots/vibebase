# API Endpoint

Create a new FastAPI endpoint following project conventions:

## Endpoint Structure

```
core/api/routers/
├── __init__.py
└── {resource}.py     # e.g., users.py, items.py
```

## Template

```python
# core/api/routers/{resource}.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies.db import get_db
from schemas.{resource} import {Resource}Create, {Resource}Response
from domain.{resource} import {Resource}Service

router = APIRouter(prefix="/{resources}", tags=["{resources}"])


@router.get("/", response_model=list[{Resource}Response])
async def list_{resources}(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all {resources}."""
    service = {Resource}Service(db)
    return await service.list(skip=skip, limit=limit)


@router.get("/{id}", response_model={Resource}Response)
async def get_{resource}(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific {resource}."""
    service = {Resource}Service(db)
    result = await service.get(id)
    if not result:
        raise HTTPException(status_code=404, detail="{Resource} not found")
    return result


@router.post("/", response_model={Resource}Response, status_code=status.HTTP_201_CREATED)
async def create_{resource}(
    data: {Resource}Create,
    db: AsyncSession = Depends(get_db),
):
    """Create a new {resource}."""
    service = {Resource}Service(db)
    return await service.create(data)
```

## Register Router

Add to `core/api/router.py`:
```python
from api.routers import {resource}

api_router.include_router({resource}.router)
```

## Required Files

1. **Schema**: `core/schemas/{resource}.py` - Pydantic models
2. **Service**: `core/domain/{resource}.py` - Business logic
3. **Model**: `core/db/models/{resource}.py` - SQLAlchemy model
4. **Tests**: `core/tests/test_api/test_{resource}.py`

## Checklist

- [ ] Pydantic schema with validation
- [ ] SQLAlchemy model with proper relationships
- [ ] Service layer with business logic
- [ ] Router with CRUD endpoints
- [ ] Proper error handling (HTTPException)
- [ ] Input validation
- [ ] Authentication/Authorization (if needed)
- [ ] Unit tests for service
- [ ] Integration tests for endpoints
- [ ] API documentation (docstrings)
