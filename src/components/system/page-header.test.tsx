import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { PageHeader } from "./page-header"

describe("PageHeader", () => {
  afterEach(cleanup)

  it("renders title, description, eyebrow and status", () => {
    const { getByText } = render(
      <PageHeader
        eyebrow="Module"
        title="Roster Readout"
        description="Read-only roster."
        status="2 lists"
      />
    )
    expect(getByText("Roster Readout")).not.toBeNull()
    expect(getByText("Read-only roster.")).not.toBeNull()
    expect(getByText("Module")).not.toBeNull()
    expect(getByText("2 lists")).not.toBeNull()
  })

  it("uses the display font for the title", () => {
    const { getByText } = render(
      <PageHeader title="Mission Console" description="d" />
    )
    expect(getByText("Mission Console").className).toContain("font-display")
  })

  it("renders a system status strip when provided", () => {
    const { getByText } = render(
      <PageHeader
        title="t"
        description="d"
        systemStatus={<span>List A loaded</span>}
      />
    )
    expect(getByText("List A loaded")).not.toBeNull()
  })
})
