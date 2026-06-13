# Product experience

How Omed Scripture is meant to feel day to day, and how the pieces fit together.
Companion to `docs/PRODUCT_VOICE.md`.

## Philosophy
Make the daily path obvious and gentle. A new person should understand, within
the first minutes, **what to read, what to resume, and what to do next** —
without getting lost in the feature set. Depth is available, never imposed.

## The daily loop
1. **Home / Today** — greeting, verse of the day, where to resume, a short
   routine, progress at a glance, and a single *next best action*.
2. **Read** — Reader + Bible Picker; act on a verse (favorite, note, highlight,
   memorize, study, share).
3. **Grow** — Plans, Memory (spaced review), Study (Observe / Interpret / Apply /
   Pray), Prayer journal.
4. **Reflect** — Review center + progress, all local and private.

## Guided journeys
`src/data/guidedJourneys.ts` orients newcomers toward existing features (they do
**not** invent content). Each journey: title, sober description, indicative
duration, theme, difficulty, one primary action → an existing route, and a few
short steps. Surfaced on Plans (« Parcours guidés »).

Journeys: Découvrir Jésus · Comprendre les bases · Lire Jean en 21 jours ·
Trouver la paix · Reprendre la prière · Mémoriser des versets essentiels ·
Étudier un passage simplement.

## Local suggestions
`src/utils/dailySuggestions.ts` computes, from already-stored state only
(onboarding, activity, due memory, study drafts, active plan, prayers):
- `getNextBestAction` — one prioritised, actionable suggestion.
- `getSuggestedJourney` — a journey matched to the user's goal/topics.
- `getGentleReminder` — an encouraging, never-culpabilising line.

No AI, no external service, deterministic, tested.

## Reading plans
`src/data/readingPlans.ts` holds real, honest plans with metadata (category,
theme, difficulty, recommended). Plans reference passages; they never embed
copyrighted Bible text. Short quality plans added: Psaumes de réconfort (3 j),
La prière du Seigneur (5 j), Foi et confiance (7 j), Commencer avec l’Évangile
(7 j). The annual plan stays « à venir » rather than faking readings.

## Microcopy & empty states
All user-facing copy follows `docs/PRODUCT_VOICE.md`: clear titles, useful
descriptions, precise buttons, human toasts, calm errors, and empty states that
teach the first step. Accessibility (labels, focus, Escape) must be preserved
when copy changes.

## Limits / honest scope
- This pass adds guided journeys, local suggestions, short plans, and product
  voice/experience docs. A full per-screen UX-writing rewrite and a dedicated
  `/discover` hub are **not** done here — `/discover` still composes Search.
- Real product validation needs human testing on a mobile device (see
  `docs/PRODUCTION_RELEASE_CHECKLIST.md`).
- Omed Scripture remains a reading/journaling companion, not a doctrinal authority.
