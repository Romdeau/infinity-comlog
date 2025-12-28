# Plan: Army List Data Persistence and Validation Refactor

This plan outlines the steps to refactor the army list storage mechanism to include raw base64 data, implement schema validation, and provide user-facing data management tools.

## Phase 1: Foundation and Types [checkpoint: e73db0c]
Refactor the data models to support the new storage requirements and ensure type safety.

- [x] Task: Define `StoredArmyList` interface in `src/lib/unit-service.ts` (including `rawBase64`, `schemaVersion`, `importTimestamp`, `validationHash`). e73db0c
- [x] Task: Create a utility function to generate a validation hash for an `EnrichedArmyList`. e73db0c
- [x] Task: Create a migration utility to convert legacy `EnrichedArmyList` records to the new `StoredArmyList` format. e73db0c
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation and Types' (Protocol in workflow.md) e73db0c

## Phase 2: Storage Layer Refactor [checkpoint: 8468f30]
Update the context and services to handle the new `StoredArmyList` structure.

- [x] Task: Update `ArmyContext` to use `Record<string, StoredArmyList>` for `storedLists`. 9f209be
- [x] Task: Update `ArmyListImporter` to capture and pass the `rawBase64` string during the import process. 9f209be
- [x] Task: Update `saveList` in `ArmyContext` to populate the new metadata fields. 9f209be
- [x] Task: Conductor - User Manual Verification 'Phase 2: Storage Layer Refactor' (Protocol in workflow.md) 8468f30

## Phase 3: Validation & Automatic Migration
Implement startup validation and the ability to re-parse lists from their stored base64.

- [x] Task: Implement a schema validation check that runs in `ArmyProvider` on initialization. 945b97b
- [x] Task: Implement logic to automatically attempt a re-parse of a list if its `schemaVersion` is outdated or `validationHash` is invalid. 945b97b
- [x] Task: Add error handling and notifications for failed automatic re-parses. 16156e9
- [~] Task: Conductor - User Manual Verification 'Phase 3: Validation & Automatic Migration' (Protocol in workflow.md)

## Phase 4: Settings Page Implementation [checkpoint: 55b17b4]
Create a dedicated space for application settings and data management.

- [x] Task: Scaffold the `Settings` page component (`src/pages/settings.tsx`). 52e977c
- [x] Task: Add the `/settings` route to `App.tsx`. 52e977c
- [x] Task: Update `AppSidebar` (specifically the User/Profile section) to link to the new Settings page. 52e977c
- [x] Task: Conductor - User Manual Verification 'Phase 4: Settings Page Implementation' (Protocol in workflow.md) 55b17b4

## Phase 5: Global and Individual Data Actions
Implement the "Re-import All" and "Export" functionalities.

- [ ] Task: Implement the `reimportAllLists` function in `ArmyContext` that iterates through all stored lists and re-parses their `rawBase64`.
- [ ] Task: Add the "Re-import All Lists" button and status feedback to the Settings page.
- [ ] Task: Add an "Export List" button to the army list display in `ArmyManager` to copy the `rawBase64` to the clipboard.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Global and Individual Data Actions' (Protocol in workflow.md)
