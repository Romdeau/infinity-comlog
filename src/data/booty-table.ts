/** Booty (Loot) table entries, indexed by d20 roll, surfaced in the game flow. */
export interface BootyEntry {
  roll: string
  item: string
}

/** Left column (rolls 1-12) of the Booty table. */
export const BOOTY_TABLE_LEFT: BootyEntry[] = [
  { roll: "1-2", item: "+1 ARM" },
  { roll: "3-4", item: "Light Flamethrower" },
  { roll: "5-6", item: "Grenades" },
  { roll: "7-8", item: "DA CCW" },
  { roll: "9", item: "MSV L1" },
  { roll: "10", item: "EXP CCW" },
  { roll: "11", item: "Adhesive L." },
  { roll: "12", item: "Immune(AP)/+2 ARM" },
]

/** Right column (rolls 13-20) of the Booty table. */
export const BOOTY_TABLE_RIGHT: BootyEntry[] = [
  { roll: "13", item: "Panzerfaust" },
  { roll: "14", item: "Monofilament CCW" },
  { roll: "15", item: "MOV 8-4" },
  { roll: "16", item: "Shock/MULTI Rifle" },
  { roll: "17", item: "MULTI Sniper" },
  { roll: "18", item: "Immune(ARM)/+4 ARM" },
  { roll: "19", item: "Mimetism (-6)" },
  { roll: "20", item: "B+1/HMG" },
]
