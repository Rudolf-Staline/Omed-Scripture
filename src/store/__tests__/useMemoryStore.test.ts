import { beforeEach, describe, expect, it } from 'vitest';

const memoryStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  } as Storage;
})();
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true });

import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { sanitizeMemoryVerses, useMemoryStore } from '../useMemoryStore';

describe('useMemoryStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useMemoryStore.setState({ memoryVerses: [] });
  });

  it('validates malformed memory entries', () => {
    expect(sanitizeMemoryVerses('bad')).toEqual([]);
    expect(sanitizeMemoryVerses([{ id: 'x' }])).toEqual([]);
    expect(sanitizeMemoryVerses([{
      id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16,
      text: 'Car Dieu a tant aimé le monde...', reference: 'Jean 3:16', addedAt: 'bad', updatedAt: 'bad', dueAt: 'bad', intervalDays: -2, easeFactor: 0, reviewCount: -1, lapses: -1, status: 'unknown'
    }])).toMatchObject([{ id: 'm1', status: 'learning', intervalDays: 0, easeFactor: 2.5, reviewCount: 0, lapses: 0 }]);
  });

  it('adds, deduplicates and removes memory verses without clearing other storage', () => {
    localStorage.setItem('unrelated', 'keep');
    const input = { verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu a tant aimé le monde...', reference: 'Jean 3:16' };
    const id = useMemoryStore.getState().addMemoryVerse(input);
    const duplicateId = useMemoryStore.getState().addMemoryVerse(input);
    expect(duplicateId).toBe(id);
    expect(useMemoryStore.getState().memoryVerses).toHaveLength(1);
    expect(localStorage.getItem(OMED_STORAGE_KEYS.memory)).toContain('Jean 3:16');
    useMemoryStore.getState().removeMemoryVerse(id);
    expect(useMemoryStore.getState().memoryVerses).toEqual([]);
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('records good review outcomes and schedules the next due date', () => {
    const id = useMemoryStore.getState().addMemoryVerse({ verseId: 'lsg-psaumes-23-1', translation: 'lsg', bookId: 'psaumes', chapter: 23, verse: 1, text: "L'Éternel est mon berger", reference: 'Psaumes 23:1' });
    useMemoryStore.getState().reviewMemoryVerse(id, 'good');
    const item = useMemoryStore.getState().memoryVerses[0];
    expect(item.reviewCount).toBe(1);
    expect(item.status).toBe('reviewing');
    expect(Date.parse(item.dueAt)).toBeGreaterThan(Date.now());
    expect(item.reviewHistory).toHaveLength(1);
    expect(item.reviewHistory?.[0].grade).toBe('good');
  });

  it('records again review outcomes without destroying unrelated localStorage data', () => {
    localStorage.setItem('unrelated', 'keep');
    const id = useMemoryStore.getState().addMemoryVerse({ verseId: 'lsg-romains-8-28', translation: 'lsg', bookId: 'romains', chapter: 8, verse: 28, text: 'Toutes choses concourent au bien', reference: 'Romains 8:28' });
    useMemoryStore.getState().reviewMemoryVerse(id, 'again');
    const item = useMemoryStore.getState().memoryVerses[0];
    expect(item.status).toBe('learning');
    expect(item.lapses).toBe(1);
    expect(item.reviewCount).toBe(1);
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('sanitizes review history and keeps old verses compatible', () => {
    const sanitized = sanitizeMemoryVerses([{
      id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16,
      text: 'Car Dieu', reference: 'Jean 3:16', addedAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', dueAt: '2026-01-01T00:00:00.000Z', intervalDays: 0, easeFactor: 2.5, reviewCount: 0, lapses: 0, status: 'learning',
      reviewHistory: [{ reviewedAt: 'bad', grade: 'good' }, { reviewedAt: '2026-01-02T00:00:00.000Z', grade: 'easy' }],
    }]);
    expect(sanitized[0].reviewHistory).toEqual([{ reviewedAt: '2026-01-02T00:00:00.000Z', grade: 'easy' }]);
  });

  it('limits review history length', () => {
    const reviewHistory = Array.from({ length: 60 }, (_, index) => ({ reviewedAt: `2026-01-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`, grade: 'good' as const }));
    const sanitized = sanitizeMemoryVerses([{
      id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16,
      text: 'Car Dieu', reference: 'Jean 3:16', addedAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', dueAt: '2026-01-01T00:00:00.000Z', intervalDays: 0, easeFactor: 2.5, reviewCount: 0, lapses: 0, status: 'learning', reviewHistory,
    }]);
    expect(sanitized[0].reviewHistory).toHaveLength(50);
  });

  it('sanitizes loaded values before persisting them', () => {
    localStorage.setItem('unrelated', 'keep');
    useMemoryStore.getState().loadMemoryVerses([
      { bad: 'data' },
      { id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu', reference: 'Jean 3:16', addedAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', dueAt: '2026-01-01T00:00:00.000Z', intervalDays: 0, easeFactor: 2.5, reviewCount: 0, lapses: 0, status: 'learning' },
    ]);
    expect(useMemoryStore.getState().memoryVerses).toHaveLength(1);
    expect(localStorage.getItem(OMED_STORAGE_KEYS.memory)).toContain('Jean 3:16');
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

});
