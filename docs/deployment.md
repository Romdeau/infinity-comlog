# Deployment Guide

This project is configured to be hosted on GitHub Pages using GitHub Actions.

## Configuration

### Vite Base Path
The `base` property in `vite.config.ts` must match your repository name. For this project, it is set to:
```ts
base: '/infinity-comlog/'
```

### GitHub Repository Settings
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

## Automatic Deployment
Any push to the `main` branch will automatically trigger the GitHub Action defined in `.github/workflows/deploy.yml`. 

The action:
1. Sets up the Bun environment.
2. Installs dependencies.
3. Builds the project (`bun run build`).
4. Deploys the `dist` folder to the `gh-pages` branch.

## Manual Deployment
You can manually trigger a deployment:
1. Go to the **Actions** tab in your GitHub repository.
2. Select the **Deploy static content to Pages** workflow.
3. Click **Run workflow**.
