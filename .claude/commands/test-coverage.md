# Test Coverage

Analyze test coverage and generate missing tests:

## Backend (Python)

1. Run tests with coverage:
```bash
cd core
uv run pytest --cov=. --cov-report=html --cov-report=json
```

2. Analyze coverage report (htmlcov/index.html, coverage.json)

3. Identify files below 80% coverage threshold

## Frontend (TypeScript)

1. Run tests with coverage:
```bash
cd frontend
pnpm test:coverage
```

2. Analyze coverage report

## For each under-covered file:
- Analyze untested code paths
- Generate unit tests for functions
- Generate integration tests for APIs
- Generate E2E tests for critical flows

## Verify new tests pass

## Show before/after coverage metrics

## Ensure project reaches 80%+ overall coverage

## Focus on:
- Happy path scenarios
- Error handling
- Edge cases (null, undefined, empty)
- Boundary conditions
- API response validation (Pydantic)
- React component rendering
- Hook behavior
