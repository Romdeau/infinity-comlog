# ToDo Items

Things I want to implement.

## Session Persistence

Currently when the page is refreshed the game state is lost, i'd like to persist this somehow (local storage?). At some point i'll build an account system to allow for saving sessions (WorkOS?), so please make sure to design the session persistence in a way that will be compatible with an account system in the future. I'm not sure how local storage in browsers works, so if there's anything specific i need to know before implementing this please pause and let me know this rather than implementing something that won't work well.

## Multi Session

It might be useful to track multiple sessions (maybe you're playing 3 games in a day for a tournament), and it could be useful to review what scoring was done by either player. Provide a way to name and store a session that can be loaded later. As in the 'Session Persistence' item above lets complete this will local storage but let's make sure to design it in a way that will be compatible with an account system in the future.

## Application Behaviour

### Army List Import allows different sectorials

In the army list import i can import a different faction/sectorial as my second list. Can we please update the import logic to only allow importing a second list from the same sectorial with the same points value? This needs to work the same in reverse (so if a list b exists the same logic should apply when importing list a).

## Feature Extensions

### Deployment options

- [x] I'm missing the skills 'Combat Drop', 'Parachutist' and 'Strategic Deployment' for skills i want to track as part of army deployment.

- [x] Additionally none of the sub items in army deployment need a checkbox, however we should provide a checkbox per unit highlighted in the 'Deployment Assistance' section.

## Future Ideas

- [ ] List Analysis Dashboard (Points distribution, specialist counts, etc.)
