import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { notes: 'notes.json' },
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

describe('useNotesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { useNotesStore } = await import('../useNotesStore');
    return useNotesStore;
  };

  it('loads initial state from empty localStorage', async () => {
    const store = await setupStore();
    expect(store.getState().notes).toEqual([]);
  });

  it('loads initial state from valid localStorage', async () => {
    const mockNotes = [{ id: '1', verseId: 'lsg-jean-3-16', text: 'God loves us', dateUpdated: 123 }];
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(mockNotes));

    const store = await setupStore();
    expect(store.getState().notes).toEqual(mockNotes);
  });

  it('loads initial state from invalid localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.notes, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    expect(store.getState().notes).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('adds a note and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().addNote({ verseId: 'lsg-jean-3-16', text: 'My first note', verseText: 'For God so loved...' });

    const state = store.getState().notes;
    expect(state).toHaveLength(1);
    expect(state[0].verseId).toBe('lsg-jean-3-16');
    expect(state[0].text).toBe('My first note');
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.notes)!)).toEqual(state);
  });

  it('edits an existing note', async () => {
    const mockNotes = [{ id: 'note-1', verseId: 'lsg-jean-3-16', text: 'Old text', dateModified: 100 }];
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(mockNotes));

    const store = await setupStore();
    store.getState().updateNote('note-1', 'New text');

    const state = store.getState().notes;
    expect(state).toHaveLength(1);
    expect(state[0].text).toBe('New text');
    expect(state[0].dateModified).toBeGreaterThan(100);
  });

  it('deletes a note', async () => {
    const mockNotes = [{ id: 'note-1', verseId: 'lsg-jean-3-16', text: 'Text', dateModified: 100 }];
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(mockNotes));

    const store = await setupStore();
    store.getState().removeNote('note-1');

    expect(store.getState().notes).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.notes)!)).toEqual([]);
  });

  it('adds a note with tags and keeps old notes without tags valid', async () => {
    const legacyNote = { id: 'note-old', verseId: 'lsg-jean-1-1', text: 'Sans tags', verseText: '...', dateAdded: 1, dateModified: 1 };
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify([legacyNote]));

    const store = await setupStore();
    store.getState().addNote({ verseId: 'lsg-jean-3-16', text: 'Avec tags', verseText: '...', tags: ['grâce', 'salut'] });

    const state = store.getState().notes;
    expect(state).toHaveLength(2);
    expect(state[0].tags).toBeUndefined();
    expect(state[1].tags).toEqual(['grâce', 'salut']);
  });

  it('updates tags through updateNote', async () => {
    const mockNotes = [{ id: 'note-1', verseId: 'lsg-jean-3-16', text: 'Texte', verseText: '...', dateAdded: 100, dateModified: 100, tags: ['ancien'] }];
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(mockNotes));

    const store = await setupStore();
    store.getState().updateNote('note-1', 'Texte', ['nouveau']);
    expect(store.getState().notes[0].tags).toEqual(['nouveau']);

    // Sans argument tags, les tags existants sont conservés.
    store.getState().updateNote('note-1', 'Texte révisé');
    expect(store.getState().notes[0].tags).toEqual(['nouveau']);
    expect(store.getState().notes[0].text).toBe('Texte révisé');
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().addNote({ verseId: 'lsg-jean-3-16', text: 'Test', verseText: 'For God so loved...' });
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('calls syncFileToDrive if user is authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    store.getState().addNote({ verseId: 'lsg-jean-3-16', text: 'Test', verseText: 'For God so loved...' });

    expect(syncFileToDrive).toHaveBeenCalledWith('notes.json', expect.any(Array), 'fake-token');
  });
});
