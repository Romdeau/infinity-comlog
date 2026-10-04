import { describe, expect, it } from 'vitest';
import type { FactionPayload } from '@/lib/faction-data-service';
import {
  buildCatalog,
  validateArmy,
  type ArmyDraft,
  type BuilderEntry,
} from './army-builder';
import pano from '../../../../public/data/factions/101.json';
import aleph from '../../../../public/data/factions/701.json';
import nomads from '../../../../public/data/factions/501.json';
import kosmoflot from '../../../../public/data/factions/306.json';
import { validateArmyDrafts } from './builder-storage';

const data: FactionPayload = {
  units: [
    {
      id: 1,
      name: 'Line troops',
      factions: [101],
      profileGroups: [
        {
          id: 1,
          profiles: [{ ava: 255 }],
          options: [
            { id: 1, points: 10, swc: '0', minis: 1 },
            { id: 2, points: 10, swc: '0', minis: 1, skills: [{ id: 119 }] },
            { id: 3, points: 20, swc: '1.5', minis: 1 },
            { id: 4, points: 20, swc: '+1', minis: 1 },
            { id: 5, points: 10, disabled: true },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Elite',
      factions: [101],
      profileGroups: [
        {
          id: 1,
          profiles: [{ ava: 1 }],
          options: [{ id: 1, points: 30, swc: '0', minis: 1 }],
        },
      ],
    },
    {
      id: 3,
      name: 'Mercenary',
      factions: [],
      profileGroups: [
        {
          id: 1,
          profiles: [{ ava: 1 }],
          options: [{ id: 1, points: 10, swc: '0' }],
        },
      ],
    },
  ],
};
const entry = (id = 1, optionId = 1, combatGroup = 1): BuilderEntry => ({
  key: crypto.randomUUID(),
  id,
  groupId: 1,
  optionId,
  combatGroup,
});

describe('official faction profile rules', () => {
  const panoData = pano as FactionPayload;
  const alephData = aleph as FactionPayload;
  const panoCatalog = buildCatalog(panoData, 101);
  const alephCatalog = buildCatalog(alephData, 701);
  const select = (id: number, groupId = 1, optionId = 1, combatGroup = 1) => ({
    ...entry(id, optionId, combatGroup),
    groupId,
  });
  const codes = (d: ArmyDraft, payload = panoData) =>
    validateArmy(d, buildCatalog(payload, d.factionId), payload).issues.map(
      (i) => i.code,
    );

  it('excludes mercenary-mode units, Spec-Ops and disabled pilots', () => {
    expect(panoCatalog.some((o) => o.id === 10265)).toBe(false);
    expect(panoCatalog.some((o) => o.id === 1912)).toBe(false);
    expect(panoCatalog.some((o) => o.id === 12 && o.groupId === 2)).toBe(false);
    expect(
      panoCatalog.find((o) => o.id === 12)?.includedNames.length,
    ).toBeGreaterThan(0);
  });
  it('shares AVA across loadouts and excludes alternative named characters', () => {
    expect(codes(draft([select(42, 1, 2), select(20)]))).toContain(
      'shared-availability',
    );
    expect(codes(draft([select(8, 1, 3), select(8, 1, 5)]))).toContain(
      'availability',
    );
  });
  it('requires a doctor/engineer controller for servants without using a troop slot', () => {
    const bot = select(37);
    const doctor = select(14);
    const option = panoCatalog.find((o) => o.id === 37);
    expect(option?.servant).toBe(true);
    expect(codes(draft([bot]))).toContain('controller');
    const linkedBot = { ...bot, controllerKey: doctor.key };
    const result = validateArmy(
      draft([doctor, linkedBot]),
      panoCatalog,
      panoData,
    );
    expect(result.troopers).toBe(1);
    expect(result.issues.map((i) => i.code)).not.toContain('controller');
    expect(codes(draft([doctor, { ...linkedBot, combatGroup: 2 }]))).toContain(
      'controller-group',
    );
    expect(
      codes(
        draft([
          doctor,
          linkedBot,
          { ...linkedBot, key: 'second' },
          { ...linkedBot, key: 'third' },
        ]),
      ),
    ).toContain('controller-limit');
  });
  it('requires the Pilot-X companion in the same combat group', () => {
    expect(codes(draft([select(1903, 2)]))).toContain('dependency');
    expect(codes(draft([select(1903, 2), select(1903, 1, 1, 2)]))).toContain(
      'dependency',
    );
    expect(codes(draft([select(1903, 2), select(1903)]))).not.toContain(
      'dependency',
    );
  });
  it('allows a Puppet Master alone and links separately bought Control peripherals', () => {
    const payload = nomads as FactionPayload;
    const master = select(1098);
    const bot = { ...select(1098, 2), controllerKey: master.key };
    const army = { ...draft([master]), factionId: 501 };
    expect(codes(army, payload)).toEqual(['lieutenant-missing']);
    expect(codes({ ...army, entries: [master, bot] }, payload)).toEqual([
      'lieutenant-missing',
    ]);
    expect(
      validateArmy(
        { ...army, entries: [master, bot] },
        buildCatalog(payload, 501),
        payload,
      ).troopers,
    ).toBe(1);
  });
  it('counts companion-team availability separately and permits two complete teams in different groups', () => {
    const payload = kosmoflot as FactionPayload;
    const army = { ...draft([select(1843), select(1843, 2)]), factionId: 306 };
    expect(codes(army, payload)).toEqual(['lieutenant-missing']);
    expect(
      codes(
        {
          ...army,
          entries: [
            ...army.entries,
            select(1843, 1, 1, 2),
            select(1843, 2, 1, 2),
          ],
        },
        payload,
      ),
    ).toEqual(['lieutenant-missing']);
    expect(codes({ ...army, entries: [select(1843)] }, payload)).toContain(
      'dependency',
    );
  });
  it('requires two or three distinct Posthuman proxies in one group, counting as one trooper', () => {
    const proxyDraft = (entries: BuilderEntry[]) => ({
      ...draft(entries),
      factionId: 701,
    });
    expect(codes(proxyDraft([select(597)]), alephData)).toContain('minimum');
    const validProxies = proxyDraft([select(597), select(597, 2)]);
    expect(validateArmy(validProxies, alephCatalog, alephData).troopers).toBe(
      1,
    );
    expect(codes(validProxies, alephData)).toEqual(['lieutenant-missing']);
    expect(codes(proxyDraft([select(597), select(597)]), alephData)).toContain(
      'availability',
    );
    expect(
      codes(proxyDraft([select(597), select(597, 2, 1, 2)]), alephData),
    ).toContain('linked-group');
    expect(
      codes(
        proxyDraft([
          select(597),
          select(597, 2),
          select(597, 4),
          select(597, 5),
        ]),
        alephData,
      ),
    ).toContain('shared-availability');
  });
  it('recovers valid drafts without trusting malformed storage', () => {
    const good = draft([entry()]);
    expect(validateArmyDrafts({ good, broken: { entries: 'oops' } })).toEqual({
      good,
    });
    expect(validateArmyDrafts(null)).toBeUndefined();
    expect(validateArmyDrafts({ bad: { ...good, pointsLimit: -1 } })).toEqual(
      {},
    );
  });
});
const draft = (entries: BuilderEntry[], pointsLimit = 300): ArmyDraft => ({
  name: 'Test army',
  factionId: 101,
  pointsLimit,
  entries,
});
const check = (entries: BuilderEntry[], pointsLimit = 300, payload = data) =>
  validateArmy(
    draft(entries, pointsLimit),
    buildCatalog(payload, 101),
    payload,
  );

describe('standard army building', () => {
  it('only offers faction-legal, enabled options', () => {
    expect(buildCatalog(data, 101).map((x) => [x.id, x.optionId])).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 1],
    ]);
  });
  it('scales SWC to the agreed limit, including custom formats', () => {
    for (const [points, swc] of [
      [100, 2],
      [200, 4],
      [300, 6],
      [175, 3.5],
    ]) {
      expect(check([entry(1, 2)], points).swcLimit).toBe(swc);
    }
  });
  it('requires exactly one lieutenant and permits unspent points', () => {
    expect(check([entry()]).issues.map((x) => x.code)).toContain(
      'lieutenant-missing',
    );
    expect(check([entry(1, 2)]).valid).toBe(true);
    expect(
      check([entry(1, 2), entry(1, 2)]).issues.map((x) => x.code),
    ).toContain('lieutenant-multiple');
  });
  it('enforces points, SWC and availability across the whole roster', () => {
    expect(
      check([entry(2), entry(2, 1, 2)]).issues.map((x) => x.code),
    ).toContain('availability');
    expect(
      check([entry(1, 3), entry(1, 3)], 100).issues.map((x) => x.code),
    ).toContain('swc');
    expect(check([entry(2)], 20).issues.map((x) => x.code)).toContain('points');
  });
  it('adds bonus SWC without spending it', () => {
    const result = check(
      [entry(1, 4), entry(1, 3), entry(1, 3), entry(1, 2)],
      100,
    );
    expect(result).toMatchObject({ swc: 3, swcLimit: 3, valid: true });
  });
  it('limits groups to ten and the army to fifteen troopers', () => {
    expect(
      check(Array.from({ length: 11 }, () => entry())).issues.map(
        (x) => x.code,
      ),
    ).toContain('combat-group');
    expect(
      check(
        Array.from({ length: 16 }, (_, i) => entry(1, 1, i < 8 ? 1 : 2)),
      ).issues.map((x) => x.code),
    ).toContain('troopers');
  });
  it('rejects invalid limits and unresolved or tampered loadouts', () => {
    expect(check([entry()], 0).issues.map((x) => x.code)).toContain('format');
    expect(check([entry(3)]).issues.map((x) => x.code)).toContain(
      'unavailable',
    );
    expect(check([entry(1, 5)]).issues.map((x) => x.code)).toContain(
      'unavailable',
    );
  });
});
