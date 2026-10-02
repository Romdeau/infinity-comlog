# Dependency audit, 2026-10-02

## Result

The original lockfile reported 67 advisories: 26 high, 37 moderate, and 4 low. After updating direct packages and their transitive dependencies, `bun audit` reports **zero vulnerabilities**, checking 598 packages. This is the registry's advisory result at the time of the audit, not a guarantee against undiscovered vulnerabilities.

All 11 May overrides were removed. Updated parent packages now resolve patched dependencies within their own supported ranges, including separate AJV 6/8 and path-to-regexp 6/8 versions. No cross-major transitive overrides remain.

## Version decisions

- Direct dependencies are at the latest stable registry releases except the two deliberate compatibility choices below. Existing exact pins for React Router and Recharts are preserved with updated versions.
- TypeScript stays on `~6.0.3`. TypeScript-ESLint 8.71.0 declares `typescript >=4.8.4 <6.1.0`; TypeScript 7.0.2 would violate that peer requirement. See [supported dependency versions](https://typescript-eslint.io/users/dependency-versions/) and the installed package's peer metadata.
- Node types use the latest Node 24 release, 24.19.1, rather than Node 26 types. The tools run on Node 24 LTS. `.node-version` selects that major in CI and permits current security patches; the local verification used Node 24.12.0.
- Bun 1.4.0 is the tested package manager, recorded in `packageManager` and read by CI. This update does not replace the developer's globally installed runtimes.
- Removed the unused `@happy-dom/global-registrator` dependency and obsolete `bunfig.toml` preload. Vitest creates Happy DOM and runs the existing shared setup.
- Retained `shadcn` because `src/index.css` imports its distributed Tailwind CSS. The updated CLI dependency tree is included in the clean audit.
- Added `@vitest/eslint-plugin` to catch test mistakes and reject focused tests. All existing tests pass under [Vitest 5](https://vitest.dev/guide/migration/).
- GitHub Actions now use checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5, and setup-bun v2. CI checks Linux and Windows and audits the lockfile. Deployment no longer builds twice.

## Verification

- `bun install --frozen-lockfile` passed.
- `bun run check` passed: uncached ESLint with no warnings, application/config/test typechecking, all 113 tests in 33 files, and the production build.
- `bun run test:coverage` passed. Reports include untested source files: 65.10% statements, 62.89% branches, 50.37% functions, and 67.60% lines. No new coverage threshold hides the existing gaps.
- `bun run lint:cached` passed with both a cold and warm cache, including after coverage generation.
- `bun outdated` lists only the deliberately retained TypeScript and Node type majors.
- Test typechecking exposed incomplete fixtures, unused imports, a stale suppression, and an obsolete crypto polyfill. These were corrected without changing application behavior.
- Browser smoke checks passed for startup at `/infinity-comlog/`, settings navigation, Rebellion/dark appearance changes, game-session creation, and the game screen at a 390px mobile viewport. This was a limited smoke check, not a full device or UI regression suite. The preview tool could not target the mission selector, so mission-selection interaction was not manually verified.

## Direct package inventory

Ranges below are from `package.json`; `bun.lock` records exact resolutions.

| Package | Before | After |
| --- | --- | --- |
| @base-ui/react | ^1.5.0 | ^1.8.0 |
| @fontsource-variable/figtree | ^5.2.10 | ^5.3.0 |
| @fontsource-variable/inter | ^5.2.8 | ^5.3.0 |
| @fontsource-variable/jetbrains-mono | ^5.2.8 | ^5.3.0 |
| @fontsource-variable/oswald | ^5.2.8 | ^5.3.0 |
| @fontsource-variable/spline-sans-mono | ^5.2.8 | ^5.3.0 |
| @fontsource/b612 | ^5.2.7 | ^5.3.0 |
| @fontsource/barlow | ^5.2.8 | ^5.3.0 |
| @fontsource/bebas-neue | ^5.2.7 | ^5.3.0 |
| @fontsource/chakra-petch | ^5.2.7 | ^5.3.0 |
| @fontsource/ibm-plex-mono | ^5.2.7 | ^5.3.0 |
| @fontsource/saira-condensed | ^5.2.8 | ^5.3.0 |
| @fontsource/space-mono | ^5.2.9 | ^5.3.0 |
| @tailwindcss/vite | ^4.3.0 | ^4.3.3 |
| class-variance-authority | ^0.7.1 | ^0.7.1 |
| clsx | ^2.1.1 | ^2.1.1 |
| lucide-react | ^1.16.0 | ^1.49.0 |
| radix-ui | ^1.4.3 | ^1.6.7 |
| react | ^19.2.6 | ^19.3.0 |
| react-dom | ^19.2.6 | ^19.3.0 |
| react-router-dom | 7.15.1 | 7.18.4 |
| recharts | 3.8.1 | 3.10.1 |
| shadcn | ^4.8.1 | ^4.21.1 |
| tailwind-merge | ^3.6.0 | ^3.7.0 |
| tailwindcss | ^4.3.0 | ^4.3.3 |
| tw-animate-css | ^1.4.0 | ^1.4.0 |
| @eslint/js | ^10.0.1 | ^10.0.1 |
| @testing-library/dom | ^10.4.1 | ^10.4.2 |
| @testing-library/react | ^16.3.2 | ^16.3.3 |
| @types/bun | ^1.3.14 | ^1.4.2 |
| @types/node | ^25.9.1 | ^24 |
| @types/react | ^19.2.15 | ^19.3.0 |
| @types/react-dom | ^19.2.3 | ^19.3.0 |
| @vitejs/plugin-react | ^6.0.2 | ^6.1.1 |
| @vitest/coverage-v8 | ^4.1.7 | ^5.0.3 |
| @vitest/eslint-plugin | not installed | ^1.6.27 |
| eslint | ^10.4.0 | ^10.11.0 |
| eslint-plugin-react-hooks | ^7.1.1 | ^7.1.1 |
| eslint-plugin-react-refresh | ^0.5.2 | ^0.5.7 |
| globals | ^17.6.0 | ^17.13.0 |
| happy-dom | ^20.9.0 | ^20.14.5 |
| typescript | ~6.0.3 | ~6.0.3 |
| typescript-eslint | ^8.60.0 | ^8.71.0 |
| vite | ^8.0.14 | ^8.3.2 |
| vitest | ^4.1.7 | ^5.0.3 |
