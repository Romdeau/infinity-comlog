import { describe, expect, it } from "vitest"

import { getFactionDataUrl } from "./faction-data-service"

describe("faction data service", () => {
  it("builds faction URLs with the deployment base path", () => {
    expect(getFactionDataUrl(101, "/infinity-comlog/")).toBe("/infinity-comlog/data/factions/101.json")
    expect(getFactionDataUrl(101, "/infinity-comlog")).toBe("/infinity-comlog/data/factions/101.json")
  })
})
