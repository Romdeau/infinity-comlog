import { type ArmyList, type Trooper, type CombatGroup } from './army-parser';

export interface UnitData {
  units: any[];
  version: string;
}

export interface EnrichedTrooper extends Trooper {
  name: string;
  isc: string;
  skills: any[];
  weapons: any[];
  equip: any[];
  logo?: string;
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
    console.log(`Enriching list for faction ${list.sectoralId}...`);
    const factionData = await this.getFactionData(list.sectoralId);

    if (!factionData) {
      console.warn(`No faction data found for ${list.sectoralId}, returning original list.`);
      return list as any;
    }

    console.log(`Loaded faction data for ${list.sectoralId}, units count: ${factionData.units?.length}`);

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
    const unit = factionData.units.find(u => u.id === trooper.id);
    if (!unit) {
      return { ...trooper, name: trooper.name || `Unknown (${trooper.id})`, isc: '', skills: [], weapons: [], equip: [] };
    }

    // groupChoice is 1-indexed index into profileGroups
    const profileGroup = unit.profileGroups[trooper.groupId - 1] || unit.profileGroups[0];
    const profile = profileGroup.profiles[0]; // Usually just one profile

    // optionChoice is 1-indexed index into options
    const option = profileGroup.options[trooper.optionId - 1] || profileGroup.options[0];

    return {
      ...trooper,
      name: option.name || unit.name,
      isc: unit.isc,
      logo: profile.logo || unit.logo,
      skills: [...(profile.skills || []), ...(option.skills || [])],
      weapons: [...(profile.weapons || []), ...(option.weapons || [])],
      equip: [...(profile.equip || []), ...(option.equip || [])],
    };
  }
}

export const unitService = new UnitService();
