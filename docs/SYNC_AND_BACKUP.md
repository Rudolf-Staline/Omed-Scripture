# Google Drive sync, export, and backup

Omed Scripture stores user data locally first. Optional Google Drive sync writes small JSON files into the authenticated user's Drive `appDataFolder`; these files are app-private and are not normal Drive documents.

## Synced data

The V1 sync set is declared in `DRIVE_FILES`:

- settings;
- favorites;
- highlights;
- notes;
- plan progress;
- current reading position;
- prayer entries;
- onboarding preferences;
- collections;
- memory verses;
- reminder preferences;
- study sessions.

## Not synced intentionally

The following are local/cache data in V1: auth token storage, daily routine history, reading activity, search history, recent chapter cache, PWA install-dismissal flag, and static Bible pack files. These are either derived, cacheable, browser-specific, or not yet part of the portable backup contract.

## Sync down

At app startup when a valid token and sync opt-in are present, and when the user triggers sync from Settings, the app downloads each declared Drive file. Before applying any remote data, it creates a local snapshot key named `omed_scripture_pre_restore_<timestamp>`. Remote payloads are accepted only when their top-level shape matches the expected array/record/position shape, and each store performs its own sanitizing on load.

## Sync up

Settings exposes a force-upload action that writes the current local user datasets to Drive. Individual stores also upload after mutations when sync is enabled and a token exists. Drive session errors (`401`/`403`) expire the local Google session and show a user-facing reconnect message.

## JSON export

The JSON export uses `createBackup` and includes:

- `schemaVersion` and `exportedAt`;
- settings, favorites, highlights, notes, plans, position;
- prayers, onboarding, collections, memory, reminders, study sessions.

The export is designed for user portability and reviewer debugging. It should not include OAuth tokens, caches, or large Bible text packs.

## JSON restore

Settings accepts a `.json` backup file. Restore flow:

1. parse JSON;
2. validate the Omed backup envelope with `validateBackup`;
3. create a local pre-restore snapshot;
4. load each dataset through its store loader, allowing store-level sanitizing;
5. report success with the snapshot key.

Invalid JSON or invalid backup shapes are rejected without modifying local data.

## Risks and limits

- Sync is last-write-wins at file level; there is no merge UI for simultaneous edits on multiple devices.
- A network failure can leave some uploads complete and others pending; users can retry force upload.
- Browser private mode or disabled storage can prevent local persistence; stores catch read errors and fall back to safe defaults where practical.
- Daily routine and reading activity are not portable in V1, so progress score history may differ between devices.
