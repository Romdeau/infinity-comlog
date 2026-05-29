import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { StatLine } from "./stat-line"

const profile = {
  mov: "4-4",
  cc: "13",
  bs: "12",
  ph: "11",
  wip: "13",
  arm: "1",
  bts: "0",
  w: "1",
  s: "2",
}

describe("StatLine", () => {
  afterEach(cleanup)

  it("renders all nine stat headers and values", () => {
    const { getByText } = render(<StatLine profile={profile} />)
    for (const h of ["MOV", "CC", "BS", "PH", "WIP", "ARM", "BTS", "VITA", "S"]) {
      expect(getByText(h)).not.toBeNull()
    }
    expect(getByText("4-4")).not.toBeNull()
  })

  it("shows STR header when isStr is set", () => {
    const { getByText, queryByText } = render(
      <StatLine profile={{ ...profile, isStr: true }} />
    )
    expect(getByText("STR")).not.toBeNull()
    expect(queryByText("VITA")).toBeNull()
  })

  it("uses the mono readout treatment for values", () => {
    const { container } = render(<StatLine profile={profile} />)
    expect(container.querySelector(".hud-readout")).not.toBeNull()
  })
})
