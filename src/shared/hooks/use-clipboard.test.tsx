import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useClipboard } from "./use-clipboard"

describe("useClipboard", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it("copies text and resets copied state after the delay", async () => {
    vi.useFakeTimers()
    const writeText = vi.fn(async () => {})
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })

    const { result } = renderHook(() => useClipboard(100))

    await act(async () => {
      await result.current.copyText("army-code")
    })

    expect(writeText).toHaveBeenCalledWith("army-code")
    expect(result.current.copied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.copied).toBe(false)
  })

  it("returns false when there is no text to copy", async () => {
    const writeText = vi.fn(async () => {})
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    const { result } = renderHook(() => useClipboard())

    await expect(result.current.copyText("")).resolves.toBe(false)
    expect(writeText).not.toHaveBeenCalled()
  })
})
