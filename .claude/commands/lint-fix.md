# Lint and Fix

Run linters and automatically fix issues:

## Backend (Python)

### Ruff (Linting + Formatting)
```bash
# From project root (recommended)
uv run ruff check .
uv run ruff check --fix .
uv run ruff format .

# Or from core directory
cd core
uv run ruff check .
uv run ruff check --fix .
uv run ruff format .
```

### Type Checking
```bash
# From project root (pyright configured in root pyproject.toml)
uv run pyright

# MyPy (alternative, from project root)
uv run mypy core
```

## Frontend (TypeScript)

### ESLint
```bash
cd frontend

# Check for issues
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### TypeScript Check
```bash
cd frontend
pnpm tsc --noEmit
```

## Full Project Check

Run all linters in sequence:

```bash
# Backend (from project root)
uv run ruff check --fix . && uv run ruff format .

# Frontend
cd frontend && pnpm lint --fix && pnpm tsc --noEmit
```

## Pre-commit Workflow

Before committing, run:

1. `uv run ruff check --fix . && uv run ruff format .`
2. `cd frontend && pnpm lint --fix`
3. `cd frontend && pnpm tsc --noEmit`

## CI/CD

GitHub Actions runs Ruff automatically on push/PR.
See: `.github/workflows/ruff.yml`

## Common Issues

### Import sorting
```bash
uv run ruff check --select I --fix .
```

### Unused imports
```bash
uv run ruff check --select F401 --fix .
```

### Line length
```bash
# Configured to 100 chars in pyproject.toml
uv run ruff format .
```
