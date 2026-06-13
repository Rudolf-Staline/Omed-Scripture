# Production release checklist

Work top to bottom. Do not skip a section silently — if something cannot be
verified, note why in the PR.

## 1. Code freeze
- [ ] Target commit chosen on `main`; no in-flight risky merges.
- [ ] Version / `APP_VERSION` (`src/utils/diagnostics.ts`) bumped if needed.
- [ ] `CHANGELOG.md` updated.

## 2. CI green
- [ ] `build` job green on the release commit (lint, typecheck, bible:validate, build, test).

## 3. Local checks
- [ ] `npm run lint` · `npm run typecheck` · `npm run build` · `npm test` all pass.
- [ ] `npm run bible:build` (index + validate) passes.

## 4. End-to-end / smoke
- [ ] Manual smoke per `docs/DEVELOPER_GUIDE.md` (or Playwright if later added).

## 5. Mobile
- [ ] Bottom nav, `/more`, Bible Picker, Verse Actions usable on a real phone.
- [ ] No horizontal overflow; tap targets ≥ 44px.

## 6. Offline / PWA
- [ ] Install prompt works; installed app launches.
- [ ] A cached chapter and local search work offline (`docs/PWA_PRODUCTION.md`).
- [ ] Service worker version bumped if SW or cached assets changed.

## 7. Sync
- [ ] Google sign-in works; sync down and up work.
- [ ] Session-expiry path shows the re-login toast (no crash).

## 8. Import / export
- [ ] JSON export downloads; re-import restores without `localStorage.clear()`.
- [ ] Pre-restore backup key is written before a Drive restore.

## 9. Bible data / licenses
- [ ] No copyrighted Bible text added without documented license
      (`docs/BIBLE_RIGHTS_AND_LICENSES.md`).

## 10. PWA assets
- [ ] `manifest.webmanifest` name, icons, `start_url`, `scope`, `theme_color` correct.

## 11. Performance
- [ ] Bundle reviewed against `docs/PERFORMANCE_BUDGET.md`; no full Bible pack in JS.

## 12. Accessibility
- [ ] `docs/ACCESSIBILITY_CHECKLIST.md` spot-checks pass (labels, focus, Escape).

## 13. Security
- [ ] `rg "API_KEY|CLIENT_SECRET|dangerouslySetInnerHTML|localStorage.clear" src public docs README.md` clean.
- [ ] Security headers present (`vercel.json`); diagnostics carry no personal data.

## 14. Vercel
- [ ] Preview deployment verified; env vars set (`VITE_GOOGLE_CLIENT_ID`).
- [ ] OAuth authorized origins include the production domain.

## 15. Rollback
- [ ] `docs/ROLLBACK_PLAN.md` reviewed; previous good deployment identified.

## 16. Post-release monitoring
- [ ] Spot-check production URL on desktop + mobile after deploy.
- [ ] Watch for user-reported diagnostics (`docs/OBSERVABILITY.md`).

## 17. Communication
- [ ] Testers told what changed and how to report issues (copy diagnostic).
