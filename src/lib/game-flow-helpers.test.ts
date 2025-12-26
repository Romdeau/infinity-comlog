import { describe, it, expect } from "bun:test";
import { isTacticalComplete, calculateTP } from "./game-flow-helpers";

describe("Game Flow Helpers", () => {
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
      it("calculates close loss correctly (< 2 diff)", () => {
          expect(calculateTP(2, 3)).toBe(1);
      });
  });
});
