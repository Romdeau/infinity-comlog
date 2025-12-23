const fs = require('fs');
const meta = JSON.parse(fs.readFileSync('/Users/thomastaege/git/infinity-comlog/src/data/metadata.json', 'utf8'));
const ammos = {};
meta.ammunitions.forEach(a => ammos[a.id] = a.name);
const weaponMap = {};
meta.weapons.forEach(w => {
    if (!weaponMap[w.id]) weaponMap[w.id] = [];
    weaponMap[w.id].push({
        name: w.name,
        mode: w.mode || 'Standard',
        damage: w.damage,
        burst: w.burst,
        ammo: ammos[w.ammunition] || 'N',
        saving: w.saving,
        savingNum: w.savingNum,
        traits: w.properties || [],
        distance: w.distance
    });
});
const content = 'export interface WeaponMode {\n  name: string;\n  mode: string;\n  damage: string;\n  burst: string;\n  ammo: string;\n  saving: string;\n  savingNum: string;\n  traits: string[];\n  distance: {\n    short: { max: number; mod: string };\n    med: { max: number; mod: string };\n    long: { max: number; mod: string };\n    max: { max: number; mod: string };\n  };\n}\n\nexport const WEAPON_DATA: Record<number, WeaponMode[]> = ' + JSON.stringify(weaponMap, null, 2) + ';\n';
fs.writeFileSync('/Users/thomastaege/git/infinity-comlog/src/lib/weapon-data.ts', content);
