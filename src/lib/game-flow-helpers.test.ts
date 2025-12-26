/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "bun:test";
import { isTacticalComplete, calculateTP, isInitiativeComplete, isSetupComplete, isPlayerComplete, getPlayerByTurnOrder } from "./game-flow-helpers";

describe("Game Flow Helpers", () => {
  describe("getPlayerByTurnOrder", () => {
    it("identifies player and opponent correctly when player is first", () => {
      const initiative = { firstTurn: 'player' as const };
      expect(getPlayerByTurnOrder(initiative, 1)).toBe('player');
      expect(getPlayerByTurnOrder(initiative, 2)).toBe('opponent');
    });

    it("identifies player and opponent correctly when opponent is first", () => {
      const initiative = { firstTurn: 'opponent' as const };
      expect(getPlayerByTurnOrder(initiative, 1)).toBe('opponent');
      expect(getPlayerByTurnOrder(initiative, 2)).toBe('player');
    });

    it("returns null if firstTurn is not set", () => {
      const initiative = { firstTurn: null };
      expect(getPlayerByTurnOrder(initiative, 1)).toBeNull();
    });
  });

  describe("isTacticalComplete", () => {
    it("returns true when all tactical substeps are done", () => {
      const tactical = {
        doneOverride: false,
        tokens: true,
        retreat: true,
        lol: true,
        count: true,
      };
      expect(isTacticalComplete(tactical)).toBe(true);
    });

    it("returns false if any substep is missing", () => {
       const tactical = {
        doneOverride: false,
        tokens: true,
        retreat: false, // missing
        lol: true,
        count: true,
      };
      expect(isTacticalComplete(tactical)).toBe(false);
    });
  });

  describe("isPlayerComplete", () => {
    it("returns true when all player turn substeps are done", () => {
      const p = {
        doneOverride: false,
        tactical: { tokens: true, retreat: true, lol: true, count: true },
        impetuous: true,
        orders: { done: true },
        states: true,
        end: true,
      };
      expect(isPlayerComplete(p as any)).toBe(true);
    });

    it("returns false if orders are not done", () => {
      const p = {
        doneOverride: false,
        tactical: { tokens: true, retreat: true, lol: true, count: true },
        impetuous: true,
        orders: { done: false },
        states: true,
        end: true,
      };
      expect(isPlayerComplete(p as any)).toBe(false);
    });
  });
  
  describe("calculateTP", () => {
      it("calculates win correctly (OP > Rival)", () => {
          expect(calculateTP(5, 2)).toBe(5); // 4 for win + 1 for >=5 OP
      });
      it("calculates draw correctly", () => {
          expect(calculateTP(3, 3)).toBe(2);
      });
      it("calculates loss correctly", () => {
          expect(calculateTP(1, 5)).toBe(0);
      });
      it("calculates close loss correctly (<= 2 diff)", () => {
          expect(calculateTP(2, 3)).toBe(1); // diff 1
          expect(calculateTP(2, 4)).toBe(1); // diff 2
          expect(calculateTP(2, 5)).toBe(0); // diff 3
      });
  });

  describe("isInitiativeComplete", () => {
    it("returns true when all initiative sub-steps are done", () => {
      const subSteps = {
        rollOff: true,
        deployment: true,
        strategicUse: true,
      };
      const initiative = {
        winner: 'player' as const,
        choice: 'initiative' as const,
        firstTurn: 'player' as const,
        firstDeployment: 'opponent' as const,
      };
      expect(isInitiativeComplete(subSteps, initiative)).toBe(true);
    });

    it("returns false if any sub-step is missing", () => {
      const subSteps = {
        rollOff: true,
        deployment: false, // missing
        strategicUse: true,
      };
      const initiative = {
        winner: 'player' as const,
        choice: 'initiative' as const,
        firstTurn: 'player' as const,
        firstDeployment: 'opponent' as const,
      };
      expect(isInitiativeComplete(subSteps, initiative)).toBe(false);
    });
  });

  describe("isSetupComplete", () => {
    it("returns true when everything is setup", () => {
        const state = {
            scenario: "mission-1",
            scenarioPicked: true,
            listPicked: true,
            classifiedsDrawn: true,
            initiationSubSteps: {
                rollOff: true,
                deployment: true,
                strategicUse: true,
                commandTokens: true,
            },
            initiative: {
                winner: 'player' as const,
                choice: 'initiative' as const,
                firstTurn: 'player' as const,
                firstDeployment: 'opponent' as const,
            }
        };
        expect(isSetupComplete(state as any)).toBe(true);
    });
  });
});
