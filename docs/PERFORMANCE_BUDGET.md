# Performance budget

## Current measurement (production build)

From `npm run build` (gzip in parentheses):

| Asset | Size | Gzip |
|---|---|---|
| `index.js` (single app chunk) | ~567 kB | ~162 kB |
| `index.css` | ~81 kB | ~14 kB |
| `index.html` | ~2.3 kB | ~0.9 kB |

These numbers are a tracking baseline; re-measure on each release.

## Budget / invariants

- **No full Bible pack in the JS bundle.** Bible packs live under `public/bibles/`
  and are fetched at runtime / served by the service worker. Never `import` a
  large Bible/search-index JSON from `src/`.
- **Local search index loaded on demand**, not at app start.
- **Initial app JS gzip target: ≤ ~180 kB** for now; treat growth past that as a
  regression to investigate.
- Main navigation must stay responsive on mid-range mobile; no visible long task
  on a simple search.

## Observations / recommended follow-ups (not in this PR)

- The app currently ships as a **single JS chunk** (no route-level code
  splitting). The highest-leverage next step is `React.lazy` + `Suspense` for the
  heaviest, least-used routes (Study, Memory, Review, Settings, Search) behind the
  authenticated `Layout`. This was intentionally deferred here to keep the
  production-readiness PR low-risk; it should be a focused follow-up with its own
  verification.
- Verify large lists (search results, plan days, memory deck) use `useMemo` and
  cap rendered counts; debounce the search input.

## How to check
- `npm run build` and read the Vite output sizes.
- Optionally inspect `dist/assets` and confirm no `bibles`-sized JSON is bundled.
