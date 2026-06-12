import { describe, expect, it } from 'vitest';
import {
  getDailyPrayer,
  getDailyReading,
  getDailyRoutineContent,
  computeRoutineStreak,
} from '../dailyRoutine';
import { DAILY_PRAYERS } from '../../data/dailyPrayers';
import { DAILY_READINGS } from '../../data/dailyReadings';
import { BIBLE_BOOKS } from '../bibleApi';
import { formatDayKey } from '../readingActivity';

describe('daily routine selection', () => {
  it('is deterministic for a given date', () => {
    const date = new Date(2026, 5, 12);
    expect(getDailyPrayer(date).id).toBe(getDailyPrayer(date).id);
    expect(getDailyReading(date).id).toBe(getDailyReading(date).id);
    expect(getDailyRoutineContent(date).dayKey).toBe(formatDayKey(date));
  });

  it('returns valid entries from the local data sets', () => {
    const date = new Date(2026, 0, 1);
    expect(DAILY_PRAYERS).toContain(getDailyPrayer(date));
    expect(DAILY_READINGS).toContain(getDailyReading(date));
  });

  it('always points readings to a real book id usable by /read', () => {
    const ids = new Set(BIBLE_BOOKS.map((book) => book.id));
    DAILY_READINGS.forEach((reading) => {
      expect(ids.has(reading.bookId)).toBe(true);
    });
  });

  it('composes a coherent routine content payload', () => {
    const content = getDailyRoutineContent(new Date(2026, 2, 15));
    expect(content.verseReference).toMatch(/\d/);
    expect(content.readingPath.startsWith('/read/')).toBe(true);
    expect(content.verseId.split('-').length).toBeGreaterThanOrEqual(4);
  });
});

describe('computeRoutineStreak', () => {
  const ref = new Date(2026, 5, 12); // vendredi
  const key = (offset: number) => {
    const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - offset);
    return formatDayKey(d);
  };

  it('returns 0 with no completed days', () => {
    expect(computeRoutineStreak([], ref)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(computeRoutineStreak([key(0), key(1), key(2)], ref)).toBe(3);
  });

  it('counts a streak ending yesterday when today is not yet done', () => {
    expect(computeRoutineStreak([key(1), key(2)], ref)).toBe(2);
  });

  it('stops at the first gap', () => {
    expect(computeRoutineStreak([key(0), key(2), key(3)], ref)).toBe(1);
  });

  it('returns 0 when the most recent day is older than yesterday', () => {
    expect(computeRoutineStreak([key(3), key(4)], ref)).toBe(0);
  });
});
