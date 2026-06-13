import { GUIDED_JOURNEYS, getJourneyById, type GuidedJourney } from '../data/guidedJourneys';

// Suggestions locales, déterministes, sans IA ni service externe. Toute la logique
// dérive de l'état déjà présent (onboarding, activité, mémoire due, brouillons
// d'étude, plan actif, prières). Le ton reste doux et non culpabilisant
// (voir docs/PRODUCT_VOICE.md).

export interface SuggestionContext {
  hasAnyActivity: boolean;
  routineDoneToday: boolean;
  dueMemoryCount: number;
  studyDraftCount: number;
  activePrayerCount: number;
  activePlan?: { id: string; title: string; nextDayLabel?: string } | null;
  streak: number;
  onboarding?: { primaryGoal?: string; topics?: string[] } | null;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  label: string;
  route: string;
}

const norm = (value: string): string =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Choisit un parcours guidé adapté à l'objectif/aux thèmes d'onboarding.
export const getSuggestedJourney = (context: SuggestionContext = defaultContext()): GuidedJourney => {
  const hints = [context.onboarding?.primaryGoal ?? '', ...(context.onboarding?.topics ?? [])].map(norm).join(' ');
  const match = (...keys: string[]) => keys.some((key) => hints.includes(key));

  if (match('priere', 'prayer', 'prier')) return getJourneyById('resume-prayer') ?? GUIDED_JOURNEYS[0];
  if (match('paix', 'peace', 'peur', 'anxi', 'stress')) return getJourneyById('find-peace') ?? GUIDED_JOURNEYS[0];
  if (match('memo', 'memory', 'retenir')) return getJourneyById('memorize-essentials') ?? GUIDED_JOURNEYS[0];
  if (match('etude', 'study', 'approfond')) return getJourneyById('study-a-passage') ?? GUIDED_JOURNEYS[0];
  if (match('base', 'debut', 'commenc', 'fondation')) return getJourneyById('understand-basics') ?? GUIDED_JOURNEYS[0];
  return getJourneyById('discover-jesus') ?? GUIDED_JOURNEYS[0];
};

// La « prochaine meilleure action » : une seule suggestion claire, priorisée.
export const getNextBestAction = (context: SuggestionContext = defaultContext()): SuggestedAction => {
  if (!context.hasAnyActivity) {
    const journey = getSuggestedJourney(context);
    return {
      id: `journey:${journey.id}`,
      title: 'Commencer en douceur',
      description: journey.title,
      label: journey.action.label,
      route: journey.action.route,
    };
  }

  if (context.activePlan?.nextDayLabel) {
    return {
      id: `plan:${context.activePlan.id}`,
      title: 'Continuer votre plan',
      description: `${context.activePlan.title} · ${context.activePlan.nextDayLabel}`,
      label: 'Continuer',
      route: `/plans/${context.activePlan.id}`,
    };
  }

  if (context.dueMemoryCount > 0) {
    return {
      id: 'memory:due',
      title: 'Quelques versets à revoir',
      description: `${context.dueMemoryCount} verset${context.dueMemoryCount > 1 ? 's' : ''} prêt${context.dueMemoryCount > 1 ? 's' : ''} pour une révision`,
      label: 'Réviser',
      route: '/memory',
    };
  }

  if (context.studyDraftCount > 0) {
    return {
      id: 'study:draft',
      title: 'Reprendre votre étude',
      description: `${context.studyDraftCount} étude${context.studyDraftCount > 1 ? 's' : ''} en brouillon`,
      label: 'Continuer l’étude',
      route: '/study',
    };
  }

  if (!context.routineDoneToday) {
    return {
      id: 'routine:today',
      title: 'Un pas aujourd’hui',
      description: 'Reprendre votre lecture là où vous en étiez',
      label: 'Lire',
      route: '/reader',
    };
  }

  return {
    id: 'discover:explore',
    title: 'Explorer un thème',
    description: 'Découvrir un passage selon ce que vous vivez',
    label: 'Découvrir',
    route: '/discover',
  };
};

// Message doux, encourageant, jamais culpabilisant.
export const getGentleReminder = (context: SuggestionContext = defaultContext()): string => {
  if (!context.hasAnyActivity) return 'Un petit pas suffit pour commencer aujourd’hui.';
  if (context.streak <= 0) return 'Reprenez tout doucement, à votre rythme.';
  if (context.routineDoneToday) return 'Beau rythme — revenez quand vous le souhaitez.';
  return `Vous avez gardé le rythme ${context.streak} jour${context.streak > 1 ? 's' : ''}. Un moment aujourd’hui ?`;
};

function defaultContext(): SuggestionContext {
  return {
    hasAnyActivity: false,
    routineDoneToday: false,
    dueMemoryCount: 0,
    studyDraftCount: 0,
    activePrayerCount: 0,
    activePlan: null,
    streak: 0,
    onboarding: null,
  };
}
