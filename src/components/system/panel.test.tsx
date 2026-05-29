import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { Panel } from "./panel"

describe("Panel", () => {
  afterEach(cleanup)

  it("renders the panel-frame chrome and children", () => {
    const { container, getByText } = render(<Panel>body content</Panel>)
    expect(container.querySelector(".panel-frame")).not.toBeNull()
    expect(getByText("body content")).not.toBeNull()
  })

  it("renders eyebrow, title and status when provided", () => {
    const { getByText, container } = render(
      <Panel eyebrow="Module" title="Scoreboard" status="active">
        x
      </Panel>
    )
    expect(getByText("Module")).not.toBeNull()
    expect(getByText("Scoreboard")).not.toBeNull()
    expect(container.querySelector(".text-status-active")).not.toBeNull()
  })
})
