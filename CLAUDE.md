# CLAUDE.md
## Stack
- Node.js (LTS)
- Project type and framework: TBD (will be updated once decided)
- Package manager: npm
## Conventions
- Commit messages follow Conventional Commits (feat, fix, docs, chore, refactor, test)
- 2-space indentation
- camelCase for variables and functions
- Keep functions small and single-purpose
## Notes for Claude Code
- This repo is in early setup. Ask before assuming project structure.
- Prefer clear, well-commented code since this is a learning project.

## Rules learned from settings-form drill (FE-01)
- Always state the tech stack explicitly in every prompt (e.g. "plain
  HTML/CSS/JS, no React, no frameworks, no JSX"). A vague prompt with no
  stack constraint produced a React .jsx component that cannot run in
  this project at all, since no build tooling is installed.
- Every input, including custom controls like toggles or switches, must
  have a real programmatic label (`<label for="id">` or `aria-label`) —
  visually-adjacent text alone is not enough for screen readers. A
  vague prompt produced toggle switches with no label association.
- Any button that saves or submits data must disable itself and show a
  loading state for the duration of the action, to prevent
  double-submission — verify this exists in the code, don't assume it.
  A vague prompt produced a Save button with no protection against
  repeated clicks.
- Email and other format-sensitive fields must use an actual pattern
  check (e.g. regex), never just a "field is non-empty" check. A vague
  prompt produced a save handler with zero validation logic at all —
  any input, including an empty name or invalid email, saved
  successfully.
- After generating any form or interactive component, ask for a test
  script that verifies the validation logic, then actually run it and
  read the output yourself before accepting the code as done. Do not
  trust a summary claiming "tests pass" without running them.