# PWA in production

Source of truth: `public/service-worker.js` and `public/manifest.webmanifest`.

## What is cached
Cache name: `omed-scripture-shell-v3` (single versioned cache).

- **Pre-cached on install** (`SHELL_ASSETS`): `/`, the manifest, app icons,
  `/bibles/catalog.json`, and the LSG starter pack
  (`/bibles/lsg/index.json`, `/bibles/lsg/jean.json`, `/bibles/lsg/search-index.json`).
- **Cached on use** (cache-first, same-origin GET): `/assets/*` (built JS/CSS),
  `/bibles/*` (static Bible packs and search index), and shell assets.
- **Navigations**: network-first, falling back to the cached `/` shell offline.

## What is NOT cached (always network)
- `/api/*`, `/bible-api*`, `/bible-proxy*`, and any cross-origin request
  (Google APIs, OAuth, remote Bible providers). This is deliberate: those must
  reflect live state and must not be served stale.

## Update strategy
- `install` calls `skipWaiting()`; `activate` runs `clients.claim()` and deletes
  any old `omed-scripture-shell-*` caches. New deploys take effect on next load.
- **When you change cached assets or the SW, bump the cache version**
  (`omed-scripture-shell-v3` → `-v4`). The hashed `/assets/*` filenames change
  per build, so app code updates naturally; the version bump matters most for the
  pre-cached Bible/shell list.

## Testing offline
1. `npm run build && npm run preview` (the SW only runs on a built app).
2. Load the app, open a cached chapter (e.g. LSG Jean), let it settle.
3. DevTools → Network → "Offline" (or Application → Service Workers → Offline).
4. Verify: app shell loads, the cached chapter reads, local search works, Settings
   opens. Uncached chapters/translations should fail gracefully (not crash).
5. Back online → uncached content loads again.

## Forcing an update
- DevTools → Application → Service Workers → "Update" / "Unregister", then reload.
- Users: fully close and reopen the installed app (or hard refresh in browser).

## Known limitations
- Icons are **SVG only** (`icon-192.svg`, `icon-512.svg`, maskable). Most modern
  Android/desktop handle SVG; some environments prefer PNG — add PNG fallbacks if
  install icons look wrong on a target device.
- No `screenshots` in the manifest → Android shows the basic (not rich) install UI.
- Offline coverage is limited to packs present under `/bibles/` plus chapters
  visited while online (runtime cache). It is **not** a full offline Bible.
- The SW caches `/` for navigation fallback; a broken deploy needs a cache-version
  bump (see `docs/ROLLBACK_PLAN.md`).
