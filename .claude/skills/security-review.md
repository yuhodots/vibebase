---
name: security-review
description: Security review checklist for authentication, user input, secrets, API endpoints, and sensitive features.
---

# Security Review Skill

Security best practices and vulnerability prevention for vibebase.

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Storing or transmitting sensitive data

## Security Checklist

### 1. Secrets Management

#### NEVER Do This

```python
# Hardcoded secrets
api_key = "sk-proj-xxxxx"
db_password = "password123"
```

#### ALWAYS Do This

```python
# core/configs/base.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    db_password: str
    jwt_secret: str

    model_config = {"env_file": ".env"}

settings = Settings()

# Verify secrets exist
if not settings.openai_api_key:
    raise ValueError("OPENAI_API_KEY not configured")
```

#### Verification Steps

- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env` files in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets in hosting platform

### 2. Input Validation

#### Pydantic Validation (Backend)

```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=150)

@router.post("/users")
async def create_user(data: UserCreate):
    # Pydantic validates before this function is called
    return await user_service.create(data)
```

#### File Upload Validation

```python
from fastapi import UploadFile, HTTPException

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5MB

async def validate_file_upload(file: UploadFile):
    # Type check
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Invalid file type")

    # Size check
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, "File too large (max 5MB)")

    # Reset file position
    await file.seek(0)
    return True
```

### 3. SQL Injection Prevention

#### NEVER Concatenate SQL

```python
# DANGEROUS - SQL Injection vulnerability
query = f"SELECT * FROM users WHERE email = '{user_email}'"
await db.execute(query)
```

#### ALWAYS Use Parameterized Queries

```python
# Safe - SQLAlchemy ORM
from sqlalchemy import select

result = await db.execute(
    select(User).where(User.email == user_email)
)

# Safe - Raw SQL with parameters
await db.execute(
    text("SELECT * FROM users WHERE email = :email"),
    {"email": user_email}
)
```

### 4. Authentication & Authorization

#### JWT Token Validation

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

#### Authorization Checks

```python
async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, admin: dict = Depends(require_admin)):
    # Only admins can reach here
    pass
```

### 5. XSS Prevention

#### Frontend - React Auto-escaping

```typescript
// React automatically escapes this - safe
const UserName = ({ name }: { name: string }) => {
  return <div>{name}</div>  // XSS-safe
}

// DANGEROUS - avoid unless absolutely necessary
const RawHTML = ({ html }: { html: string }) => {
  // Sanitize with DOMPurify if you must use dangerouslySetInnerHTML
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

### 6. CORS Configuration

```python
# core/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],  # Not "*" in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)
```

### 7. Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/search")
@limiter.limit("10/minute")
async def search(request: Request, query: str):
    # Limited to 10 requests per minute per IP
    pass
```

### 8. Sensitive Data Exposure

#### Logging

```python
# WRONG: Logging sensitive data
logger.info(f"User login: {email}, password: {password}")

# CORRECT: Redact sensitive data
logger.info(f"User login: {email}, user_id: {user.id}")
```

#### Error Messages

```python
# WRONG: Exposing internal details
except Exception as e:
    raise HTTPException(500, str(e))

# CORRECT: Generic error messages
except Exception as e:
    logger.error(f"Internal error: {e}")
    raise HTTPException(500, "An error occurred")
```

### 9. Dependency Security

```bash
# Check for vulnerabilities
pip-audit

# Update dependencies
uv sync --upgrade

# Frontend
npm audit
npm audit fix
```

## Pre-Deployment Security Checklist

Before ANY production deployment:

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated with Pydantic
- [ ] **SQL Injection**: All queries use ORM or parameterized
- [ ] **XSS**: User content properly escaped
- [ ] **Authentication**: JWT tokens validated
- [ ] **Authorization**: Role checks in place
- [ ] **Rate Limiting**: Enabled on API endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **CORS**: Properly configured (not "\*")
- [ ] **Error Handling**: No sensitive data in errors
- [ ] **Logging**: No sensitive data logged
- [ ] **Dependencies**: Up to date, no vulnerabilities

## Security Testing

```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_requires_authentication(client: AsyncClient):
    response = await client.get("/api/v1/protected")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_requires_admin_role(client: AsyncClient, user_token: str):
    response = await client.delete(
        "/api/v1/admin/resource",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_rejects_invalid_input(client: AsyncClient):
    response = await client.post(
        "/api/v1/users",
        json={"email": "not-an-email"}
    )
    assert response.status_code == 422
```

**Remember**: Security is not optional. One vulnerability can compromise the entire platform.
