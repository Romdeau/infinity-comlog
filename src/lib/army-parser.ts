/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Trooper {
  id: number;
  groupId: number;
  optionId: number;
  name?: string; // Populated from DB
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

import metadata from '../data/metadata.json';

const getUnitName = (id: number): string => {
  return `Unit ${id}`;
};

const getFactionInfo = (id: number) => {
  const factions = (metadata as any).factions;
  const faction = factions.find((f: any) => f.id === id);
  if (!faction) return null;

  const parent = factions.find((f: any) => f.id === faction.parent);
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
    if (this.offset >= this.buffer.length) return 0; // Padding/EOF checks
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
    this.offset = 0;

    const sectoralId = this.readVarInt();
    const sectoralName = this.readString();
    const armyName = this.readString();
    const points = this.readVarInt();
    const groupCount = this.readVarInt();

    const combatGroups: CombatGroup[] = [];

    for (let i = 0; i < groupCount; i++) {
      const groupNumber = this.readVarInt();

      // Skip Unknown fields 1 & 2 found in analysis
      this.readVarInt(); // Unknown 1
      this.readVarInt(); // Unknown 2

      const memberCount = this.readVarInt();

      const members: Trooper[] = [];
      for (let m = 0; m < memberCount; m++) {
        this.readByte(); // 00 start
        const unitId = this.readVarInt();
        const groupChoice = this.readVarInt();
        const optionChoice = this.readVarInt();
        this.readByte(); // 00 end

        members.push({
          id: unitId,
          groupId: groupChoice,
          optionId: optionChoice,
          name: getUnitName(unitId)
        });
      }

      combatGroups.push({ groupNumber, members });
    }

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
