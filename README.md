# Renew Home — Landing Site

Static marketing site (HTML/CSS/vanilla JS) with an embedded interactive demo game (VPP Tycoon)
and an explainer video wired into all video slots.

## Structure
- `index.html` — landing page (B2C + B2B toggle)
- `styles.css` — all styles
- `js/app.js` — page interactivity (toggle, calculators, modals, video lightbox, game embed)
- `js/phone.js` — React phone prototype (pre-compiled, no build step)
- `js/image-slot.js` — `<image-slot>` web component (used for non-video image placeholders)
- `assets/` — logos
- `media/` — explainer.mp4 (web-optimized) + poster
- `game/` — VPP Tycoon (pre-built static bundle), loaded in an iframe and openable full-screen

## Deploy (Vercel)
No build step — it's a static site.
1. Push this folder to a GitHub repo.
2. Vercel → New Project → import the repo.
3. Framework Preset: **Other**. Build Command: *(empty)*. Output Directory: *(empty / `.`)*.
4. Deploy.

## IMPORTANT — testing locally
Do NOT test by double-clicking `index.html`. The game uses ES modules, which browsers
block over the `file://` protocol — so the game appears broken when opened directly from disk.
Run a local server instead:

    python3 -m http.server 8000

then open http://localhost:8000  — the game and video work there, exactly like on Vercel.
