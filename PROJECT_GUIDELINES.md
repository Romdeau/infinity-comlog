# Project Development Workflow

To maintain high code quality and a clean history, we follow these guidelines:

## Git Strategy

- **Feature Branches**: All new work should be done in a feature branch (e.g., `feat/name`).
- **Conventional Commits**: Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
- **Frequent Commits**: Commit after every significant change or prompt completion.
- **Controlled Pushing**: Do not push to the remote origin until explicitly requested.
- **Pull Requests**: Once a feature is complete and approved, a Pull Request will be used to merge into the `main` branch.

## Component Architecture

- **UI Components**: Keep at `src/components/ui`.
- **Feature Components**: Group larger feature logic into specialized components.
- **Theme**: Always ensure components support both light and dark modes.

## Tooling & Tech Stack

- **Runtime & Package Manager**: Use `bun` for all commands (install, run, add). Do not use `npm` or `yarn`.
- **Build Tool**: Vite.
- **UI Library**: shadcn/ui (Radix UI + Tailwind).
- **Icons**: Lucide React.
