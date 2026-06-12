import { describe, expect, it } from 'vitest';
import {
  collectActivityDays,
  getUnifiedStreak,
  getUnifiedWeek,
  timestampsToDayKeys,
} from '../dailyActivity';
import { formatDayKey } from '../readingActivity';

const ref = new Date(2026, 5, 12); // vendredi 12 juin 2026
const key = (offset: number) => {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - offset);
  return formatDayKey(d);
};

describe('collectActivityDays', () => {
  it('merges and deduplicates sources, ignoring malformed keys', () => {
    const days = collectActivityDays({
      readingDays: ['2026-06-10', 'oops'],
      routineCompletedDays: ['2026-06-10', '2026-06-11'],
      extraDays: ['2026-06-11', '2026-06-09', 42 as unknown as string],
    });
    expect(days).toEqual(['2026-06-11', '2026-06-10', '2026-06-09']);
  });

  it('treats several actions on the same day as a single active day', () => {
    const days = collectActivityDays({
      readingDays: ['2026-06-12'],
      routineCompletedDays: ['2026-06-12'],
      extraDays: ['2026-06-12'],
    });
    expect(days).toEqual(['2026-06-12']);
  });

  it('returns an empty array for empty/invalid input', () => {
    expect(collectActivityDays({})).toEqual([]);
    expect(collectActivityDays({ readingDays: undefined })).toEqual([]);
  });
});

describe('timestampsToDayKeys', () => {
  it('converts valid timestamps and drops undefined/NaN', () => {
    const ts = new Date(2026, 5, 12, 9, 30).getTime();
    expect(timestampsToDayKeys([ts, undefined, Number.NaN])).toEqual([formatDayKey(new Date(ts))]);
  });
});

describe('getUnifiedStreak', () => {
  it('returns 0 when there is no activity', () => {
    expect(getUnifiedStreak([], ref)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(getUnifiedStreak([key(0), key(1), key(2)], ref)).toBe(3);
  });

  it('counts a streak ending yesterday when today is empty', () => {
    expect(getUnifiedStreak([key(1), key(2)], ref)).toBe(2);
  });

  it('stops at the first gap', () => {
    expect(getUnifiedStreak([key(0), key(2)], ref)).toBe(1);
  });

  it('returns 0 when last activity is older than yesterday', () => {
    expect(getUnifiedStreak([key(3)], ref)).toBe(0);
  });
});

describe('getUnifiedWeek', () => {
  it('marks active days within the current Monday→Sunday week', () => {
    const week = getUnifiedWeek([key(0)], ref);
    expect(week).toHaveLength(7);
    expect(week.filter((day) => day.active)).toHaveLength(1);
    expect(week.find((day) => day.isToday)?.active).toBe(true);
  });
});
