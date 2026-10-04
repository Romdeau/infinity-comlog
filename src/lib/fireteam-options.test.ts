import { describe, expect, it } from "vitest"
import type { EnrichedTrooper } from "./unit-service"
import type { FactionPayload, FireteamEntry } from "./faction-data-service"
import { getFireteamChoices } from "./fireteam-options"

const member = (id: number, name = `Unit ${id}`): EnrichedTrooper => ({
  id,
  name,
  groupId: 1,
  optionId: 1,
  isc: "",
  type: "LI",
  training: "REGULAR",
  points: 10,
  swc: "0",
  isLieutenant: false,
  profiles: [],
})
const row = (
  slug: string,
  extra: Partial<FireteamEntry> = {}
): FireteamEntry => ({
  slug,
  name: slug,
  min: 0,
  max: 5,
  required: false,
  comment: "",
  ...extra,
})
function faction(): FactionPayload {
  return {
    units: [1, 2, 3].map((id) => ({
      id,
      name: `Unit ${id}`,
      slug: `unit-${id}`,
      profileGroups: [],
    })),
    fireteamChart: {
      spec: { DUO: 256, HARIS: 1, CORE: 1 },
      desc: "",
      teams: [
        {
          name: "Line",
          obs: "",
          type: ["DUO", "HARIS", "CORE"],
          units: [row("unit-1", { min: 1 }), row("unit-2", { max: 1 })],
        },
        {
          name: "Wildcards",
          obs: "",
          type: [],
          units: [row("unit-3", { max: 1 })],
        },
      ],
    },
  }
}

describe("fireteam compositions", () => {
  it("keeps duplicate models distinct and enforces creation sizes and row caps", () => {
    const choices = getFireteamChoices(
      [member(1), member(1), member(2), member(2)],
      faction()
    )
    expect(choices.find((c) => c.type === "DUO")?.combinations).toContainEqual([
      0, 1,
    ])
    expect(
      choices.find((c) => c.type === "DUO")?.combinations
    ).not.toContainEqual([2, 3])
    expect(choices.find((c) => c.type === "HARIS")?.combinations).toEqual([
      [0, 1, 2],
      [0, 1, 3],
    ])
    expect(
      choices.find((c) => c.type === "CORE")?.combinations
    ).not.toContainEqual([0, 1, 2, 3])
  })
  it("supports wildcards without allowing them to replace mandatory members", () => {
    expect(
      getFireteamChoices([member(1), member(3)], faction())[0].combinations
    ).toEqual([[0, 1]])
    expect(getFireteamChoices([member(2), member(3)], faction())).toEqual([])
  })
  it("respects no-wildcards notes and FTO restrictions", () => {
    const data = faction()
    data.fireteamChart!.teams[0].obs = "No Wildcards Special Fireteam"
    expect(getFireteamChoices([member(1), member(3)], data)).toEqual([])
    data.fireteamChart!.teams[0].units[1].comment = "FTO (Line)"
    expect(getFireteamChoices([member(1), member(2)], data)).toEqual([])
    expect(
      getFireteamChoices([member(1), member(2, "Unit 2 FTO")], data)
    ).toHaveLength(1)
  })
  it("requires at least one starred entry, rather than every starred entry", () => {
    const data = faction()
    data.fireteamChart!.teams[0].units = [
      row("unit-1", { required: true }),
      row("unit-2", { required: true }),
    ]
    expect(getFireteamChoices([member(1), member(3)], data)).toHaveLength(1)
    expect(getFireteamChoices([member(3), member(3)], data)).toEqual([])
  })
  it("distinguishes profiles sharing a unit slug", () => {
    const data = faction()
    data.fireteamChart!.teams[0].units = [
      row("unit-1", { name: "Guard", min: 1 }),
      row("unit-1", { name: "Monitor", min: 1, max: 1 }),
    ]
    expect(
      getFireteamChoices([member(1, "Guard"), member(1, "Guard")], data)
    ).toEqual([])
    expect(
      getFireteamChoices([member(1, "Guard"), member(1, "Monitor")], data)
    ).toHaveLength(1)
  })
  it("enforces FTO variants named in the chart, including numbered variants", () => {
    const data = faction()
    data.fireteamChart!.teams[0].units[1].name = "Unit 2 FTO-2"
    expect(
      getFireteamChoices([member(1), member(2, "Unit 2 FTO")], data)
    ).toEqual([])
    expect(
      getFireteamChoices([member(1), member(2, "Unit 2 FTO-2")], data)
    ).toHaveLength(1)
  })
  it("excludes peripheral controllers even when their unit is in the chart", () => {
    const data = faction()
    data.units[1].profileGroups = [
      { id: 1, profiles: [], options: [{ id: 1, peripheral: [{ id: 1 }] }] },
    ]
    expect(getFireteamChoices([member(1), member(2)], data)).toEqual([])
  })
})
