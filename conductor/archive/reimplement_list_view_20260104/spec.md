# Specification: Reimplement Army List View & Parsing

## 1. Problem Statement
The current army list parser is incomplete. It correctly decodes the binary structure (sectorial ID, unit IDs, etc.) but fails to map these IDs to the actual game data (Unit Names, Profiles, Weapons, Skills).
- **Symptom**: Importing a Kestrel Colonial Force list displays "Unit 935" instead of "Tech-Bee".
- **Root Cause**: `ArmyParser` uses a hardcoded fallback `Unit ${id}` instead of looking up data in the sectorial JSON files.

## 2. Goals
- **Accurate Parsing**: Fully map binary army codes to rich data models.
- **Data Integrity**: Ensure every unit, weapon, skill, and piece of equipment is correctly resolved from the source JSONs.
- **Rich UI**: Provide a "per unit" overview similar to the official army app, displaying:
    -   Unit Name & ISC
    -   Profile Stats (MOV, CC, BS, PH, WIP, ARM, BTS, W/STR, S)
    -   Special Skills & Equipment
    -   Weapons (with range bands, damage, burst, etc.)
-   **Architecture**: Separate the "Binary Decoding" concern from the "Data Hydration" concern.

## 3. Technical Approach

### 3.1. Parsing / Hydration Split
We will refactor `src/lib/army-parser.ts` or create a new `src/lib/army-list-service.ts`.
- **Phase 1: Decoding**: Decode the base64 string into a raw structure (Sectorial ID, Combat Groups -> Unit ID + Group/Option Choice).
- **Phase 2: Hydration**: 
    -   Load the corresponding Sectorial JSON (e.g., `107.json`).
    -   Find the Unit by ID.
    -   Find the specific Profile by `groupChoice` / `optionChoice` (needs verification of how these map to the JSON structure).
    -   Resolve Weapon/Skill/Equip IDs to their names/stats (using `metadata.json` or constants).

### 3.2. Data Mapping Strategy
- **Sectorial Data**: Located in `public/data/factions/{id}.json`.
- **Unit Lookup**: Map `unitId` from the code to `unit.id` in the JSON.
- **Profile Lookup**: The army code contains `groupChoice` (often called "Group" or "Profile Group") and `optionChoice` (often called "Option").
    -   In the JSON, units have `filters` or specific profile structures. We need to match the binary indices to the JSON array indices or IDs.
    -   *Investigation required*: Verify how `groupChoice` and `optionChoice` map to the JSON `units` > `profiles` structure.

### 3.3. UI Updates
- Refactor `ArmyListViewPage` to render the fully hydrated data.
- Ensure the "Unit Card" component handles all variations (multiple weapons, weird equipment, etc.).

## 4. Verification
- **Test Case**: The Kestrel list provided by the user (`axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D`).
- **Success Criteria**: 
    -   "Unit 935" renders as "Tech-Bee".
    -   All other units display correct names and stats.
    -   No "undefined" or "Unit X" fallbacks visible.

## 5. Tasks
1.  **Investigate**: Confirm the mapping of `groupChoice/optionChoice` to JSON profile structure.
2.  **Refactor Parser**: Implement `ArmyListHydrator`.
3.  **Update UI**: Connect the new hydrated list to the View.
