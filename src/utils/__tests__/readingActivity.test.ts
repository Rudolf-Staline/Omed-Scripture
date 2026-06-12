import { describe, expect, it, beforeEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import {
  formatDayKey,
  getReadingDays,
  getReadingStreak,
  getWeekActivity,
  recordReadingDay,
} from '../readingActivity';

const createStorage = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: () => null,
    get length() {
      return Object.keys(store).length;
    },
  } as Storage;
};

describe('readingActivity', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it('formats local day keys', () => {
    expect(formatDayKey(new Date(2026, 5, 12))).toBe('2026-06-12');
    expect(formatDayKey(new Date(2026, 0, 3))).toBe('2026-01-03');
  });

  it('records a reading day once', () => {
    const date = new Date(2026, 5, 12);
    recordReadingDay(date, storage);
    recordReadingDay(date, storage);
    expect(getReadingDays(storage)).toEqual(['2026-06-12']);
  });

  it('returns empty list on invalid stored data', () => {
    storage.setItem(OMED_STORAGE_KEYS.readingActivity, 'not-json');
    expect(getReadingDays(storage)).toEqual([]);

    storage.setItem(OMED_STORAGE_KEYS.readingActivity, JSON.stringify({ nope: true }));
    expect(getReadingDays(storage)).toEqual([]);

    storage.setItem(OMED_STORAGE_KEYS.readingActivity, JSON.stringify(['2026-06-12', 42, 'invalid']));
    expect(getReadingDays(storage)).toEqual(['2026-06-12']);
  });

  it('builds the current week from Monday with read flags', () => {
    // Le 12 juin 2026 est un vendredi.
    const friday = new Date(2026, 5, 12);
    recordReadingDay(new Date(2026, 5, 10), storage); // mercredi
    recordReadingDay(friday, storage);

    const week = getWeekActivity(friday, storage);
    expect(week).toHaveLength(7);
    expect(week[0].dayKey).toBe('2026-06-08'); // lundi
    expect(week[2].read).toBe(true); // mercredi
    expect(week[4].read).toBe(true); // vendredi
    expect(week[4].isToday).toBe(true);
    expect(week[6].dayKey).toBe('2026-06-14'); // dimanche
  });

  it('computes a streak ending today', () => {
    const today = new Date(2026, 5, 12);
    recordReadingDay(new Date(2026, 5, 10), storage);
    recordReadingDay(new Date(2026, 5, 11), storage);
    recordReadingDay(today, storage);
    expect(getReadingStreak(today, storage)).toBe(3);
  });

  it('keeps the streak alive if today is not yet read', () => {
    const today = new Date(2026, 5, 12);
    recordReadingDay(new Date(2026, 5, 10), storage);
    recordReadingDay(new Date(2026, 5, 11), storage);
    expect(getReadingStreak(today, storage)).toBe(2);
  });

  it('returns zero without recent reading', () => {
    const today = new Date(2026, 5, 12);
    recordReadingDay(new Date(2026, 5, 1), storage);
    expect(getReadingStreak(today, storage)).toBe(0);
  });
});
