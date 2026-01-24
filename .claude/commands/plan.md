---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

Create a comprehensive implementation plan before writing any code.

## What This Command Does

1. **Restate Requirements** - Clarify what needs to be built
2. **Identify Risks** - Surface potential issues and blockers
3. **Create Step Plan** - Break down implementation into phases
4. **Wait for Confirmation** - MUST receive user approval before proceeding

## When to Use

Use `/plan` when:
- Starting a new feature
- Making significant architectural changes
- Working on complex refactoring
- Multiple files/components will be affected
- Requirements are unclear or ambiguous

## How It Works

1. **Analyze the request** and restate requirements in clear terms
2. **Break down into phases** with specific, actionable steps
3. **Identify dependencies** between components
4. **Assess risks** and potential blockers
5. **Present the plan** and WAIT for your explicit confirmation

## Plan Template

```markdown
# Implementation Plan: [Feature Name]

## Requirements Restatement
- [Clear bullet points of what needs to be built]

## Implementation Phases

### Phase 1: [Phase Name]
- [ ] Task 1
- [ ] Task 2

### Phase 2: [Phase Name]
- [ ] Task 1
- [ ] Task 2

## Files to Modify
- Backend: core/...
- Frontend: frontend/src/...

## Dependencies
- External services needed
- New packages required

## Risks
- HIGH: [Description]
- MEDIUM: [Description]
- LOW: [Description]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

## Important Notes

**CRITICAL**: Do NOT write any code until user explicitly confirms with "yes" or "proceed".

## Integration with Other Commands

After planning:
- Use `/tdd` to implement with test-driven development
- Use `/build-fix` if build errors occur
- Use `/code-review` to review completed implementation
