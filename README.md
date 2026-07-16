# LK Wedding Website

Wedding invitation website built with React + TypeScript + Vite.

## Scripts

- `npm run dev`: start local development server.
- `npm run build`: run typecheck and production build.
- `npm run preview`: preview production build locally.
- `npm run lint`: run ESLint.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

## Deployment (GitHub Pages)

Deployment pipeline is configured in `.github/workflows/deploy.yml`.

- Trigger: push to `main` branch or manual run from Actions tab.
- Output: publishes `dist` to GitHub Pages.
- Base path:
  - Uses `/` if repository name is `<owner>.github.io`.
  - Uses `/<repo-name>/` for project pages.

## GitHub Pages Setup (one-time)

1. Open repository Settings -> Pages.
2. Set Source to `GitHub Actions`.
3. Push to `main`.
