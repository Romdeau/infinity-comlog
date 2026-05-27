# May Bun Audit Remediation Task

Generated on 2026-05-28 with Bun 1.3.14 after the May package update.

## Objective

Address every advisory reported by `bun audit` without introducing unsafe dependency overrides or changing package managers. This repo is Bun-managed, so use `bun` only.

## Current Audit Result

`bun audit` reports 29 transitive vulnerabilities:

- 11 high
- 15 moderate
- 3 low

Most findings are in development/build tooling dependency trees rather than browser runtime application code. The largest source is the `shadcn` CLI package and its transitive dependencies. Other findings are under ESLint, TypeScript ESLint, Vite, and Happy DOM.

## Advisories To Triage

| Package | Severity | Dependency Paths Seen | Task |
| --- | --- | --- | --- |
| `qs` | Moderate/Low | `shadcn -> @modelcontextprotocol/sdk -> express -> body-parser -> qs` | Check whether `body-parser` or `express` has released a compatible patched `qs`; update top-level parent packages first. |
| `ajv` | Moderate | `eslint -> ajv`, `shadcn -> @modelcontextprotocol/sdk -> ajv` | Check for ESLint or MCP SDK releases that move to patched `ajv`. Avoid forcing `ajv` unless peer/range compatibility is proven. |
| `brace-expansion` | Moderate | `eslint -> @eslint/config-array -> minimatch`, `typescript-eslint -> minimatch`, `shadcn -> ts-morph -> minimatch` | Track patched `minimatch` and parent releases. |
| `minimatch` | High | `eslint`, `typescript-eslint`, `shadcn -> ts-morph` | Prefer parent package updates. Consider overrides only if all parents accept the patched major/range and tests pass. |
| `diff` | Low | `shadcn -> diff` | Check for a `shadcn` release using `diff >=8.0.3`. |
| `flatted` | High | `eslint -> file-entry-cache -> flat-cache -> flatted` | Check ESLint, `file-entry-cache`, or `flat-cache` releases that use `flatted >=3.4.0`. |
| `@isaacs/brace-expansion` | High | `minimatch` dependency chains | Resolve through patched `minimatch` or parent updates. |
| `hono` | Moderate/Low | `shadcn -> @modelcontextprotocol/sdk -> @hono/node-server -> hono` | Check MCP SDK or Hono-compatible updates. |
| `ip-address` | Moderate | `shadcn -> @modelcontextprotocol/sdk -> express-rate-limit -> ip-address` | Check `express-rate-limit` or MCP SDK updates. |
| `postcss` | Moderate | `shadcn -> postcss`, `vite -> postcss` | Vite now resolves `postcss@8.5.15`; remaining risk appears through `shadcn/postcss@8.5.9`. Check for a newer `shadcn` or compatible transitive override. |
| `ws` | Moderate | `happy-dom -> ws` | Check Happy DOM releases that use `ws >=8.20.1`; otherwise evaluate an override. |
| `fast-uri` | High | `eslint -> ajv -> fast-uri`, `shadcn -> @modelcontextprotocol/sdk -> ajv -> fast-uri` | Prefer patched `ajv` through parent updates; override only after compatibility testing. |
| `path-to-regexp` | High/Moderate | `shadcn -> msw -> path-to-regexp` | Check `msw` and `shadcn` releases that use `path-to-regexp >=8.4.0`. |
| `picomatch` | High/Moderate | `vite -> tinyglobby -> fdir -> picomatch`, `typescript-eslint -> tinyglobby -> fdir -> picomatch`, `shadcn -> @dotenvx/dotenvx -> picomatch` | Vite and TypeScript ESLint already resolve newer top-level `picomatch` in some paths; inspect why audit still reports vulnerable paths before overriding. |

## Remediation Workflow

1. Confirm the baseline:

```bash
bun audit
```

2. Check for newer compatible top-level releases:

```bash
bun outdated
```

3. Update only relevant top-level packages first. Likely candidates are:

```bash
bun update shadcn eslint typescript-eslint vite happy-dom @happy-dom/global-registrator
```

4. Run the verification suite:

```bash
bun test
bun run lint
bun run build
bun audit
```

5. If advisories remain, inspect exact dependency paths in `bun.lock` and determine whether each vulnerable package has a patched version that is compatible with the parent package semver range.

6. Only consider dependency overrides when all of these are true:

- A patched transitive version exists.
- The parent package's declared range accepts the patched version, or compatibility is verified manually.
- `bun test`, `bun run lint`, and `bun run build` pass with the override.
- The override is narrowly scoped and documented in `package.json`.

7. Do not add overrides just to silence audit output when the parent packages do not support the patched versions yet. Document upstream blockers instead.

## Specific Investigation Notes

### shadcn CLI

`shadcn` contributes many advisories through CLI-only dependency chains, including MCP SDK, MSW, Hono, Express, PostCSS, diff, and ts-morph. Because this app imports `shadcn/tailwind.css` from the package, do not remove `shadcn` without verifying the CSS import has a supported replacement.

Tasks:

- Check whether a newer `shadcn` release resolves MCP SDK, MSW, PostCSS, diff, and ts-morph advisories.
- If not, determine whether the project can replace `@import "shadcn/tailwind.css";` with a vendored or supported CSS equivalent and move the CLI out of runtime dependencies.
- Do not regenerate UI components as part of this audit task unless a package change breaks them.

### ESLint And TypeScript ESLint

ESLint and TypeScript ESLint contribute advisories through `ajv`, `fast-uri`, `flatted`, `minimatch`, and brace expansion packages.

Tasks:

- Check for patched ESLint and `typescript-eslint` releases.
- If unresolved, avoid broad overrides until their dependency ranges and flat-config behavior are verified.
- Treat new lint diagnostics after updates as real unless clearly caused by a tool regression.

### Vite And PostCSS

The May update moved Vite to `8.0.14` and PostCSS to `8.5.15` in the Vite path, but `bun audit` still lists PostCSS because `shadcn` has a separate `postcss@8.5.9` resolution.

Tasks:

- Confirm whether Vite still appears as an active vulnerable path after a clean `bun install` and `bun audit`.
- Focus PostCSS remediation on the remaining `shadcn/postcss` path if Vite is already patched.

### Happy DOM And ws

Happy DOM currently depends on `ws` below the patched range.

Tasks:

- Check for a newer `happy-dom` release that updates `ws`.
- If no release exists, test a narrow `ws` override to `>=8.20.1` only if Happy DOM's semver range permits it and all tests pass.

## Success Criteria

- `bun audit` reports zero advisories, or every remaining advisory has a documented upstream blocker and rationale for not overriding.
- `package.json` and `bun.lock` contain only intentional dependency changes.
- No `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` is created.
- Automated checks pass:

```bash
bun test
bun run lint
bun run build
```

- Manual smoke testing is completed for:

- App startup under the `/infinity-comlog/` Vite base path.
- Route navigation for all sidebar pages and unknown-route redirect behavior.
- Theme switching.
- Base UI combobox behavior with mouse and keyboard.
- Dialogs, dropdowns, tooltips, sheets, tabs, and popovers.
- List analysis charts.
- Mobile-width layout.

## Remediation Result

Implemented on 2026-05-28 with Bun 1.3.14.

- Top-level package versions were already current according to `bun outdated`; `bun update shadcn eslint typescript-eslint vite happy-dom @happy-dom/global-registrator` made no package version changes.
- Added flat Bun `overrides` for patched transitive versions whose parent ranges accept the patched release: `@isaacs/brace-expansion@5.0.1`, `brace-expansion@5.0.6`, `diff@8.0.4`, `express-rate-limit@8.5.2`, `fast-uri@3.1.2`, `flatted@3.4.2`, `hono@4.12.23`, `minimatch@10.2.5`, `postcss@8.5.15`, `qs@6.15.2`, and `ws@8.21.0`.
- Resolved advisories for `qs`, `brace-expansion`, `minimatch`, `diff`, `flatted`, `@isaacs/brace-expansion`, `hono`, `ip-address`, `postcss`, `ws`, `fast-uri`, and `picomatch`.
- Remaining `ajv` advisory is blocked upstream. ESLint 10.4.0 depends on `ajv@^6.14.0`; the MCP SDK path depends on `ajv@^8.17.1` and currently resolves to vulnerable `8.17.1`. Bun does not support nested/parent-scoped `overrides`, so a flat `ajv@8.20.0` override would be incompatible with ESLint's declared `^6.14.0` range.
- Remaining `path-to-regexp` advisory is blocked upstream. `router@2.2.0` depends on `path-to-regexp@^8.0.0` and currently resolves to vulnerable `8.3.0`; `msw@2.12.4` separately depends on `path-to-regexp@^6.3.0`. Bun does not support nested/parent-scoped `overrides`, so a flat `path-to-regexp@8.4.2` override would be incompatible with MSW's declared `^6.3.0` range.
- Attempted nested override syntax for the remaining blockers; Bun warned that nested `overrides` are not currently supported, so the unsupported syntax was removed.
- Automated verification passed: `bun test`, `bun run lint`, and `bun run build`. `bun test` emitted existing React `act(...)` environment warnings but exited successfully.
- Final `bun audit` reports 3 advisories: `ajv` (1 moderate) and `path-to-regexp` (1 high, 1 moderate).
- No `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` was created.
- Manual smoke testing remains outstanding.

## Reporting Template

When done, summarize:

- Which top-level packages changed.
- Which advisories were resolved.
- Which advisories remain, with dependency paths and upstream blockers.
- Whether any overrides were added and why.
- Verification command results.
- Manual smoke-test result or remaining manual-test gap.
