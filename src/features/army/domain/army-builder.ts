import metadata from '@/data/metadata.json';
import type { ArmyList, Trooper } from '@/lib/army-parser';
import type {
  FactionPayload,
  FactionRelationRef,
} from '@/lib/faction-data-service';
import { MetadataService } from '@/lib/metadata-service';

export interface BuilderEntry extends Trooper {
  key: string;
  combatGroup: number;
  controllerKey?: string;
}

export interface ArmyDraft {
  name: string;
  factionId: number;
  pointsLimit: number;
  entries: BuilderEntry[];
}

export interface CatalogOption extends Trooper {
  key: string;
  unitName: string;
  name: string;
  points: number;
  swc: number;
  bonusSwc: number;
  ava: number;
  availabilityKey: string;
  skills: string[];
  weapons: string[];
  equipment: string[];
  notes: string[];
  lieutenant: boolean;
  peripheral: boolean;
  servant: boolean;
  cyberplug: boolean;
  control: boolean;
  controllerRefs: FactionRelationRef[];
  doctorEngineer: boolean;
  cyberController: boolean;
  jumper: boolean;
  included: Trooper[];
  includedNames: string[];
}

export interface ArmyIssue {
  code: string;
  message: string;
  blocking: boolean;
}

/** Reinforcement pools and the mercenary umbrella are not standalone standard armies. */
export const builderFactions = metadata.factions.filter(
  (f) => f.id % 100 < 90 && f.id !== 901,
);

export const optionKey = (ref: Trooper) =>
  `${ref.id}:${ref.groupId}:${ref.optionId}`;

function matchesRef(entry: Trooper, ref: FactionRelationRef) {
  return (
    entry.id === ref.unit &&
    (ref.profile === undefined || entry.groupId === ref.profile) &&
    (!ref.options || ref.options.includes(entry.optionId))
  );
}

/** Resolve eligible controllers, including faction-specific Control units. */
export function canControl(
  peripheral: CatalogOption,
  controller: CatalogOption,
) {
  if (controller.peripheral) return false;
  if (peripheral.servant) return controller.doctorEngineer;
  if (peripheral.cyberplug) return controller.cyberController;
  return peripheral.controllerRefs.some((ref) => matchesRef(controller, ref));
}

/** Build selectable loadouts from the faction payload, excluding optional mercenary mode. */
export function buildCatalog(
  data: FactionPayload,
  factionId: number,
): CatalogOption[] {
  return data.units.flatMap((unit) => {
    const id = unit.id ?? unit.idArmy;
    if (
      id === undefined ||
      (unit.factions && !unit.factions.includes(factionId))
    )
      return [];
    return unit.profileGroups.flatMap((group) => {
      const profile = group.profiles[0];
      const ava = profile?.ava ?? 0;
      if (ava <= 0) return [];
      return group.options.flatMap((option) => {
        const refs = [...(profile.skills || []), ...(option.skills || [])];
        const has = (skill: number) => refs.some((s) => s.id === skill);
        if (
          option.disabled ||
          option.points === undefined ||
          !Number.isFinite(option.points) ||
          option.points < 0 ||
          has(281) ||
          has(204)
        )
          return [];
        const swcText = String(option.swc ?? '0').trim();
        if (!/^\+?\d+(\.\d+)?$/.test(swcText)) return [];
        const skills = MetadataService.resolveSkills(refs, data.filters);
        const included = (option.includes || []).flatMap((i) =>
          Array.from({ length: i.q }, () => ({
            id,
            groupId: i.group,
            optionId: i.option,
          })),
        );
        const ref = { id, groupId: group.id, optionId: option.id };
        const relations = (data.relations || []).flatMap((r) => r.units);
        // Companion teams can reuse an ISC while giving each member its own AVA.
        const separateAva = relations.some((r) =>
          [r, ...(r.depends || [])].some(
            (p) => p.unit === id && p.profile === group.id,
          ),
        );
        return [
          {
            ...ref,
            key: optionKey(ref),
            unitName: unit.name.trim(),
            name: (option.name || profile.name || unit.name).trim(),
            points: option.points,
            swc: swcText.startsWith('+') ? 0 : Number(swcText),
            bonusSwc: swcText.startsWith('+') ? Number(swcText) : 0,
            ava,
            availabilityKey: `${id}:${separateAva || has(252) ? group.id : group.isc || unit.isc || unit.name}`,
            skills,
            weapons: [
              ...(profile.weapons || []),
              ...(option.weapons || []),
            ].map(
              (w) =>
                MetadataService.getWeaponName(w.id) +
                (w.extra?.length
                  ? ` (${w.extra.map((e) => MetadataService.getWeaponName(e)).join(', ')})`
                  : ''),
            ),
            equipment: MetadataService.resolveEquip(
              [...(profile.equip || []), ...(option.equip || [])],
              data.filters,
            ),
            notes: [unit.notes, group.notes].filter((n): n is string =>
              Boolean(n),
            ),
            lieutenant: has(119),
            peripheral: option.minis === 0 || has(243),
            servant: skills.some((s) => /Peripheral.*Servant/i.test(s)),
            cyberplug: skills.some((s) => /Peripheral.*Cyberplug/i.test(s)),
            control: skills.some((s) => /Peripheral.*Control/i.test(s)),
            controllerRefs: relations
              .filter((r) => matchesRef(ref, r))
              .flatMap((r) => r.depends || []),
            doctorEngineer: has(49) || has(53),
            cyberController: has(277),
            jumper: has(252),
            included,
            includedNames: included.map((i) => {
              const g = unit.profileGroups.find((g) => g.id === i.groupId);
              return (
                g?.options.find((o) => o.id === i.optionId)?.name ||
                g?.profiles[0]?.name ||
                'Included profile'
              );
            }),
          },
        ];
      });
    });
  });
}

/** Validate the entire draft, including incomplete requirements while editing. */
export function validateArmy(
  draft: ArmyDraft,
  catalog: CatalogOption[],
  data: FactionPayload,
) {
  const issues: ArmyIssue[] = [];
  const add = (code: string, message: string, blocking = true) =>
    issues.push({ code, message, blocking });
  const options = new Map(catalog.map((o) => [o.key, o]));
  const selected = draft.entries.flatMap((entry) => {
    const option = options.get(optionKey(entry));
    if (!option) {
      add(
        'unavailable',
        'A selected loadout is not available in this faction. Remove it to continue.',
      );
      return [];
    }
    return [{ entry, option }];
  });
  if (!Number.isSafeInteger(draft.pointsLimit) || draft.pointsLimit <= 0)
    add('format', 'Choose a positive whole-number points limit.');
  const points = selected.reduce((sum, s) => sum + s.option.points, 0);
  const swc = selected.reduce((sum, s) => sum + s.option.swc, 0);
  const swcLimit =
    draft.pointsLimit / 50 +
    selected.reduce((sum, s) => sum + s.option.bonusSwc, 0);
  if (points > draft.pointsLimit)
    add(
      'points',
      `Remove ${points - draft.pointsLimit} points to meet the ${draft.pointsLimit}-point limit.`,
    );
  if (swc > swcLimit)
    add(
      'swc',
      `SWC exceeds the allowance by ${Number((swc - swcLimit).toFixed(2))}.`,
    );
  const lieutenants = selected.filter((s) => s.option.lieutenant).length;
  if (lieutenants === 0)
    add('lieutenant-missing', 'Choose one Lieutenant loadout.', false);
  if (lieutenants > 1)
    add('lieutenant-multiple', 'An army must have exactly one Lieutenant.');
  const countTroopers = (rows: typeof selected) =>
    rows.filter((s) => !s.option.peripheral && !s.option.jumper).length +
    new Set(rows.filter((s) => s.option.jumper).map((s) => s.option.id)).size;
  const troopers = countTroopers(selected);
  if (troopers > 15)
    add('troopers', 'An army may contain at most 15 troopers.');
  const groups = [...new Set(draft.entries.map((e) => e.combatGroup))].sort(
    (a, b) => a - b,
  );
  const groupCounts = Object.fromEntries(
    groups.map((group) => [
      group,
      countTroopers(selected.filter((s) => s.entry.combatGroup === group)),
    ]),
  );
  for (const group of groups) {
    if (!Number.isSafeInteger(group) || group < 1 || group > 15)
      add('combat-group', 'Choose a valid combat group.');
    if (groupCounts[group] > 10)
      add('combat-group', `Combat group ${group} exceeds 10 troopers.`);
  }
  const availability = new Map<string, typeof selected>();
  for (const s of selected) {
    const bucket = availability.get(s.option.availabilityKey) || [];
    bucket.push(s);
    availability.set(s.option.availabilityKey, bucket);
  }
  for (const rows of availability.values()) {
    const ava = Math.min(...rows.map((s) => s.option.ava));
    if (ava !== 255 && rows.length > ava)
      add('availability', `${rows[0].option.name} exceeds AVA ${ava}.`);
  }
  const matches = (entry: BuilderEntry, ref: FactionRelationRef) =>
    entry.id === ref.unit &&
    (ref.profile === undefined || entry.groupId === ref.profile) &&
    (!ref.options || ref.options.includes(entry.optionId));
  for (const relation of data.relations || []) {
    const rows = selected.filter((s) =>
      relation.units.some((ref) => matches(s.entry, ref)),
    );
    if (relation.max !== undefined && rows.length > relation.max)
      add(
        'shared-availability',
        `${rows.map((s) => s.option.name).join(', ')} share a maximum availability of ${relation.max}.`,
      );
    if (
      rows.length &&
      rows.length < relation.min &&
      !relation.units.some((r) => r.depends)
    )
      add(
        'minimum',
        `${rows[0].option.unitName} requires at least ${relation.min} profiles.`,
        false,
      );
    if (
      relation.group &&
      !relation.units.some((r) => r.depends) &&
      new Set(rows.map((s) => s.entry.combatGroup)).size > 1
    )
      add(
        'linked-group',
        `${rows[0].option.unitName} profiles must share a combat group.`,
      );
    for (const ref of relation.units) {
      if (!ref.depends) continue;
      const dependants = selected.filter((s) => matches(s.entry, ref));
      const parents = selected.filter((s) =>
        ref.depends?.some((p) => matches(s.entry, p)),
      );
      if (
        ref.perParent &&
        dependants.length > parents.length &&
        parents.length > 0
      ) {
        add(
          'dependency-limit',
          `${dependants[0].option.name} is limited to one per required companion.`,
        );
      }
      for (const child of dependants) {
        if (
          !parents.some(
            (p) =>
              !(relation.group || ref.depends?.some((d) => d.group)) ||
              p.entry.combatGroup === child.entry.combatGroup,
          )
        ) {
          add(
            'dependency',
            `${child.option.name} needs its required companion${relation.group || ref.depends.some((d) => d.group) ? ' in the same combat group' : ''}.`,
            false,
          );
        }
      }
      if (ref.perParent) {
        for (const group of groups) {
          const children = dependants.filter(
            (s) => !relation.group || s.entry.combatGroup === group,
          );
          const companions = parents.filter(
            (s) => !relation.group || s.entry.combatGroup === group,
          );
          if (
            children.length < companions.length * relation.min ||
            children.length > companions.length
          ) {
            add(
              'dependency',
              'Each linked team needs the required companion in its combat group.',
              false,
            );
          }
          if (!relation.group) break;
        }
      }
      for (const dependency of ref.depends) {
        if (!dependency.minDependant || !dependency.min) continue;
        for (const group of groups) {
          const children = dependants.filter(
            (s) => !dependency.group || s.entry.combatGroup === group,
          );
          const companions = parents.filter(
            (s) =>
              matches(s.entry, dependency) &&
              (!dependency.group || s.entry.combatGroup === group),
          );
          if (
            children.length >= dependency.minDependant &&
            companions.length < dependency.min
          ) {
            add(
              'dependency',
              `${children[0].option.name} needs ${dependency.min} required companions${dependency.group ? ` in combat group ${group}` : ''}.`,
              false,
            );
          }
          if (!dependency.group) break;
        }
      }
    }
  }
  for (const s of selected.filter((s) => s.option.peripheral)) {
    const controller = selected.find(
      (c) => c.entry.key === s.entry.controllerKey,
    );
    const eligible = controller && canControl(s.option, controller.option);
    if (!eligible)
      add(
        'controller',
        `${s.option.name} needs an eligible ${s.option.servant ? 'Doctor or Engineer' : 'controller'}.`,
        false,
      );
    else if (controller.entry.combatGroup !== s.entry.combatGroup)
      add(
        'controller-group',
        `${s.option.name} must share its controller's combat group.`,
      );
  }
  for (const controller of selected) {
    const attached = selected.filter(
      (s) => s.entry.controllerKey === controller.entry.key,
    );
    if (
      attached.filter((s) => s.option.servant).length > 2 ||
      attached.filter((s) => s.option.cyberplug).length > 2 ||
      attached.filter((s) => s.option.control).length > 3
    )
      add(
        'controller-limit',
        `${controller.option.name} exceeds its peripheral limit: two Servants, two Cyberplugs, or three Control peripherals.`,
      );
    if (
      attached.some((s) => s.option.servant) &&
      attached.some((s) => s.option.cyberplug)
    )
      add(
        'controller-type',
        `${controller.option.name} cannot control both Servant and Cyberplug peripherals.`,
      );
  }
  return {
    valid: issues.length === 0,
    issues,
    points,
    swc,
    swcLimit,
    troopers,
    lieutenants,
    groupCounts,
  };
}

/** Keep the IDs needed for rehydration; the draft remains editable after saving. */
export function draftToArmyList(draft: ArmyDraft): ArmyList {
  const faction = builderFactions.find((f) => f.id === draft.factionId);
  return {
    sectoralId: draft.factionId,
    sectoralName: faction?.name || 'Unknown faction',
    armyName: draft.name.trim() || 'Untitled army',
    parentName: metadata.factions.find((f) => f.id === faction?.parent)?.name,
    logo: faction?.logo,
    points: draft.pointsLimit,
    combatGroups: [...new Set(draft.entries.map((e) => e.combatGroup))]
      .sort((a, b) => a - b)
      .map((groupNumber) => ({
        groupNumber,
        members: draft.entries
          .filter((e) => e.combatGroup === groupNumber)
          .map(({ id, groupId, optionId }) => ({ id, groupId, optionId })),
      })),
  };
}

/** Validate stored drafts before rendering or using IDs as loadout references. */
export function isArmyDraft(value: unknown): value is ArmyDraft {
  if (!value || typeof value !== 'object') return false;
  const d = value as ArmyDraft;
  return (
    typeof d.name === 'string' &&
    builderFactions.some((f) => f.id === d.factionId) &&
    Number.isSafeInteger(d.pointsLimit) &&
    d.pointsLimit > 0 &&
    Array.isArray(d.entries) &&
    d.entries.every(
      (e) =>
        e &&
        typeof e.key === 'string' &&
        [e.id, e.groupId, e.optionId, e.combatGroup].every(
          (n) => Number.isSafeInteger(n) && n > 0,
        ) &&
        (e.controllerKey === undefined || typeof e.controllerKey === 'string'),
    ) &&
    new Set(d.entries.map((e) => e.key)).size === d.entries.length
  );
}
