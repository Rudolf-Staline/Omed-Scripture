import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { highlights: 'highlights.json' },
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

describe('useHighlightsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { useHighlightsStore } = await import('../useHighlightsStore');
    return useHighlightsStore;
  };

  it('loads initial state from empty localStorage', async () => {
    const store = await setupStore();
    expect(store.getState().highlights).toEqual({});
  });

  it('loads initial state from valid localStorage', async () => {
    const mockHighlights = { 'lsg-jean-3-16': { id: 'lsg-jean-3-16', color: 'yellow', dateAdded: 123 } };
    localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(mockHighlights));

    const store = await setupStore();
    expect(store.getState().highlights).toEqual(mockHighlights);
  });

  it('loads initial state from invalid localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.highlights, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    expect(store.getState().highlights).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('adds a highlight and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().addHighlight('lsg-jean-3-16', 'blue');

    const state = store.getState().highlights;
    expect(state['lsg-jean-3-16']).toBeDefined();
    expect(state['lsg-jean-3-16'].color).toBe('blue');
    expect(state['lsg-jean-3-16'].id).toBe('lsg-jean-3-16');
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.highlights)!)).toEqual(state);
  });

  it('removes a highlight and updates localStorage', async () => {
    const mockHighlights = { 'lsg-jean-3-16': { id: 'lsg-jean-3-16', color: 'yellow', dateAdded: 123 } };
    localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(mockHighlights));

    const store = await setupStore();
    store.getState().removeHighlight('lsg-jean-3-16');

    expect(store.getState().highlights).toEqual({});
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.highlights)!)).toEqual({});
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().addHighlight('lsg-jean-3-16', 'yellow');
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('calls syncFileToDrive if user is authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    store.getState().addHighlight('lsg-jean-3-16', 'green');

    expect(syncFileToDrive).toHaveBeenCalledWith('highlights.json', expect.any(Object), 'fake-token');
  });
});
