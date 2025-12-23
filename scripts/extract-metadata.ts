import fs from 'fs';

const metadata = JSON.parse(fs.readFileSync('src/data/metadata.json', 'utf8'));

const skillMap = {};
metadata.skills.forEach(s => {
  skillMap[s.id] = s.name;
});

const weaponMap = {};
metadata.weapons.forEach(w => {
  weaponMap[w.id] = w.name;
});

const equipMap = {};
metadata.equips.forEach(e => {
  equipMap[e.id] = e.name;
});

console.log('export const SKILL_MAP: Record<number, string> = ' + JSON.stringify(skillMap, null, 2) + ';');
console.log('export const WEAPON_MAP: Record<number, string> = ' + JSON.stringify(weaponMap, null, 2) + ';');
console.log('export const EQUIP_MAP: Record<number, string> = ' + JSON.stringify(equipMap, null, 2) + ';');
