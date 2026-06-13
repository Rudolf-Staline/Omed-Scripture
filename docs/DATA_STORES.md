# Data stores and persistence matrix

This document maps the client-side Zustand stores used by Omed Scripture V1. The release rule is non-destructive persistence: stores may sanitize invalid records, but they must not call `localStorage.clear()` or erase unrelated browser data.

## Matrix

| Store | localStorage key | Google Drive AppData file | Data shape | Validation / sanitizing | Export / backup | V1 risk notes |
| --- | --- | --- | --- | --- | --- | --- |
| `useAuthStore` | `auth_token`, `auth_user`, `auth_expires_at` | Not synced as data | OAuth token, user profile, expiry | Session restore catches storage/JSON errors and expires stale sessions | Not included in JSON export | Token is client-side; never commit secrets or log token values. |
| `useBibleStore` | `omed_bible_position` | `omed_bible_position.json` | `{ translation, bookId, chapter }` | Normalizes translation/book/chapter against known lists | Included as `position`; pre-restore snapshot captures old value | Keep route params and static book ids aligned. |
| `useFavoritesStore` | `omed_bible_favorites` | `omed_bible_favorites.json` | `FavoriteVerse[]` | Sanitizes arrays and drops malformed favorite rows before load/restore | Included as `favorites`; pre-restore snapshot | User text is copied verse text; avoid adding copyrighted bulk text through fixtures. |
| `useHighlightsStore` | `omed_bible_highlights` | `omed_bible_highlights.json` | `Record<verseId, Highlight>` | Sanitizes record values and highlight colors | Included as `highlights`; pre-restore snapshot | Record keys are trusted only after value validation. |
| `useNotesStore` | `omed_bible_notes` | `omed_bible_notes.json` | `Note[]` | Sanitizes note rows and optional tags | Included as `notes`; pre-restore snapshot | Free text is user-generated; do not render as HTML. |
| `usePlansStore` | `omed_bible_plans` | `omed_bible_plans.json` | `Record<planId, PlanProgress>` | `sanitizePlanProgress` keeps legacy progress and optional timestamps | Included as `progress`; pre-restore snapshot | Old `completedDays` without timestamps remains valid. |
| `usePrayerStore` | `omed_bible_prayers` | `omed_bible_prayers.json` | `PrayerEntry[]` | Sanitizes category/status/date fields | Included as `prayers`; pre-restore snapshot | Personal sensitive text; sync only to the user's Drive AppData. |
| `useCollectionsStore` | `omed_bible_collections` | `omed_bible_collections.json` | `SpiritualCollection[]` | Sanitizes collection metadata and item references | Included as `collections`; pre-restore snapshot | Item references may point to deleted notes/favorites; UI should tolerate empties. |
| `useMemoryStore` | `omed_bible_memory` | `omed_bible_memory.json` | `MemoryVerse[]` | Sanitizes spaced-repetition fields and optional history | Included as `memory`; pre-restore snapshot | Review history is optional for backward compatibility. |
| `useStudyStore` | `omed_bible_study_sessions` | `omed_bible_study_sessions.json` | `StudySession[]` | Sanitizes session sections, timestamps, status, linked refs | Included as `studySessions`; pre-restore snapshot | Editor route must handle missing session ids gracefully. |
| `useSettingsStore` | `omed_bible_settings`, `omed_bible_synced` | `omed_bible_settings.json` | Reader/UI settings + sync flag | Merges loaded settings with defaults | Included as `settings`; sync flag is not exported | Invalid enum values should be avoided by UI controls. |
| `useOnboardingStore` | `omed_bible_onboarding` | `omed_bible_onboarding.json` | Preferences and completion flag | Sanitizes known preference values | Included as `onboarding`; pre-restore snapshot | Home falls back to onboarding when not completed. |
| `useReminderStore` | `omed_bible_reminders` | `omed_bible_reminders.json` | Reminder preferences | `sanitizeReminderPreferences` validates time and booleans | Included as `reminders`; pre-restore snapshot | Browser notifications depend on permission and support. |
| `useDailyRoutineStore` | `omed_bible_daily_routine` | Not currently synced | Routine day history | Sanitizes routine days in utility/store path | Not in V1 export | Local-only by design; score can derive from it locally. |
| Reading activity helpers | `omed_bible_reading_activity` | Not currently synced | Per-day reading activity | Utility-level validation | Not in V1 export | Derived streak data; not a primary user-authored dataset. |
| Chapter/offline cache | `omed_bible_recent_chapters` | Not synced | Recent chapter cache | Utility-owned bounded cache | Not exported | Cache can be rebuilt from static/API providers. |
| Search history helpers | `omed_bible_search_history` | Not synced | Recent search queries | Utility-level normalization | Not exported | Personal but low-value; keep bounded. |
| PWA install flag | `omed_pwa_install_dismissed` | Not synced | Boolean-ish dismissal flag | Simple local flag | Not exported | UI preference only. |

## Guardrails

- `clearOmedLocalData` removes only Omed Scripture keys and is used by the explicit destructive settings action.
- Restore and Drive sync create a local pre-restore snapshot via `backupLocalDataBeforeRestore` before applying remote/imported data.
- Drive downloads are shape-checked before store load. Store loaders sanitize again for defense in depth.
- New user-data stores must be added to this matrix, `DRIVE_FILES` when synced, `createBackup`/`validateBackup`, Settings export/restore, and tests.
