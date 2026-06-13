# Repository maintenance

## Branch strategy
- `main` is the deployable trunk; Vercel deploys from it.
- Work on short-lived branches: `feat/*`, `fix/*`, `chore/*`, `release/*`.
- Keep branches rebased on a recent `main`; delete after merge.

## Pull requests
- Open as **draft** until CI is green and self-review is done.
- One focused concern per PR; description states scope, risks, and tests.
- Squash-merge feature branches to keep `main` history readable.
- A PR must not break: routes, localStorage compatibility, Drive sync, PWA/offline,
  or static Bible packs.

## Merge checklist
- [ ] CI green (lint, typecheck, bible:validate, build, test).
- [ ] No secrets / API keys added; no `localStorage.clear()`.
- [ ] New local data is typed, validated on load, and tested (see
      `docs/DATA_STORES.md` and the data-compatibility suite).
- [ ] Docs updated if behavior, data, or release process changed.

## When to close an obsolete PR
- Superseded by another merged PR (the feature already landed on `main`).
- Built on a stale base and would need a full rewrite to rebase.
- Abandoned/experimental with no path to green CI.
Document the reason in a closing comment; do not silently delete history.

## Recommended `main` protection
- Require the `build` CI check to pass before merge.
- Require at least one review (or self-review for a solo maintainer).
- Disallow force-push and direct push to `main`.
- Auto-delete head branches after merge.

## Current known state (2026-06)
- `main` is at the public-beta hardening level (review center, progress score,
  memory, study, collections, onboarding, PWA).
- Some older feature branches/PRs were **superseded** because equivalent work was
  re-implemented directly on `main` by later PRs; audit open PRs against `main`
  before reviving one, and close superseded ones with a note.
