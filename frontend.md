# Frontend Audit And Redesign Plan

## Package Audit

### What I updated

The project was upgraded in place with `bun update --latest` and then verified against the current codebase.

Updated dependencies:

- `@base-ui/react` `^1.0.0` -> `^1.3.0`
- `@tailwindcss/vite` `^4.1.17` -> `^4.2.2`
- `lucide-react` `^0.562.0` -> `^1.7.0`
- `react` `^19.2.0` -> `^19.2.5`
- `react-dom` `^19.2.0` -> `^19.2.5`
- `react-router-dom` `6.28.0` -> `7.14.0`
- `recharts` `2.15.4` -> `3.8.1`
- `shadcn` `^3.6.2` -> `^4.2.0`
- `tailwind-merge` `^3.4.0` -> `^3.5.0`
- `tailwindcss` `^4.1.17` -> `^4.2.2`
- `@eslint/js` `^9.39.1` -> `^10.0.1`
- `@happy-dom/global-registrator` `^20.0.11` -> `^20.8.9`
- `@testing-library/react` `^16.3.1` -> `^16.3.2`
- `@types/bun` `^1.3.5` -> `^1.3.11`
- `@types/node` `^24.10.1` -> `^25.5.2`
- `@types/react` `^19.2.5` -> `^19.2.14`
- `@vitejs/plugin-react` `^5.1.1` -> `^6.0.1`
- `eslint` `^9.39.1` -> `^10.2.0`
- `eslint-plugin-react-refresh` `^0.4.24` -> `^0.5.2`
- `globals` `^16.5.0` -> `^17.4.0`
- `happy-dom` `^20.0.11` -> `^20.8.9`
- `typescript` `~5.9.3` -> `~6.0.2`
- `typescript-eslint` `^8.46.4` -> `^8.58.1`
- `vite` `^7.2.4` -> `^8.0.7`

### Fixes required after the upgrade

The dependency update exposed a few compatibility issues that I fixed:

- Added `"ignoreDeprecations": "6.0"` to `tsconfig.app.json` and `tsconfig.node.json` because TypeScript 6 now errors on `baseUrl` deprecation unless explicitly acknowledged.
- Refactored `setLists` in `src/context/army-context.tsx` to satisfy ESLint 10's `no-useless-assignment` rule.
- Simplified `calculateTP` in `src/lib/game-flow-helpers.ts` for the same ESLint rule.
- Reinstalled missing packages from the Bun lockfile. Before that, `recharts` and `@happy-dom/global-registrator` were missing from the local install, which made the baseline build and tests fail even before upgrades.

### Verification status

Verified successfully:

- `bun install`
- `bun run build`
- `bun run lint`

Current test status after the upgrade:

- `bun test` still has 4 failing tests
- These failures were already application/test-suite issues rather than package-upgrade regressions

Observed test problems:

- `src/context/game-context.test.tsx`: localStorage persistence assertion fails and test cleanup appears incomplete, causing duplicate `Create Session` buttons between tests.
- `src/context/strategic-options.test.tsx`: same duplicate render / cleanup issue.
- `src/pages/settings.test.tsx`: mocked `useArmy()` value does not provide `reimportAllLists`, so the test crashes before the loading assertion.
- `src/pages/list-analysis.test.tsx`: Recharts warns because the test environment renders the responsive chart at zero size.

### Package notes and recommendations

- `react-router-dom@7` built successfully with your current usage. You are still using the older route declaration style, which is supported, but the app is not taking advantage of router data APIs or route objects.
- `recharts@3` built successfully, but chart tests need a testing strategy that does not rely on `ResponsiveContainer` measuring real layout.
- `shadcn@4` is installed, but most of the app still reflects a custom early-stage usage pattern rather than current shadcn design conventions.
- `radix-ui` remains in use across your `src/components/ui/*` primitives. It is actively used and should stay for now.
- `@fontsource-variable/figtree` is stable and fits the current visual direction.

## Current Frontend Assessment

The application already has a useful foundation:

- Tailwind 4 is in place.
- `components.json` is configured for shadcn.
- There is a shared token system in `src/index.css`.
- Core layout primitives exist: sidebar, cards, tabs, dialogs, sheets, breadcrumbs, inputs.
- The app is split into focused pages and reusable state providers.

The main gaps are design-system consistency and information architecture rather than raw implementation capability.

### Strengths

- The project already uses shadcn primitives instead of ad hoc HTML everywhere.
- Theme tokens exist for light, dark, charts, and sidebar colors.
- The sidebar layout is structurally close to a modern shadcn application shell.
- Domain-specific workflows already exist: list import, list analysis, game sequence, order reference, settings.

### Weaknesses

- Many screens still rely on heavy uppercase labels, dense micro text, and alpha badges as primary identity rather than content hierarchy.
- Page layouts often use wrapper divs and spacing patterns that fight the design system instead of composing `Card`, `Section`, `Tabs`, and `Header` structures cleanly.
- The sidebar footer contains placeholder user account UI that does not match the app's actual single-user utility nature.
- Visual emphasis is inconsistent: some screens use muted cards, others bold borders, others oversized badges.
- The `Settings` and `List Analysis` pages feel more like prototype panels than polished product surfaces.
- Search in the top bar is placeholder UI and currently suggests functionality that does not exist.
- Several pages do not establish a strong page intro area with title, description, primary actions, and contextual status.

## Goal

Realign the application to current shadcn style by making it feel like a deliberate tool interface instead of a collection of feature panels.

That means:

- quieter chrome
- stronger typography hierarchy
- fewer novelty labels
- more consistent spacing and card structure
- better responsive behavior
- clearer action placement
- removing placeholder UI that implies unsupported features

## Redesign Plan

### Phase 1: Normalize The Application Shell

Targets:

- `src/components/dashboard-layout.tsx`
- `src/components/app-sidebar.tsx`
- `src/App.tsx`

Actions:

- Replace the placeholder top-bar search with either a real command/search surface or remove it entirely until search exists.
- Turn the page header into a standard app-shell header: breadcrumb, page title context, optional page actions.
- Remove the fake account/profile dropdown from the sidebar footer. Replace it with app-level utility actions such as theme toggle, settings link, data status, and version/build info.
- Move the community disclaimer into a lower-emphasis footer block or `About` section rather than giving it primary sidebar space.
- Ensure the collapsed sidebar state still communicates route meaning using icon choice and tooltip text only.
- Review route labels so they are product-like and consistent. Example: decide whether `Army Lists`, `List View`, and `List Analysis` should be grouped under a single “Lists” concept.

Desired shadcn direction:

- simple app shell
- restrained header chrome
- clear navigation groups
- no decorative UI that does not map to real product behavior

### Phase 2: Standardize Page Header Patterns

Targets:

- all pages in `src/pages/*`

Actions:

- Introduce a shared page header pattern with:
  - title
  - short description
  - optional action area
  - optional status or helper badge
- Remove repeated ad hoc top spacing wrappers like `flex flex-1 flex-col gap-4 p-4 pt-0` when they can be centralized.
- Reserve badges such as `Alpha` for truly important product state, and style them as subtle `Badge` components rather than loud uppercase markers.
- Keep page intros consistent across `Army Lists`, `Game Sequence`, `Order Reference`, `List Analysis`, and `Settings`.

Desired shadcn direction:

- repeated layout patterns
- descriptive headers
- badges used sparingly

### Phase 3: Refactor Army Lists Into A Strong Primary Workspace

Targets:

- `src/components/army-manager.tsx`
- `src/components/army-list-importer.tsx`
- `src/pages/army-lists.tsx`

Actions:

- Make `Army Lists` the clearest primary workspace in the app.
- Separate the three jobs currently mixed in one card:
  - import a list
  - inspect active list A/B
  - manage saved library
- Consider replacing the current top tabs with a 2-column desktop layout:
  - active lists / importer on the left
  - saved library on the right
- Keep tabs only where content is mutually exclusive and not frequently compared.
- Improve information density by using proper card sections instead of many tiny text sizes.
- Replace browser `alert()` validation errors with inline `Alert`, `Toast`, or field-level messaging.
- Add clear empty states with one next action per state.
- Normalize icon and button sizing. Current `size-7`, `text-[9px]`, and `text-[10px]` usage reads as prototype UI.

Desired shadcn direction:

- cards as stable content containers
- empty states with one action
- inline validation
- clean split between primary task and supporting library

### Phase 4: Redesign List Analysis Around Insight Cards

Targets:

- `src/pages/list-analysis.tsx`

Actions:

- Rework the page into sections rather than one dense grid.
- Add a page intro that explains what analysis is available and what assumptions it uses.
- Convert top metrics into a compact summary strip with consistent stat-card structure.
- Move charts into dedicated cards with readable titles, descriptions, and enough height to feel intentional.
- Use semantic comparison patterns when both lists are loaded:
  - side-by-side cards
  - shared metric rows
  - delta indicators only where meaningful
- Reduce bright accent overuse. The chart area should be one emphasis point, not every heading.
- Add responsive chart fallbacks or minimum heights to improve testability and mobile behavior.

Desired shadcn direction:

- insight-first layout
- readable stat cards
- charts used as supporting evidence, not decoration

### Phase 5: Rework Settings Into Real Preference Sections

Targets:

- `src/pages/settings.tsx`

Actions:

- Break settings into named sections like `Display`, `Gameplay Preferences`, and `Data`.
- Replace the current segmented-button styling for measurement unit with either `RadioGroup` or `Tabs`-style segmented controls that match shadcn patterns more directly.
- Add short helper descriptions below each setting label, but reduce ornamental icon use unless it clarifies meaning.
- Treat re-import as a data maintenance action with confirmation/caution copy if the operation is potentially destructive or time-consuming.
- Surface success and failure feedback with a standard notification pattern rather than only ephemeral inline text.

Desired shadcn direction:

- settings as forms
- grouped preferences
- consistent control primitives

### Phase 6: Improve Domain Reading Screens

Targets:

- `src/pages/order-reference.tsx`
- `src/pages/game-sequence.tsx`
- `src/components/turn-reference.tsx`
- `src/components/infinity-game-flow.tsx`
- `src/components/session-manager.tsx`

Actions:

- Present rules/reference content with stronger reading rhythm: section headings, dividers, callouts, and progressive disclosure.
- Avoid making everything a card if the content is primarily textual. Use cards for grouped tools and panels, not every paragraph.
- For the game sequence flow, make the current state, next action, and completed state visually obvious.
- Introduce `Accordion`, `Collapsible`, or stepper-like grouping where it helps scanning.
- Ensure mobile layouts keep key controls above overflow-heavy content.

Desired shadcn direction:

- content hierarchy first
- interaction states clearly visible
- fewer but better containers

### Phase 7: Tighten The Design Token System

Targets:

- `src/index.css`
- any component with hardcoded `text-orange-500`, `text-sky-500`, `bg-muted/30`, etc.

Actions:

- Reduce one-off utility color usage and route more emphasis through semantic tokens.
- Decide on one accent strategy for the app. Right now magenta primary plus frequent orange and sky accents creates too many competing signals.
- Tune spacing and radius usage to a narrower set of values so the UI feels more systematic.
- Audit typography sizes and remove overuse of `text-[9px]` and `text-[10px]` except for genuine metadata.
- Prefer semantic `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`, and `text-primary` usage over ad hoc color choices.

Desired shadcn direction:

- token-driven styling
- fewer hardcoded colors
- consistent type scale

### Phase 8: Align Component Usage With Current shadcn Practices

Targets:

- `src/components/ui/*`
- high-level components using those primitives

Actions:

- Revisit locally copied shadcn components and compare them against current generated versions where relevant.
- Only refresh primitives that materially improve accessibility, API consistency, or visual quality. Do not rewrite stable components just to chase upstream.
- Prefer composition over adding app-specific variants to shared primitives unless the variant is reused broadly.
- Keep domain-specific styling in feature components, not in the generic UI layer.

Desired shadcn direction:

- thin primitive layer
- feature styling lives near features
- upstream-compatible patterns where practical

## Recommended Visual Direction

For this app specifically, the best fit is not a flashy “sci-fi HUD” skin.

A better direction is:

- quiet tactical dashboard
- neutral base surfaces
- one confident accent color
- compact but readable type
- crisp separators and state indicators
- game flavor expressed through copy, iconography, and data structure rather than novelty effects

This preserves credibility for a rules-heavy companion tool and fits current shadcn sensibilities much better than decorative theming.

## Suggested Implementation Order

1. Clean the app shell and navigation.
2. Introduce a shared page-header pattern.
3. Redesign `Army Lists` as the primary workflow page.
4. Rebuild `List Analysis` into clearer insight sections.
5. Refactor `Settings` into form-like preference sections.
6. Harmonize tokens, typography, and badge usage across the whole app.
7. Update flaky tests alongside each affected screen rather than leaving UI and tests to drift.

## Definition Of Done For The Redesign

The redesign should be considered complete when:

- every page uses the same header and spacing system
- sidebar and top bar only contain real product actions
- color and typography usage are consistent across pages
- empty states and errors use shared patterns
- forms and settings use standard shadcn controls
- analysis and reference screens read clearly on mobile and desktop
- tests are updated so the component structure can evolve safely

## Immediate Next Step

If you want to execute this plan incrementally, start with `dashboard-layout.tsx`, `app-sidebar.tsx`, and `army-manager.tsx`. Those three files will produce the biggest visible improvement fastest and establish the patterns the rest of the app should follow.
