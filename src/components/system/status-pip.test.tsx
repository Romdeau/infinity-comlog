import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { StatusPip } from "./status-pip"

describe("StatusPip", () => {
  afterEach(cleanup)

  it("renders the default label for a status", () => {
    const { getByText } = render(<StatusPip status="complete" />)
    expect(getByText("Complete")).not.toBeNull()
  })

  it("applies the status token color class", () => {
    const { container } = render(<StatusPip status="danger" />)
    expect(container.querySelector(".text-status-danger")).not.toBeNull()
  })

  it("supports a custom label", () => {
    const { getByText } = render(<StatusPip status="active" label="Your Turn" />)
    expect(getByText("Your Turn")).not.toBeNull()
  })

  it("exposes an aria-label when icon-only (no color-only meaning)", () => {
    const { getByRole } = render(
      <StatusPip status="warning" label="Mismatch" iconOnly />
    )
    const el = getByRole("img")
    expect(el.getAttribute("aria-label")).toBe("Mismatch")
  })
})
