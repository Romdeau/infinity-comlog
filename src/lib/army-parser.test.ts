import { readFileSync } from 'fs';
import { afterEach, describe, expect, it } from 'vitest';
import { armyCodeFixtures } from '../test/army-codes';
import { ArmyParser } from './army-parser';
import { clearFactionDataCacheForTest, setFactionDataForTest, type FactionPayload } from './faction-data-service';
import { unitService } from './unit-service';

afterEach(() => {
  clearFactionDataCacheForTest();
  unitService.clearCacheForTest();
});

describe('current official Army exports', () => {
  it('preserves and applies Team Ops choices without changing shared faction data', async () => {
    const parsed = new ArmyParser(armyCodeFixtures[4].code).parse();
    expect(parsed.combatGroups[0].members.slice(0, 3).map(member => member.teamOps)).toEqual([
      [{ type: 'stat', stat: 'bts', q: 2 }],
      [{ type: 'skill', id: 28, extra: [6] }],
      [{ type: 'skill', id: 213 }],
    ]);
    const faction: FactionPayload = JSON.parse(readFileSync('public/data/factions/1102.json', 'utf8'));
    const original = JSON.stringify(faction);
    setFactionDataForTest(1102, faction);
    const enriched = await unitService.enrichArmyList(parsed);
    const [light, heavy, bot] = enriched.combatGroups[0].members;
    expect(light.profiles[0].bts).toBe(5);
    expect(heavy.profiles[0].resolvedSkills).toContain('Mimetism (-3)');
    expect(bot.profiles[0].resolvedSkills).toContain('Tactical Awareness');
    expect(heavy.profiles[0].bts).toBe(3);
    expect(JSON.stringify(faction)).toBe(original);
    expect(await unitService.enrichArmyList(parsed)).toEqual(enriched);
    expect(await unitService.enrichArmyList(JSON.parse(JSON.stringify(parsed)))).toEqual(enriched);
  });

  it('applies movement, weapon and equipment selections using the existing metadata resolvers', async () => {
    const parsed = new ArmyParser(armyCodeFixtures[4].code).parse();
    parsed.combatGroups[0].members[0].teamOps = [
      { type: 'stat', stat: 'move0', q: 15 },
      { type: 'stat', stat: 'move1', q: 10 },
      { type: 'weapon', id: 19, extra: [303] },
      { type: 'equip', id: 114 },
      { type: 'skill', id: 28, extra: [6] },
    ];
    setFactionDataForTest(1102, JSON.parse(readFileSync('public/data/factions/1102.json', 'utf8')));
    const metric = await unitService.enrichArmyList(parsed, 'metric');
    const profile = metric.combatGroups[0].members[0].profiles[0];
    expect(profile.mov).toBe('15-10');
    expect(profile.weapons).toContainEqual({ id: 19, q: 1, extra: [303] });
    expect(profile.equip).toContainEqual({ id: 114, q: 1 });
    expect(profile.skills.filter(skill => skill.id === 28)).toHaveLength(1);
    const imperial = await unitService.enrichArmyList(parsed, 'imperial');
    expect(imperial.combatGroups[0].members[0].profiles[0].mov).toBe('6-4');
  });

  it('rejects malformed or unsupported Team Ops attributes', () => {
    const bytes = atob(armyCodeFixtures[4].code);
    for (const invalid of [bytes.replace('"bts"', '"xyz"'), bytes.replace('"q":2', '"q":x')]) {
      expect(() => new ArmyParser(btoa(invalid)).parse()).toThrow('Invalid or unsupported');
    }
  });

  it('reads original exports without reinforcement flags and with nonzero entry IDs', () => {
    const code = btoa(String.fromCharCode(101, 0, 0, 129, 44, 1, 1, 1, 7, 33, 1, 4, 0));
    expect(new ArmyParser(code).parse().combatGroups).toEqual([
      { groupNumber: 1, members: [{ id: 33, groupId: 1, optionId: 4, name: '' }] },
    ]);
  });

  it('retains support for older exports without the special-table field', () => {
    const code = 'axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D';
    const list = new ArmyParser(code).parse();
    expect(list.combatGroups.map(group => group.members.length)).toEqual([9, 6]);
    expect(list.combatGroups[1].members.at(-1)).toMatchObject({ id: 1824, groupId: 1, optionId: 5 });
  });

  it('rejects truncated and trailing data instead of returning a partial list', () => {
    const bytes = atob(armyCodeFixtures[0].code);
    expect(() => new ArmyParser(btoa(bytes.slice(0, -1))).parse()).toThrow();
    expect(() => new ArmyParser(btoa(bytes + '\x00')).parse()).toThrow();
  });

  it.each(armyCodeFixtures)('parses and resolves every selection in $name', async (fixture) => {
    const parsed = new ArmyParser(fixture.code).parse();
    expect(parsed.sectoralId).toBe(fixture.sectoralId);
    expect(parsed.armyName.trim()).toBe(fixture.name);
    expect(parsed.points).toBe(300);
    expect(parsed.combatGroups.map(group => group.members.length)).toEqual(fixture.groupSizes);
    expect(parsed.combatGroups.map(group => group.groupNumber)).toEqual([1, 2]);

    const faction: FactionPayload = JSON.parse(readFileSync(`public/data/factions/${fixture.sectoralId}.json`, 'utf8'));
    for (const member of parsed.combatGroups.flatMap(group => group.members)) {
      const unit = faction.units.find(unit => unit.id === member.id);
      expect(unit, `unit ${member.id}`).toBeDefined();
      const profile = unit?.profileGroups.find(profile => profile.id === member.groupId);
      expect(profile, `profile ${member.id}/${member.groupId}`).toBeDefined();
      expect(profile?.options.find(option => option.id === member.optionId), `option ${member.id}/${member.groupId}/${member.optionId}`).toBeDefined();
    }
    setFactionDataForTest(fixture.sectoralId, faction);
    const enriched = await unitService.enrichArmyList(parsed);
    for (const member of enriched.combatGroups.flatMap(group => group.members)) {
      expect(member.name).not.toMatch(/^(Unknown|Unit \d)/);
      expect(member.profiles.length).toBeGreaterThan(0);
    }
  });
});
