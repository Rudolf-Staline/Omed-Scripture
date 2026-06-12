import { DAILY_PRAYERS, type DailyPrayer } from '../data/dailyPrayers';
import { DAILY_READINGS, type DailyReading } from '../data/dailyReadings';
import { getDailyVerse, type DailyVerse } from './dailyVerse';
import { formatBibleReference } from './bibleBooks';
import { formatDayKey } from './readingActivity';
import { getDayOfYear } from './dailyVerse';
import { DAILY_VERSE_TRANSLATION } from '../data/dailyVerses';

// Sélection déterministe par date : la routine d'un jour donné est stable toute
// la journée et identique sur tous les appareils, sans dépendance à une API.
const deterministicIndex = (date: Date, length: number, salt: number): number => {
  if (length <= 0) return 0;
  return (getDayOfYear(date) + date.getFullYear() + salt) % length;
};

export const getDailyPrayer = (date: Date = new Date()): DailyPrayer =>
  DAILY_PRAYERS[deterministicIndex(date, DAILY_PRAYERS.length, 0)];

export const getDailyReading = (date: Date = new Date()): DailyReading =>
  DAILY_READINGS[deterministicIndex(date, DAILY_READINGS.length, 3)];

export interface DailyRoutineContent {
  dayKey: string;
  verse: DailyVerse;
  verseReference: string;
  verseId: string;
  prayer: DailyPrayer;
  reading: DailyReading;
  readingPath: string;
}

// Compose le contenu complet de la routine du jour (verset + prière + lecture).
export const getDailyRoutineContent = (date: Date = new Date()): DailyRoutineContent => {
  const verse = getDailyVerse(date);
  const prayer = getDailyPrayer(date);
  const reading = getDailyReading(date);
  return {
    dayKey: formatDayKey(date),
    verse,
    verseReference: formatBibleReference(verse.bookId, verse.chapter, verse.verse),
    verseId: `${DAILY_VERSE_TRANSLATION}-${verse.bookId}-${verse.chapter}-${verse.verse}`,
    prayer,
    reading,
    readingPath: `/read/${DAILY_VERSE_TRANSLATION}/${reading.bookId}/${reading.chapter}`,
  };
};

// Série de jours consécutifs de routine complétée, se terminant aujourd'hui (ou
// hier si la routine du jour n'est pas encore faite). Réutilise la même logique
// que la série de lecture pour rester cohérent.
export const computeRoutineStreak = (
  completedDayKeys: Iterable<string>,
  reference: Date = new Date()
): number => {
  const days = new Set(completedDayKeys);
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
