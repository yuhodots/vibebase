# Refactor Clean

Safely identify and remove dead code with test verification:

## Analysis Tools

### Backend (Python)

```bash
# Find unused imports and code (from project root)
uv run ruff check --select F401,F841 .

# Type check for unused variables (from project root)
uv run pyright
```

### Frontend (TypeScript)

```bash
cd frontend
# Find unused exports
npx knip
# Or use ESLint rules
pnpm lint
```

## Generate Report

Create comprehensive report in `.reports/dead-code-analysis.md`

## Categorize findings by severity

- **SAFE**: Test files, unused utilities, commented code
- **CAUTION**: API routes, React components, hooks
- **DANGER**: Config files, main entry points, shared utilities

## Propose safe deletions only

## Before each deletion

1. Run full test suite
2. Verify tests pass
3. Apply change
4. Re-run tests
5. Rollback if tests fail

## Show summary of cleaned items

Never delete code without running tests first!
