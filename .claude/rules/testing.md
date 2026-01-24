# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (ALL required):

1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows

## Test-Driven Development

MANDATORY workflow:

1. Write test first (RED)
2. Run test - it should FAIL
3. Write minimal implementation (GREEN)
4. Run test - it should PASS
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

## Backend Testing (Python)

### Setup

```bash
cd core
uv add --dev pytest pytest-asyncio pytest-cov httpx
```

### Run Tests

```bash
cd core
uv run pytest                           # Run all tests
uv run pytest --cov=. --cov-report=html # With coverage
uv run pytest tests/test_api/           # Specific directory
```

### Test Structure

```python
import pytest
from httpx import AsyncClient

@pytest.fixture
async def client(app):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_list_users(client: AsyncClient):
    response = await client.get("/api/v1/users")
    assert response.status_code == 200
    assert response.json()["success"] is True
```

## Frontend Testing (TypeScript)

### Setup

```bash
cd frontend
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Run Tests

```bash
cd frontend
pnpm test              # Run all tests
pnpm test:coverage     # With coverage
```

### Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Test File Organization

```
core/tests/
├── conftest.py              # Fixtures
├── test_api/                # API endpoint tests
│   └── test_users.py
├── test_domain/             # Service layer tests
│   └── test_user_service.py
└── test_db/                 # Database model tests
    └── test_user_model.py

frontend/src/
├── components/
│   └── button/
│       ├── button.tsx
│       └── button.test.tsx  # Co-located test
└── __tests__/               # Integration tests
    └── api.test.ts
```

## Coverage Requirements

- **80% minimum** for all code
- **100% required** for:
  - Authentication logic
  - Security-critical code
  - Core business logic
  - Financial calculations

## Troubleshooting Test Failures

1. Use `/tdd` command
2. Check test isolation (each test should be independent)
3. Verify mocks are correct
4. Fix implementation, not tests (unless tests are wrong)
