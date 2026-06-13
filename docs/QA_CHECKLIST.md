# V1 QA checklist

Use this checklist before merging release hardening changes.

## Automated checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run bible:validate`
- `npm run bible:index`
- `npm run bible:build`

## Routes

Verify that each route renders without a crash and has a clear empty/loading/error state where applicable:

- `/`
- `/reader`
- `/read/lsg/jean/3`
- `/search`
- `/discover`
- `/favorites`
- `/notes`
- `/prayer`
- `/plans`
- `/plans/<planId>`
- `/settings`
- `/me`
- `/collections`
- `/memory`
- `/study`
- `/study/<sessionId>`
- `/review`
- `/more`
- unknown route (`/does-not-exist`)

## Desktop navigation

- Sidebar principal shows Accueil, Bible, Plans, Découvrir, Moi.
- Sidebar personnel shows Reprise, Études, Notes, Favoris, Mémoriser, Prière, Collections.
- Sidebar does not show mobile-only “Plus”.
- Settings remains accessible.
- Command Palette (`Ctrl/Cmd+K`) routes to existing pages only.

## Mobile navigation

- Bottom nav shows Accueil, Bible, Plans, Découvrir.
- `/more` exposes Moi, Reprise, Études, Notes, Favoris, Mémoriser, Prière, Collections, Paramètres.
- Bottom nav does not hide primary page actions or final content.
- Reader, Bible Picker, Verse Actions, Search, Memory, Study Editor, Prayer, Settings, More, Me, and Review fit without horizontal overflow.

## Offline / PWA

- Manifest icons load.
- Service worker registers in production build.
- Previously cached/static chapter opens while offline.
- Local search uses static search index when available.
- Offline banner/message is understandable.
- Returning online allows API/sync retry.

## Sync and backup

- Login/session restore does not expose token in logs.
- Sync down creates a pre-restore snapshot before applying data.
- Force upload writes every declared Drive file.
- Session expiry shows a reconnect message.
- JSON export contains memory, study sessions, reminders, collections, prayers, and onboarding.
- JSON restore rejects invalid files and accepts legacy backups missing optional V1 fields.

## Feature checks

- Reader: chapter navigation, comparison, favorites/highlights/notes actions.
- Search/Discover: query, filters, local/static fallback, empty state.
- Favorites/Notes: empty state, sorting/filtering, copy/open actions.
- Prayer: add/update/status/mark prayed.
- Plans: start/complete day/detail route.
- Memory: add/review/update state.
- Study: create/edit/complete session and missing session fallback.
- Review: score, suggestions, links to source modules.
- Settings: theme, reader preferences, sync, export, restore, local clear confirmation.
