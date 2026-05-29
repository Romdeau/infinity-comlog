# Infinity Comlog

A specialized utility for players of Corvus Belli's **Infinity N5**. It manages active army lists, provides roster and analysis views, tracks game sessions from mission setup through final scoring, and keeps common references close at hand.

**[Launch the Infinity Comlog](https://romdeau.github.io/infinity-comlog/)**

## For AI Assistants & Contributors

Before making changes, read **[PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md)** for:

- Git workflow expectations.
- Required tooling: use `bun`, not npm or yarn.
- Component architecture standards.
- Tech stack details.

## Documentation

- [User Manual](./docs/user-manual.md) - How to use the application during a game.
- [Missions Development Guide](./docs/missions-guide.md) - How to update scenario data and scoring logic.
- [Faction Data Management](./docs/faction-data-management.md) - How to regenerate `public/data/factions/*.json` from Infinity Army data.
- [Deployment Guide](./docs/deployment.md) - Technical instructions for hosting the app.
- [Project Guidelines](./PROJECT_GUIDELINES.md) - Coding standards and architecture.

## Features

- **Army Lists**: Import Infinity Army codes, save lists locally, and maintain compatible active List A/List B pairings.
- **List View**: Inspect combat groups, unit details, weapon profiles, and print-friendly rosters.
- **List Analysis**: Compare order pools, specialists, SWC usage, and troop type investment.
- **Game Sequence**: Create persistent game sessions, walk through mission setup and turns, and calculate OP/TP scoring.
- **References**: Browse order reference content and hacking programs backed by project metadata.
- **Settings**: Switch measurement units and refresh locally saved lists after data updates.

## Local Development

To run this project locally, you will need [Bun](https://bun.sh/) installed.

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Run the development server**:
   ```bash
   bun run dev
   ```

3. **Open the app**:
    Navigate to `http://localhost:5173/` in your browser.

4. **Run the full verification gate**:
   ```bash
   bun run check
   ```

---

*Note: This is a community-made tool and is not affiliated with Corvus Belli.*
