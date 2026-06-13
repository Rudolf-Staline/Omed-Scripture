import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export interface Note {
  id: string; // generated id
  verseId: string; // translation-book-chapter-verse
  text: string;
  verseText: string;
  dateAdded: number;
  dateModified: number;
  tags?: string[]; // optionnel pour rester compatible avec les notes existantes
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'dateAdded' | 'dateModified'>) => string;
  updateNote: (id: string, text: string, tags?: string[]) => void;
  removeNote: (id: string) => void;
  loadNotes: (notes: unknown) => void;
}

const normalizeNote = (value: unknown): Note | null => {
  if (!value || typeof value !== 'object') return null;
  const note = value as Partial<Note> & { dateUpdated?: unknown };
  const legacyDate = typeof note.dateUpdated === 'number' ? note.dateUpdated : undefined;
  const dateModified = typeof note.dateModified === 'number' ? note.dateModified : legacyDate;
  const dateAdded = typeof note.dateAdded === 'number' ? note.dateAdded : dateModified;

  if (
    typeof note.id !== 'string' ||
    typeof note.verseId !== 'string' ||
    typeof note.text !== 'string' ||
    typeof dateAdded !== 'number' ||
    typeof dateModified !== 'number' ||
    (note.tags !== undefined && (!Array.isArray(note.tags) || !note.tags.every((tag) => typeof tag === 'string')))
  ) {
    return null;
  }

  return {
    id: note.id,
    verseId: note.verseId,
    text: note.text,
    verseText: typeof note.verseText === 'string' ? note.verseText : '',
    dateAdded,
    dateModified,
    ...(note.tags ? { tags: note.tags } : {}),
  };
};

export const sanitizeNotes = (value: unknown): Note[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const note = normalizeNote(item);
    return note ? [note] : [];
  });
};

const getInitialNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.notes);
    if (stored) {
      return sanitizeNotes(JSON.parse(stored));
    }
  } catch (e) {
    console.error('Failed to read notes from localStorage', e);
  }
  return [];
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: getInitialNotes(),
  addNote: (noteData) => {
    const now = Date.now();
    const id = `note-${now}`;
    set((state) => {
      const newNote: Note = {
        ...noteData,
        id,
        dateAdded: now,
        dateModified: now,
      };
      const newNotes = [...state.notes, newNote];
      localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    });
    return id;
  },
  updateNote: (id, text, tags) =>
    set((state) => {
      const newNotes = state.notes.map((n) =>
        n.id === id ? { ...n, text, ...(tags !== undefined ? { tags } : {}), dateModified: Date.now() } : n
      );
      localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    }),
  removeNote: (id) =>
    set((state) => {
      const newNotes = state.notes.filter((n) => n.id !== id);
      localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(newNotes));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.notes, newNotes, token).catch(console.error);
      }
      
      return { notes: newNotes };
    }),
  loadNotes: (notes) => {
    const sanitized = sanitizeNotes(notes);
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(sanitized));
    set({ notes: sanitized });
  },
}));
