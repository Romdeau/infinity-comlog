# Testing

Infinity Comlog uses Vitest for unit and component tests. Bun remains the package manager and script runner.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run test` | Run the test suite once with Vitest. |
| `bun run test:watch` | Run Vitest in watch mode for local development. |
| `bun run test:coverage` | Run tests with V8 coverage reporting. |
| `bun run check` | Run lint, tests, and production build. |

## Setup

- Vitest is configured in `vite.config.ts`.
- The test environment is `happy-dom`.
- Shared setup lives in `src/setupTests.ts`.
- Shared setup enables React act support, provides a `ResizeObserver` fallback, provides a `matchMedia` fallback, runs Testing Library cleanup, and clears `localStorage` after each test.

## Conventions

- Import test APIs from `vitest`.
- Do not import from `bun:test`.
- Prefer tests close to the code under test using `*.test.ts` or `*.test.tsx`.
- Mock browser APIs at the shared setup layer when they are broadly required.
- Keep component tests focused on visible behavior and baseline regressions.
- Put pure domain tests beside domain modules, such as army pair validation, list analysis, and game scoring.
- Browser API wrappers such as clipboard and print hooks should be tested or mocked at the hook boundary instead of in feature UI tests.
