# Infinity N5 Metadata Deep Dive

This document provides a comprehensive technical breakdown of the data structures used in the Infinity Comlog application, specifically focusing on the `metadata.json` file and the faction-specific data files.

## 1. Global Metadata (`metadata.json`)

The `metadata.json` file acts as the global registry for game-wide constants. It is the source of truth for everything that isn't specific to a single unit.

### Factions & Sectorials
Factions are organized in a parent-child hierarchy.
- **Parent Factions**: (e.g., PanOceania, Yu Jing) have `parent: 0`.
- **Sectorials**: (e.g., Military Orders, Invincible Army) have a `parent` ID pointing to their main faction.
- **Logo URLs**: Each faction entry contains a `logo` URL pointing to Corvus Belli's assets.

### Weapon Database
The `weapons` array is the most complex part of the global metadata.
- **ID Sharing**: MULTI weapons (like the MULTI Rifle) share a single ID but have multiple entries in the array, distinguished by the `mode` field.
- **Range Bands**: Distances are stored in centimeters. Our application converts these to inches using a `cm / 2.5` calculation.
- **Ammunition**: The `ammunition` field is an ID that maps to the `ammunitions` array.

### Skills, Equipment, and Tables
- **Skills/Equips**: Simple ID-to-Name mappings.
- **Tables**: `martialArts`, `metachemistry`, and `booty` contain the result rows for their respective game tables.

---

## 2. Faction-Specific Data (`public/data/factions/*.json`)

While `metadata.json` contains global rules, the unit-specific data is split into individual files per faction/sectoral to optimize load times.

### Unit Hierarchy
1. **Unit (`idArmy`)**: The top-level entity (e.g., "Fusiliers").
2. **Profile Group (`groupId`)**: A collection of related profiles (e.g., "Fusilier", "Fusilier (Forward Observer)").
3. **Profile**: The actual stat-line (MOV, CC, BS, etc.).
4. **Option (`optionId`)**: The specific loadout (Weapons, Skills, Equipment) chosen for that unit.

### Key Fields
- **`str`**: A boolean flag. If `true`, the unit uses **Structure (STR)**; if `false`, it uses **Vitality (VITA)**.
- **`type`**: An integer mapping to troop classifications (1: LI, 2: MI, 3: HI, 4: TAG, 5: REM, 6: SK, 7: WB).
- **`move`**: An array of two values in centimeters (e.g., `[10, 10]` for 4-4).

---

## 3. Data Processing Pipeline

### `ArmyParser` (`src/lib/army-parser.ts`)
The parser decodes the Corvus Belli Base64 army codes. It extracts:
- Sectoral ID
- Points/SWC totals
- Combat Groups
- Unit IDs (`idArmy`), Group IDs (`groupId`), and Option IDs (`optionId`).

### `UnitService` (`src/lib/unit-service.ts`)
The service "enriches" the raw IDs from the parser by:
1. Fetching the correct faction JSON.
2. Matching the `idArmy` to find the unit.
3. Navigating the `profileGroups` and `options` to find the exact loadout.
4. Formatting raw values (e.g., converting `move` from cm to inches).
5. Determining if the unit uses `STR` or `VITA`.

### `WeaponData` Generator (`scripts/fetch-faction-data.ts`)
Because the global `metadata.json` is too large to search efficiently at runtime for every weapon mode, we use a script to pre-process it into `src/lib/weapon-data.ts`.
- It groups weapons by ID into a `Record<number, WeaponMode[]>`.
- This allows the UI to instantly render all fire modes for a weapon (like the MULTI Red Fury) without complex filtering.

---

## 4. UI Integration

### `UnitCard` & `UnitDetailDialog`
These components consume the `EnrichedTrooper` object.
- **Dynamic Labels**: They check `isStr` to toggle between "STR" and "VITA" labels.
- **Range Analysis**: They use the `WEAPON_DATA` registry to render the `RangeBands` component, which calculates the correct color-coded modifiers for every 8-inch increment.
- **Troop Badges**: They map the `type` integer to the standard Infinity abbreviations (HI, MI, etc.).

---

## 5. Maintenance
When Corvus Belli updates the game (e.g., a new N5 patch), the `metadata.json` and faction files should be re-fetched using the `fetch-faction-data.ts` script to ensure all IDs and stats remain accurate.
