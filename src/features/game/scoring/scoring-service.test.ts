import { describe, expect, it } from "vitest"

import type { GameSession } from "@/context/game-context-core"
import type { MissionDefinition } from "@/shared/types/missions"
import { calculateObjectivePoints, getAssignedMissionRole, getRoundObjectiveProgress, getScoreSummary } from "./scoring-service"

const createTurn = () => ({
  doneOverride: false,
  p1: {
    doneOverride: false,
    tactical: { doneOverride: false, tokens: false, retreat: false, lol: false, count: false },
    impetuous: false,
    orders: { done: false },
    states: false,
    end: false,
  },
  p2: {
    doneOverride: false,
    tactical: { doneOverride: false, tokens: false, retreat: false, lol: false, count: false },
    impetuous: false,
    orders: { done: false },
    states: false,
    end: false,
  },
  objectives: { player: {}, opponent: {} },
})

const createState = (overrides: Partial<GameSession["state"]> = {}): GameSession["state"] => ({
  scenario: "test",
  classifiedsCount: 1,
  scenarioPicked: true,
  listPicked: true,
  classifiedsDrawn: true,
  initiationDoneOverride: false,
  setupDoneOverride: false,
  initiationSubSteps: { rollOff: true, deployment: true, strategicUse: true },
  initiative: { winner: "player", choice: "initiative", firstTurn: "player", firstDeployment: "opponent" },
  strategicOptions: {
    p1Reserve: false,
    p1Speedball: false,
    p2OrderReduction: false,
    p2CtLimit: false,
    p2SuppressiveFire: false,
    p2Speedball: false,
  },
  deploymentDetails: { hidden: false, infiltration: false, forward: false, heldBack: 1, booty: false, deployedUnits: {} },
  turns: { turn1: createTurn(), turn2: createTurn(), turn3: createTurn() },
  scoring: {
    doneOverride: false,
    player: { op: 0, vp: 0, classifieds: 0, objectives: {} },
    opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
  },
  selectedList: "none",
  ...overrides,
})

const mission: MissionDefinition = {
  id: "test",
  name: "Test Mission",
  classifieds: { count: 1, op: 1 },
  hasRoles: false,
  objectives: [
    { id: "manual", text: "Manual", type: "manual", op: 1, max: 3 },
    { id: "end", text: "End", type: "game-end", op: 2 },
    { id: "round", text: "Round", type: "round-end", op: 1 },
    { id: "round-manual", text: "Round Manual", type: "round-end-manual", op: 1, max: 2 },
  ],
}

describe("scoring service", () => {
  it("calculates OP from manual, game-end, round-end, and classifieds", () => {
    const state = createState({
      turns: {
        turn1: { ...createTurn(), objectives: { player: { round: true, "round-manual": 2 }, opponent: {} } },
        turn2: { ...createTurn(), objectives: { player: { round: true, "round-manual": 1 }, opponent: {} } },
        turn3: createTurn(),
      },
      scoring: {
        doneOverride: false,
        player: { op: 0, vp: 0, classifieds: 1, objectives: { manual: 2, end: true } },
        opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
      },
    })

    expect(calculateObjectivePoints(mission, state, "player")).toBe(10)
  })

  it("assigns attacker and defender from first turn", () => {
    const state = createState({ initiative: { winner: "player", choice: "initiative", firstTurn: "opponent", firstDeployment: "player" } })

    expect(getAssignedMissionRole({ hasRoles: true }, state, "opponent")).toBe("attacker")
    expect(getAssignedMissionRole({ hasRoles: true }, state, "player")).toBe("defender")
  })

  it("filters role-based objectives by assigned role", () => {
    const roleMission: MissionDefinition = {
      id: "roles",
      name: "Roles",
      classifieds: { count: 0, op: 0 },
      hasRoles: true,
      objectives: [
        { id: "attack", text: "Attack", type: "game-end", op: 3, role: "attacker" },
        { id: "defend", text: "Defend", type: "game-end", op: 2, role: "defender" },
      ],
    }
    const state = createState({
      scoring: {
        doneOverride: false,
        player: { op: 0, vp: 0, classifieds: 0, objectives: { attack: true, defend: true } },
        opponent: { op: 0, vp: 0, classifieds: 0, objectives: { attack: true, defend: true } },
      },
    })

    expect(calculateObjectivePoints(roleMission, state, "player")).toBe(3)
    expect(calculateObjectivePoints(roleMission, state, "opponent")).toBe(2)
  })

  it("derives OP and TP score summary", () => {
    const state = createState({
      scoring: {
        doneOverride: false,
        player: { op: 0, vp: 0, classifieds: 0, objectives: { end: true } },
        opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
      },
    })

    expect(getScoreSummary(mission, state)).toMatchObject({ playerOP: 2, opponentOP: 0, playerTP: 4, opponentTP: 1 })
  })

  it("sums round objective progress across turns", () => {
    const state = createState({
      turns: {
        turn1: { ...createTurn(), objectives: { player: { round: true }, opponent: {} } },
        turn2: { ...createTurn(), objectives: { player: { round: true }, opponent: {} } },
        turn3: createTurn(),
      },
    })

    expect(getRoundObjectiveProgress(state, "player", "round")).toBe(2)
  })
})
