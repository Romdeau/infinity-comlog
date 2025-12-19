import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const METADATA_PATH = join(process.cwd(), 'src/data/metadata.json');
const OUTPUT_DIR = join(process.cwd(), 'public/data/factions');

async function fetchFactions() {
  console.log('--- Starting Faction Data Sync ---');

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load Metadata
  const metadata = JSON.parse(await Bun.file(METADATA_PATH).text());
  const factions = metadata.factions;

  console.log(`Found ${factions.length} factions in metadata.`);

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
        console.error(`  Failed to fetch ${id}: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      const filePath = join(OUTPUT_DIR, `${id}.json`);

      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  Saved to ${id}.json`);

      // Throttle slightly to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Error fetching ${id}:`, error);
    }
  }

  console.log('--- Sync Complete ---');
}

fetchFactions().catch(console.error);
