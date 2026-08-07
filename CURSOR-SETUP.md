# Talent Formula Board Website — Cursor handoff

This folder contains the complete editable source project.

## Open in Cursor

1. Extract the ZIP file.
2. In Cursor, choose **File → Open Folder**.
3. Select the extracted `Talent-Formula-Board-Cursor-Source` folder.
4. Open Cursor's terminal and run:

```powershell
npm install
npm run dev
```

5. Open the local address shown in the terminal, normally `http://localhost:3000`.

## Important files

- `app/page.tsx` — page content, data, interactions and drill-down logic.
- `app/globals.css` — principal site layout and styling.
- `app/*.css` — section-specific presentation, typography and interaction styling.
- `public/` — logos, source PDF, original dashboard and social-preview assets.
- `github-pages/` and `vite.pages.config.ts` — static GitHub Pages build.
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow.

## Useful commands

```powershell
npm run dev
npm run build
npm run test
npm run build:pages
```

The GitHub Pages build is written to `pages-dist/`. Generated folders such as
`node_modules/`, `.next/`, `dist/` and `pages-dist/` are intentionally excluded
from this handoff because Cursor can recreate them from `package-lock.json`.

## Publishing changes

For the current GitHub Pages setup, run `npm run build:pages`, then replace the
published root files in the GitHub repository with the new files from
`pages-dist/`. Keep the filenames referenced by the newly generated
`pages-dist/index.html` together.
