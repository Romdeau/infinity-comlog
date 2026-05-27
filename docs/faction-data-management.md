# Faction Data Management

This project uses official Infinity Army unit data to provide contextual assistance and human-readable troop names. Because this data changes with game updates, we use a standalone script to synchronize local files with the official API.

## Directory Structure

- `src/data/metadata.json`: Global metadata used by the app. The faction sync script reads this file to determine which faction IDs to fetch.
- `public/data/factions/`: One JSON file per faction, named `{factionId}.json`.

## What Is Automated Today

- `public/data/factions/*.json` can be regenerated from the Corvus Belli API.
- `src/data/metadata.json` is a prerequisite for that process, but this repo does not currently include a dedicated script to regenerate it.
- Direct automated metadata pulls are currently access denied, so refresh `src/data/metadata.json` manually from a live Infinity Army app copy before syncing faction files.

If `metadata.json` is out of date, update that file first from the live app payload, then run the faction sync.

## Synchronizing Data

To regenerate the faction data from the project root, run:

```bash
bun run data:sync:factions
```

The command will:

1. Read faction IDs from `src/data/metadata.json`.
2. Fetch `https://api.corvusbelli.com/army/units/en/{id}` for each faction.
3. Write the response to `public/data/factions/{id}.json`.
4. Skip known metadata-only factions that do not have an upstream unit payload.
5. Exit with a non-zero status if any other faction download fails.

## Known Outlier

- `901` / `Non-Aligned Armies` exists in `src/data/metadata.json`, but the Corvus Belli unit endpoint does not expose a corresponding JSON payload for it.
- The upstream URL returns `200 OK` with an XML `NoSuchKey` body instead of faction JSON.
- The sync script treats this as a metadata-only faction and skips writing `public/data/factions/901.json`.
- The actual loadable NA2 faction files are the child factions such as `902`, `904`, `905`, `908`, and `909`.

## Recommended Regeneration Workflow

1. Confirm `src/data/metadata.json` reflects the Infinity Army data version you want to ship.
2. Run `bun run data:sync:factions`.
3. Review the command output for any failed faction IDs.
4. Inspect the changed files in `public/data/factions/`.
5. Run the app or relevant tests before committing.

## Verification

After syncing:

- The command should finish without listing any failed faction IDs.
- It is expected to log a skip for `901` / `Non-Aligned Armies` unless the upstream API changes.
- Updated files should appear under `public/data/factions/`.
- The top-level `version` field inside a faction JSON should match the upstream Infinity Army payload for that refresh.

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
