# Specification: Dynamic Strategic Use of Command Tokens (v2)

## Overview
The "Strategic Use of Command Tokens" step in the Setup phase currently only shows options for the second player and uses static/incorrect labels. This track will refactor the UI to dynamically display all valid N5 Strategic Use options for both the First and Second Player, split by Procedural and Logistical uses. It will also inject contextual hints based on the choices made.

## Functional Requirements
- **Dynamic Labeling:** Identify the "First Player" and "Second Player" based on `gameStep.initiative.firstTurn`. Labels "You" and "Opponent" must be used correctly.
- **State Management:** Add flags to `GameSession['state']` to track which Strategic Use options were selected.
    - `strategicOptions: { p1Reserve: boolean, p1Speedball: boolean, p2OrderReduction: boolean, p2CtLimit: boolean, p2SuppressiveFire: boolean, p2Speedball: boolean }`
- **UI Structure:**
    - **First Player Procedural (Reserve Trooper):** Display *above* the Deployment section.
    - **Second Player Procedural:** Display in the "Strategic Use" section.
    - **Logistical (Speedball Tokens):** Display in the "Strategic Use" section, clearly separated from procedural options.
- **Rules Updates (N5):**
    - **First Player Procedural:** Set aside one extra Trooper and their Peripherals to be deployed in reserve.
    - **Second Player Procedural (Choice of 1):**
        - Remove 2 Regular Orders from the opponent's Order Pool (if opponent has >10 orders).
        - Prevent the opponent from using more than one Command Token during their first turn.
        - Activate Suppressive Fire on one Trooper.
    - **Logistical (Both Players):** Spend 1 Command Token to gain 2 Speedball Tokens.
- **Contextual Hints Integration:**
    - **Deployment Assistance (Setup Phase):** If the User is the First Player and selected "Reserve Trooper", add a hint: "Strategic Use: You have an extra unit in reserve."
    - **Order Count Step (Turn 1, Tactical Phase):** If the User is the Second Player and selected "Remove 2 Regular Orders", add a hint in the opponent's "Order Count" step: "Strategic Use: Opponent's Order Pool reduced by 2 Regular Orders."

## Non-Functional Requirements
- **Mobile-First:** Maintain a compact layout suitable for mobile.
- **Clarity:** Use clear separation between procedural and logistical options.

## Acceptance Criteria
- [ ] First Player procedural option is displayed above the Deployment section.
- [ ] All Second Player procedural options are correctly displayed according to N5 rules.
- [ ] Logistical options (Speedball) are displayed for both players and clearly separated.
- [ ] Labels ("You"/"Opponent") update correctly based on the Initiative step.
- [ ] A hint appears in "Deployment Assistance" when the user reserves an extra trooper as the First Player.
- [ ] A hint appears in the opponent's "Order Count" step when the user reduces their orders as the Second Player.
- [ ] The "Strategic Use" step in "Setup & Initiative" is only considered complete when the relevant selections are made (if applicable).

## Out of Scope
- Automated Speedball equipment selection.
- Validation of the "more than 10 orders" condition for order reduction (it remains a manual check for the player).
