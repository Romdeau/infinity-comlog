import { afterEach, describe, expect, it } from "vitest"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { SettingsProvider } from "@/context/settings-context"
import type { EnrichedArmyList, EnrichedTrooper } from "@/lib/unit-service"
import { ListView } from "./list-view"
import { getWeaponModeGroups } from "./list-view-helpers"
const unit: EnrichedTrooper = {
  id: 1,
  groupId: 1,
  optionId: 1,
  name: "Test hacker",
  isc: "",
  type: "LI",
  training: "REGULAR",
  points: 20,
  swc: "0",
  isLieutenant: true,
  orders: [
    { type: "REGULAR", total: 1 },
    { type: "LIEUTENANT", total: 2 },
  ],
  profiles: [
    {
      name: "Hacker",
      mov: "4-4",
      cc: 10,
      bs: 10,
      ph: 10,
      wip: 13,
      arm: 1,
      bts: 0,
      w: 1,
      s: 2,
      isStr: false,
      skills: [],
      equip: [],
      weapons: [{ id: 4 }],
      resolvedWeapons: [],
      resolvedSkills: [],
      resolvedEquip: ["Hacking Device (UPGRADE: Trinity (+1B))"],
    },
  ],
}
const list: EnrichedArmyList = {
  sectoralId: 0,
  sectoralName: "Test",
  armyName: "Test list",
  points: 20,
  combatGroups: [{ groupNumber: 1, members: [unit] }],
}
afterEach(cleanup)
describe("list reference details", () => {
  it("shows source order totals at the top and on the unit", () => {
    render(
      <SettingsProvider>
        <ListView list={list} unit="imperial" />
      </SettingsProvider>
    )
    expect(
      within(screen.getByRole("region", { name: "Order summary" })).getByText(
        /profile orders/
      ).parentElement?.textContent
    ).toBe("3 profile orders")
    expect(
      within(screen.getByLabelText("Test hacker orders")).getByText(
        "2 Lieutenant"
      )
    ).toBeTruthy()
  })
  it("opens device programs with extra-program and modifier notes", () => {
    render(
      <SettingsProvider>
        <ListView list={list} unit="imperial" />
      </SettingsProvider>
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: "View programs for Hacking Device (UPGRADE: Trinity (+1B))",
      })
    )
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByRole("link", { name: "Trinity" })).toBeTruthy()
    expect(within(dialog).getByText("Extra program")).toBeTruthy()
    expect(within(dialog).getAllByText("UPGRADE: Trinity (+1B)")).toHaveLength(
      2
    )
  })
  it("renders a single chart name across all modes and keeps unrelated names separate", () => {
    render(
      <SettingsProvider>
        <ListView list={list} unit="imperial" />
      </SettingsProvider>
    )
    const chart = screen.getByRole("table")
    const heading = within(chart).getByRole("rowheader", {
      name: "MULTI Heavy Machine Gun",
    })
    expect(heading.getAttribute("rowspan")).toBe("3")
    expect(getWeaponModeGroups(111).map((group) => group?.[0].name)).toEqual([
      "Deployable Repeater",
      "Plasma Carbine",
    ])
  })
})
