# Vibebase

A base repository for quickly bootstrapping any service.

![Vibebase Preview](./.assets/preview.png)

## Quick Start

### Backend

```bash
cd core
uv sync --frozen
uv run uvicorn api.main:app --reload
```

### Frontend

If you want to run the frontend without authentication, you can handle it through the `AUTH_DISABLED` env variable in `frontend/.env.local`.

```bash
cd frontend
pnpm install
pnpm dev
```

### Docker

```bash
docker-compose up
```

## Claude Code Setup

The `.claude/` directory contains Claude Code configurations tailored for this project.
Based on [everything-claude-code](https://github.com/yuhodots/everything-claude-code), adapted for Vibebase's FastAPI + Next.js stack.

### Directory Structure

```
.claude/
├── commands/     # Slash commands for common workflows
├── skills/       # Reusable knowledge and patterns
├── rules/        # Always-follow guidelines
└── agents/       # Specialized sub-agents
```

### Commands

Commands are quick executable prompts invoked with `/command-name`:

| Command           | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `/plan`           | Create implementation plan before coding (waits for confirmation) |
| `/tdd`            | Test-driven development workflow (RED → GREEN → REFACTOR)         |
| `/code-review`    | Security and quality review of uncommitted changes                |
| `/build-fix`      | Incrementally fix TypeScript/Python build errors                  |
| `/lint-fix`       | Run Ruff/ESLint and auto-fix issues                               |
| `/test-coverage`  | Analyze coverage and generate missing tests                       |
| `/refactor-clean` | Identify and remove dead code safely                              |
| `/api-endpoint`   | FastAPI endpoint creation template                                |
| `/component`      | React component creation template                                 |
| `/db-migrate`     | Alembic database migration guide                                  |
| `/i18n-add`       | Add internationalization translations (en/ko)                     |

```
/plan Add user authentication with JWT
```

### Skills

Skills are comprehensive knowledge documents that Claude references automatically based on context:

| Skill                | When Referenced                                     |
| -------------------- | --------------------------------------------------- |
| `coding-standards`   | Writing any Python or TypeScript code               |
| `backend-patterns`   | Working on FastAPI, SQLAlchemy, async Python        |
| `frontend-patterns`  | Working on Next.js, React, TanStack Query           |
| `security-review`    | Handling auth, secrets, user input, APIs            |
| `project-guidelines` | Understanding Vibebase architecture and conventions |

### Rules

Rules are always-follow guidelines applied to every interaction:

| Rule           | Purpose                                             |
| -------------- | --------------------------------------------------- |
| `coding-style` | Immutability, file organization, error handling     |
| `git-workflow` | Commit messages, branch naming, PR workflow         |
| `patterns`     | API response format, service layer, React Query     |
| `security`     | Secret management, input validation, auth patterns  |
| `testing`      | TDD workflow, coverage requirements, test structure |

### References

- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Original configuration collection from Anthropic hackathon winner
- [The Shorthand Guide to Everything Claude Code](https://x.com/affaanmustafa/status/2012378465664745795) - Quick reference guide
