# ToDo Items

Things I want to implement.

## Session Persistence [COMPLETED]

Currently when the page is refreshed the game state is lost, i'd like to persist this somehow (local storage?). At some point i'll build an account system to allow for saving sessions (WorkOS?), so please make sure to design the session persistence in a way that will be compatible with an account system in the future. I'm not sure how local storage in browsers works, so if there's anything specific i need to know before implementing this please pause and let me know this rather than implementing something that won't work well.

I'd also like this to provide list storage of imported lists, which probably necessitates adding some components for listing and managing stored lists, and a picker for lists for games. Given tournaments require you to bring 2 lists you should be able to create the meta object to store two lists in and store these as well, but we should store lists as individual objects we can manage.

## Multi Session [COMPLETED]

It might be useful to track multiple sessions (maybe you're playing 3 games in a day for a tournament), and it could be useful to review what scoring was done by either player. Provide a way to name and store a session that can be loaded later. As in the 'Session Persistence' item above lets complete this will local storage but let's make sure to design it in a way that will be compatible with an account system in the future.

## Future Ideas

- [ ] List Analysis Dashboard (Points distribution, specialist counts, etc.)
- [ ] Re-implement Deployment Assistance (Track Hidden Deployment, Infiltration, Forward Deployment, Booty, etc. during setup)
