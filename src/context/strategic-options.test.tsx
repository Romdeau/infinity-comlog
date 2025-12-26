import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, act } from "@testing-library/react";
import { GameProvider, useGame } from "./game-context";

const TestComponent = () => {
  const { createSession, activeSession } = useGame();

  return (
    <div>
      <button onClick={() => createSession("Test Session")}>Create Session</button>
      {activeSession && (
        <div data-testid="strategic-options">
          {JSON.stringify((activeSession.state as any).strategicOptions)}
        </div>
      )}
    </div>
  );
};

describe("Strategic Options State", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("has strategicOptions in the initial state", () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const createButton = screen.getByText("Create Session");
    act(() => {
      createButton.click();
    });

    const optionsDiv = screen.getByTestId("strategic-options");
    const options = JSON.parse(optionsDiv.textContent || "null");
    
    expect(options).not.toBeNull();
    expect(options).toHaveProperty("p1Reserve");
    expect(options).toHaveProperty("p1Speedball");
    expect(options).toHaveProperty("p2OrderReduction");
    expect(options).toHaveProperty("p2CtLimit");
    expect(options).toHaveProperty("p2SuppressiveFire");
    expect(options).toHaveProperty("p2Speedball");
  });
});