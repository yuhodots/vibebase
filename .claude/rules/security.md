# Security Guidelines

## Mandatory Security Checks

Before ANY commit:

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated (Pydantic/Zod)
- [ ] SQL injection prevention (SQLAlchemy ORM, no raw queries)
- [ ] XSS prevention (React auto-escaping, no dangerouslySetInnerHTML)
- [ ] Authentication/authorization verified
- [ ] Rate limiting on API endpoints
- [ ] Error messages don't leak sensitive data
- [ ] CORS properly configured (not "\*" in production)

## Secret Management

### Python

```python
# NEVER: Hardcoded secrets
api_key = "sk-proj-xxxxx"

# ALWAYS: Environment variables via pydantic-settings
from configs.base import settings

api_key = settings.openai_api_key

if not api_key:
    raise ValueError("OPENAI_API_KEY not configured")
```

### TypeScript

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx";

// ALWAYS: Environment variables
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

if (!apiKey) {
  throw new Error("API_KEY not configured");
}
```

## Input Validation

### Python (Pydantic)

```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)

@router.post("/users")
async def create_user(data: UserCreate):
    # Pydantic validates before this function is called
    pass
```

## SQL Injection Prevention

```python
# NEVER: String concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"

# ALWAYS: SQLAlchemy ORM
result = await db.execute(
    select(User).where(User.email == email)
)

# Or parameterized query
await db.execute(
    text("SELECT * FROM users WHERE email = :email"),
    {"email": email}
)
```

## Authentication Pattern

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    try:
        payload = jwt.decode(
            credentials.credentials,
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

## Security Response Protocol

If security issue found:

1. STOP immediately
2. Use `/code-review` command
3. Fix CRITICAL issues before continuing
4. Rotate any exposed secrets
5. Review entire codebase for similar issues
