import * as React from "react"

export interface PlayerTurnState {
  doneOverride: boolean
  tactical: {
    doneOverride: boolean
    tokens: boolean
    retreat: boolean
    lol: boolean
    count: boolean
  }
  impetuous: boolean
  orders: boolean
  states: boolean
  end: boolean
}

export interface GameSession {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  state: {
    scenario: string
    classifiedsCount: number
    scenarioPicked: boolean
    listPicked: boolean
    classifiedsDrawn: boolean
    initiationDoneOverride: boolean
    setupDoneOverride: boolean
    initiationSubSteps: {
      rollOff: boolean
      deployment: boolean
      commandTokens: boolean
    }
    initiative: {
      winner: 'player' | 'opponent'
      choice: 'initiative' | 'deployment'
      firstTurn: 'player' | 'opponent' | null
      firstDeployment: 'player' | 'opponent' | null
    }
    deploymentDetails: {
      hidden: boolean
      infiltration: boolean
      forward: boolean
      heldBack: number
      booty: boolean
      deployedUnits: Record<string, boolean>
    }
    turns: {
      turn1: { doneOverride: boolean; p1: PlayerTurnState; p2: PlayerTurnState; objectives: Record<string, any> }
      turn2: { doneOverride: boolean; p1: PlayerTurnState; p2: PlayerTurnState; objectives: Record<string, any> }
      turn3: { doneOverride: boolean; p1: PlayerTurnState; p2: PlayerTurnState; objectives: Record<string, any> }
    }
    scoring: {
      doneOverride: boolean
      player: { op: number; vp: number; objectives: Record<string, any> }
      opponent: { op: number; vp: number; objectives: Record<string, any> }
    }
    selectedList: "none" | "listA" | "listB"
  }
}

export interface GameContextType {
  sessions: Record<string, GameSession>
  activeSessionId: string | null
  activeSession: GameSession | null
  createSession: (name: string) => string
  renameSession: (id: string, name: string) => void
  updateActiveSession: (updater: (prev: GameSession['state']) => GameSession['state']) => void
  switchSession: (id: string | null) => void
  deleteSession: (id: string) => void
}

export const GameContext = React.createContext<GameContextType | undefined>(undefined)

export function useGame() {
  const context = React.useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
