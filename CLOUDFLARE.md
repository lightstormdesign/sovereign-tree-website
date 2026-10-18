# Hosting on Cloudflare Pages

The site currently lives on GitHub Pages (built into the `gh-pages` branch,
at `lightstormdesign.github.io/sovereign-tree-website`). It also builds as-is
for Cloudflare Pages; both can run side by side until the switch.

## Pages project settings

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Root directory | `frontend` |
| Build command | `PUBLIC_URL=/ CI=false npm run build` |
| Build output directory | `build` |
| Environment variables | none needed (Pages sets `CF_PAGES=1` itself) |

Why the build command looks like that:

- `PUBLIC_URL=/`: `package.json` has a GitHub Pages `homepage`
  (`…/sovereign-tree-website`), which otherwise makes every asset load from
  `/sovereign-tree-website/static/…`. On Cloudflare the site sits at the
  root of its domain.
- `CI=false`: Cloudflare's build sets `CI=true`, and Create React App then
  fails the build on any lint warning. (It builds cleanly today, but this
  keeps a future warning from blocking a deploy.)
- `scripts/cloudflare-postbuild.js` (runs automatically after `build`)
  deletes `build/404.html` on Cloudflare builds only. That file is the
  GitHub Pages deep-link trick; without it Cloudflare serves `index.html`
  for any path, so `/about`, `/music` etc. work on refresh. The small
  decoder script in `public/index.html` only acts on GitHub Pages' encoded
  `/?/…` URLs, so it does nothing on Cloudflare.

Cloudflare's limit is 25 MiB per file. The largest file is now the Music
page vlog (`sierra-music-moments-vlog.mp4`, 21.2 MiB, 1280×720).

## Switching over, step by step

1. Workers & Pages → Create → Pages → Connect to Git → this repo, with the
   settings above. Production branch: `main`.
2. Open the `*.pages.dev` address it gives you and check: Home, About, Our
   Vision, New Earth Council, Contact, Music (vlog plays), Tour, Community.
   Refresh on an inner page to confirm deep links work.
3. Only then add the custom domain under the project's **Custom domains**
   tab and follow Cloudflare's DNS steps.
4. Check the live domain the same way as step 2.
5. Leave GitHub Pages as it is until the domain has served correctly for a
   few days; then turn it off in the repo's Settings → Pages.
