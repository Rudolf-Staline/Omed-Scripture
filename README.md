# Omed Scripture

Omed Scripture est une application web React/Vite de lecture, comparaison, annotation et sauvegarde biblique. Elle privilégie une interface calme, lisible et utilisable hors ligne lorsque les chapitres ont déjà été mis en cache.

**Application :** https://omed-scripture.vercel.app

## Identité visuelle — « Interface moderne »

L'interface adopte une direction artistique d'*application biblique moderne* : la sensation d'un vieil atlas céleste consulté à la lampe. Fonds bleu-sarcelle de nuit et encre d'ardoise, texte parchemin froid, accent laiton d'astrolabe, secondaire vert-de-gris (patine), accent émotionnel braise/cuivre, et un motif discret de constellation. Cinq ambiances sont disponibles dans les préférences :

| Thème | Ambiance |
|---|---|
| Mode sombre | Bleu-sarcelle profond et laiton (sombre par défaut) |
| Encre profonde | Nuit minimale, lune d'argent (contraste élevé) |
| Mode clair | Vélin froid de cartographe (clair) |
| Aube | Lumière douce, rose et ambre (clair) |
| Parchemin | Chaleur nostalgique (clair) |

Tout passe par un système de tokens CSS (`src/index.css`) ; changer une ambiance ne touche qu'aux variables, pas aux composants.

## Statut du projet

Le projet est en stabilisation progressive. Les fonctionnalités principales sont disponibles, avec des protections renforcées sur les données locales, les sauvegardes et la synchronisation Google Drive AppData.

## Navigation

L'application est pensée mobile-first autour de cinq destinations, accessibles
via une barre d'onglets en bas sur mobile et un rail latéral compact sur desktop :

| Onglet | Route | Contenu |
|---|---|---|
| Accueil (Today) | `/` | Verset du jour, routine quotidienne, progression, reprise, raccourcis |
| Bible | `/reader`, `/read/:translation/:bookId/:chapter` | Lecture, audio, comparaison, focus, étude |
| Plans | `/plans`, `/plans/:planId` | Parcours en cours et recommandés |
| Découvrir | `/discover` (alias de `/search`) | Recherche, thèmes bibliques, suggestions, historique |
| Moi | `/more` | Notes, favoris, prières, progression, sync, export, paramètres |

Les anciennes routes restent valides : `/search`, `/notes`, `/favorites`,
`/prayer`, `/settings` fonctionnent comme avant.

## Fonctionnalités

- **Accueil « Today »** : salutation et date du jour, verset du jour, routine quotidienne, progression (séries, semaine), reprise de lecture, plan en cours, raccourcis et activité récente.
- **Routine quotidienne** (locale, sans API) : verset du jour, prière guidée du jour, lecture courte recommandée, note rapide, bouton « Commencer aujourd'hui », série (streak) et historique des jours complétés.
- **Découvrir** : douze thèmes bibliques (Foi, Paix, Prière, Amour, Courage, Sagesse, Espérance, Pardon, Famille, Travail, Peur, Gratitude) avec description, passages suggérés et plans liés ; un clic lance une recherche réelle.
- **Carte de verset (Verse Image)** : génération locale d'une image carrée du verset (canvas, sans dépendance lourde), copie image/texte et partage WhatsApp / X depuis les actions de verset.
- **Sélecteur biblique (Bible Picker)** : un bouton de passage unique (« Jean 3 · LSG ») ouvre un panneau plein écran / bottom sheet — onglets Ancien/Nouveau Testament, recherche de livre insensible aux accents, grille des livres puis grille des chapitres, choix de traduction intégré, fermeture clavier (Échap). Les anciens menus déroulants traduction/livre/chapitre sont remplacés.
- Lecture par livre et chapitre, avec mode focus (plein texte) et mode étude (notes, surlignages et favoris du chapitre en panneau latéral).
- **Série quotidienne unifiée** : une seule série (« streak ») remplace les anciennes séries concurrentes lecture/routine ; un jour est actif dès qu'une lecture, une routine ou une prière (« j'ai prié ») a lieu. Dérivée de données déjà persistées, sans nouvelle clé de stockage.
- **Palette de commandes** (⌘K / Ctrl+K) : aller à une page, changer de thème ou entrer en méditation au clavier.
- **Mode méditation** : un verset en plein écran avec un halo de respiration lent (respecte `prefers-reduced-motion`), lancé depuis l'accueil ou la palette de commandes.
- **Cinq thèmes visuels** avec aperçu par échantillons dans les préférences (voir « Identité visuelle »).
- Progression visible dans le livre (chapitre courant / total).
- Comparaison de deux traductions, avec empilement lisible sur mobile.
- Verset du jour local et déterministe (sans API externe), avec ouverture du chapitre, copie, partage et mise en favori.
- Accueil « dashboard spirituel » : reprise de lecture, parcours en cours, progression hebdomadaire et série de lecture, notes et favoris récents, état de synchronisation.
- Recherche de versets : choix de traduction, historique récent, suggestions thématiques, filtres par testament et par livre, surlignage du terme recherché.
- Favoris triables par date ou ordre biblique canonique.
- Notes avec tags optionnels, filtres par tag et par livre, tri par date ou ordre biblique, copie avec référence.
- Carnet de prière : catégories (gratitude, demande, confession, intercession, méditation), statuts (en cours, exaucée, archivée), bouton « J'ai prié » (compteur et dernier horodatage), date d'exaucement, verset lié optionnel, recherche et filtres.
- Plans de lecture réels présentés en **catalogue** (sections En cours / Recommandés / Courts / Thématiques / Terminés) avec **filtres par durée et par thème**, métadonnées (catégorie, thème, difficulté, recommandé) et progression visible : Fondations 7 jours, Évangile de Jean 21 jours, Évangile essentiel 14 jours, Psaumes de confiance 7 jours, panorama de 30 jours ; structure annuelle préparée mais non simulée.
- **Détail de plan jour-par-jour** : carte « à lire maintenant » mise en avant, lecture du jour, marquage terminé/non terminé, parcours complet avec passages cliquables ; compléter un jour compte aussi pour la série quotidienne.
- Audio via `speechSynthesis`, déclenché uniquement par l’utilisateur.
- Export JSON local (incluant les prières) et synchronisation Google Drive AppData.
- Contenu biblique statique servi depuis `public/bibles/` (provider local prioritaire avec repli automatique vers les API).
- Route 404 et notifications globales.

## Traductions disponibles dans le code

| Traduction | ID | Langue | Source |
|---|---:|---|---|
| Louis Segond 1910 | `lsg` | Français | bolls.life (+ fichiers statiques locaux) |
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

## Contenu biblique hors ligne

Le chargement d’un chapitre tente d’abord un provider statique local (`src/utils/bibleProviders/staticProvider.ts`) qui lit des fichiers JSON pré-générés dans `public/bibles/{translation}/`. En cas d’absence ou d’invalidité, l’application bascule silencieusement vers les providers réseau (bolls.life, bible-api.com, API.Bible). Un jeu de démonstration (Jean 3:16-17 en LSG) valide la mécanique ; le format est documenté dans `docs/ARCHITECTURE.md`. Les chapitres consultés restent par ailleurs disponibles hors ligne via le cache local.

## Synchronisation Google Drive

La synchronisation utilise le scope Google Drive AppData. Les fichiers applicatifs synchronisés concernent : préférences, marque-pages, notes, surlignages, parcours, prières et position de lecture.

La routine quotidienne (`omed_bible_daily_routine`) est volontairement **locale uniquement** pour ne pas modifier le flux de synchronisation existant : elle est typée, validée au chargement (tolérante au JSON invalide) et testée, mais n'est pas envoyée vers Drive (voir « Limites connues »).

Avant toute restauration depuis Drive, Omed Scripture crée une sauvegarde locale pré-restauration dans `localStorage` avec une clé `omed_scripture_pre_restore_*`, afin de réduire le risque d’écrasement brutal.

## Confidentialité des données

- Les données personnelles de lecture restent dans le navigateur et, si l’utilisateur se connecte, dans le dossier Google Drive AppData du compte Google.
- Le bouton “Effacer toutes les données” supprime uniquement les clés locales connues d’Omed Scripture, pas tout le stockage du domaine.
- Le token OAuth Google reste actuellement conservé localement avec une date d’expiration et suppression automatique à expiration. Une future passe pourra passer à une conservation mémoire stricte.

## Limites connues

- La synchronisation Drive applique une validation minimale et une sauvegarde locale avant restauration, mais pas encore une résolution fine des conflits champ par champ.
- Le plan annuel est volontairement marqué “à venir” tant qu’un jeu de lectures complet n’est pas fourni.
- Le verset du jour est servi en Louis Segond 1910 (liste locale du domaine public) ; il est toujours rattaché à `lsg`, indépendamment de la traduction de lecture par défaut.
- L’initialisation des stores tolère un `localStorage` indisponible (mode privé, stockage désactivé) en retombant sur des valeurs par défaut, sans bloquer l’application. Les écritures peuvent toutefois échouer silencieusement si le quota est atteint.
- `speechSynthesis` dépend du navigateur, des voix installées et de la plateforme.
- Les traductions API.Bible préparées côté serveur nécessitent `BIBLE_API_KEY` et un mapping de livres robuste avant exposition produit.
- La routine quotidienne et son historique restent locaux à l'appareil (clé `omed_bible_daily_routine`) et ne sont pas encore synchronisés via Google Drive ni inclus dans l'export JSON.
- La carte de verset s'appuie sur l'API Canvas et le presse-papier/Web Share du navigateur ; le rendu et la copie image dépendent du support de `ClipboardItem` et des polices disponibles.
- Aucune notification locale en arrière-plan n'est implémentée : les rappels fiables nécessiteraient un service worker dédié, hors périmètre actuel.

## Roadmap

- Résolution de conflits Drive par `updatedAt` par entité.
- Import JSON manuel complet avec validation et aperçu.
- Plan annuel complet non simulé.
- Bible LSG statique complète dans `public/bibles/` pour une lecture et une recherche entièrement hors ligne.
- Amélioration du stockage OAuth pour réduire encore la persistance locale.
- Couverture de tests plus large sur stores et synchronisation.
- Synchronisation Drive et export JSON de la routine quotidienne (actuellement locale uniquement).
- Notifications/rappels quotidiens locaux via service worker.

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
