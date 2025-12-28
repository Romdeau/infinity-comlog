# GitHub Copilot Instructions

## Source of Truth
This project follows a specific workflow managed via the `conductor` folder. **Prioritize the information in these files above all else:**

- **[Workflow](../conductor/workflow.md)**: TDD, commit protocols, and task lifecycle.
- **[Tech Stack](../conductor/tech-stack.md)**: Vite, React 19, Bun, and subpath deployment details.
- **[UI Guidelines](../conductor/product-guidelines.md)**: shadcn/ui and Tailwind v4 patterns.

## CRITICAL CONSTRAINTS (Environment Specific)
- **NO AUTOMATIC GIT OPERATIONS**: Never execute `git commit` or `git push` unless explicitly asked.
- **WSL FOR BUN**: On Windows, all `bun` commands must run inside WSL (`wsl -d Ubuntu-24.04`). 
- **SUBPATH DEPLOYMENT**: App is deployed to `/infinity-comlog/`. Always use `import.meta.env.BASE_URL` when referencing assets.
- **BUN ONLY**: Never use `npm`, `yarn`, or `node` for scripts/installs.

## Coding Style
- Follow the patterns in `conductor/code_styleguides/`.
- Use `cn()` from `@/lib/utils` for tailwind classes.
- Prefer functional components and hooks.
