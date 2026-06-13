# Architecture — Omed Scripture

Vue d'ensemble courte et pratique. Pour les fonctionnalités, voir le README.

## Couches

```text
src/features/   pages (home, reader, search, notes, prayer, favorites, plans, settings, auth)
src/components/ composants transverses (Layout, Sidebar, états vides/erreur/chargement, AudioPlayer)
src/store/      stores Zustand (persistés en localStorage + sync Drive), plus useUiStore éphémère
src/utils/      logique métier hors composants (API Bible, cache, activité, verset du jour, commandPalette…)
src/data/       données statiques typées (livres, traductions, plans, versets du jour, thèmes)
src/constants/  clés localStorage centralisées (OMED_STORAGE_KEYS)
api/            fonctions serverless Vercel (proxy API.Bible, clé côté serveur)
public/bibles/  contenu biblique statique (provider local)
```

## Thèmes (Atlas Nocturne)

`src/data/themes.ts` est la source unique : chaque ambiance déclare sa classe CSS (`theme-*`), son libellé,
ses échantillons d'aperçu et son schéma clair/sombre. `App.tsx` applique la classe sur `<html>` ; `src/index.css`
définit les variables de chaque thème. Le choix est stocké dans `settings.theme` (déjà synchronisé via Drive) ;
les anciennes valeurs `Light`/`Sepia`/`Dark` restent valides, deux ambiances (`Nocturne`, `Aube`) ont été ajoutées.

## Interface éphémère (command palette, méditation)

`src/store/useUiStore.ts` porte un état d'interface **non persisté** : ouverture de la palette de commandes
(⌘K) et verset en cours de méditation. Le catalogue de commandes et son filtrage (insensible aux accents) sont
des fonctions pures dans `src/utils/commandPalette.ts` (testées). Aucune nouvelle clé localStorage n'est introduite,
donc la restauration Drive est inchangée.

## Chargement d'un chapitre

`getChapter` (src/utils/bibleApi.ts) essaie dans l'ordre :

1. **staticProvider** — lit `/bibles/{translation}/index.json` puis `/bibles/{translation}/{bookId}.json`.
   Retourne `null` au moindre écart (fichier absent, JSON ou structure invalide, chapitre manquant) sans jamais lever d'erreur.
2. **bollsProvider** (traductions françaises), **bibleApiProvider** (anglaises) ou **scriptureApiProvider** (API.Bible via serverless), selon la traduction.

Le composant `ChapterView` met en cache les chapitres consultés (20 max) pour la lecture hors ligne.

### Format des fichiers statiques

`public/bibles/lsg/index.json` :

```json
{
  "translationId": "lsg",
  "name": "Louis Segond 1910",
  "language": "fr",
  "source": "static",
  "books": [
    { "id": "jean", "name": "Jean", "abbreviation": "Jn", "testament": "new", "chapterCount": 21, "order": 43 }
  ]
}
```

`public/bibles/lsg/jean.json` :

```json
{
  "translationId": "lsg",
  "bookId": "jean",
  "bookName": "Jean",
  "chapters": {
    "3": [{ "verse": 16, "text": "…" }]
  }
}
```

## Données persistées

Toutes les clés localStorage sont déclarées dans `src/constants/storageKeys.ts`. Toute nouvelle clé y est
automatiquement couverte par « Effacer toutes les données » et par la sauvegarde locale pré-restauration Drive.

| Donnée | Clé | Store / util |
|---|---|---|
| Position de lecture | `omed_bible_position` | useBibleStore |
| Préférences | `omed_bible_settings` | useSettingsStore |
| Marque-pages | `omed_bible_favorites` | useFavoritesStore |
| Surlignages | `omed_bible_highlights` | useHighlightsStore |
| Notes (tags optionnels) | `omed_bible_notes` | useNotesStore |
| Parcours | `omed_bible_plans` | usePlansStore |
| Prières | `omed_bible_prayers` | usePrayerStore |
| Cache de chapitres | `omed_bible_recent_chapters` | chapterCache |
| Historique de recherche | `omed_bible_search_history` | searchHistory |
| Activité de lecture | `omed_bible_reading_activity` | readingActivity |

Rétrocompatibilité : les notes sans `tags` et les exports JSON sans `prayers` restent valides.

Résilience : chaque `getInitial*` lit `localStorage` dans un `try/catch` et valide la forme des données
(JSON invalide, type inattendu) avant usage. Si le stockage est indisponible, le store retombe sur ses
valeurs par défaut sans jamais empêcher le démarrage de l'application (couvert par `storeResilience.test.ts`).

## Synchronisation Drive

Chaque store pousse son fichier JSON dans l'espace AppData après mutation (si connecté et sync active).
La restauration (au démarrage et depuis les réglages) valide chaque fichier (`isValidArray`, `isValidRecord`,
`isValidReadingPosition`) et crée une sauvegarde locale `omed_scripture_pre_restore_*` avant d'écraser quoi que ce soit.
Aucun `localStorage.clear()` global n'est utilisé.

## Verset du jour et activité

- `src/utils/dailyVerse.ts` : sélection déterministe par date (jour de l'année + année) dans la liste locale
  `src/data/dailyVerses.ts` (LSG, domaine public). Aucune API externe. Le verset est toujours rattaché à la
  traduction `DAILY_VERSE_TRANSLATION` (`lsg`) pour le lien, le favori et le partage.
- `src/utils/readingActivity.ts` : journal local des jours de lecture (alimenté par le lecteur), qui fournit
  la progression hebdomadaire et la série de jours consécutifs affichées sur l'accueil.

## Static Bible data packs and local search

Bible text packs live in `public/bibles` and are loaded with `fetch`, not bundled into the JavaScript application. The runtime validates `catalog.json`, translation indexes, book files, and search indexes before using them. Chapter loading prefers static data, then the local cache, then the existing remote providers. Search prefers a local per-translation `search-index.json`, then falls back to API search when available. See `docs/BIBLE_DATA.md` for licence rules, file format, and import workflow.

