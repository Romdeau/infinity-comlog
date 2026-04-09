/* eslint-disable react-refresh/only-export-components */
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
  orders: {
    done: false,
  },
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
    strategicUse: false,
  },
  initiative: {
    winner: 'player',
    choice: 'initiative',
    firstTurn: null,
    firstDeployment: null,
  },
  strategicOptions: {
    p1Reserve: false,
    p1Speedball: false,
    p2OrderReduction: false,
    p2CtLimit: false,
    p2SuppressiveFire: false,
    p2Speedball: false,
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
    player: { op: 0, vp: 0, classifieds: 0, objectives: {} },
    opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
  },
  selectedList: "none"
})

const mergeDefined = <T extends object>(base: T, value: unknown): T => {
  if (!value || typeof value !== "object") return base
  return { ...base, ...(value as Partial<T>) }
}

const migratePlayerTurn = (turn: unknown): PlayerTurnState => {
  const base = createInitialPlayerTurn()
  const merged = mergeDefined(base, turn)

  return {
    ...merged,
    tactical: mergeDefined(base.tactical, merged.tactical),
    orders: mergeDefined(base.orders, merged.orders),
  }
}

const migrateGameState = (state: unknown): GameSession["state"] => {
  const base = createInitialGameState()
  const merged = mergeDefined(base, state)

  return {
    ...merged,
    initiationSubSteps: mergeDefined(base.initiationSubSteps, merged.initiationSubSteps),
    initiative: mergeDefined(base.initiative, merged.initiative),
    strategicOptions: mergeDefined(base.strategicOptions, merged.strategicOptions),
    deploymentDetails: {
      ...mergeDefined(base.deploymentDetails, merged.deploymentDetails),
      deployedUnits: mergeDefined(base.deploymentDetails.deployedUnits, merged.deploymentDetails?.deployedUnits),
    },
    turns: {
      turn1: {
        ...mergeDefined(base.turns.turn1, merged.turns?.turn1),
        p1: migratePlayerTurn(merged.turns?.turn1?.p1),
        p2: migratePlayerTurn(merged.turns?.turn1?.p2),
        objectives: {
          player: mergeDefined(base.turns.turn1.objectives.player, merged.turns?.turn1?.objectives?.player),
          opponent: mergeDefined(base.turns.turn1.objectives.opponent, merged.turns?.turn1?.objectives?.opponent),
        },
      },
      turn2: {
        ...mergeDefined(base.turns.turn2, merged.turns?.turn2),
        p1: migratePlayerTurn(merged.turns?.turn2?.p1),
        p2: migratePlayerTurn(merged.turns?.turn2?.p2),
        objectives: {
          player: mergeDefined(base.turns.turn2.objectives.player, merged.turns?.turn2?.objectives?.player),
          opponent: mergeDefined(base.turns.turn2.objectives.opponent, merged.turns?.turn2?.objectives?.opponent),
        },
      },
      turn3: {
        ...mergeDefined(base.turns.turn3, merged.turns?.turn3),
        p1: migratePlayerTurn(merged.turns?.turn3?.p1),
        p2: migratePlayerTurn(merged.turns?.turn3?.p2),
        objectives: {
          player: mergeDefined(base.turns.turn3.objectives.player, merged.turns?.turn3?.objectives?.player),
          opponent: mergeDefined(base.turns.turn3.objectives.opponent, merged.turns?.turn3?.objectives?.opponent),
        },
      },
    },
    scoring: {
      ...mergeDefined(base.scoring, merged.scoring),
      player: {
        ...mergeDefined(base.scoring.player, merged.scoring?.player),
        objectives: mergeDefined(base.scoring.player.objectives, merged.scoring?.player?.objectives),
      },
      opponent: {
        ...mergeDefined(base.scoring.opponent, merged.scoring?.opponent),
        objectives: mergeDefined(base.scoring.opponent.objectives, merged.scoring?.opponent?.objectives),
      },
    },
    selectedList: merged.selectedList === "listA" || merged.selectedList === "listB" ? merged.selectedList : "none",
  }
}

const migrateSession = (session: GameSession): GameSession => ({
  ...session,
  state: migrateGameState(session.state),
})

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useLocalStorage<Record<string, GameSession>>("comlog_sessions", {})
  const [activeSessionId, setActiveSessionId] = useLocalStorage<string | null>("comlog_active_session_id", null)
  const hydratedSessions = React.useMemo(
    () => Object.fromEntries(Object.entries(sessions).map(([id, session]) => [id, migrateSession(session)])),
    [sessions]
  )

  React.useEffect(() => {
    const needsMigration = Object.entries(sessions).some(([id, session]) => {
      const migrated = migrateSession(session)
      return JSON.stringify(migrated) !== JSON.stringify(session) || id !== migrated.id
    })

    if (needsMigration) {
      setSessions(hydratedSessions)
    }
  }, [hydratedSessions, sessions, setSessions])

  const activeSession = activeSessionId ? hydratedSessions[activeSessionId] || null : null

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
      const migratedSession = migrateSession(session)
      return {
        ...prev,
        [activeSessionId]: {
          ...migratedSession,
          updatedAt: Date.now(),
          state: updater(migratedSession.state)
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
      sessions: hydratedSessions,
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
