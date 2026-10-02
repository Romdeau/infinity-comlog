import { describe, it, expect } from "vitest";
import { getRelevantSkillsForPhase } from "./army-context-mapping";
import type { EnrichedTrooper } from "./unit-service";

function makeUnit(name: string, profiles: Partial<EnrichedTrooper["profiles"][number]>[]): EnrichedTrooper {
  return {
    id: 1, groupId: 1, optionId: 1,
    name, isc: name, type: "LI", training: "Regular",
    points: 10, swc: "0", isLieutenant: false,
    profiles: profiles.map(profile => ({
      mov: "4-4", cc: 10, bs: 10, ph: 10, wip: 10,
      arm: 0, bts: 0, w: 1, s: 2, isStr: false,
      skills: [], weapons: [], equip: [],
      resolvedSkills: [], resolvedEquip: [], resolvedWeapons: [],
      ...profile,
    })),
  };
}

describe("Army Context Mapping", () => {
  const mockUnits = [
    {
      id: "u1",
      unit: makeUnit("Unit A", [
          {
            skills: [{ id: 62 }, { id: 213 }], // Regeneration, Tactical Awareness
            equip: []
          }
      ])
    },
    {
      id: "u2",
      unit: makeUnit("Unit B", [
          {
            skills: [{ id: 256 }], // Impetuous
            equip: [{ id: 24 }] // Holomask
          }
      ])
    }
  ];

  it("identifies Regeneration for the States phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits, "states");
    expect(results).toContainEqual({ id: "u1", unitName: "Unit A", skills: ["Regeneration"] });
  });

  it("identifies Tactical Awareness for the Tactical phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits, "tactical");
    expect(results).toContainEqual({ id: "u1", unitName: "Unit A", skills: ["Tactical Awareness"] });
  });

  it("identifies Impetuous for the Impetuous phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits, "impetuous");
    expect(results).toContainEqual({ id: "u2", unitName: "Unit B", skills: ["Impetuous"] });
  });

  it("identifies Holomask for the Setup phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits, "setup");
    expect(results).toContainEqual({ id: "u2", unitName: "Unit B", skills: ["Holomask"] });
  });

  it("identifies Hacker and MediKit for the Orders phase", () => {
    const units = [
        {
          id: "u3",
          unit: makeUnit("Specialist", [{ skills: [{ id: 1000 }], equip: [{ id: 106 }] }])
        }
    ];
    const results = getRelevantSkillsForPhase(units, "orders");
    expect(results).toEqual([{ id: "u3", unitName: "Specialist", skills: ["Hacker", "MediKit"] }]);
  });

  it("handles duplicate skills by returning them only once per unit", () => {
     const multiProfileUnit = [
        {
          id: "u4",
          unit: makeUnit("Unit C", [
              { skills: [{ id: 62 }] }, // Regeneration
              { skills: [{ id: 62 }] }  // Regeneration again
          ])
        }
     ];
     const results = getRelevantSkillsForPhase(multiProfileUnit, "states");
     expect(results).toEqual([{ id: "u4", unitName: "Unit C", skills: ["Regeneration"] }]);
  });

  it("returns empty list if no relevant skills for phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits, "end");
    expect(results).toEqual([]);
  });
});
