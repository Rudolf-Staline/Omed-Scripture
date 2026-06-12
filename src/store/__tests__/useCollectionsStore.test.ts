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
import { sanitizeCollections, useCollectionsStore } from '../useCollectionsStore';

describe('useCollectionsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useCollectionsStore.setState({ collections: [] });
  });

  it('validates malformed stored collections', () => {
    expect(sanitizeCollections([{ id: 'x', title: 'Paix', items: [{ id: 'i', type: 'favorite', refId: 'fav-1', label: 'Jean 14', createdAt: 'bad' }] }, { id: 'bad' }])).toHaveLength(1);
    expect(sanitizeCollections('nope')).toEqual([]);
  });

  it('creates, updates and deletes a collection without clearing other storage', () => {
    localStorage.setItem('unrelated', 'keep');
    const id = useCollectionsStore.getState().createCollection({ title: 'Courage' });
    useCollectionsStore.getState().updateCollection(id, { description: 'Versets à mémoriser' });
    expect(useCollectionsStore.getState().collections[0].description).toBe('Versets à mémoriser');
    expect(localStorage.getItem(OMED_STORAGE_KEYS.collections)).toContain('Courage');
    useCollectionsStore.getState().deleteCollection(id);
    expect(useCollectionsStore.getState().collections).toHaveLength(0);
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('deduplicates item references in a collection', () => {
    const id = useCollectionsStore.getState().createCollection({ title: 'Jean' });
    useCollectionsStore.getState().addItem(id, { type: 'favorite', refId: 'fav-1', label: 'Jean 3:16' });
    useCollectionsStore.getState().addItem(id, { type: 'favorite', refId: 'fav-1', label: 'Jean 3:16' });
    expect(useCollectionsStore.getState().collections[0].items).toHaveLength(1);
  });
});
