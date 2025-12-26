import { type PlayerTurnState } from "../context/game-context-core";

export const isTacticalComplete = (t: PlayerTurnState['tactical']) => t.tokens && t.retreat && t.lol && t.count;

export const isPlayerComplete = (p: PlayerTurnState) =>
    (p.doneOverride || (isTacticalComplete(p.tactical) && p.impetuous && p.orders && p.states && p.end));

export const isTurnComplete = (t: { doneOverride: boolean; p1: PlayerTurnState; p2: PlayerTurnState }) =>
    (t.doneOverride || (isPlayerComplete(t.p1) && isPlayerComplete(t.p2)));

export const calculateTP = (op: number, rivalOp: number) => {
    let tp = 0;
    if (op > rivalOp) tp = 4;
    else if (op === rivalOp) tp = 2;
    else {
      tp = 0;
      if (rivalOp - op < 2) tp += 1; // Bonus for close loss
    }
    if (op >= 5) tp += 1; // Bonus for 5+ OP
    return tp;
};
