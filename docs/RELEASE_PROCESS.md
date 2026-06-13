# Release process

This project uses a lightweight single-maintainer release flow.

## 1. Prepare a release branch

```bash
git checkout main
git pull origin main
git checkout -b release/beta-readiness
npm install
```

If the repository clone has no `main` or no `origin`, create the release branch from the current clean base and document that limitation in the PR.

## 2. Run required checks

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run bible:validate
npm run bible:index
npm run bible:build
```

Bible commands are required when static Bible data or indexes changed. Otherwise they are still useful as release confidence checks.

## 3. Update release notes

- Bump `package.json` and `package-lock.json` to the intended SemVer/pre-release version.
- Add a `CHANGELOG.md` entry with features, known limits, migration notes and Bible-rights warnings.
- Update README links, beta status and manual QA notes.

## 4. Open a PR

The PR must include:
- summary and changed areas;
- routes/localStorage/sync/PWA impact;
- exact commands run;
- manual QA results or honest limitations;
- screenshots for visible UI changes when possible.

Do not merge while CI is red.

## 5. Tagging after merge

```bash
git checkout main
git pull origin main
git tag v0.1.0-beta
git push origin v0.1.0-beta
```

Use GitHub Releases to paste the changelog entry and add any manual QA caveats.

## 6. Vercel verification

After deployment:
- confirm the Vercel build points to the merged commit;
- open `/`, `/about`, `/reader`, `/search`, `/settings` and `/more`;
- verify `manifest.webmanifest`, icons and service worker load in browser devtools;
- install the PWA on one desktop browser and one mobile browser when available.

## 7. PWA/offline smoke test

1. Open a static chapter while online.
2. Confirm the service worker is active.
3. Switch devtools/network to offline or disable network.
4. Reload the app and open Reader, Search and Settings offline areas.
5. Return online and confirm no local data was lost.

## 8. Rollback

- If Vercel is broken, redeploy the last known good deployment from Vercel dashboard.
- If a release tag is wrong, create a corrective release note; avoid deleting public tags unless no one consumed them.
- If local data migration is suspected, stop the rollout and ask testers to export JSON before further testing.
