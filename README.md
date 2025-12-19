# Infinity Comlog

A specialized utility for players of Corvus Belli's **Infinity N5**. This application provides a streamlined game sequence tracker and a quick reference for common skills and AROs, directly linked to the official wiki.

## Features

- **Infinity Game Flow**: A step-by-step checklist for the N5 game sequence, from scenario selection to final scoring.
- **Turn Reference**: Categorized quick-links for Movement, Combat, Technical actions, and AROs.
- **Official Wiki Integration**: All skills link directly to the relevant entries in the Infinity the Wiki for fast rules verification.
- **Premium UI**: Built with a sleek, modern aesthetic using React, Tailwind CSS, and shadcn/ui.

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

## Deployment to GitHub Pages

This project is configured to be hosted on GitHub Pages.

### Configuration

1. **Vite Base Path**: Ensure the `base` property in `vite.config.ts` matches your repository name (currently set to `/infinity-comlog/`).
2. **Repository Settings**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.

### Publishing

Any push to the `main` branch will automatically trigger the GitHub Action defined in `.github/workflows/deploy.yml`, which builds the project and deploys it to GitHub Pages.

Alternatively, you can manually trigger a deployment:
- Go to the **Actions** tab in your GitHub repository.
- Select the **Deploy static content to Pages** workflow.
- Click **Run workflow**.

---

*Note: This is a community-made tool and is not affiliated with Corvus Belli.*
