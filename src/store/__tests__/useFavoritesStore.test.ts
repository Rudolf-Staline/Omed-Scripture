import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { favorites: 'favorites.json' },
}));

// Mock localStorage
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

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Reset the Zustand store state properly
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules(); // Ensure a fresh instance is created with current localStorage
    const { useFavoritesStore } = await import('../useFavoritesStore');
    return useFavoritesStore;
  };

  it('loads initial state from empty localStorage', async () => {
    const store = await setupStore();
    expect(store.getState().favorites).toEqual([]);
  });

  it('loads initial state from valid localStorage', async () => {
    const mockFavorites = [{ id: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu...', dateAdded: 123 }];
    localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(mockFavorites));

    const store = await setupStore();
    expect(store.getState().favorites).toEqual(mockFavorites);
  });

  it('loads initial state from invalid localStorage (JSON error)', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.favorites, '{invalid_json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    expect(store.getState().favorites).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('adds a favorite and writes to localStorage', async () => {
    const store = await setupStore();
    const newFav = { id: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu...', dateAdded: 123 };

    store.getState().addFavorite(newFav);

    expect(store.getState().favorites).toContainEqual(newFav);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.favorites)!)).toContainEqual(newFav);
  });

  it('removes a favorite and updates localStorage', async () => {
    const mockFavorites = [{ id: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu...', dateAdded: 123 }];
    localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(mockFavorites));

    const store = await setupStore();
    store.getState().removeFavorite('lsg-jean-3-16');

    expect(store.getState().favorites).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.favorites)!)).toEqual([]);
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'some_value');
    const store = await setupStore();
    const newFav = { id: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu...', dateAdded: 123 };

    store.getState().addFavorite(newFav);
    expect(localStorage.getItem('other_key')).toBe('some_value');
  });

  it('calls syncFileToDrive if user is authenticated and synced is true', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    const newFav = { id: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu...', dateAdded: 123 };

    store.getState().addFavorite(newFav);

    expect(syncFileToDrive).toHaveBeenCalledWith('favorites.json', [newFav], 'fake-token');
  });
});
