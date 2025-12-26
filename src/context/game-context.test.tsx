import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, act } from "@testing-library/react";
import { GameProvider, useGame } from "./game-context";

// Mock component to interact with the context
const TestComponent = () => {
  const { createSession, activeSession, updateActiveSession } = useGame();

  return (
    <div>
      <button onClick={() => createSession("Test Session")}>Create Session</button>
      {activeSession && (
        <>
          <span data-testid="session-name">{activeSession.name}</span>
          <button onClick={() => updateActiveSession((prev) => ({ ...prev, scenario: "Test Scenario" }))}>
            Update Scenario
          </button>
          <span data-testid="scenario-name">{activeSession.state.scenario}</span>
          <button onClick={() => updateActiveSession((prev) => ({ 
              ...prev, 
              scoring: { ...prev.scoring, player: { ...prev.scoring.player, op: 5 } } 
          }))}>
            Update Scoring
          </button>
          <span data-testid="player-op">{activeSession.state.scoring.player.op}</span>
        </>
      )}
    </div>
  );
};

describe("GameContext Persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persists new session to localStorage", () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const createButton = screen.getByText("Create Session");
    act(() => {
      createButton.click();
    });

    expect(window.localStorage.getItem("comlog_sessions")).not.toBeNull();
    const sessions = JSON.parse(window.localStorage.getItem("comlog_sessions") || "{}");
    const sessionIds = Object.keys(sessions);
    expect(sessionIds.length).toBe(1);
    expect(sessions[sessionIds[0]].name).toBe("Test Session");
  });

  it("persists scoring updates to localStorage", () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Create session
    const createButton = screen.getByText("Create Session");
    act(() => {
      createButton.click();
    });

    // Update scoring
    const updateButton = screen.getByText("Update Scoring");
    act(() => {
      updateButton.click();
    });

    const sessions = JSON.parse(window.localStorage.getItem("comlog_sessions") || "{}");
    const sessionIds = Object.keys(sessions);
    expect(sessions[sessionIds[0]].state.scoring.player.op).toBe(5);
  });
});