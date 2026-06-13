import { describe, expect, it } from 'vitest';
import { GUIDED_JOURNEYS, getJourneyById, getRecommendedJourneys } from './guidedJourneys';
import { READING_PLANS } from './readingPlans';

describe('guidedJourneys', () => {
  it('has unique ids and required fields', () => {
    const ids = GUIDED_JOURNEYS.map((j) => j.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const j of GUIDED_JOURNEYS) {
      expect(j.title.trim()).not.toBe('');
      expect(j.description.trim()).not.toBe('');
      expect(j.steps.length).toBeGreaterThan(0);
      expect(j.action.route.startsWith('/')).toBe(true);
    }
  });

  it('only links to plan routes that exist', () => {
    const planIds = new Set(READING_PLANS.map((p) => p.id));
    for (const j of GUIDED_JOURNEYS) {
      const match = j.action.route.match(/^\/plans\/(.+)$/);
      if (match) expect(planIds.has(match[1])).toBe(true);
    }
  });

  it('looks up by id and returns easy recommendations', () => {
    expect(getJourneyById('discover-jesus')?.title).toBe('Découvrir Jésus');
    expect(getJourneyById('nope')).toBeUndefined();
    const recommended = getRecommendedJourneys();
    expect(recommended.length).toBeGreaterThan(0);
    expect(recommended.every((j) => j.difficulty === 'facile')).toBe(true);
  });
});
