import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useLocalStorage } from "./use-local-storage"

describe("useLocalStorage", () => {
  it("passes the latest queued value to functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0))

    act(() => {
      result.current[1]((value) => value + 1)
      result.current[1]((value) => value + 1)
    })

    expect(result.current[0]).toBe(2)
    expect(window.localStorage.getItem("counter")).toBe("2")
  })

  it("keeps React state when localStorage write fails", () => {
    const originalSetItem = window.localStorage.setItem
    Object.defineProperty(window.localStorage, "setItem", {
      configurable: true,
      value: vi.fn(() => {
        throw new Error("quota")
      }),
    })
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    const { result } = renderHook(() => useLocalStorage("write-failure", 1))

    act(() => {
      result.current[1](2)
    })

    expect(result.current[0]).toBe(2)
    expect(warn).toHaveBeenCalled()

    Object.defineProperty(window.localStorage, "setItem", {
      configurable: true,
      value: originalSetItem,
    })
    warn.mockRestore()
  })
})
