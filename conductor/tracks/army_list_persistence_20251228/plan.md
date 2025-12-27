# Plan: Army List Data Persistence and Validation Refactor

This plan outlines the steps to refactor the army list storage mechanism to include raw base64 data, implement schema validation, and provide user-facing data management tools.

## Phase 1: Foundation and Types [checkpoint: e73db0c]
Refactor the data models to support the new storage requirements and ensure type safety.

- [x] Task: Define `StoredArmyList` interface in `src/lib/unit-service.ts` (including `rawBase64`, `schemaVersion`, `importTimestamp`, `validationHash`). e73db0c
- [x] Task: Create a utility function to generate a validation hash for an `EnrichedArmyList`. e73db0c
- [x] Task: Create a migration utility to convert legacy `EnrichedArmyList` records to the new `StoredArmyList` format. e73db0c
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation and Types' (Protocol in workflow.md) e73db0c

## Phase 2: Storage Layer Refactor
Update the context and services to handle the new `StoredArmyList` structure.

- [ ] Task: Update `ArmyContext` to use `Record<string, StoredArmyList>` for `storedLists`.
- [ ] Task: Update `ArmyListImporter` to capture and pass the `rawBase64` string during the import process.
- [ ] Task: Update `saveList` in `ArmyContext` to populate the new metadata fields.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Storage Layer Refactor' (Protocol in workflow.md)

## Phase 3: Validation & Automatic Migration
Implement startup validation and the ability to re-parse lists from their stored base64.

- [ ] Task: Implement a schema validation check that runs in `ArmyProvider` on initialization.
- [ ] Task: Implement logic to automatically attempt a re-parse of a list if its `schemaVersion` is outdated or `validationHash` is invalid.
- [ ] Task: Add error handling and notifications for failed automatic re-parses.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Validation & Automatic Migration' (Protocol in workflow.md)

## Phase 4: Settings Page Implementation
Create a dedicated space for application settings and data management.

- [ ] Task: Scaffold the `Settings` page component (`src/pages/settings.tsx`).
- [ ] Task: Add the `/settings` route to `App.tsx`.
- [ ] Task: Update `AppSidebar` (specifically the User/Profile section) to link to the new Settings page.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Settings Page Implementation' (Protocol in workflow.md)

## Phase 5: Global and Individual Data Actions
Implement the "Re-import All" and "Export" functionalities.

- [ ] Task: Implement the `reimportAllLists` function in `ArmyContext` that iterates through all stored lists and re-parses their `rawBase64`.
- [ ] Task: Add the "Re-import All Lists" button and status feedback to the Settings page.
- [ ] Task: Add an "Export List" button to the army list display in `ArmyManager` to copy the `rawBase64` to the clipboard.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Global and Individual Data Actions' (Protocol in workflow.md)
