import * as React from "react"

import { describe, it, expect, beforeEach, afterEach } from "bun:test"
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
})
