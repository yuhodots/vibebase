# Vibebase

A base repository for quickly bootstrapping any service with Python FastAPI backend and Next.js frontend.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend**: Next.js 16, React 19, TypeScript, TailwindCSS, next-intl
- **Infrastructure**: Docker, Docker Compose, uv (Python), pnpm (Node.js)

## Project Structure

```
vibebase/
├── core/                 # Backend (FastAPI)
│   ├── api/              # API routes and dependencies
│   ├── configs/          # Configuration settings
│   ├── db/               # Database models and migrations (Alembic)
│   ├── domain/           # Business logic
│   ├── schemas/          # Pydantic schemas
│   ├── clients/          # External API clients
│   ├── crawlers/         # Web crawlers
│   └── utils/            # Utility functions
├── frontend/             # Frontend (Next.js)
│   └── src/
│       ├── app/          # Next.js App Router (with [locale])
│       │   ├── [locale]/
│       │   │   ├── (landing)/    # Public pages (landing, login)
│       │   │   └── (app)/        # Protected pages (dashboard)
│       │   └── api/auth/         # Auth.js API routes
│       ├── components/   # React components
│       │   ├── layout/   # Layout components (sidebar)
│       │   └── ui/       # UI components (button, etc.)
│       ├── hooks/        # Custom React hooks (use-auth)
│       ├── providers/    # React context providers (auth, theme, query)
│       ├── i18n/         # Internationalization (ko, en)
│       ├── lib/          # Utility libraries
│       └── types/        # TypeScript definitions
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

### Code Quality (root)

```bash
uv run ruff check .      # Lint
uv run ruff format .     # Format
```

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
DB_HOST=localhost
DB_PORT=5432
DB_USER=vibebase_app_user
DB_NAME=vibebase
DB_PASSWORD=password
```

## API

- Backend runs on `http://localhost:8000`
- API prefix: `/api/v1`
- Docs: `/docs` (Swagger), `/redoc` (ReDoc)

## Frontend

- Runs on `http://localhost:3000`
- Internationalization: Korean (ko), English (en)
- UI: shadcn/ui components with TailwindCSS

## Authentication (Auth.js v5)

Frontend handles all authentication via Auth.js with Google/Kakao OAuth.

### Setup

1. Copy `.env.local.example` to `.env.local`
2. Generate secret: `openssl rand -base64 32`
3. Configure OAuth providers:
   - Google: https://console.cloud.google.com/apis/credentials
   - Kakao: https://developers.kakao.com/console/app

### Callback URLs

```
Google: http://localhost:3000/api/auth/callback/google
Kakao: http://localhost:3000/api/auth/callback/kakao
```

### Protected Routes

Configure in `frontend/src/middleware.ts`:
- `/dashboard` - requires authentication
- `/settings` - requires authentication
