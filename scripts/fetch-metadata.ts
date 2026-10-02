import { writeFileSync } from 'fs';
import { join } from 'path';
import { fetchArmyData } from './army-api';

async function fetchMetadata() {
  const data = await fetchArmyData('infinity/en/metadata');
  if (!data) throw new Error('Upstream metadata is missing');
  writeFileSync(join(process.cwd(), 'src/data/metadata.json'), JSON.stringify(data, null, 2));
  console.log('Saved src/data/metadata.json');
}

fetchMetadata().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
