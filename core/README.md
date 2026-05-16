# Vibebase Core

FastAPI backend for Vibebase.

## Setup

```bash
cd core
uv sync
```

## Run

```bash
uv run uvicorn api.main:app --reload
```

## Directory Structure

```
core/
├── api/                # FastAPI application
│   ├── main.py         # App entry point (lifespan, middleware, conditional docs)
│   ├── router.py       # Main router (registers auth + admin)
│   ├── rate_limit.py   # slowapi limiter
│   ├── routers/        # Route handlers
│   │   ├── auth.py     # /auth callback, me, update, delete
│   │   └── admin/      # /admin users, stats (admin-only)
│   ├── utils/          # Shared API utilities (query helpers)
│   └── dependencies/   # Dependency injection (auth)
├── clients/            # External API clients (OpenAI, Google, etc.)
├── configs/            # Environment and application settings
│   ├── base.py         # Base app settings
│   └── db.py           # Database settings
├── db/                 # Database layer
│   ├── base.py         # Base model, mixins, session factory
│   ├── models/         # SQLAlchemy models
│   ├── repositories/   # Data access (queries/persistence)
│   ├── ddl/            # DDL scripts
│   └── alembic/        # Migrations
├── domain/             # Business logic
│   └── services/       # Service layer (orchestrates repositories)
├── schemas/            # Pydantic schemas (request/response)
│   ├── common.py       # CamelModel, PaginatedResponse, SuccessResponse
│   └── api/            # API schemas (auth, admin)
├── enums/              # Enumerations
├── utils/              # Utility functions
├── crawlers/           # Web crawlers
├── resources/          # Static resources
│   └── prompts/        # LLM prompts
└── tests/              # Tests
```

## Database Migrations

```bash
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
uv run alembic downgrade -1
```

## Lint & Format

```bash
uv run ruff check .
uv run ruff format .
```
