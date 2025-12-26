import { describe, it, expect, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import { ContextualHints } from "./infinity-game-flow";

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
    render(
      <ContextualHints hints={hints} phase="tactical" />
    );
    
    expect(screen.getByText("Unit A")).not.toBeNull();
    expect(screen.getByText("Skill 1")).not.toBeNull();
    expect(screen.getByText("Skill 2")).not.toBeNull();
  });

  it("shows 'Deployment Assistance' for setup phase", () => {
    const hints = [
      { id: "setup-hint", unitName: "Setup Unit", skills: ["Setup Skill"] }
    ];
    render(
      <ContextualHints hints={hints} phase="setup" />
    );
    
    expect(screen.getByText("Deployment Assistance")).not.toBeNull();
  });

  it("shows 'Phase Hints' for other phases", () => {
    const hints = [
      { id: "tactical-hint", unitName: "Tactical Unit", skills: ["Tactical Skill"] }
    ];
    render(
      <ContextualHints hints={hints} phase="tactical" />
    );
    
    expect(screen.getByText("Phase Hints")).not.toBeNull();
  });

  it("renders a checkbox and respects checkedMap for setup phase", () => {
     const hints = [
      { id: "setup-1", unitName: "Checked Unit", skills: ["Skill 1"] }
    ];
    const checkedMap = { "setup-1": true };
    render(
      <ContextualHints 
        hints={hints} 
        phase="setup" 
        onToggle={() => {}} 
        checkedMap={checkedMap} 
      />
    );
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.getAttribute("data-state")).toBe("checked");
    
    const unitText = screen.getByText("Checked Unit");
    expect(unitText.className).toContain("line-through");
  });
});
