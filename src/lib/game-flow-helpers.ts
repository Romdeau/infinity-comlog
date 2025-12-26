import { type PlayerTurnState, type GameSession } from "../context/game-context-core";

export const isTacticalComplete = (t: PlayerTurnState['tactical']) => t.tokens && t.retreat && t.lol && t.count;

export const isPlayerComplete = (p: PlayerTurnState) =>
    (p.doneOverride || (isTacticalComplete(p.tactical) && p.impetuous && p.orders.done && p.states && p.end));

export const isTurnComplete = (t: { doneOverride: boolean; p1: PlayerTurnState; p2: PlayerTurnState }) =>
    (t.doneOverride || (isPlayerComplete(t.p1) && isPlayerComplete(t.p2)));

export const isInitiativeComplete = (subSteps: GameSession['state']['initiationSubSteps'], initiative: GameSession['state']['initiative']) =>
    subSteps.rollOff &&
    subSteps.deployment &&
    subSteps.strategicUse &&
    initiative.firstTurn !== null &&
    initiative.firstDeployment !== null;

export const isSetupComplete = (state: GameSession['state']) =>
    !!state.scenario &&
    state.scenarioPicked &&
    state.listPicked &&
    state.classifiedsDrawn &&
    isInitiativeComplete(state.initiationSubSteps, state.initiative);

export const calculateTP = (op: number, rivalOp: number) => {
    let tp = 0;
    if (op > rivalOp) tp = 4;
    else if (op === rivalOp) tp = 2;
    else {
      tp = 0;
      if (rivalOp - op <= 2) tp += 1; // Bonus for close loss (<= 2 OP diff)
    }
    if (op >= 5) tp += 1; // Bonus for 5+ OP
    return tp;
};

export const getPlayerByTurnOrder = (initiative: { firstTurn: 'player' | 'opponent' | null }, turnOrder: 1 | 2): 'player' | 'opponent' | null => {
    if (!initiative.firstTurn) return null;
    
    if (turnOrder === 1) return initiative.firstTurn;
    return initiative.firstTurn === 'player' ? 'opponent' : 'player';
};