import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

// Journal local des jours de lecture (clés "YYYY-MM-DD", heure locale).
// Sert à la progression hebdomadaire et au calcul de série sur la page d'accueil.

const MAX_TRACKED_DAYS = 366;

export const formatDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isDayKey = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const getReadingDays = (storage: Storage = localStorage): string[] => {
  try {
    const raw = storage.getItem(OMED_STORAGE_KEYS.readingActivity);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDayKey);
  } catch {
    return [];
  }
};

export const recordReadingDay = (date: Date = new Date(), storage: Storage = localStorage): void => {
  try {
    const key = formatDayKey(date);
    const days = getReadingDays(storage);
    if (days.includes(key)) return;
    const updated = [key, ...days].slice(0, MAX_TRACKED_DAYS);
    storage.setItem(OMED_STORAGE_KEYS.readingActivity, JSON.stringify(updated));
  } catch {
    // Le journal d'activité est un confort : ne jamais bloquer la lecture.
  }
};

export interface WeekDayActivity {
  dayKey: string;
  label: string;
  isToday: boolean;
  read: boolean;
}

const WEEKDAY_LABELS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// Semaine courante, du lundi au dimanche.
export const getWeekActivity = (
  reference: Date = new Date(),
  storage: Storage = localStorage
): WeekDayActivity[] => {
  const days = new Set(getReadingDays(storage));
  const todayKey = formatDayKey(reference);

  const monday = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekday = (monday.getDay() + 6) % 7; // lundi = 0
  monday.setDate(monday.getDate() - weekday);

  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const dayKey = formatDayKey(date);
    return { dayKey, label, isToday: dayKey === todayKey, read: days.has(dayKey) };
  });
};

// Jours consécutifs de lecture se terminant aujourd'hui (ou hier si la
// lecture du jour n'a pas encore eu lieu).
export const getReadingStreak = (
  reference: Date = new Date(),
  storage: Storage = localStorage
): number => {
  const days = new Set(getReadingDays(storage));
  const cursor = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());

  if (!days.has(formatDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(formatDayKey(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(formatDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
