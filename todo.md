# ToDo Items

Things I want to implement.

## Game Sequence

### Turn Context

Rather than there being a player 1 and player 2 I want to update this to be the player (ie, the person using the app) and the opponent.

In the lieutant roll step i want a toggle to switch between either the player or the opponent having won the lieutenant roll. It should then have text below that stating the "The <player/opponent> has won the lieutenant roll and has chosen to keep <Deployment/Initiative>" The choice between Deployment and Initiative should be a toggle, and this being the player/opponent should be based on the output of the lieutenant roll. Below this it should then show "<player/opponent> has deployment and has chosen to deploy <first/second>." This should also be a toggle. Below this should be an item that shows "<player/opponent> has initiative and has chosen to play <first/second>." The first or second should be a toggle, and the player/opponent should be based on the output of the lieutenant roll. Please ensure that the whichever has initiative does not have deployment, whichever one is not chosen by the player winning the lieutenant role is given to the player who did not win.

Based on player that has initiative turns 1-3 should be ordered to show the opponent and the player based on who is first or second based on that toggle above.

### Deployment Improvements

When deploying you have hidden deployment, infiltration and forward deployment to consider, as well as how many models were held back (which is additionally impacted by strategos). Provide sub items with explanations of these rules. 

### Booty Roll

I always forget to roll my booty checks during deployment. Provide a reminder item for these checks and include the booty table in the information popout.

| ROLL | ITEM | ROLL | ITEM |
| :--- | :--- | :--- | :--- |
| 1-2 | +1 ARM | 13 | Panzerfaust |
| 3-4 | Light Flamethrower | 14 | Monofilament CC Weapon |
| 5-6 | Grenades | 15 | MOV 8-4 |
| 7-8 | DA CC Weapon | 16 | TAG: BS Attack (Shock)<br>Other Troop Types: MULTI Rifle |
| 9 | Multispectral Visor L1 | 17 | MULTI Sniper Rifle |
| 10 | EXP CC Weapon | 18 | TAG: Immunity (ARM)<br>Other Troop Types: + 4 ARM |
| 11 | Adhesive Launcher Rifle | 19 | Mimetism (-6) |
| 12 | TAG: Immunity (AP)<br>Other Troop Types: + 2 ARM | 20 | TAG: BS Attack (+1 B)<br>Other Troop Types: HMG |

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