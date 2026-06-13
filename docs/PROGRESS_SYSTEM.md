# Progression quotidienne et centre de reprise

Le système de progression d’Omed Scripture sert à aider l’utilisateur à reprendre doucement son rythme biblique quotidien. Il ne mesure pas une performance spirituelle et n’a pas vocation à culpabiliser : le score est un repère simple pour voir ce qui a déjà été nourri aujourd’hui et quelle petite action peut venir ensuite.

## Philosophie

- **Encouragement plutôt que pression** : les libellés parlent de rythme, reprise, lecture, prière et progression.
- **Score explicable** : chaque source contribue un nombre de points lisible.
- **Compatibilité locale** : les données existantes restent valides, même sans historique récent.
- **Pas de pénalité pour les modules non configurés** : les sources absentes ne créent pas de message bloquant. Memory est considérée à jour lorsqu’aucun verset n’est dû.

## Barème quotidien

| Source | Points | Condition |
| --- | ---: | --- |
| Lecture | 20 | un jour de lecture est enregistré dans `readingActivity` |
| Routine | 20 | la routine quotidienne est complétée |
| Mémoire | 15 | une révision a été faite aujourd’hui ou aucun verset n’est dû |
| Étude | 15 | une étude est créée, modifiée ou complétée aujourd’hui |
| Prière | 15 | une intention est marquée comme priée aujourd’hui |
| Plan | 10 | un jour de plan est complété aujourd’hui |
| Notes | 5 | une note est créée ou modifiée aujourd’hui |

Niveaux :

- `repos` : 0–24
- `leger` : 25–49
- `solide` : 50–74
- `profond` : 75–100

## Sources de données

Le score est dérivé des stores existants :

- lecture locale (`readingActivity`) ;
- routine quotidienne ;
- versets Memory avec `lastReviewedAt` et `reviewHistory` ;
- Study Sessions avec `createdAt`, `updatedAt` et `completedAt` ;
- Prayer avec `lastPrayedAt` ;
- Plans avec `completedDays` et `completedAtByDay` ;
- Notes avec `dateAdded` et `dateModified`.

## Compatibilité localStorage et Drive

Les évolutions sont non destructives :

- `MemoryVerse.reviewHistory` est optionnel et sanitizé ; les anciens versets sans historique restent valides.
- `PlanProgress.completedAtByDay` est optionnel ; les anciens plans avec seulement `completedDays` continuent de fonctionner.
- `StudySession.completedAt` est optionnel ; les anciennes sessions terminées sans date de complétion restent valides.
- Les fichiers déjà synchronisés via Google Drive conservent leurs noms existants.

## Limites

- Le score reflète uniquement les événements que l’application sait dater localement.
- Une complétion de plan ancienne au format sans timestamp ne peut pas être attribuée rétroactivement à un jour précis.
- La routine quotidienne reste local-only dans l’architecture actuelle.

## Ajouter une nouvelle source au score

1. Stocker une date d’activité non destructive dans le store concerné.
2. Ajouter une entrée typée au modèle de `src/types/progress.ts` si nécessaire.
3. Étendre `getDailyProgressScore` dans `src/utils/progressScore.ts`.
4. Ajouter au moins un test de score positif et un test de non-activité ancienne.
5. Mettre à jour cette documentation et le wording UI si une nouvelle action est proposée dans `/review`.

## Tests

Commandes principales :

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

Tests ciblés :

```bash
npm test -- progressScore
npm test -- reviewCenter
npm test -- navigation
npm test -- commandPalette
npm test -- useMemoryStore
npm test -- usePlansStore
npm test -- useStudyStore
```
