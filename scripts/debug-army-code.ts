
import { ArmyParser } from '../src/lib/army-parser.ts';

const code = 'axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D';

const parser = new ArmyParser(code);
const list = parser.parse();

console.log('Army Name:', list.armyName);
console.log('Sectoral ID:', list.sectoralId);

list.combatGroups.forEach(group => {
  console.log(`\nGroup ${group.groupNumber}:`);
  group.members.forEach(m => {
    console.log(`  Unit ID: ${m.id}, Group ID: ${m.groupId}, Option ID: ${m.optionId}`);
  });
});

