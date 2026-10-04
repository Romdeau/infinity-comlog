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
- **TypeScript Rules:** TypeScript-ESLint recommended rules via the shared ESLint config
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
- **Cross-Platform:** macOS, Linux, and native Windows. WSL is optional; install dependencies inside the environment where commands will run.
- **Runtime:** Bun 1.4.0 for package management and scripts; Node.js 24 LTS for Vite, Vitest, and V8 coverage. Bun runs their Node executables through package scripts.
- **Package commands:** Strictly use `bun`. Never use `npm` or `yarn`.

## Dependency maintenance, 2026-10-02

Update the existing stack, including Vitest 5. Retain TypeScript 6 until TypeScript-ESLint supports the TypeScript 7 compiler API. Native Windows is supported so local checks do not require a second toolchain in WSL. Keep CI and local runtime versions aligned, remove obsolete Bun test registration, and provide cached linting, autofix, standalone typechecking, and coverage reports.

## Dependency audit follow-up, 2026-10-04

Keep the shadcn components and vendor the unchanged Tailwind stylesheet from `shadcn@4.21.1` in `src/styles/vendor/shadcn.css`, with its MIT license alongside it. Remove the installed `shadcn` CLI because its dependency tree includes `braces@3.0.3`, affected by GHSA-vfj7-8cjw-p6xm with no patched release. The application only imported the stylesheet. Review upstream CSS changes manually when updating the vendored copy.
