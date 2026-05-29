
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

export interface MetadataHackingProgram {
  name?: string;
  devices?: number[];
  target?: string[];
  burst?: string;
  damage?: string;
  attack?: string;
  opponent?: string;
  special?: string;
  skillType?: string[];
}

export interface MetadataPayload {
  factions: Array<{ id: number; name: string; parent?: number; logo?: string }>;
  ammunitions: MetadataAmmunition[];
  weapons: MetadataWeapon[];
  skills: MetadataSkill[];
  equips?: MetadataEquip[];
  hack?: MetadataHackingProgram[];
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
  private static equipsMap: Record<number, MetadataEquip> = {};
  private static weaponsMap: Record<number, MetadataWeapon[]> = {};
  private static ammoMap: Record<number, MetadataAmmunition> = {};

  static {
    // Initialize Skills
    const typedMetadata = metadata as MetadataPayload;
    const skills = typedMetadata.skills;
    skills.forEach(s => {
      // Normalize name: replace non-breaking spaces with standard spaces
      this.skillsMap[s.id] = { ...s, name: s.name.replace(/\u00A0/g, ' ') };
    });

    // Initialize Equipment
    const equips = typedMetadata.equips || [];
    if (equips) {
      equips.forEach(e => {
        const normalizedName = e.name.replace(/\u00A0/g, ' ');
        this.equipsMap[e.id] = { ...e, name: normalizedName };

        // Add to skillsMap as fallback if not already present
        if (!this.skillsMap[e.id]) {
          this.skillsMap[e.id] = { ...e, name: normalizedName };
        }
      });
    }

    // Initialize Weapons & Equipment
    typedMetadata.weapons.forEach(w => {
      // Normalize name: replace non-breaking spaces with standard spaces
      if (!this.weaponsMap[w.id]) {
        this.weaponsMap[w.id] = [];
      }
      this.weaponsMap[w.id].push({ ...w, name: w.name.replace(/\u00A0/g, ' ') });
    });

    // Initialize Ammunition
    typedMetadata.ammunitions.forEach(a => {
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
    // Check official equipment first to avoid overlapping ID conflicts with weapons
    if (this.equipsMap[id]) return this.equipsMap[id].name;

    // Check skills as intermediate fallback (some equipment like ECM are listed as skills in metadata)
    const skill = this.skillsMap[id];
    if (skill?.name) return skill.name;

    // Check weapons as final fallback
    const modes = this.weaponsMap[id];
    if (modes?.[0]?.name) return modes[0].name;

    return `Equip ${id}`;
  }

  static getHackingPrograms(): MetadataHackingProgram[] {
    return ((metadata as MetadataPayload).hack || []).map((program) => ({
      ...program,
      name: program.name?.replace(/\u00A0/g, ' '),
    }));
  }

  static getHackingDevices(): MetadataEquip[] {
    return Object.values(this.equipsMap).filter((equip) => equip.name.toLowerCase().includes("hacking device"));
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
