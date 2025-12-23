/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ArmyList, type Trooper, type CombatGroup } from './army-parser';

export interface UnitData {
  units: any[];
  version: string;
}

interface ProfileGroup {
  id: number;
  profiles: any[];
  options: any[];
}

interface Unit {
  idArmy: number;
  profileGroups: ProfileGroup[];
}

export interface EnrichedTrooper extends Trooper {
  name: string;
  isc: string;
  logo?: string;
  type: string;
  training: string;
  points: number;
  swc: string;
  profiles: {
    name?: string;
    mov: string;
    cc: number;
    bs: number;
    ph: number;
    wip: number;
    arm: number;
    bts: number;
    w: number;
    s: number;
    skills: any[];
    weapons: any[];
    equip: any[];
    isStr: boolean;
  }[];
}

export interface EnrichedCombatGroup extends Omit<CombatGroup, 'members'> {
  members: EnrichedTrooper[];
}

export interface EnrichedArmyList extends Omit<ArmyList, 'combatGroups'> {
  combatGroups: EnrichedCombatGroup[];
  version?: number;
}

class UnitService {
  private cache: Record<number, UnitData> = {};

  async getFactionData(factionId: number): Promise<UnitData | null> {
    if (this.cache[factionId]) return this.cache[factionId];

    try {
      // In a real app, this would be a fetch to a static asset or API
      // Since this is a Vite project, we can try to fetch the local JSON
      // We must prepend BASE_URL to handle the subpath deployment (e.g. /infinity-comlog/)
      // remove trailing slash from BASE_URL if needed, but usually it handles cleanly if we join carefully
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
      const response = await fetch(`${baseUrl}data/factions/${factionId}.json`);
      if (!response.ok) throw new Error(`Faction ${factionId} not found`);

      const data = await response.json();
      this.cache[factionId] = data;
      return data;
    } catch (e) {
      console.error(`Failed to load unit data for faction ${factionId}:`, e);
      return null;
    }
  }

  async enrichArmyList(list: ArmyList): Promise<EnrichedArmyList> {
    const factionData = await this.getFactionData(list.sectoralId);

    if (!factionData) {
      // Return a partially enriched list if data is missing
      return {
        ...list,
        combatGroups: list.combatGroups.map(group => ({
          ...group,
          members: group.members.map(member => ({
            ...member,
            name: member.name || `Unit ${member.id}`,
            isc: '',
            skills: [],
            weapons: [],
            equip: []
          }))
        }))
      };
    }

    const enrichedGroups = list.combatGroups.map(group => ({
      ...group,
      members: group.members.map(member => this.enrichTrooper(member, factionData))
    }));

    return {
      ...list,
      combatGroups: enrichedGroups,
      version: 1 // Current data structure version
    };
  }

  private enrichTrooper(trooper: Trooper, factionData: UnitData): EnrichedTrooper {
    // Corvus Belli army codes use idArmy to identify units within a specific faction/sectoral.
    // We must match against idArmy to ensure we get the correct sectoral-specific unit options.
    const unit = factionData.units.find((u: Unit) => u.idArmy === trooper.id);

    if (!unit) {
      return {
        ...trooper,
        name: trooper.name || `Unknown (${trooper.id})`,
        isc: '',
        type: '',
        training: '',
        points: 0,
        swc: '0',
        profiles: [{
          mov: '0-0',
          cc: 0, bs: 0, ph: 0, wip: 0, arm: 0, bts: 0, w: 0, s: 0,
          isStr: false,
          skills: [],
          weapons: [],
          equip: []
        }]
      };
    }

    // Find profile group by ID, fallback to index-based if not found
    let profileGroup = unit.profileGroups.find((pg: ProfileGroup) => pg.id === trooper.groupId);
    if (!profileGroup) {
      profileGroup = unit.profileGroups[trooper.groupId - 1] || unit.profileGroups[0];
    }

    // Find option by ID, fallback to index-based if not found
    let option = profileGroup.options.find((o: any) => o.id === trooper.optionId);
    if (!option) {
      option = profileGroup.options[trooper.optionId - 1] || profileGroup.options[0];
    }

    const enrichedProfiles = profileGroup.profiles.map((p: any) => ({
      name: p.name,
      mov: this.formatMove(p.move),
      cc: p.cc,
      bs: p.bs,
      ph: p.ph,
      wip: p.wip,
      arm: p.arm,
      bts: p.bts,
      w: p.w,
      s: p.s,
      isStr: !!p.str,
      skills: [...(p.skills || []), ...(option?.skills || [])],
      weapons: [...(p.weapons || []), ...(option?.weapons || [])],
      equip: [...(p.equip || []), ...(option?.equip || [])]
    }));

    const result: EnrichedTrooper = {
      ...trooper,
      name: option?.name || unit.name,
      isc: unit.isc,
      logo: profileGroup.profiles[0]?.logo || unit.logo || option?.logo,
      type: this.formatType(profileGroup.profiles[0]?.type),
      training: option?.orders?.[0]?.type || 'REGULAR',
      points: option?.points || 0,
      swc: option?.swc || '0',
      profiles: enrichedProfiles
    };

    return result;
  }

  private formatMove(move: number[]): string {
    if (!move || move.length < 2) return "0-0";
    // Convert cm to inches (approximate: 2.5cm = 1 inch)
    // 10cm = 4", 15cm = 6", 5cm = 2"
    const m1 = Math.round(move[0] / 2.5);
    const m2 = Math.round(move[1] / 2.5);
    return `${m1}-${m2}`;
  }

  private formatType(typeId: number): string {
    const types: Record<number, string> = {
      1: 'LI',
      2: 'MI',
      3: 'HI',
      4: 'TAG',
      5: 'REM',
      6: 'SK',
      7: 'WB'
    };
    return types[typeId] || `Type ${typeId}`;
  }
}

export const unitService = new UnitService();
