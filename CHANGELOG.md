# Changelog

## 0.1.0-beta — Public beta readiness

### Status
- First public beta candidate for Omed Scripture.
- Intended for controlled tester distribution, not a final V1 promise.

### Main capabilities
- Reader, Bible Picker, search/discover, favorites, notes, highlights, prayer journal, reading plans, collections and settings.
- Home/Today, Me, Memory, Study Sessions, Review Center and Progress Score.
- PWA/offline support through static Bible packs, recent chapter cache and local search indexes when available.
- Optional Google Drive AppData sync plus JSON export/import.

### Known limits
- Offline behavior depends on the browser cache, installed service worker and available static packs/indexes.
- Google Drive sync is optional and should be re-tested on a dedicated beta account before broad rollout.
- Some QA remains manual: mobile installation, real offline transitions, sync conflict behavior and accessibility passes.
- The production bundle currently emits a chunk-size warning; this is acceptable for beta but should be addressed before V1.

### Bible data and licenses
- Do not add copyrighted Bible translations unless the project has explicit permission and documents the source/license.
- Some translations may require network/API access depending on their rights status.
- Static Bible packs must remain traceable to documented sources.
