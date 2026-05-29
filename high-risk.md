# High-Risk Remaining Work

This file tracks the remaining work that should not be folded into broad cleanup commits. These items touch persisted browser data, core game behavior, or large UI surfaces where regressions are easy to miss.

## 1. Migrate Game Sessions From Active Slots To Stable List References

### Current Risk

Game sessions still store `state.selectedList` as `"none" | "listA" | "listB"`. Those values point to whichever global active pair is selected now, not the saved list that was selected when the session was played.

Changing active List A/List B can silently change the meaning of old sessions.

### Preferred End State

- Store a stable saved-list ID in each game session.
- Keep enough display metadata in the session to show a useful label even if the saved list is later deleted.
- Render a clear missing-list warning when a session references a deleted saved list.
- Preserve legacy sessions that only have `selectedList: "listA" | "listB"`.

### Migration Strategy

1. Add a new session field such as `selectedListId: string | null`.
2. During storage migration, map legacy `selectedList` values through the current active pair IDs when available.
3. Preserve the old `selectedList` field through at least one compatibility cycle to avoid data loss.
4. If no matching active pair ID exists during migration, keep `selectedListId: null` and surface a session warning rather than guessing.
5. Add tests for legacy `none`, `listA`, `listB`, missing active IDs, deleted saved lists, and already-migrated sessions.

### Acceptance Criteria

- Old sessions do not silently switch lists when the global active pair changes.
- Deleting a saved list referenced by a session does not crash the game flow.
- Existing localStorage data loads without manual cleanup.
- The UI clearly distinguishes "no list selected" from "selected list is missing".

## 2. Introduce A Typed Game State Reducer

### Current Risk

`InfinityGameFlow` now avoids broad `any` casts, but it still owns many direct state-update closures. The logic is safer than before, but not yet reducer-driven.

### Preferred End State

- Move game mutations into `features/game/reducer/game-state-reducer.ts`.
- Define typed actions for setup, initiative, strategic options, turn steps, round objectives, final objectives, classifieds, and victory points.
- Keep `InfinityGameFlow` focused on rendering and dispatching actions.

### Acceptance Criteria

- Every game state mutation can be tested without rendering React.
- Turn and scoring updates are immutable by construction.
- Component tests cover major rendering flows only; reducer tests cover mutation branches.

## 3. Canonical Army Storage And Measurement Formatting

### Current Risk

Stored army lists still contain enriched display-shaped values, including movement formatted for the selected measurement unit at import time. The import path now passes the active measurement unit, but the storage model is still not fully canonical.

### Preferred End State

- Persist raw/canonical army data independent of display preferences.
- Format movement, weapon ranges, and distances at render time.
- Rebuild view models from canonical records and current settings.

### Migration Strategy

1. Add a new versioned stored-list schema.
2. Preserve raw army code and canonical parser output where possible.
3. Migrate existing enriched stored lists in memory without deleting old fields immediately.
4. Re-enrich from raw army code when available.
5. Keep tests for legacy enriched lists, missing raw codes, measurement switching, and validation hashes.

### Acceptance Criteria

- Changing measurement units does not require rewriting saved army lists.
- Existing saved lists continue to render after migration.
- Imported and re-imported lists produce stable fingerprints independent of display formatting.

## 4. Finish Army List View Decomposition

### Current Risk

`army-list-view.tsx` is typed now, but it remains a large page that owns tabs, print styles, combat group rendering, unit cards, dialogs, weapon charts, and range bands.

### Preferred End State

- Extract presentational components for `ArmyListTabs`, `PrintableArmyList`, `CombatGroupSection`, `UnitCard`, `UnitDetailDialog`, `WeaponChart`, and `RangeBands`.
- Move print CSS out of inline `dangerouslySetInnerHTML` into a stylesheet or dedicated print module.
- Keep props typed against canonical army view models.

### Acceptance Criteria

- The page mostly composes feature components.
- Print behavior remains covered and manually checked.
- Weapon chart and detail dialog continue to handle missing metadata safely.

## 5. Metadata And Weapon Registry Consolidation

### Current Risk

Skill/equipment lookup now goes through `MetadataService`, and duplicate `constants.ts` was removed. `weapon-data.ts` still exists as a checked-in derived registry separate from `metadata.json`.

### Preferred End State

- Either derive weapon modes directly from `metadata.json`, or add a generation script that produces `weapon-data.ts` from metadata.
- Add a test that generated weapon output matches metadata.
- Keep range-band formatting consistent between weapon chart and unit dialogs.

### Acceptance Criteria

- Weapon names, modes, traits, ammunition, and ranges come from one pipeline.
- Metadata refreshes cannot silently leave stale weapon chart data behind.

## 6. Manual Smoke Testing And Deployment Verification

### Current Risk

Automated checks pass, but this refactor touched routing, storage, import, list analysis, game scoring, and browser API wrappers.

### Manual Checklist

1. Start the dev server with `bun run dev`.
2. Confirm sidebar navigation works on desktop and mobile widths.
3. Import a list into List A and a compatible list into List B.
4. Confirm mismatched sectoral and points pair validation still rejects incompatible lists.
5. Switch measurement units and verify movement/range labels update.
6. Open List View, inspect unit details, weapon chart, and print preview.
7. Open List Analysis and verify summary cards and charts render.
8. Create a game session, select mission/list, update setup, turn steps, round objectives, final objectives, classifieds, and VP.
9. Reload and confirm settings, lists, active pair, and sessions persist.
10. Delete a saved list referenced by a session after selected-list migration work lands, and verify the missing-list warning.
11. Open Order Reference and Hacking Programs.
12. Build and preview with the `/infinity-comlog/` base path before release.

### Acceptance Criteria

- `bun run check` passes before release.
- Manual smoke testing finds no route, import, print, dialog, chart, or persistence regressions.
- GitHub Pages artifact deployment can still load public faction data under `/infinity-comlog/`.
