\# CLAUDE.md

\## Stack

\- Node.js (LTS)

\- Project type and framework: TBD (will be updated once decided)

\- Package manager: npm

\## Conventions

\- Commit messages follow Conventional Commits (feat, fix, docs, chore, refactor, test)

\- 2-space indentation

\- camelCase for variables and functions

\- Keep functions small and single-purpose

\## Notes for Claude Code

\- This repo is in early setup. Ask before assuming project structure.

\- Prefer clear, well-commented code since this is a learning project.



\## Rules learned from settings-form drill (FE-XX)

\- Every form input must have a matching <label for="id">; placeholder

&#x20; text is never an acceptable substitute for a label.

\- Radio buttons in the same group must share a `name` attribute so

&#x20; only one can be selected — verify this explicitly, it's a common

&#x20; silent mistake in generated forms.

\- Any button that triggers a save/submit action must disable itself

&#x20; and show a loading state for the duration of the action, to prevent

&#x20; double-submission.

\- Email/format validation must use an actual pattern check (e.g. regex),

&#x20; never just a "field is non-empty" check.

\- After generating any form or interactive component, ask for a test

&#x20; script that verifies validation logic before accepting the code as done.

