# Continuous Integration

CI runs on every pull request and on every push to `main` via
`.github/workflows/ci.yml`.

## The `build` job

Runs on `ubuntu-latest`, Node 22, with npm cache enabled. Steps, in order:

| Step | Command | Purpose |
|---|---|---|
| Install | `npm ci` | Reproducible install from `package-lock.json`. |
| Lint | `npm run lint` | ESLint (flat config). |
| Typecheck | `npm run typecheck` | `tsc -b --noEmit`. |
| Validate Bible data | `npm run bible:validate` | Validates static Bible packs / shape (no network). |
| Build | `npm run build` | `tsc -b && vite build`. |
| Test | `npm test` | Vitest run (unit + data-compatibility). |

`concurrency` cancels superseded runs on the same ref to keep the queue short.

## Properties

- **No secrets required.** Every step is deterministic and offline; the build
  does not need `BIBLE_API_KEY` or `VITE_GOOGLE_CLIENT_ID`.
- **Not flaky.** No browser, no network calls, no timers.
- **Bible scripts** used are the real, committed scripts (`scripts/bible/*.mjs`).

## Reading a failure

1. Open the failed run → the failing step is highlighted.
2. `lint` / `typecheck` → reproduce locally with the same command.
3. `bible:validate` → a Bible pack or generated index is malformed; run
   `npm run bible:build` locally and inspect the output.
4. `test` → run `npm test` or `npx vitest run <file>` locally.

## Re-running

Use the GitHub "Re-run jobs" button, or push a new commit. Because runs are
deterministic, a green local run should mean a green CI run.

## Limits / not covered yet

- **No E2E job.** Browser end-to-end tests (Playwright) are not part of CI — see
  `docs/DEVELOPER_GUIDE.md` ("End-to-end tests") for the rationale and the manual
  smoke checklist that replaces them for now.
- No bundle-size gate (tracked manually in `docs/PERFORMANCE_BUDGET.md`).
- No deploy step here; deployment is handled by Vercel's Git integration.
