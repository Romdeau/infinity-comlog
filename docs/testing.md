# Testing

Infinity Comlog uses Vitest for unit and component tests. Bun remains the package manager and script runner.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run lint` | Run ESLint without a cache; warnings fail the check. |
| `bun run lint:cached` | Lint with a content-based cache for local feedback. |
| `bun run lint:fix` | Apply ESLint's automatic fixes. |
| `bun run typecheck` | Check application, Vite config, and test types without bundling. |
| `bun run test` | Run the test suite once with Vitest. |
| `bun run test:watch` | Run Vitest in watch mode for local development. |
| `bun run test:coverage` | Run tests with V8 coverage reporting. |
| `bun run check` | Run uncached lint, typechecking, tests, and production build. |
| `bun run audit` | Check the lockfile for known security advisories. Requires network access. |

Use `bun run test`, not `bun test`. The latter invokes Bun's separate test runner, which does not support this suite's Vitest mocks and configuration.

To focus on one file or test name:

```sh
bun run test src/lib/army-context-mapping.test.ts
bun run test:watch src/lib/army-context-mapping.test.ts
bun run test -- -t "identifies Regeneration"
```

Coverage includes untested source files and writes an HTML report to `coverage/index.html` and LCOV to `coverage/lcov.info`. Generated coverage and the lint cache are ignored by Git and ESLint. No coverage threshold is imposed by this maintenance update.

The full gate also checks test TypeScript through `tsconfig.test.json`; the production build continues to exclude tests. Vitest's recommended lint rules reject invalid assertions, and focused tests such as `it.only` fail lint.

## Setup

- Vitest is configured in `vite.config.ts`.
- Use Node.js 24 LTS and the Bun version in `package.json`. CI reads `.node-version` and `packageManager`, installs with `--frozen-lockfile`, and runs checks on Linux and Windows.
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
