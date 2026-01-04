
export interface FactionData {
  units: UnitData[];
}

export interface UnitData {
  id: number;
  name: string;
  isc: string;
  logo?: string;
  profileGroups: ProfileGroupData[];
}

export interface ProfileGroupData {
  id: number;
  profiles: ProfileData[];
  options: OptionData[];
}

export interface ProfileData {
  id: number;
  name: string;
  cc: number;
  bs: number;
  ph: number;
  wip: number;
  arm: number;
  bts: number;
  w: number;
  s: number;
  move: number[];
  type: number;
  skills: { id: number; q?: number; extra?: number[] }[];
  equip: { id: number; q?: number; extra?: number[] }[];
  str: boolean;
  logo?: string;
}

export interface OptionData {
  id: number;
  name: string;
  points: number;
  swc: string;
  weapons: { id: number; extra?: number[] }[];
  skills: { id: number; q?: number; extra?: number[] }[];
  equip: { id: number; q?: number; extra?: number[] }[];
}

import type { ArmyList, Trooper } from './army-parser';
import { MetadataService } from './metadata-service';

export interface HydratedProfileData extends ProfileData {
  weapons: { id: number; extra?: number[] }[];
  resolvedSkills: string[];
  resolvedEquip: string[];
}

export interface HydratedTrooper extends Trooper {
  unitName: string;
  isc: string;
  points: number;
  swc: string;
  profiles: HydratedProfileData[];
  option: OptionData;
  logo?: string;
}

export interface HydratedCombatGroup {
  groupNumber: number;
  members: HydratedTrooper[];
}

export interface HydratedArmyList extends Omit<ArmyList, 'combatGroups'> {
  combatGroups: HydratedCombatGroup[];
}

export class ArmyListService {
  private static factionCache: Record<number, FactionData> = {};

  static async getFactionData(factionId: number): Promise<FactionData> {
    if (this.factionCache[factionId]) {
      return this.factionCache[factionId];
    }

    // In a real app, this would be a fetch. For now, we assume the files are available.
    // If running in browser:
    try {
      const response = await fetch(`/data/factions/${factionId}.json`);
      if (!response.ok) throw new Error(`Failed to fetch faction ${factionId}`);
      const data = await response.json();
      this.factionCache[factionId] = data;
      return data;
    } catch (e) {
      console.error(e);
      // Fallback for node/bun if fetch is not available or file is local
      // This is mainly for debugging scripts
      return { units: [] };
    }
  }

  static async hydrate(list: ArmyList): Promise<HydratedArmyList> {
    const factionData = await this.getFactionData(list.sectoralId);

    const hydratedGroups: HydratedCombatGroup[] = await Promise.all(
      list.combatGroups.map(async (group) => {
        const hydratedMembers = group.members.map((member) => {
          const unit = factionData.units.find((u) => u.id === member.id);
          if (!unit) {
            return {
              ...member,
              unitName: `Unknown Unit ${member.id}`,
              isc: `Unknown`,
              points: 0,
              swc: '0',
              profiles: [this.getEmptyHydratedProfile()],
              option: this.getEmptyOption(),
            } as HydratedTrooper;
          }

          const profileGroup = unit.profileGroups.find((pg) => pg.id === member.groupId) || unit.profileGroups[0];
          const option = profileGroup.options.find((o) => o.id === member.optionId) || profileGroup.options[0];
          
          // Hydrate profiles
          const profiles: HydratedProfileData[] = profileGroup.profiles.map(p => {
             const combinedSkills = [...(p.skills || []), ...(option.skills || [])];
             const combinedEquip = [...(p.equip || []), ...(option.equip || [])];
             
             return {
               ...p,
               weapons: option.weapons || [],
               resolvedSkills: MetadataService.resolveSkills(combinedSkills),
               resolvedEquip: MetadataService.resolveEquip(combinedEquip)
             };
          });

          return {
            ...member,
            name: unit.name,
            unitName: unit.name,
            isc: unit.isc,
            points: option.points,
            swc: option.swc,
            profiles,
            option,
            logo: profiles[0]?.logo || unit.logo,
          } as HydratedTrooper;
        });

        return {
          groupNumber: group.groupNumber,
          members: hydratedMembers,
        };
      })
    );

    return {
      ...list,
      combatGroups: hydratedGroups,
    };
  }

  private static getEmptyHydratedProfile(): HydratedProfileData {
    return {
      id: 0,
      name: '',
      cc: 0,
      bs: 0,
      ph: 0,
      wip: 0,
      arm: 0,
      bts: 0,
      w: 0,
      s: 0,
      move: [0, 0],
      type: 0,
      skills: [],
      equip: [],
      str: false,
      weapons: [],
      resolvedSkills: [],
      resolvedEquip: []
    };
  }

  private static getEmptyOption(): OptionData {
    return {
      id: 0,
      name: '',
      points: 0,
      swc: '0',
      weapons: [],
      skills: [],
      equip: [],
    };
  }
}
