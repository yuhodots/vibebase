# Update Markdown Files (Reflect Current Work)

1. Based on all work completed so far (dead code cleanup, refactors, behavior-preserving changes), update `CLAUDE.md` and all `README.md` files so it accurately reflects the project’s **current** structure, commands, conventions, and decisions.
2. Keep the update **minimal, factual, and consistent** with the existing tone/style of `CLAUDE.md` and `README.md`. Do not rewrite unrelated sections.

## Inputs to use

- Git diff / recent commits (preferred source of truth)
- Updated scripts and tooling configs (`pyproject.toml`, `package.json`, `pnpm-lock`, `ruff.toml`, etc.)
- Any new/removed modules, entry points, or folder structure changes
- Test commands and CI notes discovered during the work

## What to update in CLAUDE.md and README.md

- **Project structure**: new/removed directories, renamed modules, moved files
- **How to run**:
  - Dev / build commands
  - Lint/typecheck commands
  - Test commands (and any required env vars)
- **Tooling**:
  - Python: ruff/pyright settings that changed
  - Frontend: knip/eslint/tsconfig changes
- **Code conventions**:
  - Any new patterns introduced (helpers extracted, naming conventions, module boundaries)
- **Deprecations / removals**:
  - Dead code deletions (high level)
  - Any replaced APIs or modules (note migration path if relevant)

## Hard rules

- **No speculative documentation**: only document what is verified in the codebase.
- **Do not document failed/rolled-back experiments** (only final state).
- If something is unclear, add a **TODO** section with specific follow-ups rather than guessing.

## Output format

1. Provide a brief summary of what changed in `CLAUDE.md` and `README.md`.
2. Show the exact patch (or the full updated `CLAUDE.md` and `README.md` if patch is too large).
3. Include a short checklist at the end:
   - [ ] Commands verified
   - [ ] Paths verified
   - [ ] No outdated references remain
