# Intégration BaseKit V1

Ce document décrit comment la bibliothèque UI générique **BaseKit** est intégrée
dans Omed Scripture, comment l'utiliser, et l'état de la migration.

> Principe directeur : **BaseKit fournit les briques UI ; Omed garde le métier
> biblique.** On ne déplace pas la logique Bible dans BaseKit, et on ne transforme
> pas BaseKit en application biblique.

## 1. Méthode d'intégration

BaseKit n'est pas publié sur npm. Il est **vendorisé** sous
[`vendor/basekit/`](../vendor/basekit/README.md) : la source et le `dist`
pré-compilé des paquets `@basekit/tokens`, `@basekit/core`, `@basekit/ui` et
`@basekit/api` y sont copiés depuis le repo `Rudolf-Staline/Base`.

Le projet **reste sur npm** (pas de bascule pnpm) et tous les scripts existants
sont préservés : `dev`, `build`, `lint`, `preview`, `typecheck`, `test`,
`bible:validate`, `bible:index`, `bible:build`.

Résolution des paquets :

| Outil | Mécanisme | Cible |
|---|---|---|
| Vite (dev/build/test) | `resolve.alias` dans `vite.config.ts` | `vendor/basekit/packages/<pkg>/dist/index.js` |
| TypeScript | `compilerOptions.paths` dans `tsconfig.app.json` | `vendor/basekit/packages/<pkg>/dist/index.d.ts` |

`skipLibCheck` garde les internes de BaseKit hors du type-check applicatif.

## 2. Comment importer les composants

Toujours via la **façade `src/ui`**, jamais directement depuis `@basekit/ui` :

```tsx
import { Button, Card, EmptyState, TextInput, Stack } from '../ui';
```

La façade ([`src/ui/basekit.ts`](../src/ui/basekit.ts)) réexporte les composants
React de BaseKit (les `XView`) sous des noms propres (`Button`, `Card`, …). Ce
point de passage unique rend la migration centralisée et réversible : adapter,
enrober ou remplacer un composant ne touche qu'à ce fichier, pas des dizaines
d'imports dispersés.

## 3. Pont de tokens (thèmes)

Les cinq ambiances d'Omed (**dark / light / sepia / nocturne / aube**) ne sont pas
remplacées. Le fichier [`src/styles/basekit-adapter.css`](../src/styles/basekit-adapter.css)
fait le pont :

1. Un bloc `@theme inline` déclare les tokens Tailwind v4 attendus par BaseKit
   (`bg-primary`, `text-surface-muted`, `shadow-soft`, …) en les pointant vers des
   variables `--bk-*`. L'option `inline` évite toute collision avec les `--color-*`
   d'Omed et toute référence circulaire.
2. Un bloc runtime mappe `--bk-*` vers les `--color-*` d'Omed pour les cinq
   thèmes. Les composants BaseKit suivent donc automatiquement l'ambiance active.

`src/index.css` importe l'adaptateur juste après `@import "tailwindcss"`, et un
`@source "../vendor/basekit/packages/ui/dist"` garantit que Tailwind génère bien
les classes utilitaires figées dans le `dist` de BaseKit.

Correspondances principales :

| BaseKit (`--bk-*`) | Omed (`--color-*`) |
|---|---|
| `background` / `foreground` | `bg` / `text` |
| `surface` / `surfaceRaised` / `surfaceMuted` | `surface` / `surface-raised` / `surface-soft` |
| `primary` | `accent` (or laiton) |
| `accent` | `olive` |
| `warning` | `copper` |
| `danger` | `danger` |
| `muted` / `mutedForeground` | `surface-soft` / `muted` |
| `border` / `input` / `ring` | `border` / `border` / `accent` |

> Écart assumé vs l'exemple de la spec : `--bk-muted` est mappé sur une *surface*
> douce (et non sur un texte), car BaseKit utilise `muted` comme fond discret.

Les classes utilitaires Omed (`omed-card`, `surface-card`, `omed-panel`,
`omed-button-*`, etc.) sont **conservées** pendant la migration.

## 4. Toasts

`react-hot-toast` reste le système de notifications (session Google expirée, sync
Drive, rappels, actions utilisateur). BaseKit fournit aussi un `ToastProvider`,
mais il n'est **pas** adopté dans cette passe pour ne perdre aucun message
existant. Une centralisation éventuelle se fera plus tard via `src/ui`.

## 5. Composants migrés (Phase 1)

Composants génériques d'état, migrés en conservant leur API publique :

| Composant Omed | Brique BaseKit utilisée | Note |
|---|---|---|
| `src/components/EmptyState.tsx` | `EmptyState` + `Button` | Icône lucide `Inbox` conservée |
| `src/components/LoadingState.tsx` | `Spinner` | Panneau Omed `StudyPanel` conservé |
| `src/components/ErrorState.tsx` | `Button` | Panneau Omed `StudyPanel` conservé |

Aucun appelant n'a eu à changer : les props (`title`, `message`, `actionLabel`,
`onAction`, `compact`) sont identiques.

## 6. Reste à migrer (volontairement)

La migration est **progressive**. Ne sont pas encore migrés :

- **Pages simples** (Phase 2) : Login, Settings, More, About, Me, Plans, Notes,
  Favorites — candidates suivantes, faible logique métier.
- **Reader & expérience biblique** (Phase 3) : à ne traiter qu'après stabilisation
  des briques de base, et **uniquement** sur les éléments génériques (boutons,
  panneaux, modals, tabs, drawer, search input, états vides/chargement). Le rendu
  des versets, la navigation livre/chapitre, les highlights et la logique de
  lecture **ne sont pas touchés**.

## 7. Ce qui reste métier (non migré, par conception)

Stores Zustand, logique Bible, données bibliques, sync Google Drive,
authentification Google, routes, notes, favoris, highlights, plans de lecture,
prières, collections, mémorisation, settings, reader, search, onboarding.

## 8. Limites connues

- Le `dist` BaseKit est versionné dans `vendor/` ; une évolution de BaseKit
  nécessite une re-synchronisation manuelle (voir `vendor/basekit/README.md`).
- Les utilitaires de taille de police BaseKit (`text-bk-*`) ne sont pas pontés ;
  les textes concernés héritent simplement de la taille courante (cosmétique).
- Le page builder déclaratif de BaseKit (`Page`, `RenderNode`) n'est pas utilisé :
  Omed reste une app React classique en JSX.

## 9. Prochaines étapes

1. Phase 2 : migrer 1–2 pages simples (ex. About, Settings) via `src/ui`.
2. Étendre la façade au besoin (formulaires, modals) au fil des migrations.
3. Évaluer une couche `src/ui/toast.ts` pour centraliser les toasts.


## Phase 2 — Pages visibles migrées

Cette phase rend l'intégration BaseKit **concrètement visible** dans l'interface
Omed Scripture, sans toucher au cœur biblique ni à la logique métier.

### Pages migrées

| Page | Fichier | Composants BaseKit utilisés |
|------|---------|-----------------------------|
| À propos | `src/features/about/AboutPage.tsx` | `Button`, `Grid`, `Inline`, `Badge`, `Callout` |
| Plus | `src/features/more/MorePage.tsx` | `Card`, `Stack`, `Grid`, `Inline`, `Badge` |
| Paramètres (partiel) | `src/features/settings/SettingsPage.tsx` | `Button` (zones UI simples uniquement) |

### Changements visibles

#### AboutPage
- Ajout d'une section majeure "Interface propulsée par BaseKit" expliquant la philosophie de la migration avec 3 `<Card>`.
- La section "Limites honnêtes de la bêta" est modernisée avec un `<Callout tone="warning">` et un `<Badge>`.
- La grille de fonctionnalités utilise `<Grid columns={4}>`.
- Les boutons d'action (Ouvrir l'app, Retour, Diagnostic) sont harmonisés avec `<Button>` et intégrés de manière cohérente.

#### MorePage
- L'en-tête profil a été transformé en une carte élégante intégrant un badge "BaseKit actif".
- Une nouvelle section "Interface unifiée" a été ajoutée avec un `<Callout>`.
- Les cartes de statistiques (Notes, Favoris, À revoir, Prières) sont des `<Card>` dans une `<Grid columns={4}>` avec un effet de survol.
- La section de progression est une `<Card>`.
- Le menu de navigation a été re-stylisé avec un `<Stack>` dans une `<Card>`.
- La section export est une `<Card>` plus visible.
- Le layout global est un `<Stack gap="lg">`.

#### SettingsPage (améliorations visibles ciblées)
- La section "Bêta & support" utilise une `<Card>` et un `<Callout tone="neutral">` pour clarifier le message.
- La section "Synchronisation" a été revue avec une `<Card>`, des `<Button>` BaseKit et un `<Badge>` pour le statut.
- La section "Apparence" et les autres grandes sections ont été englobées dans des `<Card>` pour uniformiser le rendu de la page.

### Composants Omed conservés

- `PageCanvas` — layout de page Omed
- `PageHero` — hero section avec kicker/titre/intro/actions
- `StudyPanel` — panneaux thématiques bibliques avec icône et style propre à Omed
- `ContentDeck` — layout multi-colonnes Settings
- `SegmentedControl` — contrôle interne Settings (non migré)

### Sections volontairement non touchées

- `ReaderPage` — cœur de l'expérience de lecture biblique
- Logique Google Drive sync (`handleSyncData`, `handleForceUpload`)
- Restauration et backup de données (`restoreData`, `backupLocalDataBeforeRestore`)
- Suppression de données (`clearData`)
- Logique hors-ligne (section `offlineLibrary`)
- Logique de permissions rappels (`requestReminderPermission`)
- `LoginPage` — non trouvée dans le dépôt ou trop sensible pour cette passe
- Stores Zustand — aucun store modifié

### Tests ajoutés

| Fichier | Tests |
|---------|-------|
| `src/features/about/__tests__/AboutPage.test.tsx` | Rendu sans crash, bouton Copier diagnostic, grille features, section limites, lien GitHub Issues |
| `src/features/more/__tests__/MorePage.test.tsx` | Rendu sans crash, items de menu, cartes stats, badge sync, section export |

### Limites restantes

- `Button` de BaseKit ne supporte pas de prop `as` — les liens React Router
  et les ancres `mailto:` gardent leurs classes Omed (`omed-button-*`) pour rester
  fonctionnels comme liens HTML natifs.
- `SettingsPage` reste majoritairement non migrée (trop grande, trop sensible).
- La compatibilité thématique (dark/light/sepia/nocturne/aube) repose sur
  l'adaptateur CSS existant ; vérification visuelle manuelle recommandée.

### Prochaines étapes

- **Phase 3** : Formulaires `Select`, `Switch`, `Checkbox` dans SettingsPage pour
  les sections Lecture et Objectifs personnels.
- **Phase 4** : Navigation (TabsBar, éventuels Breadcrumb).
- **Phase 5** : Composants de navigation avancés avec BaseKit Navigation.
