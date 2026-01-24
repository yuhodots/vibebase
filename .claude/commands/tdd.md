---
description: Enforce test-driven development workflow. Write tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.
---

# TDD Command

Enforce test-driven development methodology.

## What This Command Does

1. **Define Interfaces** - Define types/interfaces first
2. **Generate Tests First** - Write failing tests (RED)
3. **Implement Minimal Code** - Write just enough to pass (GREEN)
4. **Refactor** - Improve code while keeping tests green (REFACTOR)
5. **Verify Coverage** - Ensure 80%+ test coverage

## TDD Cycle

```
RED -> GREEN -> REFACTOR -> REPEAT

RED:      Write a failing test
GREEN:    Write minimal code to pass
REFACTOR: Improve code, keep tests passing
REPEAT:   Next feature/scenario
```

## Backend (Python/FastAPI)

### Test Framework Setup
```bash
cd core
uv add --dev pytest pytest-asyncio pytest-cov httpx
```

### Test Structure
```
core/tests/
├── conftest.py          # Fixtures
├── test_api/            # API endpoint tests
├── test_domain/         # Business logic tests
└── test_db/             # Database model tests
```

### Run Tests
```bash
cd core
uv run pytest --cov=. --cov-report=html
```

## Frontend (Next.js/React)

### Test Framework Setup
```bash
cd frontend
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Test Structure
```
frontend/src/
├── __tests__/           # Test files
├── components/
│   └── ui/
│       └── button.test.tsx
└── hooks/
    └── useExample.test.ts
```

### Run Tests
```bash
cd frontend
pnpm test
pnpm test:coverage
```

## TDD Best Practices

**DO:**
- Write the test FIRST, before any implementation
- Run tests and verify they FAIL before implementing
- Write minimal code to make tests pass
- Refactor only after tests are green
- Add edge cases and error scenarios
- Aim for 80%+ coverage (100% for critical code)

**DON'T:**
- Write implementation before tests
- Skip running tests after each change
- Write too much code at once
- Ignore failing tests
- Test implementation details (test behavior)

## Coverage Requirements

- **80% minimum** for all code
- **100% required** for:
  - Financial calculations
  - Authentication logic
  - Security-critical code
  - Core business logic

## Integration with Other Commands

- Use `/plan` first to understand what to build
- Use `/tdd` to implement with tests
- Use `/build-fix` if build errors occur
- Use `/code-review` to review implementation
