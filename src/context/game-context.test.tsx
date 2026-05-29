import * as React from "react"

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderHook, act, cleanup, waitFor } from "@testing-library/react"

await import("@/context/game-context")

import { GameProvider, useGame } from "./game-context"

describe("GameContext Persistence", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.removeItem("comlog_sessions")
    window.localStorage.removeItem("comlog_active_session_id")
  })

  afterEach(() => {
    cleanup()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  )

  it("creates a new active session", async () => {
    const { result } = renderHook(() => useGame(), { wrapper })

    act(() => {
      result.current.createSession("Test Session")
    })

    await waitFor(() => {
      expect(result.current.activeSessionId).toBeTruthy()
      expect(result.current.activeSession?.name).toBe("Test Session")
    })
  })

  it("updates scoring in the active session", async () => {
    const { result } = renderHook(() => useGame(), { wrapper })

    act(() => {
      result.current.createSession("Test Session")
    })

    await waitFor(() => {
      expect(result.current.activeSession?.name).toBe("Test Session")
    })

    act(() => {
      result.current.updateActiveSession((prev) => ({
        ...prev,
        scoring: {
          ...prev.scoring,
          player: { ...prev.scoring.player, op: 5 },
        },
      }))
    })

    await waitFor(() => {
      expect(result.current.activeSession?.state.scoring.player.op).toBe(5)
    })
  })

  it("reloads the selected active session from localStorage", async () => {
    const { result, unmount } = renderHook(() => useGame(), { wrapper })

    act(() => {
      result.current.createSession("Persistent Session")
    })

    await waitFor(() => {
      expect(result.current.activeSessionId).toBeTruthy()
    })

    const sessionId = result.current.activeSessionId

    act(() => {
      result.current.updateActiveSession((prev) => ({
        ...prev,
        scoring: {
          ...prev.scoring,
          player: { ...prev.scoring.player, op: 7 },
        },
      }))
    })

    await waitFor(() => {
      expect(result.current.activeSession?.state.scoring.player.op).toBe(7)
    })

    unmount()

    const { result: reloaded } = renderHook(() => useGame(), { wrapper })

    await waitFor(() => {
      expect(reloaded.current.activeSessionId).toBe(sessionId)
      expect(reloaded.current.activeSession?.name).toBe("Persistent Session")
      expect(reloaded.current.activeSession?.state.scoring.player.op).toBe(7)
    })
  })

  it("clears the active session ID when the stored session is missing", async () => {
    window.localStorage.setItem("comlog_active_session_id", JSON.stringify("missing-session"))

    const { result } = renderHook(() => useGame(), { wrapper })

    await waitFor(() => {
      expect(result.current.activeSessionId).toBeNull()
      expect(window.localStorage.getItem("comlog_active_session_id")).toBe("null")
    })
  })
})
