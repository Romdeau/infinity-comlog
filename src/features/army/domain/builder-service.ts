import { loadFactionData } from '@/lib/faction-data-service';
import { unitService, type EnrichedArmyList } from '@/lib/unit-service';
import type { MeasurementUnit } from '@/lib/metadata-service';
import {
  buildCatalog,
  draftToArmyList,
  isArmyDraft,
  optionKey,
  validateArmy,
  type ArmyDraft,
} from './army-builder';

/** Hydrate a validated builder list, retaining package profiles without double-charging. */
export async function enrichArmyDraft(
  draft: ArmyDraft,
  measurementUnit: MeasurementUnit,
): Promise<EnrichedArmyList> {
  if (!isArmyDraft(draft)) throw new Error('This army draft is invalid.');
  const data = await loadFactionData(draft.factionId);
  if (!data) throw new Error('Could not load faction profiles.');
  const catalog = buildCatalog(data, draft.factionId);
  const validation = validateArmy(draft, catalog, data);
  if (!validation.valid)
    throw new Error(validation.issues.map((i) => i.message).join(' '));
  const options = new Map(catalog.map((o) => [o.key, o]));
  const raw = draftToArmyList(draft);
  const list = await unitService.enrichArmyList(raw, measurementUnit);
  list.builderDraft = structuredClone(draft);
  const jumpers = new Set<number>();
  for (const group of list.combatGroups) {
    for (const member of group.members) {
      const option = options.get(optionKey(member));
      if (!option) continue;
      member.orderContribution =
        option.peripheral || (option.jumper && jumpers.has(member.id)) ? 0 : 1;
      if (option.jumper) jumpers.add(member.id);
      if (option.peripheral) member.training = 'PERIPHERAL';
      if (option.included.length) {
        const included = await unitService.enrichArmyList(
          {
            ...raw,
            combatGroups: [{ groupNumber: 1, members: option.included }],
          },
          measurementUnit,
        );
        member.profiles.push(
          ...included.combatGroups[0].members.flatMap((m) => m.profiles),
        );
      }
    }
  }
  return list;
}
