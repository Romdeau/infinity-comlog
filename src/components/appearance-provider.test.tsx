import { describe, it, expect, afterEach, beforeEach, vi } from "vitest"
import { render, cleanup, act } from "@testing-library/react"
import { AppearanceProvider, useAppearance } from "./appearance-provider"
import { STORAGE_KEYS } from "@/shared/storage/storage-keys"

function Probe() {
  const { themeId, mode, resolvedMode, setThemeId, setMode } = useAppearance()
  return (
    <div>
      <span data-testid="themeId">{themeId}</span>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolvedMode">{resolvedMode}</span>
      <button onClick={() => setThemeId("rebellion")}>set-theme</button>
      <button onClick={() => setMode("light")}>set-light</button>
    </div>
  )
}

function renderProvider() {
  return render(
    <AppearanceProvider defaultThemeId="hardscifi" defaultMode="dark">
      <Probe />
    </AppearanceProvider>
  )
}

describe("AppearanceProvider", () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ""
    document.documentElement.removeAttribute("data-theme")
  })

  afterEach(() => {
    cleanup()
  })

  it("applies default themeId and dark mode to the DOM", () => {
    const { getByTestId } = renderProvider()
    expect(getByTestId("themeId").textContent).toBe("hardscifi")
    expect(getByTestId("mode").textContent).toBe("dark")
    expect(getByTestId("resolvedMode").textContent).toBe("dark")
    expect(document.documentElement.getAttribute("data-theme")).toBe("hardscifi")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("migrates a legacy bare string value to { hardscifi, <mode> }", () => {
    window.localStorage.setItem(STORAGE_KEYS.theme, "light")
    const { getByTestId } = renderProvider()
    expect(getByTestId("themeId").textContent).toBe("hardscifi")
    expect(getByTestId("mode").textContent).toBe("light")
    expect(getByTestId("resolvedMode").textContent).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("persists themeId and mode as JSON", () => {
    const { getByText } = renderProvider()
    act(() => {
      getByText("set-theme").click()
    })
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.theme)!)
    expect(stored.themeId).toBe("rebellion")
    expect(document.documentElement.getAttribute("data-theme")).toBe("rebellion")
  })

  it("toggles .dark when mode changes to light", () => {
    const { getByText } = renderProvider()
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    act(() => {
      getByText("set-light").click()
    })
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.theme)!)
    expect(stored.mode).toBe("light")
  })

  it("resolves system mode via matchMedia", () => {
    const mql = {
      matches: true,
      media: "(prefers-color-scheme: dark)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    const spy = vi
      .spyOn(window, "matchMedia")
      .mockImplementation(() => mql as unknown as MediaQueryList)

    window.localStorage.setItem(
      STORAGE_KEYS.theme,
      JSON.stringify({ themeId: "orbital", mode: "system" })
    )
    const { getByTestId } = renderProvider()
    expect(getByTestId("resolvedMode").textContent).toBe("dark")
    expect(mql.addEventListener).toHaveBeenCalled()
    spy.mockRestore()
  })
})
