import type { LucideIcon } from 'lucide-react';
import { BookOpen, Brain, Compass, HandHeart, Heart, NotebookPen, Sparkles } from 'lucide-react';

export type JourneyDifficulty = 'facile' | 'moyen' | 'approfondi';

export interface GuidedJourney {
  id: string;
  title: string;
  /** Promesse simple, sobre, vérifiable — pas de promesse spirituelle exagérée. */
  description: string;
  /** Durée indicative lisible (ex. « 7 jours », « ~5 min »). */
  durationLabel: string;
  theme: string;
  difficulty: JourneyDifficulty;
  icon: LucideIcon;
  /** Action principale : un libellé clair + une route existante. */
  action: { label: string; route: string };
  /** Étapes courtes, descriptives — pas de contenu théologique inventé. */
  steps: string[];
}

// Parcours guidés : ils ne créent pas de contenu nouveau, ils orientent vers des
// fonctionnalités existantes (plans, lecture, mémorisation, étude, prière) pour
// qu'un nouvel utilisateur sache par où commencer.
export const GUIDED_JOURNEYS: GuidedJourney[] = [
  {
    id: 'discover-jesus',
    title: 'Découvrir Jésus',
    description: 'Un premier parcours dans l’Évangile de Marc pour faire connaissance avec Jésus.',
    durationLabel: '7 jours',
    theme: 'Évangiles',
    difficulty: 'facile',
    icon: Compass,
    action: { label: 'Commencer le parcours', route: '/plans/gospel-start-7' },
    steps: [
      'Un court chapitre par jour, dans l’ordre.',
      'Marquez le jour comme lu quand vous avez terminé.',
      'Notez une phrase qui vous marque.',
    ],
  },
  {
    id: 'understand-basics',
    title: 'Comprendre les bases',
    description: 'Sept lectures courtes : création, promesse, espérance, Évangile, vie nouvelle.',
    durationLabel: '7 jours',
    theme: 'Fondations',
    difficulty: 'facile',
    icon: Sparkles,
    action: { label: 'Ouvrir Fondations', route: '/plans/starter-7' },
    steps: ['Une lecture par jour.', 'Revenez à votre rythme, sans pression.'],
  },
  {
    id: 'read-john-21',
    title: 'Lire Jean en 21 jours',
    description: 'Un chapitre par jour pour traverser l’Évangile de Jean.',
    durationLabel: '21 jours',
    theme: 'Évangiles',
    difficulty: 'moyen',
    icon: BookOpen,
    action: { label: 'Continuer Jean', route: '/plans/john-21' },
    steps: ['Un chapitre chaque jour.', 'Surlignez ou notez ce qui vous parle.'],
  },
  {
    id: 'find-peace',
    title: 'Trouver la paix',
    description: 'Trois psaumes pour apaiser le cœur quand tout pèse.',
    durationLabel: '3 jours',
    theme: 'Confiance',
    difficulty: 'facile',
    icon: Heart,
    action: { label: 'Commencer', route: '/plans/psalms-comfort-3' },
    steps: ['Lisez lentement.', 'Gardez une phrase pour la journée.'],
  },
  {
    id: 'resume-prayer',
    title: 'Reprendre la prière',
    description: 'Cinq jours pour réapprendre à prier, simplement, avec Jésus.',
    durationLabel: '5 jours',
    theme: 'Prière',
    difficulty: 'facile',
    icon: HandHeart,
    action: { label: 'Ouvrir le parcours', route: '/plans/lords-prayer-5' },
    steps: ['Lisez le passage du jour.', 'Déposez une prière dans votre carnet.'],
  },
  {
    id: 'memorize-essentials',
    title: 'Mémoriser des versets essentiels',
    description: 'Ajoutez quelques versets clés et laissez les révisions s’espacer doucement.',
    durationLabel: '~5 min / jour',
    theme: 'Mémorisation',
    difficulty: 'moyen',
    icon: Brain,
    action: { label: 'Ouvrir Mémoriser', route: '/memory' },
    steps: ['Ajoutez un verset depuis la lecture.', 'Révisez quand c’est dû, selon votre souvenir réel.'],
  },
  {
    id: 'study-a-passage',
    title: 'Étudier un passage simplement',
    description: 'Observer, comprendre, appliquer, prier — une méthode douce en quatre temps.',
    durationLabel: '~15 min',
    theme: 'Étude',
    difficulty: 'approfondi',
    icon: NotebookPen,
    action: { label: 'Ouvrir l’Étude', route: '/study' },
    steps: [
      'Observation : que dit le texte ?',
      'Interprétation : que signifie-t-il dans son contexte ?',
      'Application : que vivre ou changer ?',
      'Prière : comment répondre à Dieu ?',
    ],
  },
];

export const getJourneyById = (id: string): GuidedJourney | undefined =>
  GUIDED_JOURNEYS.find((journey) => journey.id === id);

export const getRecommendedJourneys = (limit = 3): GuidedJourney[] =>
  GUIDED_JOURNEYS.filter((journey) => journey.difficulty === 'facile').slice(0, limit);
