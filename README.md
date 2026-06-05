# Omed Scripture

Omed Scripture est une application web React/Vite de lecture, comparaison, annotation et sauvegarde biblique. Elle privilégie une interface calme, lisible et utilisable hors ligne lorsque les chapitres ont déjà été mis en cache.

**Application :** https://omed-bible.vercel.app

## Statut du projet

Le projet est en stabilisation progressive. Les fonctionnalités principales sont disponibles, avec des protections renforcées sur les données locales, les sauvegardes et la synchronisation Google Drive AppData.

## Fonctionnalités

- Lecture par livre et chapitre.
- Comparaison de deux traductions, avec empilement lisible sur mobile.
- Recherche de versets.
- Marque-pages triables par date ou ordre biblique canonique.
- Notes, surlignages et partage texte/image.
- Parcours de lecture réels : 7 jours, Évangile de Jean, panorama de 30 jours, structure annuelle préparée mais non simulée.
- Audio via `speechSynthesis`, déclenché uniquement par l’utilisateur.
- Export JSON local et synchronisation Google Drive AppData.
- Route 404 et notifications globales.

## Traductions disponibles dans le code

| Traduction | ID | Langue | Source |
|---|---:|---|---|
| Louis Segond 1910 | `lsg` | Français | bolls.life |
| Darby (Français) | `darby` | Français | bolls.life |
| King James Version | `kjv` | Anglais | bible-api.com |
| World English Bible | `web` | Anglais | bible-api.com |
| Bible in Basic English | `bbe` | Anglais | bible-api.com |

Le code contient aussi une préparation pour certaines traductions API.Bible (`niv`, `esv`, `nlt`) via route serverless, mais elles ne sont pas exposées dans la liste principale tant que la configuration serveur et le mapping complet ne sont pas validés.

## Installation locale

### Prérequis

- Node.js >= 22 recommandé pour aligner la CI.
- npm.

```bash
git clone https://github.com/Rudolf-Staline/Omed-Scripture.git
cd Omed-Scripture
npm install
npm run dev
```

Application locale : `http://localhost:5173`.

## Commandes utiles

```bash
npm run dev          # serveur de développement Vite
npm run lint         # ESLint
npm run typecheck    # TypeScript sans émission
npm run build        # build production
npm test             # tests unitaires ciblés Vitest
```

## Variables d’environnement

Copiez l’exemple puis renseignez les valeurs nécessaires :

```bash
cp .env.example .env
```

```env
BIBLE_API_KEY=votre_cle_api_bible_cote_serveur
VITE_GOOGLE_CLIENT_ID=votre_client_id_google
```

- `BIBLE_API_KEY` : clé API.Bible côté serveur uniquement, utilisée par `api/bible/chapter.ts`. Ne pas utiliser de préfixe `VITE_`, car ces variables sont exposées dans le bundle client.
- `VITE_GOOGLE_CLIENT_ID` : identifiant OAuth Google utilisé par Google Sign-In et Drive AppData.

## Synchronisation Google Drive

La synchronisation utilise le scope Google Drive AppData. Les fichiers applicatifs synchronisés concernent : préférences, marque-pages, notes, surlignages, parcours et position de lecture.

Avant toute restauration depuis Drive, Omed Scripture crée une sauvegarde locale pré-restauration dans `localStorage` avec une clé `omed_scripture_pre_restore_*`, afin de réduire le risque d’écrasement brutal.

## Confidentialité des données

- Les données personnelles de lecture restent dans le navigateur et, si l’utilisateur se connecte, dans le dossier Google Drive AppData du compte Google.
- Le bouton “Effacer toutes les données” supprime uniquement les clés locales connues d’Omed Scripture, pas tout le stockage du domaine.
- Le token OAuth Google reste actuellement conservé localement avec une date d’expiration et suppression automatique à expiration. Une future passe pourra passer à une conservation mémoire stricte.

## Limites connues

- La synchronisation Drive applique une validation minimale et une sauvegarde locale avant restauration, mais pas encore une résolution fine des conflits champ par champ.
- Le plan annuel est volontairement marqué “à venir” tant qu’un jeu de lectures complet n’est pas fourni.
- `speechSynthesis` dépend du navigateur, des voix installées et de la plateforme.
- Les traductions API.Bible préparées côté serveur nécessitent `BIBLE_API_KEY` et un mapping de livres robuste avant exposition produit.

## Roadmap

- Résolution de conflits Drive par `updatedAt` par entité.
- Import JSON manuel complet avec validation et aperçu.
- Plan annuel complet non simulé.
- Amélioration du stockage OAuth pour réduire encore la persistance locale.
- Couverture de tests plus large sur stores et synchronisation.

## Structure du projet

```text
api/                     # fonctions serverless Vercel
src/components/          # composants UI transverses
src/constants/           # constantes partagées, dont clés de stockage
src/data/                # données statiques typées
src/features/            # pages et fonctionnalités
src/store/               # stores Zustand
src/utils/               # API Bible, cache, Drive, backups
```

## Déploiement

Le projet cible Vercel. La configuration conserve le proxy `bible-api.com`, expose la fonction serverless API.Bible sous `/api/bible/chapter`, et réécrit les routes SPA vers `index.html`.

## Licence

Projet personnel à vocation éducative et spirituelle.
