# Code Review

Comprehensive security and quality review of uncommitted changes:

1. Get changed files: `git diff --name-only HEAD`

2. For each changed file, check for:

**Security Issues (CRITICAL):**
- Hardcoded credentials, API keys, tokens
- SQL injection vulnerabilities (raw queries)
- XSS vulnerabilities
- Missing input validation (Pydantic schemas)
- Insecure dependencies
- Path traversal risks
- Exposed sensitive env variables

**Code Quality (HIGH):**
- Functions > 50 lines
- Files > 800 lines
- Nesting depth > 4 levels
- Missing error handling
- console.log/print statements in production code
- TODO/FIXME comments
- Missing docstrings for public APIs (Python)
- Missing JSDoc for public APIs (TypeScript)

**Best Practices (MEDIUM):**
- Missing type hints (Python) or types (TypeScript)
- Missing tests for new code
- Accessibility issues (a11y) in React components
- i18n strings not externalized

3. Generate report with:
   - Severity: CRITICAL, HIGH, MEDIUM, LOW
   - File location and line numbers
   - Issue description
   - Suggested fix

4. Block commit if CRITICAL or HIGH issues found

Never approve code with security vulnerabilities!
