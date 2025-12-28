# Project Guidelines

To maintain high code quality and a clean history, this project uses the **Conductor** workflow for guided development.

## AI Agents & Contributors
**You MUST follow the instructions in the `conductor/` directory.** This is the primary source of truth for the project's architecture, workflow, and standards.

### Key References:
- **[Workflow](./conductor/workflow.md)**: Sequential task management, TDD lifecycle, commit standards, and checkpointing protocols.
- **[Tech Stack](./conductor/tech-stack.md)**: Technical constraints (Vite, Bun, React 19), subpath deployment info, and environment-specific rules (WSL).
- **[Product Vision](./conductor/product.md)**: Core goals and target audience.
- **[UI Standards](./conductor/product-guidelines.md)**: Design philosophy, accessibility, and visual hierarchy rules.

## Core Rules
- **Package Manager**: Always use `bun`. Never use `npm` or `yarn`.
- **Git**: Use feature branches and [Conventional Commits](https://www.conventionalcommits.org/).
- **No Automatic Operations**: Do not perform destructive actions or major refactors without explicit user consent.
