# Common Patterns

## API Response Format

### Backend (Python)

```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

# Usage
return ApiResponse(success=True, data=result)
return ApiResponse(success=False, error="Not found")
```

### Frontend (TypeScript)

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Service Layer Pattern

```python
# core/domain/user.py
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

## Custom Hooks Pattern (React)

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

## React Query Pattern

```typescript
// Query
const { data, isPending, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/v1/users").then((r) => r.json()),
  staleTime: 5 * 60 * 1000,
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) =>
    fetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

## Dependency Injection Pattern

```python
# core/api/dependencies/db.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Usage in router
@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    return await service.list()
```

## Error Boundary Pattern (React)

```typescript
// frontend/src/app/[locale]/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```
