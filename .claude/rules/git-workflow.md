# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `test`: Adding tests
- `chore`: Maintenance
- `perf`: Performance improvement
- `ci`: CI/CD changes

Examples:

```
feat: add user authentication endpoint
fix: resolve database connection timeout
refactor: extract validation logic to separate module
```

## Branch Naming

```
<type>/<short-description>
```

Examples:

- `feat/user-auth`
- `fix/db-timeout`
- `refactor/validation-logic`

## Pull Request Workflow

When creating PRs:

1. Analyze full commit history (not just latest commit)
2. Use `git diff main...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

## Feature Implementation Workflow

1. **Plan First**
   - Use `/plan` command for complex features
   - Identify dependencies and risks
   - Break down into phases

2. **TDD Approach**
   - Use `/tdd` command
   - Write tests first (RED)
   - Implement to pass tests (GREEN)
   - Refactor (IMPROVE)
   - Verify 80%+ coverage

3. **Code Review**
   - Use `/code-review` command after writing code
   - Address CRITICAL and HIGH issues
   - Fix MEDIUM issues when possible

4. **Lint and Format**
   - Backend: `ruff check --fix . && ruff format .`
   - Frontend: `pnpm lint --fix`

5. **Commit & Push**
   - Detailed commit messages
   - Follow conventional commits format

## Pre-Commit Checklist

- [ ] All tests passing
- [ ] Lint checks passing
- [ ] Type checks passing
- [ ] No hardcoded secrets
- [ ] Meaningful commit message
