import { describe, expect, it, beforeEach } from 'vitest';

const memoryStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  } as Storage;
})();
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true });

import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { DEFAULT_ONBOARDING, sanitizeOnboarding, useOnboardingStore } from '../useOnboardingStore';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingStore.setState({ preferences: DEFAULT_ONBOARDING });
  });

  it('sanitizes invalid localStorage payloads', () => {
    expect(sanitizeOnboarding({ completed: 'yes', topics: ['paix', 'bad'], dailyGoalMinutes: 99 }).topics).toEqual(['paix']);
    expect(sanitizeOnboarding('bad')).toEqual(DEFAULT_ONBOARDING);
  });

  it('completes and persists preferences', () => {
    useOnboardingStore.getState().complete({ primaryGoal: 'prayer', dailyGoalMinutes: 5 });
    const stored = JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.onboarding) ?? '{}');
    expect(stored.completed).toBe(true);
    expect(stored.primaryGoal).toBe('prayer');
    expect(stored.dailyGoalMinutes).toBe(5);
  });

  it('supports skip and reset', () => {
    useOnboardingStore.getState().skip();
    expect(useOnboardingStore.getState().preferences.skipped).toBe(true);
    useOnboardingStore.getState().resetOnboarding();
    expect(useOnboardingStore.getState().preferences.completed).toBe(false);
  });
});
