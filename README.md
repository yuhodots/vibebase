# Vibebase

A base repository for quickly bootstrapping any service.

Here is a preview image of the Vibebase project.

![Vibebase Preview](./.assets/preview.png)

## Project Structure

```
vibebase/
├── core/               # Python FastAPI backend
├── frontend/           # Next.js frontend
└── hooks/              # Hooks for claude code
```

## Quick Start

### Backend

```bash
cd core
uv sync --frozen
uv run uvicorn api.main:app --reload
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Tech Stack

### Backend (core/)

- Python 3.11+
- FastAPI
- SQLAlchemy + Alembic
- PostgreSQL
- Pydantic

### Frontend (frontend/)

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl (i18n)
- next-themes (dark mode)
- React Query
