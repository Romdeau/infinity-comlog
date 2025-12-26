import { SKILL_MAP, EQUIP_MAP } from "./constants";

export type GamePhase = "setup" | "tactical" | "impetuous" | "orders" | "states" | "end";

const PHASE_SKILL_IDS: Record<string, number[]> = {
  tactical: [
    213, // Tactical Awareness
    211, // NCO
    207, // Counterintelligence
    69,  // Strategos L1
    70,  // Strategos L2
    71,  // Strategos L3
    26,  // Chain of Command
    52,  // Inspiring Leadership
    83,  // Religious Troop
    84,  // Courage
    88,  // Veteran
  ],
  impetuous: [
    256, // Impetuous
    250, // Frenzy
  ],
  orders: [
    189, // Specialist Operative
    53,  // Doctor
    49,  // Engineer
    64,  // Paramedic
    59,  // Forward Observer
    1000, // Hacker
  ],
  states: [
    62,  // Regeneration
    66,  // Seed-Embryo
    246, // Transmutation
  ],
  setup: [
    25,  // Booty
    29,  // Camouflage
    33,  // Parachutist
    35,  // Combat Jump
    46,  // Inferior Infiltration
    47,  // Infiltration
    48,  // Superior Infiltration
    56,  // Minelayer
    66,  // Seed-Embryo
    69,  // Strategos L1
    70,  // Strategos L2
    71,  // Strategos L3
    89,  // Sapper
    161, // Forward Deployment
    215, // Decoy
    238, // Hidden Deployment
    249, // Impersonation
    251, // Strategic Deployment
    265, // Aerial
  ]
};

const PHASE_EQUIP_IDS: Record<string, number[]> = {
  setup: [
    24,  // Holomask
    104, // Holoprojector
    107, // Motorcycle
    205, // AI Motorcycle
  ],
  orders: [
    106, // MediKit
    237, // GizmoKit
    238, // Deactivator
    240, // FastPanda
  ]
};

export function getRelevantSkillsForPhase(units: any[], phase: GamePhase): { unitName: string; skills: string[] }[] {
  const relevantSkillIds = PHASE_SKILL_IDS[phase] || [];
  const relevantEquipIds = PHASE_EQUIP_IDS[phase] || [];
  
  return units.map(unit => {
    const skills = new Set<string>();

    unit.profiles?.forEach((profile: any) => {
      profile.skills?.forEach((skill: { id: number }) => {
        if (relevantSkillIds.includes(skill.id)) {
          const name = SKILL_MAP[skill.id];
          if (name) skills.add(name);
        }
      });
      
      profile.equip?.forEach((equip: { id: number }) => {
        if (relevantEquipIds.includes(equip.id)) {
          const name = EQUIP_MAP[equip.id];
          if (name) skills.add(name);
        }
      });
    });

    if (skills.size === 0) return null;

    return {
      unitName: unit.name,
      skills: Array.from(skills)
    };
  }).filter((res): res is { unitName: string; skills: string[] } => res !== null);
}
