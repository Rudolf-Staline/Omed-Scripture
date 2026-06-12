import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { position: 'position.json' },
}));

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

describe('useBibleStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { useBibleStore } = await import('../useBibleStore');
    return useBibleStore;
  };

  it('loads initial state from empty localStorage (uses fallback lsg jean 3)', async () => {
    const store = await setupStore();
    const state = store.getState();
    expect(state.translation).toBe('lsg');
    expect(state.bookId).toBe('jean');
    expect(state.chapter).toBe(3);
    expect(state.compareTranslation).toBeNull();
  });

  it('loads initial state from valid localStorage', async () => {
    const mockPos = { translation: 'darby', bookId: 'matthieu', chapter: 1 };
    localStorage.setItem(OMED_STORAGE_KEYS.biblePosition, JSON.stringify(mockPos));

    const store = await setupStore();
    const state = store.getState();
    expect(state.translation).toBe('darby');
    expect(state.bookId).toBe('matthieu');
    expect(state.chapter).toBe(1);
  });

  it('loads fallback state if localStorage is invalid JSON', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.biblePosition, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    const state = store.getState();
    expect(state.translation).toBe('lsg');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('loads fallback state if localStorage has incomplete position', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.biblePosition, JSON.stringify({ translation: 'lsg' }));

    const store = await setupStore();
    const state = store.getState();
    expect(state.translation).toBe('lsg');
    expect(state.bookId).toBe('jean');
    expect(state.chapter).toBe(3);
  });

  it('sets position and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().setPosition('kjv', 'romains', 8);

    const state = store.getState();
    expect(state.translation).toBe('kjv');
    expect(state.bookId).toBe('romains');
    expect(state.chapter).toBe(8);

    const stored = JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.biblePosition)!);
    expect(stored.translation).toBe('kjv');
    expect(stored.bookId).toBe('romains');
    expect(stored.chapter).toBe(8);
  });

  it('normalizes unsupported stored position values', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.biblePosition, JSON.stringify({ translation: 'bad', bookId: 'jean', chapter: 999 }));

    const store = await setupStore();
    const state = store.getState();
    expect(state.translation).toBe('lsg');
    expect(state.bookId).toBe('jean');
    expect(state.chapter).toBe(21);
  });

  it('normalizes invalid setPosition values before persisting', async () => {
    const store = await setupStore();
    store.getState().setPosition('bad', 'unknown', -4);

    const state = store.getState();
    expect(state.translation).toBe('lsg');
    expect(state.bookId).toBe('jean');
    expect(state.chapter).toBe(1);

    const stored = JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.biblePosition)!);
    expect(stored.translation).toBe('lsg');
    expect(stored.bookId).toBe('jean');
    expect(stored.chapter).toBe(1);
  });

  it('sets compare translation', async () => {
    const store = await setupStore();
    store.getState().setCompareTranslation('darby');

    expect(store.getState().compareTranslation).toBe('darby');
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().setPosition('lsg', 'marc', 2);
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('calls syncFileToDrive if user is authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    store.getState().setPosition('lsg', 'luc', 1);

    expect(syncFileToDrive).toHaveBeenCalledWith('position.json', expect.any(Object), 'fake-token');
  });
});
