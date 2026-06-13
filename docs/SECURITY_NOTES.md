# Security notes

Omed Scripture is a browser-only client application. V1 security expectations are focused on avoiding accidental data leakage, secrets in the repository, and unsafe rendering of user content.

## Secrets and OAuth

- No Google client secret belongs in the repository.
- OAuth tokens are kept client-side in localStorage for session restore and are removed on logout/session expiry.
- Google Drive sync uses the user's `appDataFolder` and does not upload Bible packs or caches.

## User data

Notes, prayers, collections, study sessions, favorites, memory verses, and settings are stored locally and optionally synced to the user's Google Drive AppData. JSON export is explicit and user-triggered.

## Rendering

User-authored text should be rendered as React text nodes, not injected HTML. Avoid `dangerouslySetInnerHTML` unless the content is fully controlled and sanitized.

## Logging

Error logs may include operation names but must not include OAuth tokens, full backup payloads, or personal prayer/note content.

## Release checklist

- Run `rg "API_KEY|CLIENT_SECRET|dangerouslySetInnerHTML|localStorage.clear" src public docs README.md` before release.
- Verify `.env.example` contains placeholders only.
- Review new fixtures to ensure they do not add copyrighted Bible text without documented license/provenance.
