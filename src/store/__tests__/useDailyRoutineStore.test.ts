import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { formatDayKey } from '../../utils/readingActivity';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const today = formatDayKey(new Date());

describe('useDailyRoutineStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { useDailyRoutineStore } = await import('../useDailyRoutineStore');
    return useDailyRoutineStore;
  };

  it('loads an empty routine from empty storage', async () => {
    const store = await setupStore();
    expect(store.getState().days).toEqual([]);
    expect(store.getState().streak()).toBe(0);
  });

  it('recovers from invalid JSON in localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.dailyRoutine, 'not-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = await setupStore();
    expect(store.getState().days).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('filters malformed entries and duplicate dates on load', async () => {
    localStorage.setItem(
      OMED_STORAGE_KEYS.dailyRoutine,
      JSON.stringify([
        { date: '2026-06-10', completedAt: 1 },
        { date: 'bad-date' },
        { date: '2026-06-10', completedAt: 2 },
        { notADate: true },
        { date: '2026-06-09', note: 5 },
      ])
    );
    const store = await setupStore();
    const days = store.getState().days;
    expect(days).toHaveLength(1);
    expect(days[0].date).toBe('2026-06-10');
  });

  it('completes today and persists it', async () => {
    const store = await setupStore();
    store.getState().completeDay(today, { verseRef: 'Jean 3:16', prayerPromptId: 'prayer-paix' });

    const day = store.getState().getDay(today);
    expect(day?.completedAt).toEqual(expect.any(Number));
    expect(day?.verseRef).toBe('Jean 3:16');
    expect(store.getState().isCompleted(today)).toBe(true);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.dailyRoutine)!)[0].date).toBe(today);
  });

  it('counts a streak of 1 after completing today', async () => {
    const store = await setupStore();
    store.getState().completeDay(today);
    expect(store.getState().streak()).toBe(1);
  });

  it('stores a quick note without marking completion', async () => {
    const store = await setupStore();
    store.getState().setNote(today, 'Une intention');
    expect(store.getState().getDay(today)?.note).toBe('Une intention');
    expect(store.getState().isCompleted(today)).toBe(false);
  });

  it('merges note and completion for the same day', async () => {
    const store = await setupStore();
    store.getState().setNote(today, 'Note du matin');
    store.getState().completeDay(today, { readingReference: 'Psaume 23' });
    const day = store.getState().getDay(today);
    expect(day?.note).toBe('Note du matin');
    expect(day?.readingReference).toBe('Psaume 23');
    expect(store.getState().days).toHaveLength(1);
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().completeDay(today);
    expect(localStorage.getItem('other_key')).toBe('val');
  });
});
