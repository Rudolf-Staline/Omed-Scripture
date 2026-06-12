import { formatDayKey } from './readingActivity';

// Activité quotidienne *unifiée* : une seule série remplace les anciennes séries
// concurrentes (lecture vs routine). Un jour compte comme « actif » dès qu'au
// moins une action spirituelle significative a eu lieu : lecture, routine
// complétée, ou prière marquée « j'ai prié ». Tout est dérivé de données déjà
// persistées — aucune nouvelle clé de stockage n'est créée.

export interface UnifiedActivitySources {
  /** Clés de jour issues du journal de lecture (`YYYY-MM-DD`). */
  readingDays?: string[];
  /** Clés de jour des routines complétées. */
  routineCompletedDays?: string[];
  /** Clés de jour additionnelles (ex. prière « j'ai prié »). */
  extraDays?: string[];
}

const isDayKey = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

// Union dédupliquée et triée (du plus récent au plus ancien) des jours actifs.
export const collectActivityDays = (sources: UnifiedActivitySources): string[] => {
  const all = [
    ...(sources.readingDays ?? []),
    ...(sources.routineCompletedDays ?? []),
    ...(sources.extraDays ?? []),
  ].filter(isDayKey);
  return Array.from(new Set(all)).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
};

// Convertit une liste d'horodatages (ms) en clés de jour locales valides.
export const timestampsToDayKeys = (timestamps: Array<number | undefined>): string[] =>
  timestamps
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
    .map((value) => formatDayKey(new Date(value)));

// Série de jours consécutifs actifs se terminant aujourd'hui (ou hier si rien
// n'a encore été fait aujourd'hui).
export const getUnifiedStreak = (days: Iterable<string>, reference: Date = new Date()): number => {
  const set = new Set(days);
  const cursor = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());

  if (!set.has(formatDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(formatDayKey(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(formatDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export interface UnifiedWeekDay {
  dayKey: string;
  label: string;
  isToday: boolean;
  active: boolean;
}

const WEEKDAY_LABELS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

// Semaine courante (lundi → dimanche) avec marquage des jours actifs.
export const getUnifiedWeek = (days: Iterable<string>, reference: Date = new Date()): UnifiedWeekDay[] => {
  const set = new Set(days);
  const todayKey = formatDayKey(reference);
  const monday = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekday = (monday.getDay() + 6) % 7; // lundi = 0
  monday.setDate(monday.getDate() - weekday);

  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    const dayKey = formatDayKey(date);
    return { dayKey, label, isToday: dayKey === todayKey, active: set.has(dayKey) };
  });
};
