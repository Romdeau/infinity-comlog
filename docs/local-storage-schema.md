# Local Storage Schema

This is the current browser persistence baseline. Versioned storage validation is not yet implemented for every key, so this document records the existing shapes that future migrations must preserve.

| Key | Storage | Current Shape | Current Behavior |
| --- | --- | --- | --- |
| `infinity-theme` | `localStorage` | Theme string: `dark`, `light`, or `system`. | Read and written by `ThemeProvider`. No schema validation. |
| `comlog_settings` | `localStorage` | `{ "measurementUnit": "imperial" | "metric" }` | Read and written by `SettingsProvider` through `useLocalStorage`. Invalid JSON or invalid measurement values fall back to the default settings. No version field yet. |
| `comlog_stored_lists` | `localStorage` | Record keyed by generated list ID. Values are `StoredArmyList` objects: enriched army list fields plus `rawBase64`, `schemaVersion`, `importTimestamp`, `validationHash`, and optional `name`. | `ArmyProvider` validates that the top-level value is a record, migrates legacy enriched-list values without storage metadata, and re-parses stale/corrupted lists when `rawBase64` or `rawCode` is available. |
| `comlog_active_pair` | `localStorage` | `{ "a": string | null, "b": string | null }` | IDs point into `comlog_stored_lists`. Legacy `{ listAId, listBId }` values migrate to the current shape. Missing IDs are cleaned back to `null`. |
| `comlog_sessions` | `localStorage` | Record keyed by session ID. Values are `GameSession` objects with `id`, `name`, `createdAt`, `updatedAt`, and nested `state`. | `GameProvider` validates that the top-level value is a record of session-like objects, fills missing state branches such as strategic options and turn objectives, and writes migrated sessions back. `state.selectedList` currently stores `none`, `listA`, or `listB`. |
| `comlog_active_session_id` | `localStorage` | Session ID string or `null`. | `GameProvider` validates that the value is a string or `null`, resolves it against `comlog_sessions`, and clears missing IDs back to `null`. |
| `sidebar_state` | Cookie | Boolean-ish string value written as `true` or `false`. | Owned by the sidebar UI primitive. It is independent of app data migrations. |

## Current Storage Utility

- Storage keys are centralized in `src/shared/storage/storage-keys.ts`.
- `src/shared/storage/storage-adapter.ts` owns JSON reads, writes, validation, migration execution, and recoverable warning reporting.
- `src/shared/storage/storage-schemas.ts` owns current validators and small compatibility migrations.
- `useLocalStorage` reads JSON during initial React state creation and writes JSON on setter calls.
- If a read fails, it logs a warning and returns the provided initial value.
- If a write fails, it logs a warning and keeps the React state update path from throwing.
- Functional updater calls now receive the latest queued React state value.

## Migration Notes

- Do not remove existing fields without a migration and tests because local browser data is production data for this app.
- Future migrations should preserve raw invalid values or report recoverable warnings before resetting data.
- Game session selected-list migration needs special care because old sessions point to active slots, not stable saved-list IDs.
