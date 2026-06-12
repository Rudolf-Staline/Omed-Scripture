import { describe, expect, it } from 'vitest';
import { getDailyVerse, getDailyVerseIndex, getDayOfYear } from '../dailyVerse';
import { DAILY_VERSES } from '../../data/dailyVerses';
import { BIBLE_BOOKS } from '../../data/bibleBooks';

describe('dailyVerse', () => {
  it('computes day of year correctly', () => {
    expect(getDayOfYear(new Date(2026, 0, 1))).toBe(1);
    expect(getDayOfYear(new Date(2026, 0, 31))).toBe(31);
    expect(getDayOfYear(new Date(2026, 11, 31))).toBe(365);
  });

  it('is deterministic for a given date', () => {
    const date = new Date(2026, 5, 12);
    expect(getDailyVerse(date)).toEqual(getDailyVerse(new Date(2026, 5, 12, 23, 59)));
  });

  it('changes from one day to the next', () => {
    const indexA = getDailyVerseIndex(new Date(2026, 5, 12));
    const indexB = getDailyVerseIndex(new Date(2026, 5, 13));
    expect(indexB).not.toBe(indexA);
  });

  it('always returns a verse within bounds', () => {
    for (let day = 0; day < 370; day += 1) {
      const date = new Date(2026, 0, 1 + day);
      const verse = getDailyVerse(date);
      expect(verse).toBeDefined();
      expect(verse.text.length).toBeGreaterThan(0);
    }
  });

  it('only references known book ids', () => {
    const knownIds = new Set(BIBLE_BOOKS.map((book) => book.id));
    DAILY_VERSES.forEach((verse) => {
      expect(knownIds.has(verse.bookId)).toBe(true);
    });
  });

  it('only references chapters that exist in the book', () => {
    DAILY_VERSES.forEach((verse) => {
      const book = BIBLE_BOOKS.find((b) => b.id === verse.bookId);
      expect(book).toBeDefined();
      expect(verse.chapter).toBeGreaterThanOrEqual(1);
      expect(verse.chapter).toBeLessThanOrEqual(book!.chapters);
    });
  });
});
