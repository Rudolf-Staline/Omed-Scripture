import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import type { DailyGoalMinutes, OnboardingGoal, OnboardingPreferences, PreferredTopicId } from '../types/onboarding';

const GOALS: OnboardingGoal[] = ['daily_reading', 'study', 'prayer', 'plan', 'notes'];
const TOPICS: PreferredTopicId[] = ['foi', 'paix', 'sagesse', 'courage', 'priere', 'famille', 'pardon', 'esperance'];
const DAILY_GOALS: DailyGoalMinutes[] = [5, 10, 15, 'free'];

export const DEFAULT_ONBOARDING: OnboardingPreferences = {
  completed: false,
  skipped: false,
  preferredTranslation: 'lsg',
  primaryGoal: 'daily_reading',
  topics: ['foi', 'paix'],
  dailyGoalMinutes: 10,
  preferredReminderTime: '08:00',
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isTime = (value: unknown): value is string => typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);

export const sanitizeOnboarding = (value: unknown): OnboardingPreferences => {
  if (!isRecord(value)) return DEFAULT_ONBOARDING;
  const topics = Array.isArray(value.topics) ? value.topics.filter((topic): topic is PreferredTopicId => TOPICS.includes(topic as PreferredTopicId)) : [];
  return {
    completed: typeof value.completed === 'boolean' ? value.completed : DEFAULT_ONBOARDING.completed,
    skipped: typeof value.skipped === 'boolean' ? value.skipped : DEFAULT_ONBOARDING.skipped,
    completedAt: typeof value.completedAt === 'string' ? value.completedAt : undefined,
    preferredTranslation: typeof value.preferredTranslation === 'string' && value.preferredTranslation.trim() ? value.preferredTranslation : DEFAULT_ONBOARDING.preferredTranslation,
    primaryGoal: GOALS.includes(value.primaryGoal as OnboardingGoal) ? value.primaryGoal as OnboardingGoal : DEFAULT_ONBOARDING.primaryGoal,
    topics: topics.length > 0 ? topics.slice(0, 8) : DEFAULT_ONBOARDING.topics,
    dailyGoalMinutes: DAILY_GOALS.includes(value.dailyGoalMinutes as DailyGoalMinutes) ? value.dailyGoalMinutes as DailyGoalMinutes : DEFAULT_ONBOARDING.dailyGoalMinutes,
    preferredReminderTime: isTime(value.preferredReminderTime) ? value.preferredReminderTime : DEFAULT_ONBOARDING.preferredReminderTime,
  };
};

const getStorage = (): Storage | undefined => typeof localStorage === 'undefined' ? undefined : localStorage;

const readInitial = (storage: Storage | undefined = getStorage()): OnboardingPreferences => {
  if (!storage) return DEFAULT_ONBOARDING;
  try {
    const stored = storage.getItem(OMED_STORAGE_KEYS.onboarding);
    return stored ? sanitizeOnboarding(JSON.parse(stored)) : DEFAULT_ONBOARDING;
  } catch (error) {
    console.error('Failed to read onboarding preferences', error);
    return DEFAULT_ONBOARDING;
  }
};

const persist = (preferences: OnboardingPreferences, storage: Storage | undefined = getStorage()) => {
  if (!storage) return;
  try {
    storage.setItem(OMED_STORAGE_KEYS.onboarding, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to persist onboarding preferences', error);
  }
};

interface OnboardingState {
  preferences: OnboardingPreferences;
  updatePreferences: (patch: Partial<OnboardingPreferences>) => void;
  complete: (patch?: Partial<OnboardingPreferences>) => void;
  skip: () => void;
  resetOnboarding: () => void;
  loadOnboarding: (value: unknown) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  preferences: readInitial(),
  updatePreferences: (patch) => set((state) => {
    const preferences = sanitizeOnboarding({ ...state.preferences, ...patch });
    persist(preferences);
    return { preferences };
  }),
  complete: (patch = {}) => set((state) => {
    const preferences = sanitizeOnboarding({ ...state.preferences, ...patch, completed: true, skipped: false, completedAt: new Date().toISOString() });
    persist(preferences);
    return { preferences };
  }),
  skip: () => set((state) => {
    const preferences = sanitizeOnboarding({ ...state.preferences, completed: true, skipped: true, completedAt: new Date().toISOString() });
    persist(preferences);
    return { preferences };
  }),
  resetOnboarding: () => {
    persist(DEFAULT_ONBOARDING);
    set({ preferences: DEFAULT_ONBOARDING });
  },
  loadOnboarding: (value) => {
    const preferences = sanitizeOnboarding(value);
    persist(preferences);
    set({ preferences });
  },
}));
