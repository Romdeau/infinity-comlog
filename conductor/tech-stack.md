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
- **Routing:** React Router DOM (v6)
- **State Management:** React Context API

## Deployment & Tooling
- **Linting:** ESLint
- **Formatting:** TypeScript-ESLint
- **Deployment:** GitHub Pages (Subpath: `/infinity-comlog/`)
- **Critical Requirement:** Always use `import.meta.env.BASE_URL` for assets in the `public/` folder.

## Environment Details
- **Cross-Platform:** Developed on macOS and Windows (via WSL Ubuntu-24.04).
- **WSL Constraint:** On Windows, all `bun` commands MUST be executed via WSL. Use PowerShell for `git` operations.
- **Node/NPM Prohibited:** Strictly use `bun`. Never use `npm` or `yarn`.
