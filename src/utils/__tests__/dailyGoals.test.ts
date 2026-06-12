import { describe, expect, it } from 'vitest';
import { DEFAULT_ONBOARDING } from '../../store/useOnboardingStore';
import { getPersonalizedDailyPrompt, getRecommendedTopic, getTodayGoalStatus, getWeeklyGoalProgress } from '../dailyGoals';

const ref = new Date(2026, 5, 12);

describe('daily goals utils', () => {
  it('reports today goal completion', () => {
    const status = getTodayGoalStatus(DEFAULT_ONBOARDING, [{ date: '2026-06-12', completedAt: 1 }], ref);
    expect(status.completed).toBe(true);
    expect(status.label).toContain('10');
  });

  it('uses preferred topics for prompt personalization', () => {
    const topic = getRecommendedTopic({ ...DEFAULT_ONBOARDING, topics: ['paix'] }, ref);
    expect(topic.id).toBe('paix');
    expect(getPersonalizedDailyPrompt({ ...DEFAULT_ONBOARDING, primaryGoal: 'prayer', topics: ['paix'] }, ref)).toContain('prière');
  });

  it('computes weekly routine progress', () => {
    const progress = getWeeklyGoalProgress([{ date: '2026-06-12', completedAt: 1 }, { date: '2026-06-11', completedAt: 1 }], ref);
    expect(progress.completedThisWeek).toBe(2);
    expect(progress.percent).toBe(29);
  });
});
