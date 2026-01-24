# Build and Fix

Incrementally fix TypeScript, Python, and build errors:

## Backend (Python/FastAPI)

1. Run type check: `uv run pyright` (from project root)
2. Run lint: `uv run ruff check .` (from project root)
3. Parse error output and group by file

## Frontend (Next.js)

1. Run build: `cd frontend && pnpm build`
2. Run lint: `cd frontend && pnpm lint`
3. Parse error output and group by file

## For each error:
- Show error context (5 lines before/after)
- Explain the issue
- Propose fix
- Apply fix
- Re-run check
- Verify error resolved

## Stop if:
- Fix introduces new errors
- Same error persists after 3 attempts
- User requests pause

## Show summary:
- Errors fixed
- Errors remaining
- New errors introduced

Fix one error at a time for safety!
