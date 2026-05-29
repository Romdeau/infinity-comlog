import { describe, expect, it } from "vitest"

import { validateActivePair, validateActivePairAssignment } from "./pair-validation"

const list = (overrides = {}) => ({
  armyName: "List",
  sectoralId: 101,
  sectoralName: "PanOceania",
  points: 300,
  ...overrides,
})

describe("pair validation", () => {
  it("accepts empty or compatible pairs", () => {
    expect(validateActivePair({ listA: list(), listB: null })).toEqual({ valid: true })
    expect(validateActivePair({ listA: list(), listB: list({ armyName: "Other" }) })).toEqual({ valid: true })
  })

  it("rejects mismatched sectoral assignments", () => {
    const result = validateActivePairAssignment("listB", list({ sectoralId: 102, sectoralName: "Nomads" }), {
      listA: list({ sectoralId: 101, sectoralName: "PanOceania" }),
      listB: null,
    })

    expect(result).toMatchObject({ valid: false, reason: "sectoral" })
  })

  it("rejects mismatched points assignments", () => {
    const result = validateActivePair({
      listA: list({ points: 300 }),
      listB: list({ points: 250 }),
    })

    expect(result).toMatchObject({ valid: false, reason: "points" })
  })
})
