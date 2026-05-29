import { describe, expect, it } from "vitest"

import { getHackingDeviceNames, getHackingProgramsByDevice, toHackingProgramViewModel } from "./metadata-selectors"

describe("metadata selectors", () => {
  it("normalizes hacking program metadata for UI display", () => {
    const program = toHackingProgramViewModel({
      name: "Assisted\u00a0Fire",
      devices: [182],
      target: ["REM"],
      burst: "-",
      damage: "-",
      attack: "-",
      opponent: "-",
      special: "Target gains Marksmanship.",
      skillType: ["entire order"],
    })

    expect(program).toMatchObject({
      name: "Assisted Fire",
      deviceIds: [182],
      target: "REM",
      skillType: "ENTIRE ORDER",
    })
  })

  it("groups hacking programs by metadata hacking devices", () => {
    const devices = getHackingDeviceNames()
    const groups = getHackingProgramsByDevice()

    expect(devices[100]).toBe("Hacking Device")
    expect(groups["EVO Hacking Device"].some((program) => program.name === "Assisted Fire")).toBe(true)
  })
})
