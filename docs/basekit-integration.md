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
