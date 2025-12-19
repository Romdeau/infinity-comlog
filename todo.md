# ToDo Items

Things I want to implement.

## Scenario Chooser

### Implement the full list of scenarios 

This should implement the full list of scenarios from ITS 17. We should make this modular so that we can add new ITS seasons in the future, so i think this data should be stored in a json file.

The full list of scenarious in ITS 17 are.

* Akial Interference
* B-Pong
* Corporate Appropriation
* Critical Intervention
* Crossing Lines
* Evacuation
* Hardlock
* Last Launch
* Provisioning
* Area of Interest

### Dynamically Update Classified Count

With the scenario selected the app should update the classified count based on the scenario. This count and how many OP they are worth should be stored in the JSON. In the item list the classified count should be updated dynamically based on the active scenario.

* Akial Interference: 1 (2 OP each)
* B-Pong: 2 (1 OP each)
* Corporate Appropriation: 3 (1 OP each)
* Critical Intervention: 1 (1 OP each)
* Crossing Lines: 0 (0 OP each)
* Evacuation: 2 (2 OP each)
* Hardlock: 1 (1 OP each)
* Last Launch: 3 (1 OP each)
* Provisioning: 1 (1 OP each)
* Area of Interest: 1 (1 OP each)

### Scenario Objectives

We should update the json to include all the main objectives, which should include their value in OP, when it is scored (per turn or end of game). In the text below items scored at the end of the game are reffered to as 'end of game' and items scored at the end of each turn are reffered to as 'end of each game round', where neither is displayed treat these as end of game. 

Some scenarios have attacker and defender objectives, which should be stored in the json as well. UI Elements specifically for tracking attacker and defender elements should only be displayed when this type of mission is played.

Please make sure that the json is structured in a way that makes it easy to add new scenarios in the future, and make sure that the way that common objective as well as attacker and defender objectives are stored is easy to understand and maintain. Here is an example;

```json
{
  "id": "akial-interference",
  "name": "Akial Interference",
  "classifieds": { "count": 1, "op": 2 },
  "hasRoles": false,
  "objectives": [
    { "text": "Control more consoles", "op": 2, "type": "round-end" },
    { "text": "Dominate area", "op": 1, "type": "game-end" }
  ]
}
```

The `hasRoles` field should be set to `true` if the scenario has attacker and defender objectives. Objectives in these game types should have an additional field `role` which should be set to `attacker` or `defender`. The `type` field should be set to `round-end` or `game-end` based on the logic defined above.

#### Akial Interference

* Accomplish Common Classified Objectives (1 Objective
Point for each, up to a maximum of 6 Objective Points).
* At the end of the game, have accomplished more
Classified Objectives than the adversary (1 Objective
Point).
* At the end of the game, have accomplished at least 1
Classified Objective in each Game Round (1 Objective
Point, even if the Classified Objective gets canceled for
that player).

#### B-Pong

* At the end of the Game, the Tracking Beacon is totally
inside the enemy half of the game table. (2 Objective
Points).
* At the end of each Game Round, Control the Tracking
Beacon (1 Objective Point).
* At the end of each Game Round, Control at least one
Console (1 Objective Point).

#### Corporate Appropriation

* At the end of the game, have the Enemy Prototype Captured
(2 Objective Points).
* At the end of the game, have the Enemy Prototype Captured
in your Deployment Zone (1 Objective Point, in addition to the
previous Objective).
* At the end of the game, your Prototype is not Captured by
the enemy (1 Objective Point, but only if your Prototype has
not been Destroyed).
* At the end of the game, your Prototype is Destroyed
(3 Objective Points).
* At the end of the game, have acquired more weapons or
items from the Panoplies than the adversary (1 Objective
Points).

#### Critical Intervention

##### Attacker 

* Unlock the Data Console (1 Objective Point).
* Extract the Data Pack from the Data Console (2 Objective
Points).
* The Trooper that Extracted the Data Pack is not Killed
at the end of the game (1 Objective Point).
* At the end of the game, the Trooper that Extracted the
Data Pack is in your Deployment Zone and is not in a
Null State (2 Objective Points).
* At the end of the game, Dominate the Server Room
(2 Objective Points).

##### Defender

* Prevent the Attacker from Unlocking the Data Console (1
Objective Point).
* Prevent the Attacker from Extracting the Data Pack from
the Data Console (3 Objective Points).
* Kill the Trooper that Extracted the Data Pack (2 Objective
Points, only if the Attacker has Extracted the Data Pack).
* At the end of the game, Dominate the Server Room (3
Objective Points).

#### Crossing Lines

* At the end of each Game Round, Dominate a Dead Zone
(1 Objective Point for each Dead Zone).
* At the end of the game, Dominate both Dead Zones
(2 Objective Points).
* At the end of the game, have an Activated Antenna
(1 Objective Point for each Activated Antenna).

#### Evacuation

* At the end of the game, have an Extracted Civilian
(1 Objective Point for each one).
* At the end of the game, have an Extracted enemy HVT
(1 Objective Point for each one).

#### Hardlock

* At the end of each Game Round, Control the Enemy
Beacon (1 Objective Point).
* At the end of the game, your Beacon is not Controlled by
the enemy (1 Objective Point).
* At the end of the game, have more Activated Consoles
than the adversary (2 Objective Points).
* At the end of the game, have an Activated Console
(1 Objective Point for each Activated Console).

#### Last Launch

* At the end of the game, have Extracted more Army Points
than the adversary (2 Objective Points).
* At the end of the game, have Extracted more Specialist
Troops than the adversary (2 Objective Points).
* At the end of the game, have Killed more Specialist
Troops than the adversary (2 Objective Points).
* At the end of the game, have Killed the same number of Specialist Troops as the adversary (1 Objective Point).
* At the end of the game, Dominate the Launching Tower (1 Objective Point).

#### Provisioning

* At the end of the game, Control a Supply Box
(1 Objective Point for each Supply Box).
* At the end of the game, Control more Supply Boxes in
your own Safe Area than your adversary in their own
Safe Area (3 Objective Points).
* At the end of the game, Control the same number of
Supply Boxes in your Safe Area than the adversary does
in their Safe Area (1 Objective Point, but only if at least 1 Supply Box is Controlled in their Safe Area).
* At the end of the game, if your adversary does not
Control any Supply Boxes in their Safe Area (2 Objective Points).

#### Area of Interest

* At the end of the game, Dominate an Area of Interest
(1 Objective Point for each Dominated Area of Interest,
up to a maximum of 3 Objective Points).
* At the end of each GAME ROUND, Dominate the Special
Area of Interest (1 Objective Point).
* At the end of each GAME ROUND have an Activated
Communication Antenna (1 Objective Point).

### Contextual OP tracking

In each scenario there are defined rules for scoring OP. Some of these are scored per turn (which is to say after both the player and opponent have completed their turns in a specific numbered turn), some are scored at the end of the game. Provide a scoring module for these, so the 'Finalise Scoring' section should only contain an entry field for VP, as OP should not longer be manually entered. Instead a checklist should be supplied per player, and each checked item should apply the appropriate amount of OP. These should be updated dynamically from the JSON based on the selected scenario.

### Attacker and Defender Objectives

Where the mission 

Where a mission has the attacker and defender objective types we want to show this clearly in the Lieutenant Roll section, so place this text inside the box where the current text;

> You have won the lieutenant roll and have chosen to keep initiative.

Is displayed. This text should read;

> In this scenario, two distinct roles are established: Attacker and Defender. Each has different Main Objectives.

> The player with the first Player Turn is the Attacker. The player with the second Player Turn is the Defender.

For the scoring section this should have two sections, one for the attacker and one for the defender. This should show which player is the attacker and which is the defender.

## List integration

The player should be able to input their infinity list code. The GitHub user twonirwana has a repository called Infinity-Data that contains logic for parsing these specific army codes

### Initial Integration

Based on the list code the player has inputted the app should then display the following information:

- The name of the list
- The faction of the list
- The points of the list
- The number of models in the list
- The number of wounds in the list

### Game Sequence Integration

Update the game sequence to include contextual assistance for the player. Provide a summary of units with special rules that impact deployment, such as hidden deployment, infiltration, forward deployment. Some units have multiple of these, so specifically highlight each unit and then list each of the special rules that they have for deployment. Additionally after this provide a 'Booty Reminder' item that prompts the player to roll their booty checks (which should only appear if the player has units with the 'Booty' special rule).