import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup, act, fireEvent } from "@testing-library/react"
import { ThemePicker } from "./theme-picker"
import { AppearanceProvider, useAppearance } from "./appearance-provider"
import { THEMES } from "@/app/themes"

function CurrentTheme() {
  const { themeId } = useAppearance()
  return <span data-testid="current">{themeId}</span>
}

function setup() {
  return render(
    <AppearanceProvider defaultThemeId="hardscifi" defaultMode="dark">
      <ThemePicker />
      <CurrentTheme />
    </AppearanceProvider>
  )
}

function openMenu(trigger: HTMLElement) {
  act(() => {
    fireEvent.pointerDown(
      trigger,
      new MouseEvent("pointerdown", { bubbles: true, button: 0 })
    )
    fireEvent.pointerUp(trigger)
    trigger.click()
  })
}

describe("ThemePicker", () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it("lists every registered theme", async () => {
    const { getByRole, findByText } = setup()
    openMenu(getByRole("button"))
    for (const theme of THEMES) {
      expect(await findByText(theme.label)).not.toBeNull()
    }
  })

  it("applies the selected theme", async () => {
    const { getByRole, findByText, getByTestId } = setup()
    openMenu(getByRole("button"))
    const item = await findByText("Rebellion")
    act(() => item.click())
    expect(getByTestId("current").textContent).toBe("rebellion")
  })
})
