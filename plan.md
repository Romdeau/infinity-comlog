# Infinity Comlog — Visual Redesign & Theming Plan

Source of truth for the multi-theme redesign described in `design-plan.md`.
Status legend: `[ ]` pending, `[~]` in progress, `[x]` done (append 7-char commit SHA).

## Phase A — Appearance Foundation
- [x] A1: `appearance-provider.tsx` (ThemeId/Mode, resolvedMode, migration, DOM contract, system listener) + test
- [x] A2: `src/app/themes.ts` theme metadata registry
- [x] A3: `index.css` restructure: `:root` fallback + 4 theme color token sets (light+dark) + extended `@theme inline`
- [x] A4: Wire `AppProviders` to `AppearanceProvider`; set `data-theme` in `index.html`; remove `theme-provider.tsx` (ThemeId/Mode, resolvedMode, migration, DOM contract, system listener) + test
- [ ] A2: `src/app/themes.ts` theme metadata registry
- [ ] A3: `index.css` restructure: `:root` fallback + 4 theme color token sets (light+dark) + extended `@theme inline`
- [ ] A4: Wire `AppProviders` to `AppearanceProvider`; set `data-theme` in `index.html`; remove `theme-provider.tsx`

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
- [ ] F1: Split `army-list-view.tsx` → `src/components/list-view/*` (UnitCard, WeaponChart, UnitDetailDialog)
- [ ] F2: Redesign List View (dossier panels, fire-control table, print neutral palette)
- [ ] F3: Split `infinity-game-flow.tsx` → `src/components/game-flow/*`; extract Booty data
- [ ] F4: Redesign Game Sequence (status strip, scoreboard, advisories, StatusPip)

## Phase G — Remaining Pages
- [ ] G1: Army Lists "deployment bay" (army-lists.tsx, army-manager.tsx)
- [ ] G2: List Analysis telemetry + `chart-palette.ts` token-driven recharts
- [ ] G3: Order Reference field manual + hacking-reference device tokens
- [ ] G4: Settings Appearance panel + restyle Measurement/Data panels

## Phase H — Hardcode Elimination
- [ ] H1: Grep gate to zero offenders outside token defs / print CSS

## Phase I — Verification
- [ ] I1: `bun run check` green; theme matrix QA; migration; print; reduced-motion; a11y
