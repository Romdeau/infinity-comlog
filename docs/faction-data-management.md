# Faction data management

The app uses official Infinity Army metadata and unit data. Refresh both from the project root:

```bash
bun run data:sync
```

On Windows, run Bun in WSL as described in the project guidelines.

The command downloads and validates `src/data/metadata.json`, then reads its faction IDs and refreshes `public/data/factions/{id}.json`. Metadata includes weapon, skill, equipment, and hacking program definitions, so refresh it along with the faction files after game updates.

You can also run either step separately:

```bash
bun run data:sync:metadata
bun run data:sync:factions
```

The faction-only command uses the existing local metadata. Both commands exit non-zero on failures. Failed or invalid downloads leave the corresponding local file unchanged. A faction run can update some files before another request fails; review the summary and rerun the command before shipping a partial refresh.

## Upstream requests

- Metadata: `https://api.corvusbelli.com/army/infinity/en/metadata`
- Factions: `https://api.corvusbelli.com/army/units/en/{id}`
- Required request origin: `https://infinityuniverse.com`

The official Army site moved from `infinitytheuniverse.com` to `infinityuniverse.com`. Sending the old origin returns HTTP 403, even though the API URLs have not changed. If access fails again, inspect the live Army app's domain and requests before changing endpoints.

Faction `901`, Non-Aligned Armies, previously returned HTTP 200 with an XML `NoSuchKey` body. It now returns valid unit data and is saved normally. The script retains a skip only for that specific missing-key response on `901`; other invalid responses are failures.

## Verification

1. Run `bun run data:sync` and check that no downloads failed.
2. Review changes in `src/data/metadata.json` and `public/data/factions/`.
3. Run `bun run check`.
4. Open the app and import or refresh a saved army list to check unit names and profiles.

Faction payloads include an upstream `version` field. Versions can differ between factions.

## Runtime loading

App code loads faction JSON through `src/lib/faction-data-service.ts`. `getFactionDataUrl()` prefixes URLs with `import.meta.env.BASE_URL` for the GitHub Pages `/infinity-comlog/` subpath. `unitService` enriches parser output. Tests use `setFactionDataForTest()` and `clearFactionDataCacheForTest()` for deterministic payloads.
