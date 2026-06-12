import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Vérifie que l'initialisation des stores ne crashe pas quand l'accès à
// localStorage lève une exception (mode privé, stockage désactivé…).

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: {
    favorites: 'favorites.json',
    highlights: 'highlights.json',
    notes: 'notes.json',
    plans: 'plans.json',
    settings: 'settings.json',
    position: 'position.json',
    prayers: 'prayers.json',
  },
}));

const throwingStorage = {
  getItem: vi.fn(() => {
    throw new DOMException('Access denied', 'SecurityError');
  }),
  setItem: vi.fn(() => {
    throw new DOMException('Access denied', 'SecurityError');
  }),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
} as unknown as Storage;

describe('store resilience when localStorage is unavailable', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', { value: throwingStorage, configurable: true });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('settings store falls back to defaults', async () => {
    const { useSettingsStore } = await import('../useSettingsStore');
    expect(useSettingsStore.getState().settings.defaultTranslation).toBe('lsg');
    expect(useSettingsStore.getState().synced).toBe(false);
  });

  it('bible position store falls back to defaults', async () => {
    const { useBibleStore } = await import('../useBibleStore');
    const state = useBibleStore.getState();
    expect(state.translation).toBe('lsg');
    expect(state.bookId).toBe('jean');
    expect(state.chapter).toBe(3);
  });

  it('collection stores fall back to empty', async () => {
    const { useFavoritesStore } = await import('../useFavoritesStore');
    const { useNotesStore } = await import('../useNotesStore');
    const { useHighlightsStore } = await import('../useHighlightsStore');
    const { usePlansStore } = await import('../usePlansStore');
    const { usePrayerStore } = await import('../usePrayerStore');

    expect(useFavoritesStore.getState().favorites).toEqual([]);
    expect(useNotesStore.getState().notes).toEqual([]);
    expect(useHighlightsStore.getState().highlights).toEqual({});
    expect(usePlansStore.getState().progress).toEqual({});
    expect(usePrayerStore.getState().prayers).toEqual([]);
  });
});
