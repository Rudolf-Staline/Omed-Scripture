# Developer guide

## Install & run
```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
```
Copy `.env.example` → `.env` and set `VITE_GOOGLE_CLIENT_ID` for Google sign-in.
`BIBLE_API_KEY` (if used) is **server-side only** — never prefix it with `VITE_`.

## Scripts
| Script | What |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `tsc -b && vite build` |
| `npm run preview` | Serve the build (needed to exercise the service worker) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm test` | Vitest (unit + data compatibility) |
| `npm run bible:index` | Build the static search index |
| `npm run bible:validate` | Validate Bible packs / shape |
| `npm run bible:build` | index + validate |

## Structure
```
src/components/   shared UI (Layout, Sidebar, ErrorBoundary, BiblePicker, ...)
src/features/     one folder per screen (reader, search, plans, study, ...)
src/store/        Zustand stores (one per domain, each with sanitize + load)
src/utils/        bible API/providers, cache, drive sync, diagnostics, study, ...
src/data/         typed static data (books, translations, plans, topics)
public/bibles/    static Bible packs + search index (NOT bundled into JS)
scripts/bible/    Node scripts for index/validation
docs/             architecture, data, security, PWA, release, this guide
```

## Routes
`/` (or onboarding), `/reader`, `/read/:translation/:bookId/:chapter`, `/search`,
`/discover`, `/favorites`, `/notes`, `/prayer`, `/plans`, `/plans/:planId`,
`/settings`, `/about`, `/me`, `/collections`, `/memory`, `/review`, `/study`,
`/study/:sessionId`, `/more`, `/login`, `/onboarding`, and `*` → NotFound.

## Stores & local data
Each store: initial state from `localStorage` (guarded by `try/catch`), a
`sanitizeX` validator, and a `loadX` used by Drive sync. Storage keys live in
`src/constants/storageKeys.ts`. Rules:
- New persisted data → add a typed key, sanitize on load, and a test.
- Never `localStorage.clear()`; use `clearOmedLocalData` (Omed keys only).
- See `docs/DATA_STORES.md` and `src/utils/__tests__/dataCompatibility.test.ts`.

## Bible data & sync
- Chapters: static provider (`public/bibles/`) first, then network providers
  (bolls.life, bible-api.com, optional API.Bible) — see `docs/BIBLE_DATA.md`.
- Sync: Google Drive AppData; a local pre-restore backup is written before any
  restore (`docs/SYNC_AND_BACKUP.md`).
- Offline/PWA: `docs/PWA_PRODUCTION.md`.

## Tests
- Unit + data-compatibility tests run in Vitest (jsdom-free, pure where possible).
- Prefer testing pure sanitizers/utils; for stores, use the existing
  localStorage-mock + `vi.resetModules()` pattern.

### End-to-end tests (deferred — rationale)
Playwright is **not** added yet, on purpose:
- It is a heavy dev dependency and downloads browsers; the current CI runner is
  offline/deterministic and adding browser E2E risks flakiness and slow CI.
- The mission constraint is to avoid heavy deps / flaky CI without clear need.

Instead, the **manual smoke checklist** below is the release gate. If E2E is
added later: `tests/e2e/` with `smoke`, `navigation`, and (if stable) `offline`
specs, a `test:e2e` script, and a **separate, optional** CI job.

#### Manual smoke checklist (desktop + mobile)
1. `/` loads (or onboarding on first run).
2. Reader opens; **Bible Picker** opens, switches book/chapter/translation.
3. Search/Discover returns results and opens a chapter.
4. Memory, Study, Review, Settings, About, More all open.
5. Unknown route shows NotFound.
6. Offline (after `build`+`preview`): cached chapter + local search work.
7. Sign-in → sync down/up; export → re-import restores.

## Adding a feature
1. New screen → `src/features/<name>/`, add a route in `App.tsx`, add nav entries
   in `src/data/navigation.ts`.
2. New persisted data → store + sanitize + storage key + tests (above).
3. Keep bundle discipline (`docs/PERFORMANCE_BUDGET.md`).

## Adding a Bible translation legally
- Only add text that is public domain or that you have an explicit license to
  ship; record provenance in `docs/BIBLE_RIGHTS_AND_LICENSES.md`.
- Add the pack under `public/bibles/<id>/`, register it in the catalog/translation
  list, run `npm run bible:build`, and verify `bible:validate` passes in CI.
- Do not commit copyrighted Bible text without documented permission.
