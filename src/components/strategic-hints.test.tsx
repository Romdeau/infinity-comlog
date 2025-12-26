/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, mock, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { InfinityGameFlow } from "./infinity-game-flow";
import * as React from "react";

const createMockTurn = () => ({
  doneOverride: false,
  tactical: { doneOverride: false, tokens: false, retreat: false, lol: false, count: false },
  impetuous: false,
  orders: { done: false },
  states: false,
  end: false,
});

// Mock useGame
const mockActiveSession = {
  state: {
    scenario: "test-mission",
    selectedList: "listA",
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
    deploymentDetails: { deployedUnits: {} },
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
};

mock.module("@/context/game-context", () => ({
  useGame: () => ({
    activeSession: mockActiveSession,
    updateActiveSession: () => {},
    createSession: () => {},
  }),
}));

// Mock missions
mock.module("@/data/missions.json", () => [
  { id: "test-mission", name: "Test Mission", objectives: [] }
]);

describe("InfinityGameFlow Strategic Hints", () => {
  afterEach(() => {
    cleanup();
  });

  const mockArmyLists = {
    listA: {
      armyName: "Test Army",
      combatGroups: []
    },
    listB: null
  };

  it("shows 'Reserve Trooper' hint in Setup phase when user is first player and selected it", () => {
    // Force firstTurn to 'player' and p1Reserve to true
    mockActiveSession.state.initiative.firstTurn = "player";
    mockActiveSession.state.strategicOptions.p1Reserve = true;

    render(<InfinityGameFlow armyLists={mockArmyLists as any} />);
    
    expect(screen.getByText("Strategic Use")).not.toBeNull();
    expect(screen.getByText("You have an extra unit in reserve.")).not.toBeNull();
  });

  it("shows 'Order Reduction' hint in Turn 1 Tactical Phase for opponent when user is second player and selected it", async () => {
    // Force firstTurn to 'opponent' (so user is p2) and p2OrderReduction to true
    mockActiveSession.state.initiative.firstTurn = "opponent";
    mockActiveSession.state.strategicOptions.p2OrderReduction = true;

    render(<InfinityGameFlow armyLists={mockArmyLists as any} />);
    
    // Open Round 1 accordion
    const round1Trigger = screen.getByText(/Game Round 1/);
    round1Trigger.click();

    // Use findAllByText and click the first one (which should be p1 - the opponent)
    const tacticalTriggers = await screen.findAllByText("Tactical Phase");
    tacticalTriggers[0].click();

    expect(await screen.findByText("Strategic Use")).not.toBeNull();
    expect(await screen.findByText("Opponent's Order Pool reduced by 2 Regular Orders.")).not.toBeNull();
  });

  it("shows 'Your Order Pool' hint in Turn 1 Tactical Phase for user when user is first player and opponent selected order reduction", async () => {
    // Force firstTurn to 'player' (user is p1) and p2OrderReduction to true
    mockActiveSession.state.initiative.firstTurn = "player";
    mockActiveSession.state.strategicOptions.p2OrderReduction = true;

    render(<InfinityGameFlow armyLists={mockArmyLists as any} />);
    
    // Open Round 1 accordion
    const round1Trigger = screen.getByText(/Game Round 1/);
    round1Trigger.click();

    // Find the user's tactical phase (P1)
    const tacticalTriggers = await screen.findAllByText("Tactical Phase");
    tacticalTriggers[0].click();

    expect(await screen.findByText("Strategic Use")).not.toBeNull();
    expect(await screen.findByText("Your Order Pool reduced by 2 Regular Orders.")).not.toBeNull();
  });
});
