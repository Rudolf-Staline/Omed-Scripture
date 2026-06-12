import { describe, expect, it } from 'vitest';
import { DURATION_FILTERS, filterPlans, getPlanThemes, matchesDuration } from '../planCatalog';
import { READING_PLANS, type ReadingPlan } from '../../data/readingPlans';

const make = (overrides: Partial<ReadingPlan>): ReadingPlan => ({
  id: 'x', title: 'X', description: '', durationDays: 7, readings: [], ...overrides,
});

describe('planCatalog', () => {
  it('exposes the expected duration filters', () => {
    expect(DURATION_FILTERS.map((f) => f.id)).toEqual(['all', 'short', 'mid', 'long']);
  });

  it('matches plans against duration buckets', () => {
    const short = make({ durationDays: 7 });
    const mid = make({ durationDays: 14 });
    const long = make({ durationDays: 30 });
    expect(matchesDuration(short, 'short')).toBe(true);
    expect(matchesDuration(mid, 'short')).toBe(false);
    expect(matchesDuration(mid, 'mid')).toBe(true);
    expect(matchesDuration(long, 'mid')).toBe(false);
    expect(matchesDuration(long, 'long')).toBe(true);
    expect(matchesDuration(long, 'all')).toBe(true);
  });

  it('derives unique sorted themes', () => {
    const themes = getPlanThemes([make({ theme: 'Paix' }), make({ theme: 'Foi' }), make({ theme: 'Paix' }), make({})]);
    expect(themes).toEqual(['Foi', 'Paix']);
  });

  it('filters by duration and theme together', () => {
    const plans = [
      make({ id: 'a', durationDays: 7, theme: 'Foi' }),
      make({ id: 'b', durationDays: 21, theme: 'Foi' }),
      make({ id: 'c', durationDays: 7, theme: 'Paix' }),
    ];
    expect(filterPlans(plans, { duration: 'short', theme: 'Foi' }).map((p) => p.id)).toEqual(['a']);
    expect(filterPlans(plans, { duration: 'all', theme: 'all' })).toHaveLength(3);
  });

  it('keeps real reading plans coherent with the metadata contract', () => {
    READING_PLANS.forEach((plan) => {
      expect(plan.durationDays).toBeGreaterThan(0);
      if (plan.difficulty) expect(['facile', 'moyen', 'engagé']).toContain(plan.difficulty);
    });
  });
});
