/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ArmyList, type Trooper, type CombatGroup } from './army-parser';
import { MetadataService, type FactionFilters } from './metadata-service';

export interface UnitData {
  units: any[];
  filters?: FactionFilters;
  version: string;
}

interface ProfileGroup {
  id: number;
  profiles: any[];
  options: any[];
}

export interface EnrichedTrooper extends Trooper {
  name: string;
  isc: string;
  logo?: string;
  type: string;
  training: string;
  points: number;
  swc: string;
  isLieutenant: boolean;
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
    // Resolved names for UI
    resolvedSkills: string[];
    resolvedEquip: string[];
    resolvedWeapons: { id: number; name: string; traits: string[] }[];
  }[];
}

export interface EnrichedCombatGroup extends Omit<CombatGroup, 'members'> {
  members: EnrichedTrooper[];
}

export interface EnrichedArmyList extends Omit<ArmyList, 'combatGroups'> {
  combatGroups: EnrichedCombatGroup[];
  version?: number;
}

export interface StoredArmyList extends EnrichedArmyList {
  rawBase64: string;
  schemaVersion: number;
  importTimestamp: number;
  validationHash: string;
  name?: string;
}

export const CURRENT_SCHEMA_VERSION = 1;

export function generateValidationHash(list: EnrichedArmyList): string {
  // Create a stable string representation
  // We exclude properties that might vary but aren't part of the core data definition if any
  // For now, we just hash the whole enriched object
  const str = JSON.stringify(list);
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

export function migrateToStoredList(list: EnrichedArmyList | StoredArmyList): StoredArmyList {
  // Check if it's already a StoredArmyList
  if ('schemaVersion' in list && 'rawBase64' in list && 'validationHash' in list) {
    return list as StoredArmyList;
  }

  // It's a legacy list
  return {
    ...list,
    rawBase64: '', // Unknown for legacy lists
    schemaVersion: 1, // Default to current version
    importTimestamp: Date.now(),
    validationHash: generateValidationHash(list),
    // Extract name if possible, or use defaults
    name: (list as any).name || (list as any).listName || `List ${list.rawCode}`
  };
}

class UnitService {
  private cache: Record<number, UnitData> = {};

  async getFactionData(factionId: number): Promise<UnitData | null> {
    if (this.cache[factionId]) return this.cache[factionId];

    try {
      // In a real app, this would be a fetch to a static asset or API
      // Since this is a Vite project, we can try to fetch the local JSON
      // We must prepend BASE_URL to handle the subpath deployment (e.g. /infinity-comlog/)
      const rawBaseUrl = import.meta.env?.BASE_URL || '/';
      const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
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

  async enrichArmyList(list: ArmyList, unitPref: MeasurementUnit = "imperial"): Promise<EnrichedArmyList> {
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
            type: '',
            training: '',
            points: 0,
            swc: '0',
            isLieutenant: false,
            profiles: []
          }))
        }))
      };
    }

    const enrichedGroups = list.combatGroups.map(group => ({
      ...group,
      members: group.members.map(member => this.enrichTrooper(member, factionData, unitPref))
    }));

    return {
      ...list,
      combatGroups: enrichedGroups,
      version: 1 // Current data structure version
    };
  }

  private enrichTrooper(trooper: Trooper, factionData: UnitData, unitPref: MeasurementUnit): EnrichedTrooper {
    // Corvus Belli army codes use unit ID (stable global ID) to identify units.
    const unit = factionData.units.find((u: any) => u.id === trooper.id);

    if (!unit) {
      return {
        ...trooper,
        name: trooper.name || `Unknown (${trooper.id})`,
        isc: '',
        type: '',
        training: '',
        points: 0,
        swc: '0',
        isLieutenant: false,
        profiles: [{
          mov: '0-0',
          cc: 0, bs: 0, ph: 0, wip: 0, arm: 0, bts: 0, w: 0, s: 0,
          isStr: false,
          skills: [],
          weapons: [],
          equip: [],
          resolvedSkills: [],
          resolvedEquip: [],
          resolvedWeapons: []
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

    const enrichedProfiles = profileGroup.profiles.map((p: any) => {
      const skills = [...(p.skills || []), ...(option?.skills || [])];
      const weapons = [...(p.weapons || []), ...(option?.weapons || [])];
      const equip = [...(p.equip || []), ...(option?.equip || [])];

      return {
        name: p.name,
        mov: this.formatMove(p.move, unitPref),
        cc: p.cc,
        bs: p.bs,
        ph: p.ph,
        wip: p.wip,
        arm: p.arm,
        bts: p.bts,
        w: p.w,
        s: p.s,
        isStr: !!p.str,
        skills,
        weapons,
        equip,
        resolvedSkills: MetadataService.resolveSkills(skills, factionData.filters, unitPref),
        resolvedEquip: MetadataService.resolveEquip(equip, factionData.filters, unitPref),
        resolvedWeapons: weapons.map((w: any) => ({
          id: w.id,
          name: MetadataService.getWeaponName(w.id),
          traits: (w.extra || []).map((ext: number) => MetadataService.getWeaponName(ext) || ext.toString())
        }))
      };
    });

    const isLieutenant = enrichedProfiles.some((p: any) => 
      p.skills.some((s: any) => s.id === 119) || // Lieutenant skill ID
      p.resolvedSkills.some((s: string) => s.toLowerCase().includes('lieutenant'))
    );

    const result: EnrichedTrooper = {
      ...trooper,
      name: option?.name || unit.name,
      isc: unit.isc,
      logo: profileGroup.profiles[0]?.logo || unit.logo || option?.logo,
      type: this.formatType(profileGroup.profiles[0]?.type),
      training: option?.orders?.[0]?.type || 'REGULAR',
      points: option?.points || 0,
      swc: option?.swc || '0',
      isLieutenant,
      profiles: enrichedProfiles
    };

    return result;
  }

  private formatMove(move: number[], unit: MeasurementUnit): string {
    if (!move || move.length < 2) return "0-0";
    
    if (unit === "metric") {
      return `${move[0]}-${move[1]}`;
    }

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
