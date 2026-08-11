# henrynitzberg.com

Personal site — three tabs (Making, Drawing, Climbing) showcasing projects, artwork, and photos. Built with React 19, TypeScript, Vite, and MUI, with a custom liquid-glass effect (`GlassBox`, an SVG `feDisplacementMap` filter) used throughout the chrome.

## Development

```
npm install
npm run dev      # start the dev server
npm run lint      # eslint
npm run build     # type-check (tsc -b) + production build
npm run preview   # preview the production build locally
```

## Structure

- `src/components/` — UI components, one folder per tab plus shared chrome (`AppBar`, `GlassBox`, `TabHeader`, etc.)
- `src/content/` — the actual site copy and project/work/climb data
- `public/` — static assets (images, CV, favicon)

The liquid-glass effect only renders correctly in Chromium-based browsers (Safari/Firefox don't support referencing an SVG filter from `backdrop-filter`); see `src/utils/browserSupport.ts` and `BrowserWarningModal` for the fallback.
