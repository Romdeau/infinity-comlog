import * as React from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { GameContext, type GameContextType, type GameSession, type PlayerTurnState, useGame } from "./game-context-core"

export { useGame }
export type { GameSession, PlayerTurnState, GameContextType }

const createInitialPlayerTurn = (): PlayerTurnState => ({
  doneOverride: false,
  tactical: {
    doneOverride: false,
    tokens: false,
    retreat: false,
    lol: false,
    count: false,
  },
  impetuous: false,
  orders: false,
  states: false,
  end: false,
})

const createInitialGameState = (): GameSession['state'] => ({
  scenario: "",
  classifiedsCount: 1,
  scenarioPicked: false,
  listPicked: false,
  classifiedsDrawn: false,
  initiationDoneOverride: false,
  setupDoneOverride: false,
  initiationSubSteps: {
    rollOff: false,
    deployment: false,
    commandTokens: false,
  },
  initiative: {
    winner: 'player',
    choice: 'initiative',
    firstTurn: null,
    firstDeployment: null,
  },
  deploymentDetails: {
    hidden: false,
    infiltration: false,
    forward: false,
    heldBack: 1,
    booty: false,
    deployedUnits: {},
  },
  turns: {
    turn1: { doneOverride: false, p1: createInitialPlayerTurn(), p2: createInitialPlayerTurn(), objectives: { player: {}, opponent: {} } },
    turn2: { doneOverride: false, p1: createInitialPlayerTurn(), p2: createInitialPlayerTurn(), objectives: { player: {}, opponent: {} } },
    turn3: { doneOverride: false, p1: createInitialPlayerTurn(), p2: createInitialPlayerTurn(), objectives: { player: {}, opponent: {} } },
  },
  scoring: {
    doneOverride: false,
    player: { op: 0, vp: 0, objectives: {} },
    opponent: { op: 0, vp: 0, objectives: {} },
  },
  selectedList: "none"
})

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useLocalStorage<Record<string, GameSession>>("comlog_sessions", {})
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>("comlog_active_session_id", null)

  const activeSession = activeSessionId ? sessions[activeSessionId] || null : null

  const createSession = (name: string) => {
    const id = crypto.randomUUID()
    const newSession: GameSession = {
      id,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      state: createInitialGameState()
    }
    setSessions(prev => ({ ...prev, [id]: newSession }))
    setActiveSessionId(id)
    return id
  }

  const renameSession = (id: string, name: string) => {
    setSessions(prev => {
      const session = prev[id]
      if (!session) return prev
      return {
        ...prev,
        [id]: { ...session, name, updatedAt: Date.now() }
      }
    })
  }

  const updateActiveSession = (updater: (prev: GameSession['state']) => GameSession['state']) => {
    if (!activeSessionId) return
    setSessions(prev => {
      const session = prev[activeSessionId]
      if (!session) return prev
      return {
        ...prev,
        [activeSessionId]: {
          ...session,
          updatedAt: Date.now(),
          state: updater(session.state)
        }
      }
    })
  }

  const switchSession = (id: string | null) => {
    setActiveSessionId(id)
  }

  const deleteSession = (id: string) => {
    setSessions(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (activeSessionId === id) setActiveSessionId(null)
  }

  return (
    <GameContext.Provider value={{
      sessions,
      activeSessionId,
      activeSession,
      createSession,
      renameSession,
      updateActiveSession,
      switchSession,
      deleteSession
    }}>
      {children}
    </GameContext.Provider>
  )
}
