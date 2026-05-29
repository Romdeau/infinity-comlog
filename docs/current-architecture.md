# Current Architecture

This note describes the current implementation after the initial architecture refactor phases. It is not a product roadmap.

## Application Shell

- `src/App.tsx` is a compatibility re-export for `src/app/app.tsx`.
- `src/app/app-providers.tsx` owns the provider stack: `ThemeProvider`, `SettingsProvider`, `ArmyProvider`, and `GameProvider`.
- `src/app/app-router.tsx` owns the `HashRouter` and route element rendering.
- `DashboardLayout` renders the sidebar, breadcrumbs, route title, route description, mobile settings shortcut, notifications, and the route outlet.
- Page components also render their own `PageIntro`, so route/page metadata is currently duplicated in layout and pages.
- `AppSidebar` reads `useArmy()` to show saved-list and import-warning counts.

## Routes

Routes and route metadata are declared in `src/app/routes.tsx`. Sidebar navigation and settings navigation are derived in `src/app/navigation.ts`.

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `Navigate` | Redirects to `/army-lists`. |
| `/army-lists` | `src/pages/army-lists.tsx` | Imports and manages active List A/List B. |
| `/army-list-view` | `src/pages/army-list-view.tsx` | Roster, unit cards, detail dialog, print styles, and weapon chart. |
| `/list-analysis` | `src/pages/list-analysis.tsx` | List metrics and charts. |
| `/game-sequence` | `src/pages/game-sequence.tsx` | Session manager and game flow tracker. |
| `/order-reference` | `src/pages/order-reference.tsx` | Turn and quick reference content. |
| `/settings` | `src/pages/settings.tsx` | Measurement preference and list re-import action. |
| `*` | `Navigate` | Redirects unknown routes to `/army-lists`. |

## State Providers

- `SettingsProvider` persists `{ measurementUnit }` through `useLocalStorage("comlog_settings", DEFAULT_SETTINGS)`.
- `ArmyProvider` persists saved lists at `comlog_stored_lists` and active list IDs at `comlog_active_pair`.
- `ArmyProvider` migrates legacy saved lists to `StoredArmyList`, re-enriches stale/corrupted lists when raw codes are available, and keeps import warnings in memory.
- `ArmyProvider` validates active pair compatibility before accepting context-level list assignments.
- `GameProvider` persists sessions at `comlog_sessions` and the selected session ID at `comlog_active_session_id`.
- `GameProvider` migrates older session state in memory and writes migrated sessions back when shape changes are detected.
- Settings, army, and game providers memoize their context values and primary actions.
- `ThemeProvider` persists the theme string at `infinity-theme`.
- The sidebar primitive persists collapsed state in the `sidebar_state` cookie.

## Data Services

- `ArmyParser` decodes Infinity Army base64 codes into raw `ArmyList` objects with sectoral/list metadata and raw unit references.
- `unitService` enriches parser output with faction JSON data and metadata names. It uses `faction-data-service` for cached, `BASE_URL`-aware faction loading.
- The old `ArmyListService` compatibility module has been removed; app code and tests use `unitService` for army enrichment.
- `MetadataService` consumes `src/data/metadata.json` and resolves skill, equipment, weapon, ammunition, and faction labels.
- `src/lib/weapon-data.ts` remains as a checked-in derived weapon-mode registry; skill and equipment labels are resolved through `MetadataService` rather than duplicate constants.
- `src/data/missions.json` is consumed directly by `InfinityGameFlow`; mission objective types are inferred inline in the component.
- `src/features/game/scoring/scoring-service.ts` owns pure mission OP/TP scoring helpers used by `InfinityGameFlow`.
- `src/features/army/domain/list-analysis.ts` owns pure list-analysis metrics used by `ListAnalysisPage`.
- Browser APIs used by feature components are wrapped by small shared hooks such as `useClipboard` and `usePrint`.

## Baseline Checks

Initial Phase 0 commands run on 2026-05-29:

| Command | Result |
| --- | --- |
| `bun run lint` | Passed with no output. |
| `bun test` | Passed: 56 tests across 15 files. Warning observed: `The current testing environment is not configured to support act(...)` from React test rendering. |
| `bun run build` | Passed: TypeScript build and Vite production build completed. |

After Phase 1 tooling alignment, tests run with Vitest via `bun run test`; 63 tests pass across 16 files.

After the Phase 8 cleanup, `bun run check` is the expected full verification gate.
