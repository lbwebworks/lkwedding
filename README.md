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

## Image Drop Folders (Auto-Loaded)

Drop image files into these folders and the app will automatically pick them up:

- `src/assets/wedding/hero/`
- `src/assets/wedding/story/`
- `src/assets/wedding/dress/ladies/`
- `src/assets/wedding/dress/gentlemen/`
- `src/assets/wedding/venue/`
- `src/assets/wedding/save-the-date/`

Supported image types:

- `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`

Notes:

- Files are loaded in filename order, so you can control sequence with names like `01.jpg`, `02.jpg`, etc.
- If a folder has no images, the UI falls back to text placeholders.
