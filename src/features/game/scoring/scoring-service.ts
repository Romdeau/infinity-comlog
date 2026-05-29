import type { GameSession } from "@/context/game-context-core"
import { calculateTP } from "@/lib/game-flow-helpers"
import type { MissionDefinition, MissionObjective } from "@/shared/types/missions"
import type { MissionRole, ScoringSide, TurnKey } from "@/shared/types/game"
import { turnKeys } from "@/shared/types/game"

export type ScoreSummary = {
  playerOP: number
  opponentOP: number
  playerTP: number
  opponentTP: number
  roles: Record<ScoringSide, MissionRole | undefined>
}

type GameState = GameSession["state"]

function getObjectiveProgress(value: number | boolean | undefined) {
  if (typeof value === "number") return value
  if (value === true) return 1
  return 0
}

export function getAssignedMissionRole(mission: Pick<MissionDefinition, "hasRoles"> | null | undefined, state: Pick<GameState, "initiative">, side: ScoringSide): MissionRole | undefined {
  if (!mission?.hasRoles || state.initiative.firstTurn === null) return undefined

  const isPlayer = side === "player"
  const isFirst =
    (isPlayer && state.initiative.firstTurn === "player") ||
    (!isPlayer && state.initiative.firstTurn === "opponent")

  return isFirst ? "attacker" : "defender"
}

export function objectiveAppliesToRole(objective: Pick<MissionObjective, "role">, role: MissionRole | undefined) {
  return !objective.role || objective.role === role
}

export function getRoundObjectiveProgress(state: Pick<GameState, "turns">, side: ScoringSide, objectiveId: string) {
  return turnKeys.reduce((total, turnKey) => {
    const value = state.turns[turnKey as TurnKey].objectives[side][objectiveId]
    return total + getObjectiveProgress(value)
  }, 0)
}

export function calculateObjectivePoints(mission: MissionDefinition | null | undefined, state: GameState, side: ScoringSide) {
  if (!mission) return state.scoring[side].op

  const assignedRole = getAssignedMissionRole(mission, state, side)
  const objectiveProgress = state.scoring[side].objectives
  let total = state.scoring[side].classifieds || 0

  mission.objectives.forEach((objective) => {
    if (!objectiveAppliesToRole(objective, assignedRole)) return

    if (objective.type === "manual") {
      total += getObjectiveProgress(objectiveProgress[objective.id]) * objective.op
      return
    }

    if (objective.type === "boolean" || objective.type === "game-end") {
      if (objectiveProgress[objective.id]) total += objective.op
      return
    }

    if (objective.type === "round-end" || objective.type === "round-end-boolean") {
      total += getRoundObjectiveProgress(state, side, objective.id) * objective.op
      return
    }

    if (objective.type === "round-end-manual") {
      total += getRoundObjectiveProgress(state, side, objective.id) * objective.op
    }
  })

  return Math.min(10, total)
}

export function getScoreSummary(mission: MissionDefinition | null | undefined, state: GameState): ScoreSummary {
  const playerOP = calculateObjectivePoints(mission, state, "player")
  const opponentOP = calculateObjectivePoints(mission, state, "opponent")

  return {
    playerOP,
    opponentOP,
    playerTP: calculateTP(playerOP, opponentOP),
    opponentTP: calculateTP(opponentOP, playerOP),
    roles: {
      player: getAssignedMissionRole(mission, state, "player"),
      opponent: getAssignedMissionRole(mission, state, "opponent"),
    },
  }
}
