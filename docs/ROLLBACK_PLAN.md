# Rollback plan

The app is a static client (Vercel) plus user-owned local/Drive data. Rollback
is about **code/deployment**, while **never destroying user data**.

## 1. Identify a broken release
Signals: white screen, ErrorBoundary fallback for many users, sign-in/sync
broken, offline broken, repeated diagnostics with the same route/version.

## 2. Revert the code
- Preferred: `git revert <merge_commit>` of the offending PR → open a PR → merge.
  Keeps history honest and re-triggers CI.
- Avoid force-push to `main`.

## 3. Roll back the deployment (fastest)
- In Vercel → Deployments, find the last known-good build → **Promote to
  Production** (instant rollback while the code revert lands).

## 4. Service worker / cache
- A bad service worker can keep serving stale/broken assets after rollback.
- Ensure the SW `CACHE_VERSION` was bumped in the good build so clients fetch
  fresh assets; the SW should `skipWaiting` + `clients.claim` and delete old
  caches on activate (see `docs/PWA_PRODUCTION.md`).
- If a SW shipped that breaks loading, ship a minimal "kill-switch" SW that
  unregisters itself and clears its caches, then promote it.

## 5. Communicate to testers
- Post: what broke, that a rollback is live, and "hard refresh / reopen the app".
- If install is affected, tell them to reopen the PWA once.

## 6. Preserve user data
- Never call `localStorage.clear()`; never auto-wipe Drive AppData.
- All stores sanitize on load (`docs/DATA_STORES.md`, data-compatibility tests),
  so older/newer local data must keep loading after a rollback.

## 7. If Drive sync wrote bad data
- A pre-restore local backup is written before any restore
  (`backupLocalDataBeforeRestore`, key prefix `omed_scripture_pre_restore_*`).
- Recovery: instruct the user to restore from that backup key, or to re-import a
  known-good JSON export. Do not mass-delete remote AppData.

## 8. If localStorage is corrupted on a device
- Sanitizers drop invalid entries and fall back to safe defaults (no crash).
- Last resort for one user: export what is readable, then clear only Omed keys
  via Settings → "Effacer les données" (uses `clearOmedLocalData`, never the
  whole origin).

## Post-mortem
Record cause, fix, and a CI/test gap to add so it cannot recur.
