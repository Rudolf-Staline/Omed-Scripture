import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { prayers: 'prayers.json' },
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

const validPrayer = {
  id: 'prayer-1',
  title: 'Gratitude du matin',
  content: 'Merci pour cette journée.',
  category: 'gratitude',
  status: 'active',
  dateAdded: 100,
  dateModified: 100,
};

describe('usePrayerStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { usePrayerStore } = await import('../usePrayerStore');
    return usePrayerStore;
  };

  it('loads initial state from empty localStorage', async () => {
    const store = await setupStore();
    expect(store.getState().prayers).toEqual([]);
  });

  it('loads initial state from valid localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();
    expect(store.getState().prayers).toEqual([validPrayer]);
  });

  it('recovers from invalid JSON in localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    expect(store.getState().prayers).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('filters out malformed entries on load', async () => {
    localStorage.setItem(
      OMED_STORAGE_KEYS.prayers,
      JSON.stringify([validPrayer, { id: 'x' }, { ...validPrayer, id: 'p2', category: 'inconnu' }])
    );
    const store = await setupStore();
    expect(store.getState().prayers).toEqual([validPrayer]);
  });

  it('creates a prayer entry and persists it', async () => {
    const store = await setupStore();
    store.getState().addPrayer({
      title: 'Pour la famille',
      content: 'Garde-les dans ta paix.',
      category: 'intercession',
      verseRef: 'Philippiens 4:6',
    });

    const prayers = store.getState().prayers;
    expect(prayers).toHaveLength(1);
    expect(prayers[0].title).toBe('Pour la famille');
    expect(prayers[0].status).toBe('active');
    expect(prayers[0].verseRef).toBe('Philippiens 4:6');
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.prayers)!)).toEqual(prayers);
  });

  it('updates an entry and bumps dateModified', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();

    store.getState().updatePrayer('prayer-1', { content: 'Texte révisé.', category: 'meditation' });

    const entry = store.getState().prayers[0];
    expect(entry.content).toBe('Texte révisé.');
    expect(entry.category).toBe('meditation');
    expect(entry.dateModified).toBeGreaterThan(100);
  });

  it('archives and marks entries as answered', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();

    store.getState().setPrayerStatus('prayer-1', 'answered');
    expect(store.getState().prayers[0].status).toBe('answered');

    store.getState().setPrayerStatus('prayer-1', 'archived');
    expect(store.getState().prayers[0].status).toBe('archived');
  });

  it('records an answeredAt timestamp when marked answered', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();

    store.getState().setPrayerStatus('prayer-1', 'answered');
    expect(store.getState().prayers[0].answeredAt).toEqual(expect.any(Number));
  });

  it('increments prayedCount and stores lastPrayedAt on "j\'ai prié"', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();

    store.getState().markPrayed('prayer-1');
    store.getState().markPrayed('prayer-1');

    const entry = store.getState().prayers[0];
    expect(entry.prayedCount).toBe(2);
    expect(entry.lastPrayedAt).toEqual(expect.any(Number));
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.prayers)!)[0].prayedCount).toBe(2);
  });

  it('keeps optional prayed fields through validation on load', async () => {
    localStorage.setItem(
      OMED_STORAGE_KEYS.prayers,
      JSON.stringify([{ ...validPrayer, prayedCount: 3, lastPrayedAt: 200, answeredAt: 300 }])
    );
    const store = await setupStore();
    expect(store.getState().prayers[0].prayedCount).toBe(3);
  });

  it('removes an entry', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify([validPrayer]));
    const store = await setupStore();

    store.getState().removePrayer('prayer-1');
    expect(store.getState().prayers).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.prayers)!)).toEqual([]);
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().addPrayer({ title: 'Test', content: 'Contenu', category: 'autre' });
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('syncs to Drive when authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    store.getState().addPrayer({ title: 'Test', content: 'Contenu', category: 'demande' });

    expect(syncFileToDrive).toHaveBeenCalledWith('prayers.json', expect.any(Array), 'fake-token');
  });
});
