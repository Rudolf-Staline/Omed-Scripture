import { DAILY_VERSES, type DailyVerse } from '../data/dailyVerses';

export const getDayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.floor(diff / 86_400_000) + 1;
};

// Déterministe par date : même verset toute la journée, rotation décalée
// d'une année sur l'autre pour ne pas répéter le calendrier à l'identique.
export const getDailyVerseIndex = (date: Date, listLength: number = DAILY_VERSES.length): number => {
  if (listLength <= 0) return 0;
  return (getDayOfYear(date) + date.getFullYear()) % listLength;
};

export const getDailyVerse = (date: Date = new Date()): DailyVerse =>
  DAILY_VERSES[getDailyVerseIndex(date)];

export type { DailyVerse };
