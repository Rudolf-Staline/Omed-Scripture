import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { settings: 'settings.json' },
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

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { useSettingsStore } = await import('../useSettingsStore');
    return useSettingsStore;
  };

  it('loads initial state from empty localStorage (uses defaults)', async () => {
    const store = await setupStore();
    const state = store.getState();
    expect(state.settings.defaultTranslation).toBe('lsg');
    expect(state.settings.theme).toBe('Light');
    expect(state.synced).toBe(false);
  });

  it('loads initial state from valid localStorage', async () => {
    const mockSettings = { defaultTranslation: 'darby', theme: 'Dark' };
    localStorage.setItem(OMED_STORAGE_KEYS.settings, JSON.stringify(mockSettings));
    localStorage.setItem(OMED_STORAGE_KEYS.synced, 'true');

    const store = await setupStore();
    const state = store.getState();
    expect(state.settings.defaultTranslation).toBe('darby');
    expect(state.settings.theme).toBe('Dark');
    expect(state.settings.fontSize).toBe('M'); // fallback to default
    expect(state.synced).toBe(true);
  });

  it('loads fallback state if localStorage is invalid JSON', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.settings, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    const state = store.getState();
    expect(state.settings.defaultTranslation).toBe('lsg');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('updates settings and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().updateSettings({ theme: 'Sepia' });

    const state = store.getState();
    expect(state.settings.theme).toBe('Sepia');

    const stored = JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.settings)!);
    expect(stored.theme).toBe('Sepia');
  });

  it('sets synced and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().setSynced(true);

    expect(store.getState().synced).toBe(true);
    expect(localStorage.getItem(OMED_STORAGE_KEYS.synced)).toBe('true');
  });

  it('loads complete settings', async () => {
    const store = await setupStore();
    const newSettings = {
      defaultTranslation: 'darby',
      fontSize: 'L' as const,
      lineHeight: 'Large' as const,
      fontFamily: 'Inter' as const,
      theme: 'Dark' as const,
      language: 'English' as const,
      readingWidth: 'Wide' as const,
      readingDensity: 'Compact' as const,
      showVerseNumbers: false,
    };

    store.getState().loadSettings(newSettings);
    expect(store.getState().settings).toEqual(newSettings);
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().updateSettings({ theme: 'Dark' });
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('calls syncFileToDrive if user is authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    store.getState().setSynced(true);

    store.getState().updateSettings({ theme: 'Dark' });

    expect(syncFileToDrive).toHaveBeenCalledWith('settings.json', expect.any(Object), 'fake-token');
  });
});
