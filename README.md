# Renew Home — Landing Site

Static marketing site (HTML/CSS/vanilla JS) with an embedded interactive demo game (VPP Tycoon).

## Structure
- `index.html` — the landing page (B2C + B2B toggle)
- `styles.css` — all styles
- `js/app.js` — page interactivity (toggle, calculators, modals, game embed)
- `js/phone.js` — React phone prototype (pre-compiled, no build step)
- `js/image-slot.js` — `<image-slot>` web component
- `assets/` — logos
- `game/` — VPP Tycoon (pre-built static bundle), loaded in an iframe and also openable full-screen

## Deploy (Vercel)
No build step. It's a static site.
1. Push this folder to a GitHub repo.
2. In Vercel: New Project → import the repo.
3. Framework Preset: **Other**. Build Command: *(leave empty)*. Output Directory: *(leave empty / `.`)*.
4. Deploy.

React is loaded from a CDN (production build). The JSX was pre-compiled to plain JS, so the browser does no compilation.
