# ToDo Items

Things I want to implement.

## Session Persistence

Currently when the page is refreshed the game state is lost, i'd like to persist this somehow (local storage?). At some point i'll build an account system to allow for saving sessions (WorkOS?), so please make sure to design the session persistence in a way that will be compatible with an account system in the future. I'm not sure how local storage in browsers works, so if there's anything specific i need to know before implementing this please pause and let me know this rather than implementing something that won't work well.

## Multi Session

It might be useful to track multiple sessions (maybe you're playing 3 games in a day for a tournament), and it could be useful to review what scoring was done by either player. Provide a way to name and store a session that can be loaded later. As in the 'Session Persistence' item above lets complete this will local storage but let's make sure to design it in a way that will be compatible with an account system in the future.

## List Integration (Completed ✅)
The player can now input two tournament lists. 

### Implementation Details
- **Binary Parser**: Robust `ArmyParser` handles `readVarInt`, `readString`, and URI-encoded codes.
- **Metadata Integration**: Factions are automatically mapped to names, parent factions (e.g., JSA -> Yu Jing), and official logos using `src/data/metadata.json`.
- **UI**: Added `ArmyManager` for dual-list management with clear/switch logic.
- **Game Selection**: Integrated list choice directly into the "Choose List" step of the game flow.

### Next Step: Unit Data Enrichment
The parser currently extracts `Unit ID`s, but these need to be mapped to full profiles to enable contextual assistance.
- [ ] **Unit Database**: Map `Unit ID` to profile data (Skills, Weapons, Armor, etc.).
- [ ] **Contextual Assistance**: Use unit skills to auto-populate reminders for:
  - Hidden Deployment
  - Infiltration
  - Forward Deployment
  - Booty rolls (only if a unit has the 'Booty' skill)

### Game Sequence Integration

Update the game sequence to include contextual assistance for the player. Provide a summary of units with special rules that impact deployment, such as hidden deployment, infiltration, forward deployment. Some units have multiple of these, so specifically highlight each unit and then list each of the special rules that they have for deployment. Additionally after this provide a 'Booty Reminder' item that prompts the player to roll their booty checks (which should only appear if the player has units with the 'Booty' special rule).

## Order Reference

The order reference is currently called the 'Skill Quick Reference", which should be updated to 'Order Reference'.

### Hacking Programs

I'd like to have this initiall show a quick reference for the available hacking programs (while also having the current link via a button or something?).

### Missing Orders

The [Place Deployable](https://infinitythewiki.com/Place_Deployable) order is missing. 
The [Dodge](https://infinitythewiki.com/Dodge) order is missing from the movement section, its a valid short skill as well an ARO.
The [Idle - Infinity](https://infinitythewiki.com/Idle) order is missing. It's neither a movement action, combat action, ARO or 'technical action', though i think we'll bundle it into 'technical action' for the moment until i decide otherwise.
The [Intuitive Attack - Infinity](https://infinitythewiki.com/Intuitive_Attack) order is missing.
The [Reload - Infinity](https://infinitythewiki.com/Reload) order is missing.
The [Request Speedball - Infinity](https://infinitythewiki.com/Request_Speedball) order is missing.
The [Reset - Infinity](https://infinitythewiki.com/Reset) order is only listed as an ARO, it's also a valid short skill.
