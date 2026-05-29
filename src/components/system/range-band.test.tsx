import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { RangeBand } from "./range-band"

const distance = {
  short: { max: 20, mod: "+3" },
  med: { max: 40, mod: "0" },
  long: { max: 60, mod: "-3" },
  max: { max: 120, mod: "-6" },
}

describe("RangeBand", () => {
  afterEach(cleanup)

  it("renders seven cells", () => {
    const { container } = render(
      <RangeBand distance={distance} unit="imperial" />
    )
    const grid = container.querySelector(".grid-cols-7")
    expect(grid).not.toBeNull()
    expect(grid!.children.length).toBe(7)
  })

  it("uses tokenized band classes, not hardcoded palette colors", () => {
    const { container } = render(<RangeBand distance={distance} unit="metric" />)
    expect(container.querySelector(".bg-band-good")).not.toBeNull()
    expect(container.querySelector(".bg-band-worst")).not.toBeNull()
    expect(container.querySelector('[class*="bg-green-"]')).toBeNull()
    expect(container.querySelector('[class*="bg-red-"]')).toBeNull()
  })

  it("renders an empty placeholder when distance is null", () => {
    const { container } = render(<RangeBand distance={null} unit="imperial" />)
    expect(container.querySelector(".grid-cols-7")).toBeNull()
  })
})
