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
  skills: any[];
  weapons: any[];
  equip: any[];
  logo?: string;
  // Stats
  mov: string;
  cc: number;
  bs: number;
  ph: number;
  wip: number;
  arm: number;
  bts: number;
  w: number;
  s: number;
  type: string;
}

export interface EnrichedCombatGroup extends Omit<CombatGroup, 'members'> {
  members: EnrichedTrooper[];
}

export interface EnrichedArmyList extends Omit<ArmyList, 'combatGroups'> {
  combatGroups: EnrichedCombatGroup[];
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
      combatGroups: enrichedGroups
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
        skills: [],
        weapons: [],
        equip: []
      };
    }

    // Find profile group by ID, fallback to index-based if not found
    let profileGroup = unit.profileGroups.find((pg: ProfileGroup) => pg.id === trooper.groupId);
    if (!profileGroup) {
      profileGroup = unit.profileGroups[trooper.groupId - 1] || unit.profileGroups[0];
    }

    // Profiles are usually just one per group in N5
    const profile = profileGroup.profiles[0] || { skills: [], weapons: [], equip: [] };

    // Find option by ID, fallback to index-based if not found
    let option = profileGroup.options.find((o: any) => o.id === trooper.optionId);
    if (!option) {
      option = profileGroup.options[trooper.optionId - 1] || profileGroup.options[0];
    }

    if (!option) {
      return {
        ...trooper,
        name: unit.name,
        isc: unit.isc,
        logo: unit.logo,
        skills: profile.skills || [],
        weapons: profile.weapons || [],
        equip: profile.equip || [],
        mov: this.formatMove(profile.move),
        cc: profile.cc,
        bs: profile.bs,
        ph: profile.ph,
        wip: profile.wip,
        arm: profile.arm,
        bts: profile.bts,
        w: profile.w,
        s: profile.s,
        type: this.formatType(profile.type)
      };
    }

    return {
      ...trooper,
      name: option.name || unit.name,
      isc: unit.isc,
      logo: profile.logo || unit.logo || option.logo,
      skills: [...(profile.skills || []), ...(option.skills || [])],
      weapons: [...(profile.weapons || []), ...(option.weapons || [])],
      equip: [...(profile.equip || []), ...(option.equip || [])],
      mov: this.formatMove(profile.move),
      cc: profile.cc,
      bs: profile.bs,
      ph: profile.ph,
      wip: profile.wip,
      arm: profile.arm,
      bts: profile.bts,
      w: profile.w,
      s: profile.s,
      type: this.formatType(profile.type)
    };
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
