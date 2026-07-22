# SovereignTree — Website

A cinematic, multi-page website for SovereignTree — a sanctuary/retreat community, luxury retreat center, and school of sovereignty co-founded by Trev and Sierra Marin. Built with React, Tailwind CSS, and Framer Motion. Pinned scroll-driven Portal→Hero transitions and a light cream/olive-green visual language throughout.

Forked from the reusable artist-site template originally built for sierramarin.com — the architecture (data-driven content, reusable animation components, a consistent palette/typography system) let this rebrand happen by swapping `src/data/site.js`, the `public/` media assets, and the palette variables in `src/index.css`, largely without touching page components.

## Stack

- **React** (Create React App via `@craco/craco` for the `@/` import alias and Tailwind integration)
- **Tailwind CSS** for styling, with a small set of custom CSS variables/keyframes in `src/index.css` for the site's palette, ambient dust/starfield background, and ambient motion effects
- **Framer Motion** for scroll-driven and mount animations
- **react-router-dom** for client-side routing (this is a multi-page site, not a single scrolling page)
- **lucide-react** for icons

## Getting started

```bash
cd frontend
npm install
npm start
```

The dev server runs on the port configured in `craco.config.js` / `package.json` scripts.

## Project structure

```
frontend/
  src/
    App.js                 # Route table
    index.css              # Palette (--st-* CSS vars), fonts, shared keyframes/utilities
    data/site.js            # ALL real content lives here: copy, links, dates
    pages/                  # One file per route (see below)
    components/site/        # Shared, reusable pieces used across pages
  public/                   # Images, videos, audio — flat, root-relative paths
```

## Page architecture

Each route is a self-contained page component in `src/pages/`. Every page follows the same shell pattern: a background layer, the shared `<Navbar />`, a `<main>` with the page's real content, and a shared `<Footer />`.

| Route | File | Notes |
|---|---|---|
| `/` | `Home.jsx` | Renders `CinematicExperience` — the pinned Portal→Hero scroll-scrub sequence (SovereignTree's animated logo cross-dissolving into the hero background loop) |
| `/our-vision` | `OurVision.jsx` | Mission/vision copy, the "We Are.." pillars, and the pitch deck / Skool community CTAs |
| `/about` | `About.jsx` | The origin story — how Trev and Sierra met and founded SovereignTree |
| `/music` | `Music.jsx` | "Music Medicine" — Trev & Sierra's music, kept from the original site per Trev's direction, reskinned only |
| `/tour` | `Tour.jsx` | Joint Trev & Sierra tour dates, framed with the New Earth Circles umbrella (prayerformances, New Earth Councils, men's/women's groups) |
| `/community` | `Community.jsx` | Skool community signup landing page |
| `/contact` | `Contact.jsx` | Contact info |

## Key reusable components (`src/components/site/`)

- **`CinematicExperience.jsx`** — the Home page's pinned Portal→Hero scroll-scrub (desktop). A tall section with a `sticky` inner viewport; scroll progress drives a two-layer cross-dissolve between the portal animation and the hero background loop.
- **`MobilePortal.jsx`** — mobile's tap-to-enter equivalent, same two-layer cross-dissolve, driven by a single tap instead of scroll.
- **`CDAnimation.jsx` / `AlbumExperience.jsx`** — Sierra's CD-unboxing interaction, kept for the Music page's promo card only.
- **`Navbar.jsx` / `Footer.jsx`** — shared site chrome. Nav links and active-page highlighting are driven entirely by `NAV_LINKS` in `data/site.js`.
- **`Reveal.jsx`** — scroll-reveal wrapper. Uses its own `IntersectionObserver` plus a timeout fallback so content never gets stuck invisible.
- **`TourFlyer.jsx`** — data-driven date-list generator; swap the `dates` prop for a new tour, no design work required.
- **`Fireflies.jsx` / `HeartIcon.jsx`** — small shared decorative pieces.
- **`TrackingPixel.jsx`** — Meta Pixel / GA placeholder, mounted once in `App.js`; a no-op until real IDs are set in `data/site.js`.

## Content and theming

- **`src/data/site.js`** — every piece of real copy, every external link, tour dates. Single source of truth for content.
- **`src/index.css`** `:root` block — the `--st-*` color variables (cream/olive-green/gold palette, ambient background tint colors).
- **`public/`** — all media assets, referenced by root-relative path. `sovereigntree-*` files are SovereignTree's own assets; `sierra-*` files are Sierra's music-page assets, kept intentionally since the Music page stays hers.
- **Fonts** are loaded via Google Fonts in `public/index.html`: Caudex (display/accent — matches the live sovereigntree.org site) and EB Garamond (body copy).

## Known placeholders / pending items

- **Hero background video** — the first pass uses the desktop hero loop Trev supplied; confirm before treating as final.
- **`SKOOL_COMMUNITY_URL`** in `data/site.js` — the real link live on sovereigntree.org today. Trev flagged a different community link + image are coming soon; swap here when that lands.
- **Favicon / touch icons** — still Sierra's placeholder icon files; swap for a SovereignTree favicon.
- **`TRACKING_PIXEL_IDS`** in `data/site.js` (Meta Pixel / GA — currently `null`).
- **Mobile portal/hero videos** — transcoded from the provided animated-logo and hero-loop footage; regenerate from source if higher-quality masters become available.
