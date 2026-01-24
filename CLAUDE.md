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
│   ├── utils/            # Utility functions
│   └── workflows/        # Background workflows
├── frontend/             # Frontend (Next.js)
│   └── src/
│       ├── app/          # Next.js App Router (with [locale])
│       ├── components/   # React components
│       ├── hooks/        # Custom React hooks
│       ├── providers/    # React context providers
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
