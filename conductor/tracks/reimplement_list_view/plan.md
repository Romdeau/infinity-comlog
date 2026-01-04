# Plan: Reimplement Army List View & Parsing

## Phase 1: Investigation & Setup
- [x] Analyze current `ArmyParser` and identifying missing data.
- [x] Verify mapping between Army Code IDs and Faction JSON data.
- [x] Create debug scripts to validate assumptions.
- [ ] Task: Conductor - User Manual Verification 'Investigation & Setup' (Protocol in workflow.md)

## Phase 2: Core Logic Implementation
- [x] Create `MetadataService` for unified data lookup.
- [x] Create `ArmyListService` to handle hydration.
- [x] Refactor `unit-service.ts` to use `MetadataService`.
- [ ] Task: Conductor - User Manual Verification 'Core Logic Implementation' (Protocol in workflow.md)

## Phase 3: UI Updates [checkpoint: b58254d]
- [x] Update `ArmyListViewPage` to display hydrated data (Skills, Weapons, Equip).
- [x] Update `ListAnalysisPage` to use resolved data for stats.
- [x] Update `UnitDetailDialog` to show full profile info.
- [x] Task: Conductor - User Manual Verification 'UI Updates' (Protocol in workflow.md)

## Phase 4: Verification
- [x] Verify Kestrel Colonial Force list renders correctly (Unit 935 -> Tech-Bee).
- [x] Verify multiple profiles (Su-Jian) render correctly.
- [x] Run project linting/type-checking.
- [ ] Task: Conductor - User Manual Verification 'Verification' (Protocol in workflow.md)
