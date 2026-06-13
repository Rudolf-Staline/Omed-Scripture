# Beta QA results — 0.1.0-beta

Date: 2026-06-13
Branch: `release/beta-readiness`

## Automated checks

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed with a Vite chunk-size warning over 500 kB.
- `npm test` passed.
- `npm run bible:validate`, `npm run bible:index` and `npm run bible:build` passed.

## Dev-server route smoke

`npm run dev -- --host 127.0.0.1` was started and the following routes/assets returned HTTP 200 by `curl`:

`/`, `/about`, `/reader`, `/search`, `/favorites`, `/notes`, `/prayer`, `/plans`, `/settings`, `/me`, `/collections`, `/memory`, `/study`, `/review`, `/more`, `/manifest.webmanifest`, `/service-worker.js`.

## Manual QA still required

The non-interactive environment could not fully validate:

- real mobile browser behavior and PWA installation UI;
- visual screenshot capture of `/about` and Settings support section;
- actual offline toggling in a browser service-worker context;
- Google Drive OAuth/sync against a test Google account;
- screen-reader pass and full keyboard audit.

These items should be completed with `docs/BETA_QA_CHECKLIST.md` before broad beta distribution.
