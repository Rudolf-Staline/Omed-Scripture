# Omed Scripture

Omed Scripture est une application biblique React/Vite en **version `0.1.0-beta`**. Elle vise une bêta publique propre : lecture, étude, annotations, mémorisation, PWA/offline, synchronisation optionnelle Google Drive, documentation QA et processus de release léger.

**Application :** https://omed-scripture.vercel.app

## Statut bêta

Cette version est prête pour des tests contrôlés par de vrais utilisateurs, mais elle n’est pas encore une V1 stable. Les testeurs doivent exporter leurs données avant les essais risqués et signaler les problèmes via GitHub Issues ou le diagnostic copiable dans Settings/About.

## Diagnostic initial de release

1. **État actuel** : l’application dispose déjà d’une surface fonctionnelle V1 (Reader, Search, Notes, Prayer, Plans, Collections, Memory, Study, Review, Settings, PWA/offline et Drive sync), mais nécessitait une couche release/bêta plus claire.
2. **Scripts disponibles** : `dev`, `build`, `lint`, `preview`, `typecheck`, `test`, `bible:validate`, `bible:index`, `bible:build`.
3. **CI** : GitHub Actions existe avec installation, lint, typecheck, build et tests sur PR/push `main`.
4. **Versioning** : le package est positionné en `0.1.0-beta` et le changelog documente la première bêta.
5. **README/docs** : les docs architecture, stores, sync, sécurité et QA existaient; cette branche ajoute release process, privacy, Bible rights, roadmap et checklist bêta.
6. **Risques bêta** : offline dépendant du cache/packs, sync Drive à retester sur compte dédié, droits des traductions, bundle à optimiser, QA mobile/PWA encore manuelle.
7. **Priorités** : CI verte, QA checklist, feedback sans backend, mentions confidentialité/licences, page `/about`, section Settings bêta/support et documentation release.
8. **Branche** : travail préparé sur `release/beta-readiness`. Le clone local ne contenait pas de branche `main` ni de remote configuré; la branche a donc été créée depuis la base locale propre.

## Fonctionnalités principales

- Reader, Bible Picker, routes `/reader` et `/read/:translation/:bookId/:chapter`.
- Recherche `/search` et alias `/discover`, avec recherche locale lorsque les index statiques sont disponibles.
- Favorites, Notes, Highlights, Prayer, Plans, Collections.
- Home/Today, Me, Settings, More.
- Memory, Study Sessions, Review Center et Progress Score.
- PWA/offline via manifest, service worker, cache de chapitres récents, packs statiques et index locaux.
- Google Drive AppData sync optionnelle et export/import JSON.
- Page `/about` pour expliquer la bêta, le feedback, la confidentialité et les licences bibliques.

## Routes utiles

| Route | Usage |
|---|---|
| `/` | Home / Today |
| `/about` | Présentation bêta, feedback, confidentialité/licences |
| `/reader` | Lecture biblique |
| `/read/:translation/:bookId/:chapter` | Lecture directe d’un chapitre |
| `/search`, `/discover` | Recherche et découverte |
| `/favorites`, `/notes`, `/prayer` | Données personnelles locales |
| `/plans`, `/plans/:planId` | Plans de lecture |
| `/collections`, `/memory`, `/study`, `/study/:sessionId`, `/review` | Collections, mémorisation, études, reprise |
| `/settings`, `/me`, `/more` | Préférences, profil local et navigation complémentaire |

## Installation développeur

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run bible:validate
npm run bible:index
npm run bible:build
```

Les scripts Bible valident et reconstruisent les index de données statiques. Lancez-les dès qu’un pack biblique change.

## Système de design — BaseKit

Les briques UI génériques proviennent de **BaseKit**, vendorisé sous `vendor/basekit/`
et consommé via la façade `src/ui`. Le métier biblique reste entièrement dans Omed.
Importez toujours via la façade :

```tsx
import { Button, Card, EmptyState } from '../ui';
```

Détails (pont de tokens, thèmes, composants migrés, étapes restantes) :
`docs/basekit-integration.md` et `vendor/basekit/README.md`.

## CI

`.github/workflows/ci.yml` lance `npm ci`, `npm run lint`, `npm run typecheck`, `npm run build` et `npm test` sur les pull requests et les push vers `main`. Aucune PR ne devrait être mergée si la CI est rouge.

## Confidentialité et synchronisation

Par défaut, les données utilisateur restent dans le navigateur. La synchronisation Google Drive est optionnelle, déclenchée par connexion/activation, et ne doit pas être présentée comme du chiffrement de bout en bout. Voir `docs/PRIVACY_NOTES.md` et `docs/SYNC_AND_BACKUP.md`.

## Données bibliques et licences

Ne pas ajouter de traduction protégée sans autorisation explicite. Les packs statiques doivent documenter source, statut et limites. Voir `docs/BIBLE_RIGHTS_AND_LICENSES.md` et `docs/BIBLE_DATA.md`.

## Feedback bêta

- Dans l’app : Settings → **Bêta & support** ou `/about` pour copier un diagnostic non personnel.
- GitHub : utilisez les issue templates bug, feature request ou QA report.
- Le diagnostic inclut version, navigateur, online/offline, route, thème, sync activée et date; il n’inclut pas notes, prières, favoris, compte ou token.

## Documentation release et QA

- `CHANGELOG.md` — notes `0.1.0-beta`.
- `docs/RELEASE_PROCESS.md` — préparation, commandes, tag, rollback et vérification Vercel/PWA.
- `docs/BETA_QA_CHECKLIST.md` — checklist testeur non technique.
- `docs/ROADMAP.md` — V0.1 beta, V0.2, V0.3, V1 stable.
- `docs/QA_CHECKLIST.md` — checklist technique historique.

## Limites connues

- Le test mobile/PWA/offline réel doit être confirmé manuellement après déploiement.
- Le build signale un avertissement de chunk supérieur à 500 kB; acceptable pour bêta, à optimiser avant V1.
- Les comportements de conflit Drive sync doivent être testés sur données non critiques.
- Les traductions Bible restent soumises à vérification de licences avant distribution large.
