import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import { formatDayKey } from '../utils/readingActivity';
import { computeRoutineStreak } from '../utils/dailyRoutine';

// Journal local de la routine quotidienne. Volontairement local-only : la
// synchronisation Google Drive n'est pas branchée ici pour ne pas modifier le
// flux de sync existant (voir README, section "Limites connues").

export interface RoutineDay {
  /** Clé de jour "YYYY-MM-DD" en heure locale. */
  date: string;
  /** Horodatage de complétion ; undefined tant que la routine n'est pas faite. */
  completedAt?: number;
  /** Référence du verset du jour au moment de la complétion. */
  verseRef?: string;
  /** Identifiant de la prière guidée du jour. */
  prayerPromptId?: string;
  /** Référence de la lecture courte du jour. */
  readingReference?: string;
  /** Note rapide du jour (optionnelle). */
  note?: string;
}

const MAX_TRACKED_DAYS = 366;

const isRoutineDay = (value: unknown): value is RoutineDay => {
  if (!value || typeof value !== 'object') return false;
  const day = value as Record<string, unknown>;
  if (typeof day.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return false;
  if (day.completedAt !== undefined && typeof day.completedAt !== 'number') return false;
  if (day.verseRef !== undefined && typeof day.verseRef !== 'string') return false;
  if (day.prayerPromptId !== undefined && typeof day.prayerPromptId !== 'string') return false;
  if (day.readingReference !== undefined && typeof day.readingReference !== 'string') return false;
  if (day.note !== undefined && typeof day.note !== 'string') return false;
  return true;
};

export const sanitizeRoutineDays = (value: unknown): RoutineDay[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: RoutineDay[] = [];
  for (const item of value) {
    if (!isRoutineDay(item) || seen.has(item.date)) continue;
    seen.add(item.date);
    result.push(item);
  }
  return result.slice(0, MAX_TRACKED_DAYS);
};

const getInitialDays = (storage: Storage = localStorage): RoutineDay[] => {
  try {
    const stored = storage.getItem(OMED_STORAGE_KEYS.dailyRoutine);
    if (stored) return sanitizeRoutineDays(JSON.parse(stored));
  } catch (e) {
    console.error('Failed to read daily routine from localStorage', e);
  }
  return [];
};

const persist = (days: RoutineDay[], storage: Storage = localStorage) => {
  try {
    storage.setItem(OMED_STORAGE_KEYS.dailyRoutine, JSON.stringify(days));
  } catch (e) {
    console.error('Failed to persist daily routine', e);
  }
};

const upsertToday = (
  days: RoutineDay[],
  dayKey: string,
  patch: Partial<RoutineDay>
): RoutineDay[] => {
  const existing = days.find((day) => day.date === dayKey);
  const merged: RoutineDay = { ...(existing ?? { date: dayKey }), ...patch, date: dayKey };
  const others = days.filter((day) => day.date !== dayKey);
  return [merged, ...others].slice(0, MAX_TRACKED_DAYS);
};

interface CompletePayload {
  verseRef?: string;
  prayerPromptId?: string;
  readingReference?: string;
  note?: string;
}

interface DailyRoutineState {
  days: RoutineDay[];
  getDay: (dayKey: string) => RoutineDay | undefined;
  isCompleted: (dayKey: string) => boolean;
  completeDay: (dayKey: string, payload?: CompletePayload) => void;
  setNote: (dayKey: string, note: string) => void;
  streak: () => number;
  loadRoutine: (days: unknown) => void;
  reset: () => void;
}

export const useDailyRoutineStore = create<DailyRoutineState>((set, get) => ({
  days: getInitialDays(),
  getDay: (dayKey) => get().days.find((day) => day.date === dayKey),
  isCompleted: (dayKey) => Boolean(get().days.find((day) => day.date === dayKey)?.completedAt),
  completeDay: (dayKey, payload = {}) =>
    set((state) => {
      const days = upsertToday(state.days, dayKey, { ...payload, completedAt: Date.now() });
      persist(days);
      return { days };
    }),
  setNote: (dayKey, note) =>
    set((state) => {
      const days = upsertToday(state.days, dayKey, { note });
      persist(days);
      return { days };
    }),
  streak: () =>
    computeRoutineStreak(
      get().days.filter((day) => day.completedAt).map((day) => day.date),
      new Date()
    ),
  loadRoutine: (value) => {
    const days = sanitizeRoutineDays(value);
    persist(days);
    set({ days });
  },
  reset: () => {
    persist([]);
    set({ days: [] });
  },
}));

export const todayKey = (): string => formatDayKey(new Date());
