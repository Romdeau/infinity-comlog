import { afterEach, describe, expect, it } from "vitest"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { FireteamRoster } from "./fireteam-roster"
import { SettingsProvider } from "@/context/settings-context"
import { setFactionDataForTest } from "@/lib/faction-data-service"
import type { EnrichedArmyList, EnrichedTrooper } from "@/lib/unit-service"
const member: EnrichedTrooper = {
  id: 1,
  groupId: 1,
  optionId: 1,
  name: "Guard",
  isc: "Guard",
  type: "LI",
  training: "REGULAR",
  points: 10,
  swc: "0",
  isLieutenant: false,
  profiles: [],
}
const list: EnrichedArmyList = {
  sectoralId: 123456,
  armyName: "Test",
  sectoralName: "Test",
  points: 40,
  combatGroups: [
    { groupNumber: 1, members: [member, member] },
    { groupNumber: 2, members: [member, member] },
  ],
}
const renderRoster = (roster = list) =>
  render(
    <SettingsProvider>
      <FireteamRoster list={roster} />
    </SettingsProvider>
  )
afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe("fireteam roster interactions", () => {
  it("groups only chosen units, enforces army-wide caps, persists and ungroups", async () => {
    setFactionDataForTest(123456, {
      units: [{ id: 1, name: "Guard", slug: "guard", profileGroups: [] }],
      fireteamChart: {
        spec: { DUO: 1 },
        desc: "",
        teams: [
          {
            name: "Guards",
            obs: "",
            type: ["DUO"],
            units: [
              {
                name: "Guard",
                slug: "guard",
                min: 1,
                max: 2,
                required: false,
                comment: "",
              },
            ],
          },
        ],
      },
    })
    const view = renderRoster()
    const badges = await screen.findAllByRole("button", {
      name: "Guards · DUO",
    })
    expect(badges).toHaveLength(4)
    fireEvent.click(badges[0])
    const dialog = screen.getByRole("dialog")
    const submit = within(dialog).getByRole("button", {
      name: "Group fireteam",
    })
    expect(submit.hasAttribute("disabled")).toBe(true)
    within(dialog)
      .getAllByRole("checkbox")
      .forEach((checkbox) => fireEvent.click(checkbox))
    fireEvent.click(submit)
    expect(screen.getAllByRole("region", { name: "Guards DUO" })).toHaveLength(
      1
    )
    expect(screen.queryByRole("button", { name: "Guards · DUO" })).toBeNull()
    view.unmount()
    renderRoster()
    expect(
      await screen.findByRole("region", { name: "Guards DUO" })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Ungroup" }))
    expect(screen.queryByRole("region", { name: "Guards DUO" })).toBeNull()
    expect(
      screen.getAllByRole("button", { name: "Guards · DUO" })
    ).toHaveLength(4)
  })
  it("never combines members from different combat groups", async () => {
    renderRoster({
      ...list,
      combatGroups: list.combatGroups.map((group) => ({
        ...group,
        members: [member],
      })),
    })
    await screen.findByText(/Fireteam badges/)
    expect(screen.queryByRole("button", { name: "Guards · DUO" })).toBeNull()
  })
})
