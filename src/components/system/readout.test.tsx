import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { Readout } from "./readout"

describe("Readout", () => {
  afterEach(cleanup)

  it("renders label, value and unit", () => {
    const { getByText } = render(<Readout label="Orders" value={6} unit="REG" />)
    expect(getByText("Orders")).not.toBeNull()
    expect(getByText("6")).not.toBeNull()
    expect(getByText("REG")).not.toBeNull()
  })

  it("uses the monospace hud-readout treatment", () => {
    const { container } = render(<Readout label="VP" value={3} />)
    expect(container.querySelector(".hud-readout")).not.toBeNull()
  })
})
