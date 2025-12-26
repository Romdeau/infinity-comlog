import { describe, it, expect } from "bun:test";
import { getRelevantSkillsForPhase } from "./army-context-mapping";

describe("Army Context Mapping", () => {
  const mockUnits = [
    {
      name: "Unit A",
      profiles: [
        {
          skills: [{ id: 62 }, { id: 213 }], // Regeneration, Tactical Awareness
          equip: []
        }
      ]
    },
    {
      name: "Unit B",
      profiles: [
        {
          skills: [{ id: 256 }], // Impetuous
          equip: [{ id: 24 }] // Holomask
        }
      ]
    }
  ];

  it("identifies Regeneration for the States phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits as any, "states");
    expect(results).toContainEqual({ unitName: "Unit A", skills: ["Regeneration"] });
  });

  it("identifies Tactical Awareness for the Tactical phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits as any, "tactical");
    expect(results).toContainEqual({ unitName: "Unit A", skills: ["Tactical Awareness"] });
  });

  it("identifies Impetuous for the Impetuous phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits as any, "impetuous");
    expect(results).toContainEqual({ unitName: "Unit B", skills: ["Impetuous"] });
  });

  it("identifies Holomask for the Setup phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits as any, "setup");
    expect(results).toContainEqual({ unitName: "Unit B", skills: ["Holomask"] });
  });

  it("identifies Hacker and MediKit for the Orders phase", () => {
    const units = [
        {
          name: "Specialist",
          profiles: [{ skills: [{ id: 1000 }], equip: [{ id: 106 }] }]
        }
    ];
    const results = getRelevantSkillsForPhase(units as any, "orders");
    expect(results).toEqual([{ unitName: "Specialist", skills: ["Hacker", "MediKit"] }]);
  });

  it("handles duplicate skills by returning them only once per unit", () => {
     const multiProfileUnit = [
        {
          name: "Unit C",
          profiles: [
            { skills: [{ id: 62 }] }, // Regeneration
            { skills: [{ id: 62 }] }  // Regeneration again
          ]
        }
     ];
     const results = getRelevantSkillsForPhase(multiProfileUnit as any, "states");
     expect(results).toEqual([{ unitName: "Unit C", skills: ["Regeneration"] }]);
  });

  it("returns empty list if no relevant skills for phase", () => {
    const results = getRelevantSkillsForPhase(mockUnits as any, "end");
    expect(results).toEqual([]);
  });
});