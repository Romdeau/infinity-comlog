import { describe, expect, it } from "vitest"

import type { EnrichedArmyList } from "@/lib/unit-service"
import { analyzeList } from "./list-analysis"

const list = {
  armyName: "Analysis List",
  sectoralId: 101,
  sectoralName: "PanOceania",
  points: 300,
  combatGroups: [
    {
      groupNumber: 1,
      members: [
        {
          id: 1,
          groupId: 1,
          optionId: 1,
          name: "Regular Hacker",
          isc: "Hacker",
          type: "LI",
          training: "REGULAR",
          points: 20,
          swc: "0.5",
          isLieutenant: false,
          profiles: [
            {
              mov: "4-4",
              cc: 10,
              bs: 10,
              ph: 10,
              wip: 13,
              arm: 1,
              bts: 0,
              w: 1,
              s: 2,
              skills: [],
              weapons: [],
              equip: [],
              isStr: false,
              resolvedSkills: ["Tactical Awareness", "Forward Observer"],
              resolvedEquip: ["Hacking Device"],
              resolvedWeapons: [],
            },
          ],
        },
        {
          id: 2,
          groupId: 1,
          optionId: 1,
          name: "Impetuous Doctor",
          isc: "Doctor",
          type: "WB",
          training: "IRREGULAR",
          points: 15,
          swc: "0",
          isLieutenant: false,
          profiles: [
            {
              mov: "6-2",
              cc: 10,
              bs: 10,
              ph: 10,
              wip: 13,
              arm: 1,
              bts: 0,
              w: 1,
              s: 2,
              skills: [],
              weapons: [],
              equip: [],
              isStr: false,
              resolvedSkills: ["Impetuous", "Doctor"],
              resolvedEquip: [],
              resolvedWeapons: [],
            },
          ],
        },
      ],
    },
  ],
} as EnrichedArmyList

describe("analyzeList", () => {
  it("summarizes orders, specialists, SWC, skills, and troop type investment", () => {
    const result = analyzeList(list)

    expect(result.regular).toBe(1)
    expect(result.irregular).toBe(1)
    expect(result.impetuous).toBe(1)
    expect(result.tacticalAwareness).toBe(1)
    expect(result.totalSwc).toBe(0.5)
    expect(result.finalSpecialists.Hacker).toBe(1)
    expect(result.finalSpecialists.Doctor).toBe(1)
    expect(result.finalSpecialists["Forward Observer"]).toBe(1)
    expect(result.typeData).toEqual([
      { name: "LI", points: 20, count: 1 },
      { name: "WB", points: 15, count: 1 },
    ])
  })
})
