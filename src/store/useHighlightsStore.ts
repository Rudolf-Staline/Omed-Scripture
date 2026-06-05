import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export interface Highlight {
  id: string; // translation-book-chapter-verse
  color: HighlightColor;
  dateAdded: number;
}

interface HighlightsState {
  highlights: Record<string, Highlight>;
  addHighlight: (id: string, color: HighlightColor) => void;
  removeHighlight: (id: string) => void;
  loadHighlights: (highlights: Record<string, Highlight>) => void;
}

const getInitialHighlights = (): Record<string, Highlight> => {
  const stored = localStorage.getItem(OMED_STORAGE_KEYS.highlights);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse highlights from localStorage', e);
    }
  }
  return {};
};

export const useHighlightsStore = create<HighlightsState>((set) => ({
  highlights: getInitialHighlights(),
  addHighlight: (id, color) =>
    set((state) => {
      const newHighlights = { ...state.highlights, [id]: { id, color, dateAdded: Date.now() } };
      localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(newHighlights));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.highlights, newHighlights, token).catch(console.error);
      }
      
      return { highlights: newHighlights };
    }),
  removeHighlight: (id) =>
    set((state) => {
      const newHighlights = { ...state.highlights };
      delete newHighlights[id];
      localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(newHighlights));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.highlights, newHighlights, token).catch(console.error);
      }
      
      return { highlights: newHighlights };
    }),
  loadHighlights: (highlights) => {
    localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(highlights));
    set({ highlights });
  },
}));
