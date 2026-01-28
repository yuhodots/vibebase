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
│   ├── main.py         # App entry point
│   ├── router.py       # Main router
│   ├── routers/        # Route handlers
│   └── dependencies/   # Dependency injection
├── clients/            # External API clients (OpenAI, Google, etc.)
├── configs/            # Environment and application settings
│   ├── base.py         # Base app settings
│   └── db.py           # Database settings
├── db/                 # Database layer
│   ├── models/         # SQLAlchemy models
│   ├── ddl/            # DDL scripts
│   └── alembic/        # Migrations
├── domain/             # Core business logic
├── schemas/            # Pydantic schemas (request/response)
├── enums/              # Enumerations
├── utils/              # Utility functions
├── crawlers/           # Web crawlers
├── resources/          # Static resources
│   └── prompts/        # LLM prompts
└── tests/              # Tests
```
