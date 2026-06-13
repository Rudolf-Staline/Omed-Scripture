# Bible data packs

Omed Scripture separates Bible text from the JavaScript bundle. Static Bible data lives under `public/bibles` and is loaded with `fetch` only when a catalog, translation index, book, or search index is needed.

## Current legal/provenance status

| Translation | App id | Runtime status | Static status | Provenance/licence decision |
| --- | --- | --- | --- | --- |
| Louis Segond 1910 | `lsg` | bolls.life fallback remains enabled | **Partial static pack** (`Jean 3:16-17`) | Louis Segond 1910 is documented as Public Domain by eBible (`fraLSG`) and Wikimedia Commons marks the 1910 edition as public domain. The committed pack is intentionally tiny and used to validate the architecture before importing a complete corpus. |
| Darby français | `darby` | bolls.life | API-only | Not included statically because this repository does not yet contain a reviewed source/provenance file and licence audit for a complete text. |
| King James Version | `kjv` | bible-api.com | API-only | Public-domain candidates exist, but no static source has been imported in this PR. |
| World English Bible | `web` | bible-api.com | API-only | The app still uses the existing API provider; no static corpus has been imported in this PR. |
| Bible in Basic English | `bbe` | bible-api.com | API-only | No reviewed static corpus has been imported in this PR. |

If licence certainty is missing, the translation must remain API-only. Do not commit copyrighted modern translations such as NIV, ESV, NLT, Segond 21, Semeur, or Colombe without explicit permission compatible with this app.

## File structure

```text
public/bibles/
  catalog.json
  lsg/
    index.json
    jean.json
    search-index.json
```

### `catalog.json`

The catalog is the first lightweight file fetched by the app. It declares each known translation, its licence/provenance note, and whether it is `static`, `partial`, or `api-only`.

Static or partial translations must define:

- `indexPath`: path to `/bibles/{translationId}/index.json`;
- `searchIndexPath`: path to `/bibles/{translationId}/search-index.json` when local search is available.

### Translation index

`/public/bibles/{translationId}/index.json` lists books without embedding Bible text. Each book has a stable app-compatible `id`, an `osisId`, display labels, testament, order, chapter count, and the book file path.

For partial packs, `availableChapters` documents which chapters are actually present.

### Book file

`/public/bibles/{translationId}/{bookId}.json` stores text for one book only:

```json
{
  "translationId": "lsg",
  "bookId": "jean",
  "name": "Jean",
  "chapters": [
    { "chapter": 3, "verses": [{ "verse": 16, "text": "..." }] }
  ]
}
```

The app must fetch this file at read time; it must not be imported into `src`.

### Search index

`search-index.json` contains one entry per verse available in the static pack:

```json
{
  "bookId": "jean",
  "chapter": 3,
  "verse": 16,
  "reference": "Jean 3:16",
  "text": "...",
  "normalizedText": "..."
}
```

`normalizedText` is lower-case and accent-insensitive. The UI loads a search index only when a search is run for that translation.

## Runtime loading order

Chapter loading now follows this order:

1. static provider (`public/bibles`) if the translation/book/chapter exists;
2. local chapter cache/offline library;
3. existing remote API provider;
4. controlled UI error.

Search loading follows this order:

1. local static search index when available;
2. existing remote bolls.life search provider;
3. controlled UI error, especially offline.

## Validation and generation

NPM scripts:

- `npm run bible:index` rebuilds `search-index.json` files from the book files declared in each static/partial translation index;
- `npm run bible:validate` checks catalog/index/book/search file presence and core structure;
- `npm run bible:build` runs index generation then validation.

Browser-side TypeScript validators also validate fetched JSON before use:

- `validateCatalog`;
- `validateTranslationIndex`;
- `validateBookFile`;
- `validateSearchIndex`.

## How to add a complete static translation

1. Identify a source with a clear licence compatible with redistribution.
2. Document the exact source, URL, licence, and any conversion steps in this file.
3. Normalize book ids to the ids used by `src/data/bibleBooks.ts` and `src/utils/bibleNavigation.ts`.
4. Generate one JSON file per book under `public/bibles/{translationId}`.
5. Add a lightweight translation `index.json`.
6. Add/update `catalog.json`.
7. Run `npm run bible:build`, `npm run bible:validate`, `npm run typecheck`, and tests.
8. Confirm no large JSON is imported from `src` and no protected text is committed.

## Known limits

- The committed LSG static corpus is partial: it proves static reading and local search for Jean 3:16-17 only.
- Complete LSG import is a next step after choosing and documenting a canonical machine-readable source.
- Static packs are cache-on-install/cache-on-request through the service worker for current small files; future complete packs should avoid pre-caching every large book/search file by default.
