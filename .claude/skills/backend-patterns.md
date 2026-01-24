---
name: backend-patterns
description: Backend architecture patterns for FastAPI, SQLAlchemy, and Python async development.
---

# Backend Development Patterns

Backend architecture patterns for vibebase FastAPI application.

## API Design Patterns

### RESTful API Structure

```python
# Resource-based URLs
GET    /api/v1/users              # List resources
GET    /api/v1/users/{id}         # Get single resource
POST   /api/v1/users              # Create resource
PUT    /api/v1/users/{id}         # Replace resource
PATCH  /api/v1/users/{id}         # Update resource
DELETE /api/v1/users/{id}         # Delete resource

# Query parameters for filtering, sorting, pagination
GET /api/v1/users?status=active&sort=created_at&limit=20&offset=0
```

### Router Pattern

```python
# core/api/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.dependencies.db import get_db
from schemas.user import UserCreate, UserResponse
from domain.user import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all users."""
    service = UserService(db)
    return await service.list(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific user."""
    service = UserService(db)
    result = await service.get(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result
```

### Service Layer Pattern

```python
# core/domain/user.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.models.user import User
from schemas.user import UserCreate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.db.execute(
            select(User).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def get(self, user_id: int) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: UserCreate) -> User:
        user = User(**data.model_dump())
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
```

### Dependency Injection

```python
# core/api/dependencies/db.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from configs.db import async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
```

## Database Patterns

### SQLAlchemy Async Session

```python
# core/configs/db.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from configs.base import settings

DATABASE_URL = (
    f"postgresql+asyncpg://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)

engine = create_async_engine(DATABASE_URL, echo=settings.db_echo)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)
```

### Query Optimization

```python
# GOOD: Select only needed columns
result = await db.execute(
    select(User.id, User.name, User.email)
    .where(User.is_active == True)
    .order_by(User.created_at.desc())
    .limit(10)
)

# BAD: Select everything
result = await db.execute(select(User))
```

### N+1 Query Prevention

```python
from sqlalchemy.orm import selectinload

# BAD: N+1 query problem
users = await db.execute(select(User))
for user in users.scalars():
    print(user.posts)  # N additional queries

# GOOD: Eager loading
users = await db.execute(
    select(User).options(selectinload(User.posts))
)
```

### Transaction Pattern

```python
async def create_user_with_profile(
    db: AsyncSession,
    user_data: UserCreate,
    profile_data: ProfileCreate,
) -> User:
    async with db.begin():
        user = User(**user_data.model_dump())
        db.add(user)
        await db.flush()  # Get user.id

        profile = Profile(user_id=user.id, **profile_data.model_dump())
        db.add(profile)

    await db.refresh(user)
    return user
```

## Error Handling Patterns

### Custom Exceptions

```python
# core/utils/exceptions.py
from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    def __init__(self, resource: str, resource_id: int | str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with id {resource_id} not found"
        )


class ValidationError(HTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
```

### Global Exception Handler

```python
# core/api/main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

app = FastAPI()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )
```

## Authentication Patterns

### JWT Token Validation

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from configs.base import settings

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
```

## Response Format

```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
```
