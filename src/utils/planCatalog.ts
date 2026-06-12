import type { ReadingPlan } from '../data/readingPlans';

export type DurationFilterId = 'all' | 'short' | 'mid' | 'long';

export interface DurationFilter {
  id: DurationFilterId;
  label: string;
  max?: number;
  min?: number;
}

export const DURATION_FILTERS: DurationFilter[] = [
  { id: 'all', label: 'Toutes durées' },
  { id: 'short', label: '≤ 7 jours', max: 7 },
  { id: 'mid', label: '8 – 21 jours', min: 8, max: 21 },
  { id: 'long', label: '22 jours +', min: 22 },
];

export const matchesDuration = (plan: ReadingPlan, filterId: DurationFilterId): boolean => {
  const filter = DURATION_FILTERS.find((item) => item.id === filterId) ?? DURATION_FILTERS[0];
  if (filter.min !== undefined && plan.durationDays < filter.min) return false;
  if (filter.max !== undefined && plan.durationDays > filter.max) return false;
  return true;
};

// Thèmes uniques disponibles dans le catalogue, triés alphabétiquement.
export const getPlanThemes = (plans: ReadingPlan[]): string[] =>
  Array.from(new Set(plans.map((plan) => plan.theme).filter((theme): theme is string => Boolean(theme))))
    .sort((a, b) => a.localeCompare(b, 'fr'));

export interface PlanFilters {
  duration: DurationFilterId;
  theme: string | 'all';
}

export const filterPlans = (plans: ReadingPlan[], filters: PlanFilters): ReadingPlan[] =>
  plans.filter((plan) => {
    if (!matchesDuration(plan, filters.duration)) return false;
    if (filters.theme !== 'all' && plan.theme !== filters.theme) return false;
    return true;
  });
