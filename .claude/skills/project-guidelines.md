---
name: project-guidelines
description: Vibebase project architecture, conventions, and development guidelines.
---

# Vibebase Project Guidelines

Project-specific conventions and architecture for vibebase.

## Architecture Overview

```
vibebase/
├── core/                    # Backend (Python/FastAPI)
│   ├── api/                 # FastAPI application
│   │   ├── main.py         # App entry point
│   │   ├── routers/        # API route handlers
│   │   └── dependencies/   # Dependency injection
│   ├── db/                  # Database layer
│   │   ├── models/         # SQLAlchemy ORM models
│   │   ├── ddl/            # SQL DDL scripts
│   │   └── alembic/        # Migrations
│   ├── domain/             # Business logic services
│   ├── schemas/            # Pydantic validation schemas
│   ├── configs/            # Configuration (pydantic-settings)
│   ├── clients/            # External API clients
│   ├── utils/              # Utility functions
│   └── tests/              # Backend tests
│
├── frontend/               # Frontend (Next.js/React)
│   └── src/
│       ├── app/            # Next.js App Router
│       │   └── [locale]/   # i18n routes (en, ko)
│       ├── components/     # React components
│       │   └── ui/         # Base UI (shadcn/ui)
│       ├── providers/      # Context providers
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utilities
│       ├── types/          # TypeScript types
│       └── i18n/           # Internationalization
│
├── docker-compose.yml      # Development containers
└── .github/workflows/      # CI/CD pipelines
```

## Tech Stack

### Backend

- **Framework**: FastAPI 0.104+
- **Python**: 3.11+
- **ORM**: SQLAlchemy 2.0+ (async)
- **Database**: PostgreSQL 16
- **Migrations**: Alembic
- **Validation**: Pydantic 2.5+
- **Package Manager**: uv

### Frontend

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **State Management**: TanStack Query v5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix)
- **i18n**: next-intl (en, ko)
- **Package Manager**: pnpm

## Code Patterns

### Service Layer Pattern (Backend)

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

    async def create(self, data: UserCreate) -> User:
        user = User(**data.model_dump())
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
```

### React Query Pattern (Frontend)

```typescript
// frontend/src/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/v1/users").then((r) => r.json()),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) =>
      fetch("/api/v1/users", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

## File Naming Conventions

### Backend (Python)

```
core/api/routers/users.py       # snake_case
core/domain/user_service.py     # snake_case
core/db/models/user.py          # snake_case
core/schemas/user.py            # snake_case
```

### Frontend (TypeScript)

```
components/user-card.tsx        # kebab-case
hooks/use-users.ts              # kebab-case with use- prefix
types/user.ts                   # kebab-case
lib/utils.ts                    # kebab-case
```

## Development Commands

### Backend

```bash
cd core
uv sync --frozen                        # Install dependencies
uv run uvicorn api.main:app --reload    # Start dev server
uv run alembic upgrade head             # Run migrations
uv run pytest                           # Run tests
uv run ruff check . && ruff format .    # Lint and format
```

### Frontend

```bash
cd frontend
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server
pnpm build                      # Production build
pnpm lint                       # ESLint
```

### Docker

```bash
docker-compose up -d            # Start all services
docker-compose up -d db         # Start only database
docker-compose down             # Stop all
```

## Environment Variables

### Backend (core/.env)

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=vibebase_app_user
DB_NAME=vibebase
DB_PASSWORD=password

APP_NAME=vibebase
ENVIRONMENT=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (frontend/.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Critical Rules

1. **Type Safety**: Always use type hints (Python) and TypeScript
2. **Immutability**: Never mutate objects/arrays directly
3. **Error Handling**: Use try/catch and proper HTTP status codes
4. **Input Validation**: Validate all inputs with Pydantic
5. **No Hardcoded Secrets**: Use environment variables
6. **Internationalization**: Externalize all user-facing strings

## API Documentation

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>
