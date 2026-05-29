import type { MissionRole } from "./game"

export type MissionId = string

export type ManualObjective = {
  id: string
  text: string
  op: number
  type: "manual"
  max: number
  role?: MissionRole
}

export type GameEndObjective = {
  id: string
  text: string
  op: number
  type: "game-end" | "boolean"
  role?: MissionRole
}

export type RoundEndObjective = {
  id: string
  text: string
  op: number
  type: "round-end" | "round-end-boolean"
  role?: MissionRole
}

export type RoundEndManualObjective = {
  id: string
  text: string
  op: number
  type: "round-end-manual"
  max: number
  role?: MissionRole
}

export type MissionObjective = ManualObjective | GameEndObjective | RoundEndObjective | RoundEndManualObjective

export type MissionDefinition = {
  id: MissionId
  name: string
  classifieds: {
    count: number
    op: number
  }
  hasRoles: boolean
  objectives: MissionObjective[]
}
