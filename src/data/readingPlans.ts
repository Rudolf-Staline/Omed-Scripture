export type ReadingPlanPassage = {
  bookId: string;
  chapterStart: number;
  chapterEnd?: number;
};

export type ReadingPlanDay = {
  day: number;
  title?: string;
  passages: ReadingPlanPassage[];
};

export type PlanDifficulty = 'facile' | 'moyen' | 'engagé';

export type ReadingPlan = {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  status?: 'ready' | 'planned';
  readings: ReadingPlanDay[];
  /** Catégorie large affichée dans le catalogue (ex. « Évangile »). */
  category?: string;
  /** Thème principal, aligné autant que possible avec les thèmes Découvrir. */
  theme?: string;
  difficulty?: PlanDifficulty;
  /** Mis en avant dans la section « Recommandés ». */
  recommended?: boolean;
};

const range = (length: number, build: (day: number) => ReadingPlanDay): ReadingPlanDay[] =>
  Array.from({ length }, (_, index) => build(index + 1));

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'starter-7',
    title: 'Fondations en 7 jours',
    description: 'Sept lectures courtes pour parcourir création, espérance, Évangile et vie nouvelle.',
    durationDays: 7,
    category: 'Découverte',
    theme: 'Fondations',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'Création', passages: [{ bookId: 'genese', chapterStart: 1 }] },
      { day: 2, title: 'Promesse', passages: [{ bookId: 'genese', chapterStart: 12 }] },
      { day: 3, title: 'Confiance', passages: [{ bookId: 'psaumes', chapterStart: 23 }] },
      { day: 4, title: 'Espérance', passages: [{ bookId: 'ésaïe', chapterStart: 53 }] },
      { day: 5, title: 'Bonne nouvelle', passages: [{ bookId: 'jean', chapterStart: 3 }] },
      { day: 6, title: 'Résurrection', passages: [{ bookId: 'luc', chapterStart: 24 }] },
      { day: 7, title: 'Vie nouvelle', passages: [{ bookId: 'romains', chapterStart: 8 }] },
    ],
  },
  {
    id: 'john-21',
    title: 'Évangile de Jean',
    description: 'Un chapitre par jour pour suivre le témoignage de Jean sur Jésus-Christ.',
    durationDays: 21,
    category: 'Évangile',
    theme: 'Évangiles',
    difficulty: 'moyen',
    recommended: true,
    readings: range(21, (day) => ({
      day,
      title: `Jean ${day}`,
      passages: [{ bookId: 'jean', chapterStart: day }],
    })),
  },
  {
    id: 'core-30',
    title: 'Panorama biblique en 30 jours',
    description: 'Un parcours de base à travers les grands mouvements de l’histoire biblique.',
    durationDays: 30,
    category: 'Parcours',
    theme: 'Panorama',
    difficulty: 'engagé',
    readings: [
      { day: 1, passages: [{ bookId: 'genese', chapterStart: 1 }] },
      { day: 2, passages: [{ bookId: 'genese', chapterStart: 3 }] },
      { day: 3, passages: [{ bookId: 'genese', chapterStart: 12 }] },
      { day: 4, passages: [{ bookId: 'exode', chapterStart: 3 }] },
      { day: 5, passages: [{ bookId: 'exode', chapterStart: 20 }] },
      { day: 6, passages: [{ bookId: 'josué', chapterStart: 1 }] },
      { day: 7, passages: [{ bookId: '1 samuel', chapterStart: 16 }] },
      { day: 8, passages: [{ bookId: '2 samuel', chapterStart: 7 }] },
      { day: 9, passages: [{ bookId: 'psaumes', chapterStart: 23 }] },
      { day: 10, passages: [{ bookId: 'psaumes', chapterStart: 51 }] },
      { day: 11, passages: [{ bookId: 'proverbes', chapterStart: 3 }] },
      { day: 12, passages: [{ bookId: 'ésaïe', chapterStart: 9 }] },
      { day: 13, passages: [{ bookId: 'ésaïe', chapterStart: 53 }] },
      { day: 14, passages: [{ bookId: 'jérémie', chapterStart: 31 }] },
      { day: 15, passages: [{ bookId: 'daniel', chapterStart: 6 }] },
      { day: 16, passages: [{ bookId: 'jonas', chapterStart: 1, chapterEnd: 4 }] },
      { day: 17, passages: [{ bookId: 'matthieu', chapterStart: 5 }] },
      { day: 18, passages: [{ bookId: 'marc', chapterStart: 1 }] },
      { day: 19, passages: [{ bookId: 'luc', chapterStart: 15 }] },
      { day: 20, passages: [{ bookId: 'jean', chapterStart: 1 }] },
      { day: 21, passages: [{ bookId: 'jean', chapterStart: 3 }] },
      { day: 22, passages: [{ bookId: 'jean', chapterStart: 11 }] },
      { day: 23, passages: [{ bookId: 'jean', chapterStart: 20 }] },
      { day: 24, passages: [{ bookId: 'actes', chapterStart: 2 }] },
      { day: 25, passages: [{ bookId: 'romains', chapterStart: 5 }] },
      { day: 26, passages: [{ bookId: 'romains', chapterStart: 8 }] },
      { day: 27, passages: [{ bookId: '1 corinthiens', chapterStart: 13 }] },
      { day: 28, passages: [{ bookId: 'éphésiens', chapterStart: 2 }] },
      { day: 29, passages: [{ bookId: 'hébreux', chapterStart: 11 }] },
      { day: 30, passages: [{ bookId: 'apocalypse', chapterStart: 21 }] },
    ],
  },
  {
    id: 'essential-14',
    title: 'Évangile essentiel en 14 jours',
    description: 'Quatorze moments clés de la vie de Jésus, de l’incarnation à l’envoi des disciples.',
    durationDays: 14,
    category: 'Évangile',
    theme: 'Évangiles',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'La Parole faite chair', passages: [{ bookId: 'jean', chapterStart: 1 }] },
      { day: 2, title: 'La naissance', passages: [{ bookId: 'luc', chapterStart: 2 }] },
      { day: 3, title: 'Le baptême', passages: [{ bookId: 'matthieu', chapterStart: 3 }] },
      { day: 4, title: 'La tentation', passages: [{ bookId: 'matthieu', chapterStart: 4 }] },
      { day: 5, title: 'Les béatitudes', passages: [{ bookId: 'matthieu', chapterStart: 5 }] },
      { day: 6, title: 'La prière', passages: [{ bookId: 'matthieu', chapterStart: 6 }] },
      { day: 7, title: 'Les paraboles', passages: [{ bookId: 'marc', chapterStart: 4 }] },
      { day: 8, title: 'Le pain de vie', passages: [{ bookId: 'jean', chapterStart: 6 }] },
      { day: 9, title: 'La grâce', passages: [{ bookId: 'luc', chapterStart: 15 }] },
      { day: 10, title: 'La résurrection de Lazare', passages: [{ bookId: 'jean', chapterStart: 11 }] },
      { day: 11, title: 'Le serviteur', passages: [{ bookId: 'jean', chapterStart: 13 }] },
      { day: 12, title: 'La croix', passages: [{ bookId: 'jean', chapterStart: 19 }] },
      { day: 13, title: 'Le tombeau vide', passages: [{ bookId: 'jean', chapterStart: 20 }] },
      { day: 14, title: 'L’envoi', passages: [{ bookId: 'matthieu', chapterStart: 28 }] },
    ],
  },
  {
    id: 'psalms-trust-7',
    title: 'Psaumes de confiance en 7 jours',
    description: 'Sept psaumes pour apprendre à se reposer en Dieu au cœur des circonstances.',
    durationDays: 7,
    category: 'Psaumes',
    theme: 'Confiance',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'Le berger', passages: [{ bookId: 'psaumes', chapterStart: 23 }] },
      { day: 2, title: 'La lumière', passages: [{ bookId: 'psaumes', chapterStart: 27 }] },
      { day: 3, title: 'La délivrance', passages: [{ bookId: 'psaumes', chapterStart: 34 }] },
      { day: 4, title: 'Le refuge', passages: [{ bookId: 'psaumes', chapterStart: 46 }] },
      { day: 5, title: 'Le repos', passages: [{ bookId: 'psaumes', chapterStart: 62 }] },
      { day: 6, title: 'La protection', passages: [{ bookId: 'psaumes', chapterStart: 91 }] },
      { day: 7, title: 'Le secours', passages: [{ bookId: 'psaumes', chapterStart: 121 }] },
    ],
  },
  {
    id: 'psalms-comfort-3',
    title: 'Psaumes de réconfort',
    description: 'Trois psaumes pour retrouver le calme quand le cœur est lourd.',
    durationDays: 3,
    category: 'Psaumes',
    theme: 'Confiance',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'Le berger', passages: [{ bookId: 'psaumes', chapterStart: 23 }] },
      { day: 2, title: 'À l’abri', passages: [{ bookId: 'psaumes', chapterStart: 91 }] },
      { day: 3, title: 'Mon secours', passages: [{ bookId: 'psaumes', chapterStart: 121 }] },
    ],
  },
  {
    id: 'lords-prayer-5',
    title: 'La prière du Seigneur',
    description: 'Cinq jours pour apprendre à prier à partir de l’enseignement de Jésus.',
    durationDays: 5,
    category: 'Prière',
    theme: 'Prière',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'Notre Père', passages: [{ bookId: 'matthieu', chapterStart: 6 }] },
      { day: 2, title: 'Apprends-nous à prier', passages: [{ bookId: 'luc', chapterStart: 11 }] },
      { day: 3, title: 'La louange', passages: [{ bookId: 'psaumes', chapterStart: 145 }] },
      { day: 4, title: 'Sans inquiétude', passages: [{ bookId: 'philippiens', chapterStart: 4 }] },
      { day: 5, title: 'Demandez', passages: [{ bookId: 'matthieu', chapterStart: 7 }] },
    ],
  },
  {
    id: 'faith-trust-7',
    title: 'Foi et confiance en 7 jours',
    description: 'Sept passages pour nourrir la confiance en Dieu dans l’incertitude.',
    durationDays: 7,
    category: 'Thématique',
    theme: 'Confiance',
    difficulty: 'moyen',
    readings: [
      { day: 1, title: 'Les témoins de la foi', passages: [{ bookId: 'hébreux', chapterStart: 11 }] },
      { day: 2, title: 'Croire comme Abraham', passages: [{ bookId: 'romains', chapterStart: 4 }] },
      { day: 3, title: 'Une forteresse', passages: [{ bookId: 'psaumes', chapterStart: 46 }] },
      { day: 4, title: 'Ne crains rien', passages: [{ bookId: 'ésaïe', chapterStart: 41 }] },
      { day: 5, title: 'Crois seulement', passages: [{ bookId: 'marc', chapterStart: 5 }] },
      { day: 6, title: 'La foi à l’épreuve', passages: [{ bookId: 'jacques', chapterStart: 1 }] },
      { day: 7, title: 'Ma lumière et mon salut', passages: [{ bookId: 'psaumes', chapterStart: 27 }] },
    ],
  },
  {
    id: 'gospel-start-7',
    title: 'Commencer avec l’Évangile',
    description: 'Sept étapes dans l’Évangile de Marc pour découvrir qui est Jésus.',
    durationDays: 7,
    category: 'Évangile',
    theme: 'Évangiles',
    difficulty: 'facile',
    recommended: true,
    readings: [
      { day: 1, title: 'Le commencement', passages: [{ bookId: 'marc', chapterStart: 1 }] },
      { day: 2, title: 'L’autorité de Jésus', passages: [{ bookId: 'marc', chapterStart: 2 }] },
      { day: 3, title: 'Les paraboles', passages: [{ bookId: 'marc', chapterStart: 4 }] },
      { day: 4, title: 'Qui est-il ?', passages: [{ bookId: 'marc', chapterStart: 8 }] },
      { day: 5, title: 'Servir et suivre', passages: [{ bookId: 'marc', chapterStart: 10 }] },
      { day: 6, title: 'La croix', passages: [{ bookId: 'marc', chapterStart: 15 }] },
      { day: 7, title: 'Le tombeau vide', passages: [{ bookId: 'marc', chapterStart: 16 }] },
    ],
  },
  {
    id: 'bible-year-planned',
    title: 'Bible en un an — à venir',
    description: 'Structure réservée pour un plan annuel complet. Ce plan n’est pas encore activable afin de ne pas simuler des lectures artificielles.',
    durationDays: 365,
    status: 'planned',
    category: 'Parcours',
    theme: 'Annuel',
    difficulty: 'engagé',
    readings: [],
  },
];
