import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, render, cleanup, screen } from "@testing-library/react";
import { ContextualHints, InfinityGameFlow } from "./infinity-game-flow";
import { GameContext, type GameSession } from "@/context/game-context-core";

const createMockTurn = () => ({
  doneOverride: false,
  tactical: { doneOverride: false, tokens: false, retreat: false, lol: false, count: false },
  impetuous: false,
  orders: { done: false },
  states: false,
  end: false,
});

const createMockSession = (stateOverrides: Partial<GameSession["state"]> = {}): GameSession => ({
  id: "test-session",
  name: "Test Session",
  createdAt: 1,
  updatedAt: 1,
  state: {
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
      winner: "player",
      choice: "initiative",
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
      turn1: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
      turn2: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
      turn3: { doneOverride: false, p1: createMockTurn(), p2: createMockTurn(), objectives: { player: {}, opponent: {} } },
    },
    scoring: {
      doneOverride: false,
      player: { op: 0, vp: 0, classifieds: 0, objectives: {} },
      opponent: { op: 0, vp: 0, classifieds: 0, objectives: {} },
    },
    selectedList: "none",
    ...stateOverrides,
  },
});

const renderGameFlow = (session: GameSession) => {
  render(
    <GameContext.Provider value={{
      sessions: { [session.id]: session },
      activeSessionId: session.id,
      activeSession: session,
      createSession: () => session.id,
      renameSession: () => {},
      updateActiveSession: () => {},
      switchSession: () => {},
      deleteSession: () => {},
    }}>
      <InfinityGameFlow armyLists={{ listA: null, listB: null }} />
    </GameContext.Provider>
  );
};

describe("ContextualHints Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when hints are empty", () => {
    const { container } = render(
      <ContextualHints hints={[]} phase="tactical" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders unit name and skills when hints are provided", () => {
    const hints = [
      { id: "1", unitName: "Unit A", skills: ["Skill 1", "Skill 2"] }
    ];
    const { getByText } = render(
      <ContextualHints hints={hints} phase="tactical" />
    );
    
    expect(getByText("Unit A")).not.toBeNull();
    expect(getByText("Skill 1")).not.toBeNull();
    expect(getByText("Skill 2")).not.toBeNull();
  });

  it("shows 'Deployment Assistance' for setup phase", () => {
    const hints = [
      { id: "setup-hint", unitName: "Setup Unit", skills: ["Setup Skill"] }
    ];
    const { getByText } = render(
      <ContextualHints hints={hints} phase="setup" />
    );
    
    expect(getByText("Deployment Assistance")).not.toBeNull();
  });

  it("shows 'Phase Hints' for other phases", () => {
    const hints = [
      { id: "tactical-hint", unitName: "Tactical Unit", skills: ["Tactical Skill"] }
    ];
    const { getByText } = render(
      <ContextualHints hints={hints} phase="tactical" />
    );
    
    expect(getByText("Phase Hints")).not.toBeNull();
  });

  it("renders a checkbox and respects checkedMap for setup phase", () => {
     const hints = [
      { id: "setup-1", unitName: "Checked Unit", skills: ["Skill 1"] }
    ];
    const checkedMap = { "setup-1": true };
    const { getByRole, getByText } = render(
      <ContextualHints 
        hints={hints} 
        phase="setup" 
        onToggle={() => {}} 
        checkedMap={checkedMap} 
      />
    );
    
    const checkbox = getByRole("checkbox");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
    
    const unitText = getByText("Checked Unit");
    expect(unitText.className).toContain("line-through");
  });

  it("shows different final scoring objectives for attacker and defender roles", () => {
    const session = createMockSession({
      scenario: "critical-intervention",
      selectedList: "listA",
      listPicked: true,
      initiative: {
        winner: "player",
        choice: "initiative",
        firstTurn: "player",
        firstDeployment: "opponent",
      },
    });

    renderGameFlow(session);

    fireEvent.click(screen.getByText("5. Final Scoring"));

    expect(screen.getByText("attacker")).toBeTruthy();
    expect(screen.getByText("defender")).toBeTruthy();
    expect(screen.getByText("Unlock the Data Console")).toBeTruthy();
    expect(screen.getByText("Prevent Attacker from Extracting Data Pack")).toBeTruthy();
  });
});
