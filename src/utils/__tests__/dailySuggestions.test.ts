import { describe, expect, it } from 'vitest';
import { getGentleReminder, getNextBestAction, getSuggestedJourney, type SuggestionContext } from '../dailySuggestions';

const base: SuggestionContext = {
  hasAnyActivity: true,
  routineDoneToday: false,
  dueMemoryCount: 0,
  studyDraftCount: 0,
  activePrayerCount: 0,
  activePlan: null,
  streak: 0,
  onboarding: null,
};

describe('getNextBestAction', () => {
  it('suggests a guided journey for a brand-new user', () => {
    const action = getNextBestAction({ ...base, hasAnyActivity: false });
    expect(action.id.startsWith('journey:')).toBe(true);
    expect(action.route.startsWith('/plans/')).toBe(true);
  });

  it('prioritises continuing an active plan', () => {
    const action = getNextBestAction({ ...base, activePlan: { id: 'john-21', title: 'Évangile de Jean', nextDayLabel: 'Jour 3' }, dueMemoryCount: 5 });
    expect(action.route).toBe('/plans/john-21');
  });

  it('suggests memory review when verses are due', () => {
    expect(getNextBestAction({ ...base, dueMemoryCount: 4 }).route).toBe('/memory');
  });

  it('suggests resuming a study draft', () => {
    expect(getNextBestAction({ ...base, studyDraftCount: 2 }).route).toBe('/study');
  });

  it('suggests reading when nothing pending and routine not done', () => {
    expect(getNextBestAction({ ...base, routineDoneToday: false }).route).toBe('/reader');
  });

  it('falls back to discover when everything is done', () => {
    expect(getNextBestAction({ ...base, routineDoneToday: true }).route).toBe('/discover');
  });
});

describe('getSuggestedJourney', () => {
  it('maps a prayer goal to the prayer journey', () => {
    expect(getSuggestedJourney({ ...base, onboarding: { primaryGoal: 'prière' } }).id).toBe('resume-prayer');
  });

  it('maps a peace topic to the peace journey', () => {
    expect(getSuggestedJourney({ ...base, onboarding: { topics: ['paix'] } }).id).toBe('find-peace');
  });

  it('defaults to discovering Jesus', () => {
    expect(getSuggestedJourney(base).id).toBe('discover-jesus');
  });
});

describe('getGentleReminder', () => {
  const forbidden = ['échou', 'echou', 'raté', 'rate', 'perdu', 'nul', 'score'];

  it('is never culpabilising in any state', () => {
    const states: SuggestionContext[] = [
      { ...base, hasAnyActivity: false },
      { ...base, streak: 0 },
      { ...base, streak: 5, routineDoneToday: true },
      { ...base, streak: 5, routineDoneToday: false },
    ];
    for (const state of states) {
      const message = getGentleReminder(state).toLowerCase();
      for (const word of forbidden) expect(message.includes(word)).toBe(false);
      expect(message.length).toBeGreaterThan(0);
    }
  });
});
