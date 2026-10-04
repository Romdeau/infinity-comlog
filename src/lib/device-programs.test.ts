import { describe, expect, it } from "vitest"
import { getDevicePrograms } from "./device-programs"
import type { EnrichedProfile } from "@/components/list-view/list-view-helpers"
const profile = (equipment: string[], skills: string[] = []) =>
  ({ resolvedEquip: equipment, resolvedSkills: skills }) as EnrichedProfile

describe("profile hacking programs", () => {
  it("includes only the clicked device's base programs", () => {
    const data = getDevicePrograms("Killer Hacking Device", profile([]))!
    expect(data.programs.some((p) => p.name === "Trinity")).toBe(true)
    expect(data.programs.some((p) => p.name === "Oblivion")).toBe(false)
    expect(getDevicePrograms("Multispectral Visor", profile([]))).toBeNull()
  })
  it("adds upgrade programs and retains exact modifier text without duplicates", () => {
    const name = "Hacking Device (UPGRADE: Trinity (+1B))"
    const data = getDevicePrograms(name, profile([name]))!
    expect(data.programs.filter((p) => p.name === "Trinity")).toHaveLength(1)
    expect(data.programs.find((p) => p.name === "Trinity")).toMatchObject({
      added: true,
      upgrades: ["UPGRADE: Trinity (+1B)"],
    })
  })
  it("shows changes to existing programs and general upgrades", () => {
    const name = "Hacking Device (UPGRADE: Oblivion (+1B))"
    const data = getDevicePrograms(name, profile([name], ["UPGRADE: SR-1"]))!
    expect(data.programs.find((p) => p.name === "Oblivion")).toMatchObject({
      added: false,
      upgrades: ["UPGRADE: Oblivion (+1B)"],
    })
    expect(data.upgrades).toContain("UPGRADE: SR-1")
  })
  it("does not leak upgrades from another device", () => {
    const data = getDevicePrograms(
      "Killer Hacking Device",
      profile(["Hacking Device (UPGRADE: Oblivion (+1B))"])
    )!
    expect(data.programs.some((p) => p.name === "Oblivion")).toBe(false)
  })
})
