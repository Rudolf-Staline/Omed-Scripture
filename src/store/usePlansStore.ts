import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export interface PlanProgress {
  planId: string;
  completedDays: number[]; // array of day indices (1-based)
  startDate: number;
  completedAtByDay?: Record<number, number>;
}

interface PlansState {
  progress: Record<string, PlanProgress>;
  startPlan: (planId: string) => void;
  markDayComplete: (planId: string, dayIndex: number) => void;
  unmarkDayComplete: (planId: string, dayIndex: number) => void;
  loadPlans: (progress: unknown) => void;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeCompletedAtByDay = (value: unknown, completedDays: number[]): Record<number, number> => {
  if (!isRecord(value)) return {};
  const completed = new Set(completedDays);
  return Object.entries(value).reduce<Record<number, number>>((acc, [key, timestamp]) => {
    const day = Number.parseInt(key, 10);
    if (Number.isInteger(day) && day > 0 && completed.has(day) && typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp > 0) {
      acc[day] = timestamp;
    }
    return acc;
  }, {});
};

export const sanitizePlanProgress = (value: unknown): Record<string, PlanProgress> => {
  if (!isRecord(value)) return {};
  return Object.entries(value).reduce<Record<string, PlanProgress>>((acc, [planId, raw]) => {
    if (!isRecord(raw)) return acc;
    const completedDays = Array.isArray(raw.completedDays)
      ? Array.from(new Set(raw.completedDays.filter((day): day is number => typeof day === 'number' && Number.isInteger(day) && day > 0))).sort((a, b) => a - b)
      : [];
    const startDate = typeof raw.startDate === 'number' && Number.isFinite(raw.startDate) && raw.startDate > 0 ? raw.startDate : Date.now();
    const storedPlanId = typeof raw.planId === 'string' && raw.planId ? raw.planId : planId;
    acc[planId] = {
      planId: storedPlanId,
      completedDays,
      startDate,
      completedAtByDay: sanitizeCompletedAtByDay(raw.completedAtByDay, completedDays),
    };
    return acc;
  }, {});
};

const persistPlans = (progress: Record<string, PlanProgress>) => {
  localStorage.setItem(OMED_STORAGE_KEYS.plans, JSON.stringify(progress));
  const token = useAuthStore.getState().token;
  const synced = useSettingsStore.getState().synced;
  if (token && synced) syncFileToDrive(DRIVE_FILES.plans, progress, token).catch(console.error);
};

const getInitialPlans = (): Record<string, PlanProgress> => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.plans);
    return stored ? sanitizePlanProgress(JSON.parse(stored)) : {};
  } catch (e) {
    console.error('Failed to read plans from localStorage', e);
    return {};
  }
};

export const usePlansStore = create<PlansState>((set) => ({
  progress: getInitialPlans(),
  startPlan: (planId) =>
    set((state) => {
      const newProgress = {
        ...state.progress,
        [planId]: { planId, completedDays: [], startDate: Date.now(), completedAtByDay: {} },
      };
      persistPlans(newProgress);
      return { progress: newProgress };
    }),
  markDayComplete: (planId, dayIndex) =>
    set((state) => {
      const plan = state.progress[planId];
      if (!plan) return state;
      const completedDays = Array.from(new Set([...plan.completedDays, dayIndex])).sort((a, b) => a - b);
      const newProgress = {
        ...state.progress,
        [planId]: {
          ...plan,
          completedDays,
          completedAtByDay: { ...(plan.completedAtByDay ?? {}), [dayIndex]: plan.completedAtByDay?.[dayIndex] ?? Date.now() },
        },
      };
      persistPlans(newProgress);
      return { progress: newProgress };
    }),
  unmarkDayComplete: (planId, dayIndex) =>
    set((state) => {
      const plan = state.progress[planId];
      if (!plan) return state;
      const completedAtByDay = { ...(plan.completedAtByDay ?? {}) };
      delete completedAtByDay[dayIndex];
      const newProgress = {
        ...state.progress,
        [planId]: {
          ...plan,
          completedDays: plan.completedDays.filter((d) => d !== dayIndex),
          completedAtByDay,
        },
      };
      persistPlans(newProgress);
      return { progress: newProgress };
    }),
  loadPlans: (progress) => {
    const sanitized = sanitizePlanProgress(progress);
    persistPlans(sanitized);
    set({ progress: sanitized });
  },
}));
