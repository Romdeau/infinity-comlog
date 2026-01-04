
import { ArmyParser } from '../src/lib/army-parser.ts';
import { unitService } from '../src/lib/unit-service.ts';

// Mock fetch for faction data since we are in node/bun
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(unitService as any).getFactionData = async (id: number) => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'factions', `${id}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

const code = 'axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D';

async function run() {
  const parser = new ArmyParser(code);
  const list = parser.parse();
  const enriched = await unitService.enrichArmyList(list);

  console.log('Army Name:', enriched.armyName);
  
  enriched.combatGroups.forEach(group => {
    console.log(`
Group ${group.groupNumber}:`);
    group.members.forEach(m => {
      console.log(`- ${m.name} (${m.isc}) [${m.points} pts]`);
      m.profiles.forEach(p => {
        console.log(`  Stats: ${p.mov} CC:${p.cc} BS:${p.bs} PH:${p.ph} WIP:${p.wip} ARM:${p.arm} BTS:${p.bts} W:${p.w} S:${p.s}`);
        console.log(`  Skills: ${p.resolvedSkills.join(', ')}`);
        console.log(`  Weapons: ${p.resolvedWeapons.map(w => w.name).join(', ')}`);
      });
    });
  });
}

run();
