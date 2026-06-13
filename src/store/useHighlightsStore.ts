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
  loadHighlights: (highlights: unknown) => void;
}

const HIGHLIGHT_COLORS: HighlightColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];

const isHighlight = (value: unknown): value is Highlight => {
  if (!value || typeof value !== 'object') return false;
  const highlight = value as Highlight;
  return (
    typeof highlight.id === 'string' &&
    HIGHLIGHT_COLORS.includes(highlight.color) &&
    typeof highlight.dateAdded === 'number'
  );
};

export const sanitizeHighlights = (value: unknown): Record<string, Highlight> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.entries(value as Record<string, unknown>).reduce<Record<string, Highlight>>((acc, [key, highlight]) => {
    if (isHighlight(highlight)) acc[key] = highlight;
    return acc;
  }, {});
};

const getInitialHighlights = (): Record<string, Highlight> => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.highlights);
    if (stored) {
      return sanitizeHighlights(JSON.parse(stored));
    }
  } catch (e) {
    console.error('Failed to read highlights from localStorage', e);
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
    const sanitized = sanitizeHighlights(highlights);
    localStorage.setItem(OMED_STORAGE_KEYS.highlights, JSON.stringify(sanitized));
    set({ highlights: sanitized });
  },
}));
