# Beta QA checklist

Use this checklist on a fresh profile and on a returning-user profile. Mark each item `[x]` only after observing the expected result.

## 1. Installation
- [ ] Steps: clone repo, run `npm install`, then `npm run dev`.
- Expected: dev server starts without dependency errors.

## 2. First launch
- [ ] Steps: open `/` in a clean browser profile.
- Expected: onboarding or home loads with no console crash.

## 3. Onboarding
- [ ] Steps: complete preferences and daily goal.
- Expected: preferences persist after reload.

## 4. Navigation desktop
- [ ] Steps: use sidebar/rail to visit main destinations.
- Expected: active route is clear and no route 404s.

## 5. Navigation mobile
- [ ] Steps: emulate mobile viewport and use bottom navigation plus More.
- Expected: primary tabs and More entries are reachable.

## 6. Reader
- [ ] Steps: open `/reader`, change book/chapter/translation.
- Expected: passage updates, position persists, no infinite loading.

## 7. Bible Picker
- [ ] Steps: open picker from Reader and select a different chapter.
- Expected: selection closes and navigates to the chosen passage.

## 8. Search
- [ ] Steps: search a common term online and, if index exists, offline.
- Expected: results or a helpful empty/offline message appears.

## 9. Offline
- [ ] Steps: open a static chapter online, go offline, reload.
- Expected: cached app shell and cached/static content remain usable.

## 10. PWA install
- [ ] Steps: inspect manifest and install prompt/browser install action.
- Expected: installed app opens with Omed name/icon and standalone display.

## 11. Favorites
- [ ] Steps: favorite a verse, visit `/favorites`, remove it.
- Expected: list updates and persists after reload.

## 12. Notes
- [ ] Steps: create, edit/tag and delete a note.
- Expected: content is local, searchable where applicable and removable.

## 13. Highlights
- [ ] Steps: highlight a verse from Reader and reload chapter.
- Expected: highlight persists and can be changed/removed.

## 14. Prayer
- [ ] Steps: add an active prayer, mark prayed/answered.
- Expected: status and counts update.

## 15. Plans
- [ ] Steps: open `/plans`, start/update a plan, open detail route.
- Expected: progress persists and plan detail loads.

## 16. Collections
- [ ] Steps: create a collection and add a saved item if supported.
- Expected: collection appears empty or populated with clear actions.

## 17. Memory
- [ ] Steps: add a verse to Memory and run a review.
- Expected: due/review state changes without data loss.

## 18. Study Sessions
- [ ] Steps: create a study session, edit sections, reopen `/study/:sessionId`.
- Expected: observation/application/prayer fields persist.

## 19. Review Center
- [ ] Steps: open `/review` after adding activity.
- Expected: score, suggestions and resume actions render.

## 20. Progress Score
- [ ] Steps: complete routine/reading/prayer/note activities.
- Expected: score changes consistently with documented rules.

## 21. Settings
- [ ] Steps: change theme, font, width, language and reminders.
- Expected: changes apply immediately and persist.

## 22. Google Drive sync
- [ ] Steps: connect a test Google account, enable sync, sync, reload.
- Expected: AppData sync completes or fails with a clear message; no local wipe without backup.

## 23. Export/import
- [ ] Steps: export JSON, clear test profile, import JSON.
- Expected: supported stores restore and invalid files are rejected.

## 24. Network errors
- [ ] Steps: simulate failed Bible API and failed Drive requests.
- Expected: user sees recoverable error, not blank screen.

## 25. Quick accessibility
- [ ] Steps: keyboard through navigation, command palette and dialogs.
- Expected: focus remains visible and controls have accessible names.

## 26. Responsive
- [ ] Steps: test 360px, 768px and desktop widths.
- Expected: no horizontal overflow in main pages.

## 27. Final smoke test
- [ ] Steps: reload `/`, `/about`, `/reader`, `/search`, `/favorites`, `/notes`, `/prayer`, `/plans`, `/settings`, `/me`, `/collections`, `/memory`, `/study`, `/review`, `/more`.
- Expected: every route renders and the 404 only appears for unknown paths.
