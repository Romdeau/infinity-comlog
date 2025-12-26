# Spec: Refine Game Sequence Flow & Persistence

## Goal
Improve the reliability and completeness of the N5 game sequence tracker. This includes ensuring all phases are covered according to N5 rules, state is persisted locally, and the tracker integrates unit context from imported army lists.

## Requirements
1. **Complete N5 Sequence:** Audit and implement any missing steps in the Setup, Game Turns (including Order Pool generation, Impetuous Phase, etc.), and End-of-Game scoring.
2. **State Persistence:** Use Local Storage to save the current progress of a game session (active phase, completed tasks, score, imported army).
3. **Army Context Integration:** When an army is imported, the tracker should show relevant skills/items for the current phase (e.g., Tactical Awareness during Order Pool, Regeneration during the Recovery phase).
4. **Mobile Usability:** Ensure all interactive elements are touch-friendly and state transitions are clear.

## Success Criteria
- Game state survives page refresh.
- All N5 phases are representable and trackable.
- Unit-specific skills from imported lists appear as contextual hints in relevant phases.
- Tests verify persistence logic and phase transitions.
