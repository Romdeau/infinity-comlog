import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const METADATA_PATH = join(process.cwd(), 'src/data/metadata.json');
const OUTPUT_DIR = join(process.cwd(), 'public/data/factions');
const KNOWN_METADATA_ONLY_FACTIONS = new Set([901]);

async function fetchFactions() {
  console.log('--- Starting Faction Data Sync ---');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load Metadata
  const metadata = JSON.parse(await Bun.file(METADATA_PATH).text());
  const factions = metadata.factions;

  if (!Array.isArray(factions) || factions.length === 0) {
    throw new Error(`No factions found in ${METADATA_PATH}`);
  }

  console.log(`Found ${factions.length} factions in metadata.`);

  let successCount = 0;
  const failures: Array<{ id: number; name: string; reason: string }> = [];

  for (const faction of factions) {
    const { id, name } = faction;
    console.log(`Fetching [${id}] ${name}...`);

    try {
      const response = await fetch(`https://api.corvusbelli.com/army/units/en/${id}`, {
        headers: {
          'Origin': 'https://infinitytheuniverse.com',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        const reason = `${response.status} ${response.statusText}`;
        console.error(`  Failed to fetch ${id}: ${reason}`);
        failures.push({ id, name, reason });
        continue;
      }

      const responseText = await response.text();

      if (!responseText.trim().startsWith('{')) {
        const reason = 'Upstream did not return a JSON faction payload';

        if (KNOWN_METADATA_ONLY_FACTIONS.has(id)) {
          console.log(`  Skipping ${id}. ${name} is metadata-only upstream.`);
          continue;
        }

        console.error(`  Failed to fetch ${id}: ${reason}`);
        failures.push({ id, name, reason });
        continue;
      }

      const data = JSON.parse(responseText);
      const filePath = join(OUTPUT_DIR, `${id}.json`);

      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  Saved to ${id}.json`);
      successCount += 1;

      // Throttle slightly to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error fetching ${id}:`, error);
      failures.push({
        id,
        name,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  console.log(`Fetched ${successCount} of ${factions.length} faction files.`);

  if (failures.length > 0) {
    console.error('Faction sync completed with failures:');
    for (const failure of failures) {
      console.error(`  [${failure.id}] ${failure.name}: ${failure.reason}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('--- Sync Complete ---');
}

fetchFactions().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
