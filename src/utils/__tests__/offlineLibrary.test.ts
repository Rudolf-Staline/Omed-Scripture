import { beforeEach, describe, expect, it } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { cacheChapter, getCachedChapterEntry, parseCache } from '../chapterCache';
import { cleanRecentChapterCache, clearOfflineLibrary, getOfflineLibrarySummary, removeOfflineChapter, saveChapterForOffline } from '../offlineLibrary';
import type { Verse } from '../bibleApi';

const createStorage = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    key: () => null,
    get length() { return Object.keys(store).length; },
  } as Storage;
};

const verses: Verse[] = [{ book_id: 'JHN', book_name: 'Jean', chapter: 3, verse: 16, text: 'Car Dieu a tant aimé le monde.' }];

describe('offline library chapter cache', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it('caches recent chapters without touching unrelated localStorage keys', () => {
    storage.setItem('other_key', 'keep');
    cacheChapter('lsg', 'JHN', 3, verses, { storage });
    expect(getCachedChapterEntry('lsg', 'JHN', 3, storage)?.verses[0].text).toContain('Dieu');
    expect(storage.getItem('other_key')).toBe('keep');
  });

  it('saves a chapter as manually pinned offline content', async () => {
    await saveChapterForOffline('lsg', 'JHN', 3, { verses, storage });
    const summary = getOfflineLibrarySummary(storage);
    expect(summary.manualCount).toBe(1);
    expect(summary.chapters[0]).toMatchObject({ translation: 'lsg', bookId: 'JHN', chapter: 3, pinned: true, verseCount: 1 });
  });

  it('removes a saved chapter and can clear the library', async () => {
    await saveChapterForOffline('lsg', 'JHN', 3, { verses, storage });
    expect(removeOfflineChapter('lsg', 'JHN', 3, storage)).toBe(true);
    expect(getOfflineLibrarySummary(storage).chapters).toEqual([]);
    await saveChapterForOffline('lsg', 'JHN', 3, { verses, storage });
    clearOfflineLibrary(storage);
    expect(getOfflineLibrarySummary(storage).chapters).toEqual([]);
  });

  it('recovers from invalid stored cache data', () => {
    storage.setItem(OMED_STORAGE_KEYS.chapterCache, 'not-json');
    expect(getOfflineLibrarySummary(storage).chapters).toEqual([]);
    expect(parseCache(JSON.stringify([{ key: 'bad', verses: 'nope' }]))).toEqual([]);
  });

  it('cleans only recent chapters by default', async () => {
    cacheChapter('lsg', 'GEN', 1, verses, { storage });
    await saveChapterForOffline('lsg', 'JHN', 3, { verses, storage });
    cleanRecentChapterCache(storage);
    const summary = getOfflineLibrarySummary(storage);
    expect(summary.chapters).toHaveLength(1);
    expect(summary.chapters[0].bookId).toBe('JHN');
  });
});
