
import metadata from '../data/metadata.json';

export interface MetadataSkill {
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

export class MetadataService {
  private static skillsMap: Record<number, MetadataSkill> = {};
  private static weaponsMap: Record<number, MetadataWeapon[]> = {};
  private static ammoMap: Record<number, MetadataAmmunition> = {};

  static {
    // Initialize Skills
    (metadata.skills as MetadataSkill[]).forEach(s => {
      this.skillsMap[s.id] = s;
    });

    // Initialize Weapons & Equipment
    (metadata.weapons as any[]).forEach(w => {
      if (!this.weaponsMap[w.id]) {
        this.weaponsMap[w.id] = [];
      }
      this.weaponsMap[w.id].push(w);
    });

    // Initialize Ammunition
    (metadata.ammunitions as MetadataAmmunition[]).forEach(a => {
      this.ammoMap[a.id] = a;
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
    return modes?.[0]?.name || `Equip ${id}`;
  }

  static getAmmoName(id: number): string {
    return this.ammoMap[id]?.name || `Ammo ${id}`;
  }

  static resolveSkills(skills: { id: number; q?: number; extra?: number[] }[]): string[] {
    return skills.map(s => {
      let name = this.getSkillName(s.id);
      if (s.extra && s.extra.length > 0) {
        const extraNames = s.extra.map(e => this.getSkillName(e) || this.getWeaponName(e) || e.toString());
        name += ` (${extraNames.join(', ')})`;
      }
      if (s.q && s.q > 1) {
        name += ` x${s.q}`;
      }
      return name;
    });
  }

  static resolveEquip(equip: { id: number; q?: number; extra?: number[] }[]): string[] {
    return equip.map(e => {
      let name = this.getEquipmentName(e.id);
      if (e.extra && e.extra.length > 0) {
        const extraNames = e.extra.map(ext => this.getEquipmentName(ext) || ext.toString());
        name += ` (${extraNames.join(', ')})`;
      }
      if (e.q && e.q > 1) {
        name += ` x${e.q}`;
      }
      return name;
    });
  }
}
