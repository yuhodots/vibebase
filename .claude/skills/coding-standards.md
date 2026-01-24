---
name: coding-standards
description: Universal coding standards for Python (FastAPI) and TypeScript (Next.js) development.
---

# Coding Standards & Best Practices

Universal coding standards for vibebase project.

## Code Quality Principles

### 1. Readability First

- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments

### 2. KISS (Keep It Simple)

- Simplest solution that works
- Avoid over-engineering
- No premature optimization

### 3. DRY (Don't Repeat Yourself)

- Extract common logic into functions
- Create reusable components

### 4. YAGNI (You Aren't Gonna Need It)

- Don't build features before they're needed

## Python Standards (Backend)

### Naming Conventions

```python
# Variables: snake_case
search_query = "test"
is_authenticated = True

# Functions: snake_case
async def fetch_user_data(user_id: int) -> User:
    pass

# Classes: PascalCase
class UserService:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_RETRIES = 3
DEFAULT_PAGE_SIZE = 20
```

### Type Hints (Required)

```python
from typing import Optional

async def get_user(user_id: int) -> Optional[User]:
    """Get user by ID."""
    pass

def calculate_score(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0
```

### Pydantic Models

```python
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=255)

    model_config = {"str_strip_whitespace": True}

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}
```

### Error Handling

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

### Async/Await

```python
import asyncio

async def fetch_dashboard_data(user_id: int):
    users, stats, notifications = await asyncio.gather(
        fetch_users(user_id),
        fetch_stats(user_id),
        fetch_notifications(user_id)
    )
    return {"users": users, "stats": stats, "notifications": notifications}
```

## TypeScript Standards (Frontend)

### Variable Naming

```typescript
// camelCase for variables
const searchQuery = "test";
const isAuthenticated = true;

// PascalCase for types/interfaces
interface UserData {
  id: string;
  name: string;
  status: "active" | "inactive";
}
```

### Function Naming

```typescript
// Verb-noun pattern
async function fetchUserData(userId: string): Promise<User> {}
function calculateScore(values: number[]): number {}
function isValidEmail(email: string): boolean {}
```

### Immutability Pattern

```typescript
// ALWAYS use spread operator
const updatedUser = { ...user, name: "New Name" };
const updatedArray = [...items, newItem];

// NEVER mutate directly
user.name = "New Name"; // BAD
items.push(newItem); // BAD
```

### Type Safety

```typescript
// GOOD: Proper types
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {}

// BAD: Using 'any'
function getUser(id: any): Promise<any> {}
```

## React Best Practices

### Component Structure

```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn('btn', `btn-${variant}`)}
    >
      {children}
    </button>
  )
}
```

### State Management

```typescript
const [count, setCount] = useState(0);

// Functional update for state based on previous state
setCount((prev) => prev + 1);

// NOT this (can be stale)
setCount(count + 1);
```

### Conditional Rendering

```typescript
// GOOD: Clear conditional rendering
{isPending && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// BAD: Ternary hell
{isPending ? <Spinner /> : error ? <ErrorMessage /> : data ? <DataDisplay /> : null}
```

## Code Smell Detection

### 1. Long Functions

```python
# BAD: Function > 50 lines

# GOOD: Split into smaller functions
def process_data():
    validated = validate_data()
    transformed = transform_data(validated)
    return save_data(transformed)
```

### 2. Deep Nesting

```python
# BAD: 5+ levels of nesting
if user:
    if user.is_admin:
        if item:
            if item.is_active:
                pass

# GOOD: Early returns
if not user:
    return
if not user.is_admin:
    return
if not item or not item.is_active:
    return
# Do something
```

### 3. Magic Numbers

```python
# BAD
if retry_count > 3:
    pass

# GOOD
MAX_RETRIES = 3
if retry_count > MAX_RETRIES:
    pass
```
