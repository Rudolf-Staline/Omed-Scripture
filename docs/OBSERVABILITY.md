# Observability

Omed Scripture intentionally ships **no invasive analytics and no third-party
tracking**. Observability is local, privacy-first, and user-initiated.

## What is collected
- **Nothing is sent anywhere automatically.** No analytics, no error-reporting
  endpoint, no telemetry by default.
- The user can **copy a diagnostic snapshot** (Settings / About / ErrorBoundary)
  and paste it into a bug report — only if they choose to.

## The diagnostic snapshot
Built by `src/utils/diagnostics.ts`. Includes only non-sensitive context:
app version, current route, user agent, online/offline, theme, sync on/off,
and an ISO timestamp.

It **never** includes: notes, prayers, favorites, highlights, collections,
memory verses, personal text, OAuth token, email, name, or licensed Bible text.
`diagnosticsContainSensitiveTerms()` plus unit tests guard this.

## What is NOT collected
- No personal content, no tokens, no Drive payloads, no IP/geolocation, no
  per-user identifiers.

## Diagnosing a user issue
1. Ask the user to **Copy diagnostic** and paste it.
2. Read version + route + online/sync to reproduce the context.
3. Reproduce locally (`npm run dev`, or `build`+`preview` for SW/offline).
4. For offline/PWA issues, follow `docs/PWA_PRODUCTION.md`.

## User-facing errors
- Recoverable errors surface as toasts (`react-hot-toast`) with plain language.
- Unrecoverable render errors are caught by the ErrorBoundary, which shows a soft
  fallback (Reload / Home / Copy diagnostic) — no raw stack trace in production.
- Console logging: technical errors only, dev-useful, **never** tokens or personal
  content (see `docs/SECURITY_NOTES.md`).

## If an opt-in error reporter is added later
It must be: opt-in (off by default), documented here, free of hardcoded keys,
and stripped of personal data (reuse the diagnostics allow-list).

## Limits
- No aggregate metrics: you only see what a user voluntarily reports.
- No session replay, no breadcrumbs beyond the single diagnostic snapshot.
