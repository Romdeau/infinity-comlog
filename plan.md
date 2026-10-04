# Infinity Comlog — Visual Redesign & Theming Plan

Source of truth for the multi-theme redesign described in `design-plan.md`.
Status legend: `[ ]` pending, `[~]` in progress, `[x]` done (append 7-char commit SHA).

## Dependency and tooling maintenance, 2026-10-02

- [x] Audit and update dependencies, remove obsolete overrides and test setup, improve local checks and CI, and verify. Implementation: e643093. Push the signed maintenance branch to GitHub after recording this completion.

## Phase A — Appearance Foundation
- [x] A1: `appearance-provider.tsx` (ThemeId/Mode, resolvedMode, migration, DOM contract, system listener) + test
- [x] A2: `src/app/themes.ts` theme metadata registry
- [x] A3: `index.css` restructure: `:root` fallback + 4 theme color token sets (light+dark) + extended `@theme inline`
- [x] A4: Wire `AppProviders` to `AppearanceProvider`; set `data-theme` in `index.html`; remove `theme-provider.tsx`

## Phase B — Typography & Textures
- [x] B1: Add fonts via `bun add @fontsource-variable/*`; per-theme `--font-sans/display/mono`
- [x] B2: `.panel-frame`, `.grid-bg`, `.hud-readout`, `.scanline` utilities + motion tokens + reduced-motion

## Phase C — Shared Primitives (`src/components/system/`)
- [x] C1: `StatusPip` (status→token+icon+label) + test
- [x] C2: `Readout` (.hud-readout mono numeric) + test
- [x] C3: `Panel` (panel-frame wrapper around Card) + test
- [x] C4: `PageHeader` (replaces PageIntro) + test; migrate 6 pages; alias PageIntro then remove
- [x] C5: `RangeBand` (tokenized 7-cell range) + test
- [x] C6: `StatLine` (9-stat grid) + test

## Phase D — Theme Switcher
- [x] D1: `ModeToggle` (renamed ThemeToggle, sets mode only)
- [x] D2: `ThemePicker` (lists THEMES, swatches, applies themeId) + test
- [x] D3: Wire into header (dashboard-layout) + mobile + remove old ThemeToggle

## Phase E — App Shell
- [x] E1: `dashboard-layout.tsx` status bar + grid-bg + font-display title
- [x] E2: `app-sidebar.tsx` command rail active treatment + logotype
- [x] E3: `army-import-notifications.tsx` restyle (remove text-white)

## Phase F — Highest-Priority Pages
- [x] F1: Split `army-list-view.tsx` → `src/components/list-view/*` (UnitCard, WeaponChart, UnitDetailDialog)
- [x] F2: Redesign List View (dossier panels, fire-control table, print neutral palette)
- [x] F3: Split `infinity-game-flow.tsx` → `src/components/game-flow/*`; extract Booty data
- [x] F4: Redesign Game Sequence (status strip, scoreboard, advisories, StatusPip)

## Phase G — Remaining Pages
- [x] G1: Army Lists "deployment bay" (army-lists.tsx, army-manager.tsx) — 564f815
- [x] G2: List Analysis telemetry + `chart-palette.ts` token-driven recharts — 564f815
- [x] G3: Order Reference field manual + hacking-reference device tokens — 564f815
- [x] G4: Settings Appearance panel + restyle Measurement/Data panels — 564f815

## Phase H — Hardcode Elimination
- [x] H1: Grep gate to zero offenders outside token defs / print CSS — verified clean post-564f815 (only chart-palette fallbacks + print neutral palette + range-band negative-assertion tests remain)

## Phase I — Verification
- [x] I1: `bun run check` green; theme matrix QA; migration; print; reduced-motion; a11y — 564f815 verified

## Datafile renewal fix

Implementation commit: `643bc67`.

- [x] Support the user-supplied Team Ops export, including selected stat and skill upgrades.

- [x] Replace old test exports with four current user-supplied codes and verify parsing and enrichment.

- [x] Reproduce the API failure and inspect the official Army app requests.
- [x] Fix the request origin, automate metadata renewal, and test failure handling.
- [x] Run a live data refresh and the project verification gate.

The old Origin header returns HTTP 403. The live Army app uses
https://infinityuniverse.com, which returns both metadata and faction JSON.
Faction 901 now has a valid unit payload upstream.

Verified on 2026-10-02: all 58 faction downloads succeeded; metadata refreshed;
118 tests, lint, production build, and sync-script type checking passed.
Browser verification imported the Kestrel fixture with 15 named units and no
import warnings, then displayed unit profiles and weapons in List View.

Follow-up: current exports exposed the additional schema-3 special-table marker.
The parser now tries schemas 3, 2, and 1 with complete-input validation. All four
new fixtures resolve every unit/profile/option; older exports remain covered.
`bun run check` passes with 125 tests. Coverage was attempted but the installed
Bun runtime rejects the V8 coverage API. Browser verification on this worktree's
port 5187 confirmed group sizes 8/7, 9/6, 11/6, and 10/5 with no unknown units.
Port 5173 was found to serve an older checkout and is not used as final evidence.

Team Ops follow-up: decode and retain special-table JSON attributes, apply stat,
movement, skill, weapon, and equipment choices without mutating cached profiles.
Verified the supplied 10/5-entry list in the browser, including BTS 5 on KAIZOKU-1,
Mimetism (-3) on KAIZOKU HEAVY, and Tactical Awareness on KOBARUTO SPECBOT_1.
Selections persist through reload and re-enrichment. `bun run check` passes with
129 tests. Coverage remains unavailable under the installed Bun runtime as noted above.

PR #40 conflict resolution: merged the updated main toolchain, retaining both
data-sync commands and the current army-code fixture import. Native Windows
verification passes lint, app/test typechecking, 129 tests, production build,
and dependency audit. The updated Node runtime also enables V8 coverage;
the focused parser regression suite reports 96.2% parser line coverage.

## Griffin favicon, 2026-10-04

- [x] Create and visually check a Griffin-inspired SVG helmet at 512, 32 and
  16 pixels, with four pink optics, blue armor, side fins and a gray respirator.
- [x] Replace `public/favicon.svg` with the approved helmet design.
- [x] Remove the discarded concepts and redundant previews.

Validation: `bun run check` passes, including all 129 tests and the production
build. The built favicon matches the approved SVG.
