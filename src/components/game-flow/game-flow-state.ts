import type { GameSession } from "@/context/game-context"
import type { MissionObjective } from "@/shared/types/missions"
import type {
  ScoringSide,
  TurnKey,
  TurnPlayerKey,
} from "@/shared/types/game"

export type GameState = GameSession["state"]
export type GameTurn = GameState["turns"][TurnKey]
export type PlayerTurn = GameTurn[TurnPlayerKey]
export type RoundObjective = Extract<
  MissionObjective,
  { type: "round-end" | "round-end-boolean" | "round-end-manual" }
>

export function isRoundObjective(
  objective: MissionObjective
): objective is RoundObjective {
  return (
    objective.type === "round-end" ||
    objective.type === "round-end-boolean" ||
    objective.type === "round-end-manual"
  )
}

export function updateTurn(
  state: GameState,
  turnKey: TurnKey,
  updater: (turn: GameTurn) => GameTurn
): GameState {
  return {
    ...state,
    turns: {
      ...state.turns,
      [turnKey]: updater(state.turns[turnKey]),
    },
  }
}

export function updateTurnPlayer(
  state: GameState,
  turnKey: TurnKey,
  playerKey: TurnPlayerKey,
  updater: (player: PlayerTurn) => PlayerTurn
): GameState {
  return updateTurn(state, turnKey, (turn) => ({
    ...turn,
    [playerKey]: updater(turn[playerKey]),
  }))
}

export function toggleRoundObjective(
  state: GameState,
  turnKey: TurnKey,
  side: ScoringSide,
  objective: RoundObjective
): GameState {
  return updateTurn(state, turnKey, (turn) => {
    const currentObjectives = turn.objectives[side]
    const current = currentObjectives[objective.id]
    const nextValue =
      objective.type === "round-end-manual"
        ? typeof current === "number" && current >= objective.max
          ? 0
          : (typeof current === "number" ? current : 0) + 1
        : !current

    return {
      ...turn,
      objectives: {
        ...turn.objectives,
        [side]: {
          ...currentObjectives,
          [objective.id]: nextValue,
        },
      },
    }
  })
}

export function toggleScoringObjective(
  state: GameState,
  side: ScoringSide,
  objective: MissionObjective
): GameState {
  const currentObjectives = state.scoring[side].objectives
  const current = currentObjectives[objective.id]
  const nextValue =
    objective.type === "manual"
      ? typeof current === "number" && current >= objective.max
        ? 0
        : (typeof current === "number" ? current : 0) + 1
      : !current

  return {
    ...state,
    scoring: {
      ...state.scoring,
      [side]: {
        ...state.scoring[side],
        objectives: {
          ...currentObjectives,
          [objective.id]: nextValue,
        },
      },
    },
  }
}
