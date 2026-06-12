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
  addNote: (note: Omit<Note, 'id' | 'dateAdded' | 'dateModified'>) => void;
  updateNote: (id: string, text: string, tags?: string[]) => void;
  removeNote: (id: string) => void;
  loadNotes: (notes: Note[]) => void;
}

const getInitialNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.notes);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read notes from localStorage', e);
  }
  return [];
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: getInitialNotes(),
  addNote: (noteData) =>
    set((state) => {
      const now = Date.now();
      const newNote: Note = {
        ...noteData,
        id: `note-${now}`,
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
    }),
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
    localStorage.setItem(OMED_STORAGE_KEYS.notes, JSON.stringify(notes));
    set({ notes });
  },
}));
