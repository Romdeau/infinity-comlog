# ToDo Items

Things I want to implement.

## Session Persistence

Currently when the page is refreshed the game state is lost, i'd like to persist this somehow (local storage?). At some point i'll build an account system to allow for saving sessions (WorkOS?), so please make sure to design the session persistence in a way that will be compatible with an account system in the future. I'm not sure how local storage in browsers works, so if there's anything specific i need to know before implementing this please pause and let me know this rather than implementing something that won't work well.

## Multi Session

It might be useful to track multiple sessions (maybe you're playing 3 games in a day for a tournament), and it could be useful to review what scoring was done by either player. Provide a way to name and store a session that can be loaded later. As in the 'Session Persistence' item above lets complete this will local storage but let's make sure to design it in a way that will be compatible with an account system in the future.

## List Integration & Unit Data (In Progress - Buggy ⚠️)
The player can input lists, but unit enrichment is currently failing to map IDs to names correctly.

### Implementation Details
- **Binary Parser**: Robust `ArmyParser` handles `readVarInt`, `readString`, and URI-encoded codes.
- **Unit Enrichment (Buggy)**: `UnitService` attempts to load local faction data but units currently display as "Unit [ID]".
- **Metadata**: Factions mapped to names, parent factions, and logos using `src/data/metadata.json`.
- **UI**: `ArmyManager` handles dual-list imports and selection.
- **Contextual Assistance**: 
  - **Deployment Summary**: Lists units with Hidden Deployment, Infiltration, or Forward Deployment.
  - **Booty Reminder**: Displays a conditional reminder and table if units with `Booty` are present.
- **Sync System**: `scripts/fetch-faction-data.ts` and `docs/faction-data-management.md` for data maintenance.

## Order Reference (In Progress)

### Completed Tasks
- [x] Rename "Skill Quick Reference" to "Order Reference".
- [x] **Hacking Programs**: Show a quick reference for the available hacking programs (keep the wiki link as well).
- [x] **Add Missing Skills/Orders**:
  - [x] [Place Deployable](https://infinitythewiki.com/Place_Deployable)
  - [x] [Dodge](https://infinitythewiki.com/Dodge) (Add to movement section, valid as Short Skill and ARO)
  - [x] [Idle - Infinity](https://infinitythewiki.com/Idle) (Add to 'Technical Action' for now)
  - [x] [Intuitive Attack - Infinity](https://infinitythewiki.com/Intuitive_Attack)
  - [x] [Reload - Infinity](https://infinitythewiki.com/Reload)
  - [x] [Request Speedball - Infinity](https://infinitythewiki.com/Request_Speedball)
  - [x] [Reset - Infinity](https://infinitythewiki.com/Reset) (Update to show as valid Short Skill, not just ARO)

## Future Ideas
- [ ] List Analysis Dashboard (Points distribution, specialist counts, etc.)
