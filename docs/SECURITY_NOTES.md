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

## Security headers and known limitations

Headers are configured in `vercel.json` and applied to all responses:

| Header | Value | Reason |
|---|---|---|
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` | Required so the Google OAuth popup can communicate back. |
| `Cross-Origin-Embedder-Policy` | `unsafe-none` | Avoids breaking the OAuth popup / third-party scripts; COEP `require-corp` is intentionally NOT used. |
| `X-Content-Type-Options` | `nosniff` | Blocks MIME-type sniffing. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage to other origins. |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking protection (the app is not meant to be framed cross-origin). |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | The app needs none of these; also opts out of FLoC. |

### Content-Security-Policy — intentionally deferred

A strict CSP is **not** shipped yet. Reasons and constraints:

- Google Identity Services / OAuth loads scripts and opens popups from `accounts.google.com` and `*.gstatic.com`; a wrong `script-src`/`frame-src` silently breaks sign-in.
- Tailwind v4 + Vite inject styles; a naive `style-src` without `'unsafe-inline'` (or hashes) breaks rendering.
- The Bible providers (`bible-api.com` proxy, `bolls.life`, optional API.Bible) and Google Drive (`www.googleapis.com`) must be allowed in `connect-src`.

When a CSP is introduced it must be validated against: Google sign-in, Drive sync up/down, font/asset loading, the service worker, and the Bible providers. A reasonable starting `connect-src` allow-list: `'self' https://www.googleapis.com https://bible-api.com https://bolls.life https://api.scripture.api.bible`. Ship it in `Content-Security-Policy-Report-Only` first.
