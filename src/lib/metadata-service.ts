
import metadata from '../data/metadata.json';

export interface MetadataSkill {
  id: number;
  name: string;
  wiki?: string;
}

export interface MetadataEquip {
  id: number;
  name: string;
  wiki?: string;
}

export interface MetadataWeapon {
  id: number;
  type: string;
  name: string;
  mode?: string;
  ammunition?: number | string;
  burst?: string;
  damage?: string;
  saving?: string;
  savingNum?: string;
  properties?: string[];
  distance?: {
    short?: { max: number; mod: string };
    med?: { max: number; mod: string };
    long?: { max: number; mod: string };
    max?: { max: number; mod: string };
  };
  traits?: string[];
}

export interface MetadataAmmunition {
  id: number;
  name: string;
  wiki?: string;
}

export interface FactionFilters {
  extras?: { id: number; name: string; type?: string }[];
}

export type MeasurementUnit = "metric" | "imperial";

export class MetadataService {
  private static skillsMap: Record<number, MetadataSkill> = {};
  private static weaponsMap: Record<number, MetadataWeapon[]> = {};
  private static ammoMap: Record<number, MetadataAmmunition> = {};

  static {
    // Initialize Skills
    const skills = metadata.skills as MetadataSkill[];
    skills.forEach(s => {
      // Normalize name: replace non-breaking spaces with standard spaces
      this.skillsMap[s.id] = { ...s, name: s.name.replace(/\u00A0/g, ' ') };
    });

    // Initialize Equipment (some things like ECM are in equips array)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const equips = (metadata as any).equips as MetadataEquip[];
    if (equips) {
      equips.forEach(e => {
        // Only add if not already present in skillsMap or if it provides a better name
        if (!this.skillsMap[e.id]) {
          this.skillsMap[e.id] = { ...e, name: e.name.replace(/\u00A0/g, ' ') };
        }
      });
    }

    // Initialize Weapons & Equipment
    (metadata.weapons as MetadataWeapon[]).forEach(w => {
      // Normalize name: replace non-breaking spaces with standard spaces
      if (!this.weaponsMap[w.id]) {
        this.weaponsMap[w.id] = [];
      }
      this.weaponsMap[w.id].push({ ...w, name: w.name.replace(/\u00A0/g, ' ') });
    });

    // Initialize Ammunition
    (metadata.ammunitions as MetadataAmmunition[]).forEach(a => {
      this.ammoMap[a.id] = { ...a, name: a.name.replace(/\u00A0/g, ' ') };
    });
  }

  static getSkill(id: number): MetadataSkill | undefined {
    return this.skillsMap[id];
  }

  static getSkillName(id: number): string {
    return this.skillsMap[id]?.name || `Skill ${id}`;
  }

  static getWeaponModes(id: number): MetadataWeapon[] {
    return this.weaponsMap[id] || [];
  }

  static getWeaponName(id: number): string {
    const modes = this.weaponsMap[id];
    return modes?.[0]?.name || `Weapon ${id}`;
  }

  static getEquipmentName(id: number): string {
    const modes = this.weaponsMap[id];
    if (modes?.[0]?.name) return modes[0].name;
    
    // Check skills as fallback (some equipment like ECM are listed as skills in metadata)
    const skill = this.getSkill(id);
    if (skill?.name) return skill.name;

    return `Equip ${id}`;
  }

  static getAmmoName(id: number): string {
    return this.ammoMap[id]?.name || `Ammo ${id}`;
  }

  private static formatExtraName(id: number, filters?: FactionFilters, unit: MeasurementUnit = "imperial"): string | null {
    if (!filters?.extras) return null;
    
    const extra = filters.extras.find((ex) => ex.id === id);
    if (!extra) return null;

    if (extra.type === "DISTANCE") {
      // Convert cm to inches (2.5cm = 1") or keep as cm
      // Example: "+2.5" -> "+1\"", "20" -> "8\""
      return extra.name.replace(/(\d+(\.\d+)?)/g, (match) => {
        const cm = parseFloat(match);
        if (unit === "metric") {
          return `${cm}cm`;
        }
        const inches = Math.round(cm / 2.5);
        return `${inches}"`;
      });
    }

    return extra.name;
  }

  static resolveSkills(
    skills: { id: number; q?: number; extra?: number[] }[], 
    filters?: FactionFilters,
    unit: MeasurementUnit = "imperial"
  ): string[] {
    return skills.map(s => {
      let name = this.getSkillName(s.id);
      if (s.extra && s.extra.length > 0) {
        const extraNames = s.extra.map(e => {
          // Check faction-specific filters first
          const formatted = this.formatExtraName(e, filters, unit);
          if (formatted) return formatted;
          
          return this.getSkillName(e) || this.getWeaponName(e) || e.toString();
        });
        name += ` (${extraNames.join(', ')})`;
      }
      if (s.q && s.q > 1) {
        name += ` x${s.q}`;
      }
      return name;
    });
  }

  static resolveEquip(
    equip: { id: number; q?: number; extra?: number[] }[], 
    filters?: FactionFilters,
    unit: MeasurementUnit = "imperial"
  ): string[] {
    return equip.map(e => {
      let name = this.getEquipmentName(e.id);
      if (e.extra && e.extra.length > 0) {
        const extraNames = e.extra.map(ext => {
          // Check faction-specific filters first
          const formatted = this.formatExtraName(ext, filters, unit);
          if (formatted) return formatted;

          return this.getEquipmentName(ext) || ext.toString();
        });
        name += ` (${extraNames.join(', ')})`;
      }
      if (e.q && e.q > 1) {
        name += ` x${e.q}`;
      }
      return name;
    });
  }
}
