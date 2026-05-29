import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { InfinityGameFlow } from "./infinity-game-flow";
import * as React from "react";
import { GameContext, type GameContextType, type GameSession, type PlayerTurnState } from "@/context/game-context-core";
import type { EnrichedArmyList } from "@/lib/unit-service";

vi.mock("@/data/missions.json", () => ({
  default: [
    { id: "test-mission", name: "Test Mission", objectives: [] }
  ]
}));

const createMockTurn = (): PlayerTurnState => ({
  doneOverride: false,
  tactical: { doneOverride: false, tokens: false, retreat: false, lol: false, count: false },
  impetuous: false,
  orders: { done: false },
  states: false,
  end: false,
});

const createMockSession = (): GameSession => ({
  id: "test-session",
  name: "Test Session",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  state: {
    scenario: "test-mission",
    classifiedsCount: 1,
    scenarioPicked: true,
    listPicked: true,
    classifiedsDrawn: true,
    initiationDoneOverride: false,
    setupDoneOverride: false,
    initiative: {
      winner: "player",
      choice: "initiative",
      firstTurn: "player",
      firstDeployment: "opponent",
    },
    strategicOptions: {
      p1Reserve: true,
      p1Speedball: false,
      p2OrderReduction: true,
      p2CtLimit: false,
      p2SuppressiveFire: false,
      p2Speedball: false,
    },
    initiationSubSteps: {
      rollOff: true,
      deployment: false,
      strategicUse: false,
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
      turn1: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
      turn2: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
      turn3: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
    },
    scoring: {
        doneOverride: false,
        player: { op: 0, vp: 0, classifieds: 0, objectives: {} },
        opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
    },
    selectedList: "listA"
  }
});

const createMockArmyList = (): EnrichedArmyList => ({
  armyName: "Test Army",
  sectoralId: 101,
  sectoralName: "Test Sectorial",
  points: 300,
  combatGroups: [],
});

function renderStrategicHints(activeSession: GameSession, armyLists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }) {
  const gameContextValue: GameContextType = {
    sessions: { [activeSession.id]: activeSession },
    activeSessionId: activeSession.id,
    activeSession,
    updateActiveSession: () => {},
    createSession: () => activeSession.id,
    renameSession: () => {},
    switchSession: () => {},
    deleteSession: () => {},
  };

  return render(
    <GameContext.Provider value={gameContextValue}>
      <InfinityGameFlow armyLists={armyLists} />
    </GameContext.Provider>
  );
}

describe("InfinityGameFlow Strategic Hints", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows 'Reserve Trooper' hint in Setup phase when user is first player and selected it", () => {
    const mockActiveSession = createMockSession();
    const mockArmyLists = { listA: createMockArmyList(), listB: null };

    // Force firstTurn to 'player' and p1Reserve to true
    mockActiveSession.state.initiative.firstTurn = "player";
    mockActiveSession.state.strategicOptions.p1Reserve = true;

    const { getByText } = renderStrategicHints(mockActiveSession, mockArmyLists);
    
    expect(getByText("Strategic Use")).not.toBeNull();
    expect(getByText("You have an extra unit in reserve.")).not.toBeNull();
  });

  it("shows 'Order Reduction' hint in Turn 1 Tactical Phase for opponent when user is second player and selected it", async () => {
    const mockActiveSession = createMockSession();
    const mockArmyLists = { listA: createMockArmyList(), listB: null };

    // Force firstTurn to 'opponent' (so user is p2) and p2OrderReduction to true
    mockActiveSession.state.initiative.firstTurn = "opponent";
    mockActiveSession.state.strategicOptions.p2OrderReduction = true;

    const { getByText, findAllByText, findByText } = renderStrategicHints(mockActiveSession, mockArmyLists);
    
    // Open Round 1 accordion
    const round1Trigger = getByText(/Game Round 1/);
    round1Trigger.click();

    // Use findAllByText and click the first one (which should be p1 - the opponent)
    const tacticalTriggers = await findAllByText("Tactical Phase");
    tacticalTriggers[0].click();

    expect(await findByText("Strategic Use")).not.toBeNull();
    expect(await findByText("Opponent's Order Pool reduced by 2 Regular Orders.")).not.toBeNull();
  });

  it("shows 'Your Order Pool' hint in Turn 1 Tactical Phase for user when user is first player and opponent selected order reduction", async () => {
    const mockActiveSession = createMockSession();
    const mockArmyLists = { listA: createMockArmyList(), listB: null };

    // Force firstTurn to 'player' (user is p1) and p2OrderReduction to true
    mockActiveSession.state.initiative.firstTurn = "player";
    mockActiveSession.state.strategicOptions.p2OrderReduction = true;

    const { getByText, findAllByText, findByText } = renderStrategicHints(mockActiveSession, mockArmyLists);
    
    // Open Round 1 accordion
    const round1Trigger = getByText(/Game Round 1/);
    round1Trigger.click();

    // Find the user's tactical phase (P1)
    const tacticalTriggers = await findAllByText("Tactical Phase");
    tacticalTriggers[0].click();

    expect(await findByText("Strategic Use")).not.toBeNull();
    expect(await findByText("Your Order Pool reduced by 2 Regular Orders.")).not.toBeNull();
  });
});
