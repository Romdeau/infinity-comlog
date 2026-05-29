# Tech Stack

## Core Technologies
- **Framework:** React (v19)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Package Manager:** Bun

## UI & Styling
- **CSS Framework:** Tailwind CSS (v4)
- **Component Library:** shadcn/ui (based on Radix UI)
- **Icons:** Lucide React
- **Charts:** Recharts

## Routing & State
- **Routing:** React Router DOM (v7)
- **State Management:** React Context API

## Deployment & Tooling
- **Linting:** ESLint
- **Type-Aware Rules:** TypeScript-ESLint via the shared ESLint config
- **Testing:** Vitest with Happy DOM, run through Bun scripts
- **Deployment:** GitHub Pages artifact deployment (Subpath: `/infinity-comlog/`)
- **Critical Requirement:** Always use `import.meta.env.BASE_URL` for assets in the `public/` folder.

## Project Commands
- **Install:** `bun install`
- **Development Server:** `bun run dev`
- **Lint:** `bun run lint`
- **Tests:** `bun run test`
- **Watch Tests:** `bun run test:watch`
- **Coverage:** `bun run test:coverage`
- **Full Check:** `bun run check`
- **Build:** `bun run build`

## Environment Details
- **Cross-Platform:** Developed on macOS and Windows (via WSL Ubuntu-24.04).
- **WSL Constraint:** On Windows, all `bun` commands MUST be executed via WSL. Use PowerShell for `git` operations.
- **Node/NPM Prohibited:** Strictly use `bun`. Never use `npm` or `yarn`.
