# Coding Style

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate:

### Python

```python
# WRONG: Mutation
def update_user(user: dict, name: str) -> dict:
    user["name"] = name  # MUTATION!
    return user

# CORRECT: Immutability
def update_user(user: dict, name: str) -> dict:
    return {**user, "name": name}
```

### TypeScript

```typescript
// WRONG: Mutation
function updateUser(user: User, name: string) {
  user.name = name; // MUTATION!
  return user;
}

// CORRECT: Immutability
function updateUser(user: User, name: string) {
  return { ...user, name };
}
```

## File Organization

MANY SMALL FILES > FEW LARGE FILES:

- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large modules
- Organize by feature/domain, not by type

## Error Handling

### Python (FastAPI)

```python
from fastapi import HTTPException, status

async def get_user(user_id: int) -> User:
    user = await db.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found"
        )
    return user
```

### TypeScript

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Operation failed:", error);
  throw new Error("User-friendly message");
}
```

## Input Validation

### Python (Pydantic)

```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=150)
```

### TypeScript (Zod)

```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

const validated = schema.parse(input);
```

## Code Quality Checklist

Before marking work complete:

- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No console.log/print statements in production
- [ ] No hardcoded values (use constants)
- [ ] No mutation (immutable patterns used)
- [ ] Type hints (Python) / TypeScript types used
