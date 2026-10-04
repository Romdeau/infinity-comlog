import { beforeEach, describe, expect, it } from 'vitest';
import pano from '../../../../public/data/factions/101.json';
import {
  setFactionDataForTest,
  type FactionPayload,
} from '@/lib/faction-data-service';
import { unitService } from '@/lib/unit-service';
import { enrichArmyDraft } from './builder-service';
import type { ArmyDraft } from './army-builder';

const draft: ArmyDraft = {
  name: 'Patrol',
  factionId: 101,
  pointsLimit: 300,
  entries: [
    { key: 'lt', id: 1, groupId: 1, optionId: 10, combatGroup: 1 },
    { key: 'tag', id: 12, groupId: 1, optionId: 1, combatGroup: 2 },
  ],
};
describe('builder list hydration', () => {
  beforeEach(() => {
    setFactionDataForTest(101, pano as FactionPayload);
    unitService.clearCacheForTest();
  });
  it('saves the format, faction, groups and editable draft without inventing an army code', async () => {
    const list = await enrichArmyDraft(draft, 'imperial');
    expect(list).toMatchObject({
      armyName: 'Patrol',
      sectoralId: 101,
      points: 300,
      builderDraft: draft,
    });
    expect(list.builderDraft).not.toBe(draft);
    expect(list.rawCode).toBeUndefined();
    expect(list.combatGroups.map((g) => g.groupNumber)).toEqual([1, 2]);
    expect(list.combatGroups[0].members[0].isLieutenant).toBe(true);
    const tag = list.combatGroups[1].members[0];
    expect(tag.points).toBe(97);
    expect(tag.profiles.length).toBeGreaterThan(1);
    expect(
      tag.profiles.some((p) => p.name === 'Crabbot Ancillary Remote Unit'),
    ).toBe(true);
  });
  it('re-enriches measurements from profile IDs and rejects illegal saved drafts', async () => {
    const list = await enrichArmyDraft(draft, 'metric');
    expect(list.combatGroups[0].members[0].profiles[0].mov).toBe('10-10');
    await expect(
      enrichArmyDraft({ ...draft, pointsLimit: 50 }, 'imperial'),
    ).rejects.toThrow('points');
    await expect(
      enrichArmyDraft({ ...draft, entries: [] }, 'imperial'),
    ).rejects.toThrow('Lieutenant');
  });
});
