# Vibebase

A base repository for quickly bootstrapping any service with Python FastAPI backend and Next.js frontend.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS, next-intl, Motion (Framer Motion)
- **Infrastructure**: Docker, Docker Compose, uv (Python), pnpm (Node.js)

## Project Structure

```
vibebase/
├── core/                 # Backend (FastAPI)
│   ├── api/              # API routes and dependencies
│   │   ├── main.py       # FastAPI app (lifespan, middleware, conditional docs)
│   │   ├── router.py     # Main router (registers all feature routers)
│   │   ├── rate_limit.py # Rate limiting config (slowapi)
│   │   ├── routers/      # Route handlers
│   │   │   ├── auth.py   # Auth (callback, me, update, delete)
│   │   │   └── admin/    # Admin endpoints (requires admin role)
│   │   │       ├── users.py  # User list, role update, soft-delete
│   │   │       └── stats.py  # Dashboard statistics
│   │   ├── utils/        # Shared API utilities
│   │   │   └── query_helpers.py # SQL helpers (escape_like)
│   │   └── dependencies/ # Dependency injection
│   │       └── auth.py   # JWT auth (get_current_user, get_admin_user, etc.)
│   ├── configs/          # Configuration settings (pydantic-settings)
│   │   ├── base.py       # App settings (JWT, CORS, internal secret)
│   │   └── db.py         # Database settings
│   ├── db/               # Database layer
│   │   ├── base.py       # Base model, mixins (Timestamp, SoftDelete), session
│   │   ├── models/       # SQLAlchemy models
│   │   │   └── user.py   # User model (OAuth, roles)
│   │   └── alembic/      # Migrations
│   │       ├── env.py    # Migration environment
│   │       └── versions/ # Migration files
│   ├── schemas/          # Pydantic schemas
│   │   ├── common.py     # CamelModel, PaginatedResponse, SuccessResponse
│   │   └── api/          # API-specific schemas
│   │       ├── auth.py   # Auth request/response schemas
│   │       └── admin.py  # Admin schemas (user list, role, stats)
│   ├── enums/            # Enum definitions
│   │   └── user.py       # UserRole (user, admin)
│   ├── domain/           # Business logic services
│   ├── clients/          # External API clients
│   ├── utils/            # Utility functions
│   └── tests/            # Tests
├── frontend/             # Frontend (Next.js)
│   └── src/
│       ├── app/          # Next.js App Router
│       │   ├── [locale]/ # Locale segment
│       │   │   ├── (landing)/  # Public pages (landing, login)
│       │   │   └── (app)/      # Protected pages (dashboard)
│       │   └── api/auth/       # Auth.js API routes
│       ├── auth.ts       # NextAuth config (Google, Kakao + backend token exchange)
│       ├── middleware.ts  # i18n + auth middleware
│       ├── components/   # React components
│       │   ├── landing/  # Landing page sections (hero, features, CTA, etc.)
│       │   ├── layout/   # Layout components (sidebar)
│       │   └── ui/       # UI primitives (shadcn/ui)
│       ├── hooks/        # Custom React hooks
│       │   └── use-auth.ts # Auth hook (session, role, backendToken)
│       ├── providers/    # Context providers (auth, theme, query)
│       ├── i18n/         # Internationalization (ko, en)
│       ├── lib/
│       │   ├── api/
│       │   │   └── client.ts # API client (auto auth token injection)
│       │   └── utils.ts  # Utility functions
│       └── types/        # TypeScript definitions
│           └── next-auth.d.ts # NextAuth type extensions
└── docker-compose.yml    # Docker orchestration
```

## Commands

### Backend (core/)

```bash
cd core
uv sync --frozen
uv run uvicorn api.main:app --reload
```

### Frontend (frontend/)

```bash
cd frontend
pnpm install
pnpm dev
```

### Docker

```bash
docker-compose up
```

### Database Migrations

```bash
cd core
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
uv run alembic downgrade -1
```

### Code Quality (root)

```bash
uv run ruff check .      # Lint
uv run ruff format .     # Format
```

## Database

### Mixins (`db/base.py`)

- **`TimestampMixin`**: `created_at`, `updated_at` — DB server-side defaults via `func.now()`, `DateTime(timezone=True)`
- **`SoftDeleteMixin`**: `deleted_at` column + `is_active()` classmethod + `soft_delete()` instance method
  - All queries must include `.where(Model.is_active())` to exclude soft-deleted records

### Session Management

- `get_db()`: FastAPI dependency — yields async session with auto-rollback on error
- `get_db_session()`: Context manager for non-FastAPI usage
- Connection pooling: `pool_size=5`, `max_overflow=10`, `pool_pre_ping=True`

### Naming Convention

Consistent constraint names via `NAMING_CONVENTION`: `ix_` (index), `uq_` (unique), `ck_` (check), `fk_` (foreign key), `pk_` (primary key)

## API

- Backend runs on `http://localhost:8000`
- API prefix: `/api/v1`
- Docs: `/docs` (Swagger), `/redoc` (ReDoc) — **development only**
- Rate limiting: slowapi (`api/rate_limit.py`), per-endpoint limits

### Endpoints

| Router | Prefix | Key Endpoints |
|--------|--------|---------------|
| auth | `/auth` | `POST /callback` (OAuth upsert), `GET /me`, `PUT /me`, `DELETE /me` |
| admin | `/admin` | `GET /users` (paginated, search, role filter), `PUT /users/{id}/role`, `DELETE /users/{id}`, `GET /stats` |

Admin endpoints require the `admin` role (enforced via `get_admin_user` dependency on the router).

### Schemas

- `CamelModel`: Base schema with automatic `snake_case` → `camelCase` conversion for JSON
- `PaginatedResponse[T]`: Generic paginated response
- `SuccessResponse`: Simple success message

## Authentication

### Flow: NextAuth ↔ Backend

1. User clicks OAuth provider (Google/Kakao) in frontend
2. NextAuth `signIn` callback calls backend `POST /api/v1/auth/callback` with `X-Internal-Secret` header
3. Backend upserts user, returns JWT token + role
4. NextAuth stores `backendToken`, `role`, `backendId` in JWT/session
5. Frontend API client auto-injects `Authorization: Bearer <token>` from session

### Backend Auth Dependencies

- `get_current_user()`: Requires valid JWT, returns `User`
- `get_admin_user()`: Requires admin role, returns 403 if not
- `get_optional_user()`: Returns `User | None` (no error on missing auth)
- `verify_internal_secret()`: HMAC header check for NextAuth callbacks

### User Roles

- `UserRole` enum: `user` (default), `admin`
- First admin must be set manually: `UPDATE users SET role='admin' WHERE email='...'`

### Protected Routes

Configure in `frontend/src/middleware.ts`:
- `/dashboard` - requires authentication
- `/settings` - requires authentication
- Set `AUTH_DISABLED=true` in `.env.local` to bypass auth during development

## Code Style

- Python: Ruff (line-length: 100), Pyright for type checking
- TypeScript: ESLint, Prettier
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`

## Environment Variables

Backend (`core/.env`):

```bash
APP_NAME=VIBEBASE CORE API
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=<required>                    # No default — must be set (≥32 chars in production)
INTERNAL_API_SECRET=<required>           # Shared secret for NextAuth → Backend calls
DB_HOST=localhost
DB_PORT=5432
DB_USER=vibebase_app_user
DB_NAME=vibebase
DB_PASSWORD=password
```

Frontend (`frontend/.env.local`):

```bash
AUTH_SECRET=<generate with openssl rand -base64 32>
AUTH_DISABLED=true                       # Bypass auth during development
NEXT_PUBLIC_API_URL=http://localhost:8000 # Backend URL
INTERNAL_API_SECRET=<must match backend> # Shared secret
AUTH_GOOGLE_ID=                          # Google OAuth
AUTH_GOOGLE_SECRET=
AUTH_KAKAO_ID=                           # Kakao OAuth
AUTH_KAKAO_SECRET=
```

### Callback URLs

```
Google: http://localhost:3000/api/auth/callback/google
Kakao: http://localhost:3000/api/auth/callback/kakao
```

## Frontend

- Runs on `http://localhost:3000`
- Internationalization: Korean (ko), English (en)
- UI: shadcn/ui components with TailwindCSS
- Dark/light mode via next-themes
- React Query for server state management

### API Client (`lib/api/client.ts`)

- `apiClient.get/post/put/delete` with typed responses
- Auto-injects `Authorization: Bearer <token>` from NextAuth session
- Returns `ApiResponse<T>` with `success`, `data`, `error`, `statusCode`
