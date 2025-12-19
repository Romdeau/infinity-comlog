# Faction Data Management

This project uses official Infinity Army unit data to provide contextual assistance and human-readable troop names. Because this data changes with game updates, we use a standalone script to synchronize local files with the official API.

## Directory Structure

- `src/data/metadata.json`: Contains global data (factions, skills, weapons).
- `public/data/factions/`: Contains one JSON file per faction, named `{factionId}.json`.

## Synchronizing Data

To update the unit data for all factions, run the following command from the project root:

```bash
bun scripts/fetch-faction-data.ts
```

### How it works
1. It reads `src/data/metadata.json` to identify all valid faction IDs.
2. It makes a request to `https://api.corvusbelli.com/army/units/en/{id}` for each faction.
3. It includes the required `Origin: https://infinitytheuniverse.com` header to bypass access restrictions.
4. It saves the resulting JSON into `public/data/factions/{id}.json`.

## Data Format

The resulting files contain the full response from the Corvus Belli API, which includes:
- **Units**: High-level troop information.
- **Profiles**: Specific stats (MOV, CC, BS, etc.).
- **Options**: Loadout choices (Weapons, Skills, Costs).

## Frequency
You should run this script whenever a new N5 balance update or new faction is released by Corvus Belli.
