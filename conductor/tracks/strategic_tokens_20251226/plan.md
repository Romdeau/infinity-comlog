# Plan: Dynamic Strategic Use of Command Tokens

Refactor the "Strategic Use of Command Tokens" implementation to support N5 rules, dynamic labeling, and contextual hints.

## Phase 1: Data Model & State Update [checkpoint: 80afaed]
Update the `GameSession` state to track the specific strategic options selected by each player.

- [x] Task: Update `GameSession` interface in `src/context/game-context-core.ts` to include `strategicOptions`. 2f5c1a1
- [x] Task: Initialize default `strategicOptions` in `src/context/game-context.tsx`. 2f5c1a1
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Model' (Protocol in workflow.md) 80afaed

## Phase 2: Core UI Refactoring [checkpoint: e2073ff]
Refactor `src/components/infinity-game-flow.tsx` to use the new state and dynamically label players.

- [x] Task: Implement helper logic to determine "First Player" and "Second Player" identities (You vs Opponent). 7a84ffe
- [x] Task: Relocate First Player Procedural (Reserve Trooper) option above the Deployment section. 8b1e926
- [x] Task: Refactor the "Strategic Use" step to display Second Player Procedural options and Logistical (Speedball) options with clear separation. 8b1e926
- [x] Task: Update the `isInitiativeComplete` helper in `src/lib/game-flow-helpers.ts` if needed to reflect the new state. 8b1e926
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core UI' (Protocol in workflow.md) e2073ff

## Phase 3: Contextual Hints & Integration
Inject dynamic hints into the setup and tactical phases based on strategic choices.

- [x] Task: Update `ContextualHints` or the hint generation logic to include the "Reserve Trooper" hint for the user. c477086
- [x] Task: Add the "Order Reduction" hint to the Turn 1 Tactical Phase for the opponent's order count step. c477086
- [x] Task: Write unit tests in `src/components/infinity-game-flow.test.tsx` (or a new test file) to verify dynamic labeling and hint visibility. c477086
- [~] Task: Conductor - User Manual Verification 'Phase 3: Integration' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification
Final styling adjustments and verification of the N5 rule implementation.

- [x] Task: Style "Strategic Use" hints with a unique color and ensure they appear at the top of hint lists. b1623ff
- [x] Task: Refine "Order Reduction" hint logic to show for both players when they are the target (P1) of the effect. b1623ff
- [x] Task: Ensure mobile responsiveness of the new split layout. b1623ff
- [x] Task: Verify wiki links for all strategic options. b1623ff
- [x] Task: Run full suite of tests and linting. b1623ff
- [~] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
