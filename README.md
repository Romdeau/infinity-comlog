# Infinity Comlog

A specialized utility for players of Corvus Belli's **Infinity N5**. This application provides a streamlined game sequence tracker and a quick reference for common skills and AROs, directly linked to the official wiki.

**[🚀 Launch the Infinity Comlog](https://romdeau.github.io/infinity-comlog/)**

---

## 🤖 For AI Assistants & Contributors

**⚠️ Important**: Before making any changes to this project, please read **[PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md)** for:
- Git workflow (feature branches, conventional commits)
- Required tooling (`bun` only - not npm/yarn)
- Component architecture standards
- Tech stack details

---

## Documentation

- [User Manual](./docs/user-manual.md) - How to use the application during a game.
- [Missions Development Guide](./docs/missions-guide.md) - How to update scenario data and scoring logic.
- [Deployment Guide](./docs/deployment.md) - Technical instructions for hosting the app.
- [Project Guidelines](./PROJECT_GUIDELINES.md) - Coding standards and architecture.

## Features

- **Infinity Game Flow**: A step-by-step checklist for the N5 game sequence, from scenario selection to final scoring.
- **Turn Reference**: Categorized quick-links for Movement, Combat, Technical actions, and AROs.
- **Official Wiki Integration**: All skills link directly to the relevant entries in the Infinity the Wiki for fast rules verification.
- **Premium UI**: Built with a sleek, modern aesthetic using React, Vite, and shadcn/ui.

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

---

*Note: This is a community-made tool and is not affiliated with Corvus Belli.*
