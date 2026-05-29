export const turnKeys = ["turn1", "turn2", "turn3"] as const
export type TurnKey = (typeof turnKeys)[number]

export const turnPlayerKeys = ["p1", "p2"] as const
export type TurnPlayerKey = (typeof turnPlayerKeys)[number]

export const scoringSides = ["player", "opponent"] as const
export type ScoringSide = (typeof scoringSides)[number]

export const missionRoles = ["attacker", "defender"] as const
export type MissionRole = (typeof missionRoles)[number]

export function isTurnKey(value: string): value is TurnKey {
  return turnKeys.includes(value as TurnKey)
}

export function isTurnPlayerKey(value: string): value is TurnPlayerKey {
  return turnPlayerKeys.includes(value as TurnPlayerKey)
}

export function getOpponentSide(side: ScoringSide): ScoringSide {
  return side === "player" ? "opponent" : "player"
}
