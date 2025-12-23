# AI Coding Guidelines

## CRITICAL CONSTRAINTS
- **NO AUTOMATIC GIT OPERATIONS**: Never execute `git commit` or `git push` unless the user explicitly asks for it in the current turn.
- **WSL FOR BUN**: All `bun` commands must run inside WSL (`wsl -d Ubuntu-24.04`). If `bun` is not found in the path, use the absolute path `/home/thomas/.bun/bin/bun`.
- **POWERSHELL FOR GIT**: All `git` commands should be run via PowerShell (Windows) unless specifically required otherwise. Use `git fetch --prune` regularly to clean up stale remote references.
- **SUBPATH DEPLOYMENT**: This app is deployed to a subpath (`/infinity-comlog/`). Always use `import.meta.env.BASE_URL` when referencing assets in the `public/` folder (e.g., `${import.meta.env.BASE_URL}favicon.svg`).

## Architecture Overview
This is a React 19 + TypeScript + Vite application using shadcn/ui components with Tailwind CSS v4. We're using `bun` and not `npm` as the package manager.

Key structural patterns:
- **Components**: Located in `src/components/`, with `ui/` subfolder for shadcn/ui primitives.
- **Path Aliases**: `@/*` maps to `./src/*`.
- **Sidebar**: Uses `SidebarProvider` from shadcn/ui for collapsible sidebar.
- **Demos**: Example components wrap demos in `Example`/`ExampleWrapper` containers.

## Git Strategy
- **Feature Branches**: All new work should be done in a feature branch (e.g., `feat/name`).
- **Conventional Commits**: Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
- **Manual Operations**: Strictly follow the **NO AUTOMATIC GIT OPERATIONS** rule in the Critical Constraints section. Do not commit or push without explicit permission.
- **Merge Conflicts**: When resolving conflicts that involve deleting or replacing files (e.g., `game-tracker.tsx` vs `infinity-game-flow.tsx`), always verify that all features from the incoming branch have been ported to the new file before finalizing the deletion.
- **Pull Requests**: Once a feature is complete and approved, a Pull Request will be used to merge into the `main` branch. Always provide PR descriptions in raw markdown format (wrapped in a code block) to make it easy to copy-paste into GitHub.
- **Git Hooks**: Husky is configured to run `lint-staged` on pre-commit and `bun run build` on pre-push. Ensure all changes pass these checks before committing/pushing.

## Development Workflow (Windows + WSL Setup)
- **Environment**: This project is developed on Windows using WSL (Ubuntu-24.04).
- **Runtime & Package Manager**: Always use `bun` for all tasks. Never use `node`, `npm`, or `yarn`.
- **Bun Command Execution**: All `bun` commands MUST be executed via WSL.
- **WSL Path**: When running commands in WSL, always `cd /mnt/c/Users/Thoma/git/infinity-comlog` first.
- **General Commands**: For non-bun tasks (e.g., `git`, `ls`, `mkdir`, `rm`), prefer using PowerShell directly in the Windows terminal.
- **Dev Server**: `bun run dev` (via WSL).
- **Build**: `bun run build` (via WSL).
- **Lint**: `bun run lint` (via WSL).
- **Preview**: `bun run preview` (via WSL).

## Component Patterns
- **Styling Utilities**: Use `cn()` from `@/lib/utils` for conditional Tailwind classes (clsx + tailwind-merge).
- **Mobile Detection**: Use `useIsMobile()` hook (breakpoint: 768px).
- **Radix UI Primitives**: When using the `asChild` pattern with `radix-ui`, always use `Slot.Root` (e.g., `const Comp = asChild ? Slot.Root : "div"`).
- **shadcn/ui Config**: `radix-vega` style, `stone` base color, Lucide icons.
- **Drag-and-Drop**: Use @dnd-kit with `DndContext`, `SortableContext`, and sensors.

## File Structure Conventions
- **New Components**: Place in `src/components/` (avoid `ui/` unless extending shadcn).
- **Hooks**: Located in `src/hooks/`.
- **Utilities**: Located in `src/lib/utils.ts`.
- **shadcn/ui**: Keep `src/components/ui/` for unmodified shadcn/ui components only.
- **Layout**: `MainLayout` provides a persistent `<header>` with `SidebarTrigger` and dynamic `Breadcrumb`. All page content should be rendered via `Outlet`.

## Data & State
- **Tables**: Use @tanstack/react-table with sorting, filtering, pagination.
- **Charts**: Recharts components (Area, Bar, etc.) with CartesianGrid/XAxis.
- **State Management**: No global state management yet; use local state or props.

## Styling
- **Tailwind CSS**: v4 with CSS variables for theming (using OKLCH colors).
- **Container Queries**: Use `@container` and `@container/main` for responsive component layouts within the dashboard.
- **Dark Mode**: Support via `ThemeProvider` (default: dark).
- **Responsive Design**: Mobile-first approach.

## Dependencies
- **Core**: React 19 (latest), Vite 7, TypeScript 5.9.
- **UI**: shadcn/ui (Radix UI primitives), Lucide React icons.
- **Charts**: Recharts 2.15.4.
- **Tables**: @tanstack/react-table.
- **Drag-Drop**: @dnd-kit/core + sortable.

Reference: `overview-page.tsx` for full dashboard implementation example.
