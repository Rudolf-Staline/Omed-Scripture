import { describe, expect, it, beforeEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { addSearchHistoryEntry, clearSearchHistory, getSearchHistory } from '../searchHistory';

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

describe('searchHistory', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it('starts empty', () => {
    expect(getSearchHistory(storage)).toEqual([]);
  });

  it('adds entries most recent first', () => {
    addSearchHistoryEntry('amour', storage);
    addSearchHistoryEntry('pardon', storage);
    expect(getSearchHistory(storage)).toEqual(['pardon', 'amour']);
  });

  it('deduplicates entries case-insensitively', () => {
    addSearchHistoryEntry('amour', storage);
    addSearchHistoryEntry('pardon', storage);
    addSearchHistoryEntry('AMOUR', storage);
    expect(getSearchHistory(storage)).toEqual(['AMOUR', 'pardon']);
  });

  it('ignores empty queries', () => {
    addSearchHistoryEntry('   ', storage);
    expect(getSearchHistory(storage)).toEqual([]);
  });

  it('caps history length', () => {
    for (let i = 0; i < 12; i += 1) {
      addSearchHistoryEntry(`requête ${i}`, storage);
    }
    expect(getSearchHistory(storage)).toHaveLength(8);
    expect(getSearchHistory(storage)[0]).toBe('requête 11');
  });

  it('recovers from invalid stored data', () => {
    storage.setItem(OMED_STORAGE_KEYS.searchHistory, 'broken');
    expect(getSearchHistory(storage)).toEqual([]);

    storage.setItem(OMED_STORAGE_KEYS.searchHistory, JSON.stringify(['ok', 3, '']));
    expect(getSearchHistory(storage)).toEqual(['ok']);
  });

  it('clears history', () => {
    addSearchHistoryEntry('amour', storage);
    clearSearchHistory(storage);
    expect(getSearchHistory(storage)).toEqual([]);
  });
});
