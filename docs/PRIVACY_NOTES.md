# Privacy notes

Omed Scripture is currently a client-side beta application.

## Local data
The app stores user-controlled data in the browser localStorage/cache, including settings, reading position, favorites, highlights, notes, prayers, plans, onboarding preferences, collections, memory verses, reminders, study sessions, routine activity and cached/offline Bible data.

## Google Drive sync
If the user signs in with Google and enables sync, supported app data can be copied to the user's Google Drive AppData area. This is optional and user-initiated. The beta does not claim end-to-end encryption.

## Analytics and tracking
No analytics provider is configured in this repository. Do not add tracking or personal-data collection without explicit opt-in, documentation and review.

## What remains on device
Local notes, prayers, favorites, highlights, reading activity, cache and settings remain on the device/browser profile until the user clears them, imports over them or the browser removes site data.

## What can go to Drive
When sync is enabled, app stores documented in `docs/SYNC_AND_BACKUP.md` can be written to Drive AppData. Google account identity and OAuth token handling remain browser/client concerns.

## Export and deletion
Use Settings to export JSON before risky beta tests. Use Settings/local browser controls to clear local Omed data. Disconnect Google or disable sync before tests that should stay local only.

## Beta limits
Backups and sync should be tested on non-critical data. Users should not rely on beta sync as their only copy of important notes or prayers.
