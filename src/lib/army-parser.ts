import metadata from '../data/metadata.json';
import type { MetadataPayload } from './metadata-service';

export const TEAM_OPS_STATS = ['cc', 'bs', 'ph', 'wip', 'arm', 'bts', 'w', 's', 'move0', 'move1'] as const;
export type TeamOpsStat = typeof TEAM_OPS_STATS[number];
export type TeamOpsAttribute =
  | { type: 'stat'; stat: TeamOpsStat; q: number }
  | { type: 'skill' | 'equip' | 'weapon'; id: number; q?: number; extra?: number[] };

function isTeamOpsAttribute(value: unknown): value is TeamOpsAttribute {
  if (!value || typeof value !== 'object') return false;
  const attr = value as Record<string, unknown>;
  if (attr.type === 'stat') {
    return TEAM_OPS_STATS.some(stat => stat === attr.stat) && typeof attr.q === 'number' && Number.isFinite(attr.q);
  }
  return ['skill', 'equip', 'weapon'].includes(String(attr.type)) &&
    typeof attr.id === 'number' && Number.isSafeInteger(attr.id) && attr.id > 0 &&
    (attr.q === undefined || (typeof attr.q === 'number' && Number.isFinite(attr.q))) &&
    (attr.extra === undefined || (Array.isArray(attr.extra) && attr.extra.every(id => Number.isSafeInteger(id))));
}

export interface Trooper {
  id: number;
  groupId: number;
  optionId: number;
  name?: string; // Populated from DB
  teamOps?: TeamOpsAttribute[];
}

export interface CombatGroup {
  groupNumber: number;
  members: Trooper[];
}

export interface ArmyList {
  sectoralId: number;
  sectoralName: string;
  armyName: string;
  points: number;
  combatGroups: CombatGroup[];
  parentName?: string;
  logo?: string;
  rawCode?: string;
}

const typedMetadata = metadata as MetadataPayload;

const getFactionInfo = (id: number) => {
  const factions = typedMetadata.factions;
  const faction = factions.find((f) => f.id === id);
  if (!faction) return null;

  const parent = factions.find((f) => f.id === faction.parent);
  return {
    parentName: parent ? parent.name : faction.name,
    logo: faction.logo
  };
};

export class ArmyParser {
  private buffer: Uint8Array;
  private offset: number = 0;
  private rawCode: string;

  constructor(base64: string) {
    this.rawCode = base64;
    try {
      // Decode URI components (e.g. %3D -> =) and handle URL-safe chars if necessary
      const decoded = decodeURIComponent(base64);
      const binaryString = atob(decoded);
      this.buffer = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    } catch (e) {
      console.error("Failed to decode army code:", e);
      // Fallback for non-URI encoded strings
      const binaryString = atob(base64);
      this.buffer = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    }
  }

  private readByte(): number {
    if (this.offset >= this.buffer.length) throw new Error('Truncated army code');
    return this.buffer[this.offset++];
  }

  private readVarInt(): number {
    const b1 = this.readByte();
    if (b1 < 128) return b1;
    const b2 = this.readByte();
    // ((byte1 & 0x7F) << 8) | byte2
    return ((b1 & 0x7F) << 8) | b2;
  }

  private readString(): string {
    const length = this.readVarInt();
    if (length === 0) return "";

    let str = "";
    for (let i = 0; i < length; i++) {
      // Assuming ASCII/UTF-8 single byte
      str += String.fromCharCode(this.readByte());
    }
    return str;
  }

  public parse(): ArmyList {
    // Army's encoder has no version tag. Try its current layout first, then
    // older layouts, accepting only a complete, structurally valid decode.
    for (const schema of [3, 2, 1]) {
      try {
        return this.parseSchema(schema);
      } catch {
        // Retry from the start with the previous schema.
      }
    }
    throw new Error('Invalid or unsupported army code. Export the list again from Infinity Army.');
  }

  private readTeamOps(): TeamOpsAttribute[] | undefined {
    const present = this.readByte();
    if (present === 0) return undefined;
    if (present !== 1) throw new Error('Invalid special-table marker');
    const count = this.readVarInt();
    const attributes: TeamOpsAttribute[] = [];
    for (let i = 0; i < count; i++) {
      const attrs: unknown = JSON.parse(this.readString());
      if (!Array.isArray(attrs) || !attrs.every(isTeamOpsAttribute)) {
        throw new Error('Invalid or unsupported Team Ops attributes');
      }
      attributes.push(...attrs);
    }
    return attributes;
  }

  private parseSchema(schema: number): ArmyList {
    this.offset = 0;

    const sectoralId = this.readVarInt();
    const sectoralName = this.readString();
    const armyName = this.readString();
    const points = this.readVarInt();
    const groupCount = this.readVarInt();

    const combatGroups: CombatGroup[] = [];

    for (let i = 0; i < groupCount; i++) {
      const groupNumber = this.readVarInt();
      if (groupNumber === 0) throw new Error('Invalid combat group');
      if (schema >= 2) {
        const hasReinforcements = this.readByte();
        if (hasReinforcements > 1) throw new Error('Invalid reinforcement marker');
        if (hasReinforcements && this.readByte() > 1) throw new Error('Invalid reinforcement flag');
      }

      const memberCount = this.readVarInt();

      const members: Trooper[] = [];
      for (let m = 0; m < memberCount; m++) {
        this.readVarInt(); // Entry ID, distinct from the unit ID.
        const unitId = this.readVarInt();
        const groupChoice = this.readVarInt();
        const optionChoice = this.readVarInt();
        if (unitId === 0 || groupChoice === 0 || optionChoice === 0) throw new Error('Invalid unit selection');
        // Legacy custom Spec-Ops use a different payload from Team Ops.
        if (this.readByte() !== 0) throw new Error('Unsupported Spec-Ops selection');
        const teamOps = schema >= 3 ? this.readTeamOps() : undefined;

        members.push({
          id: unitId,
          groupId: groupChoice,
          optionId: optionChoice,
          name: "",
          ...(teamOps ? { teamOps } : {}),
        });
      }

      combatGroups.push({ groupNumber, members });
    }

    if (this.offset !== this.buffer.length) throw new Error('Unexpected trailing army data');
    const factionInfo = getFactionInfo(sectoralId);

    return {
      sectoralId,
      sectoralName,
      armyName,
      points,
      combatGroups,
      rawCode: this.rawCode,
      ...factionInfo
    };
  }
}
