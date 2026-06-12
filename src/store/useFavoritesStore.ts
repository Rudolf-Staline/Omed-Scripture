import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export interface FavoriteVerse {
  id: string; // e.g., lsg-jean-3-16
  translation: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  dateAdded: number;
}

interface FavoritesState {
  favorites: FavoriteVerse[];
  addFavorite: (verse: FavoriteVerse) => void;
  removeFavorite: (id: string) => void;
  loadFavorites: (favorites: FavoriteVerse[]) => void;
}

const getInitialFavorites = (): FavoriteVerse[] => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.favorites);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read favorites from localStorage', e);
  }
  return [];
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  favorites: getInitialFavorites(),
  addFavorite: (verse) =>
    set((state) => {
      const newFavorites = [...state.favorites, verse];
      localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(newFavorites));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.favorites, newFavorites, token).catch(console.error);
      }
      
      return { favorites: newFavorites };
    }),
  removeFavorite: (id) =>
    set((state) => {
      const newFavorites = state.favorites.filter((f) => f.id !== id);
      localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(newFavorites));
      
      const token = useAuthStore.getState().token;
      const synced = useSettingsStore.getState().synced;
      if (token && synced) {
        syncFileToDrive(DRIVE_FILES.favorites, newFavorites, token).catch(console.error);
      }
      
      return { favorites: newFavorites };
    }),
  loadFavorites: (favorites) => {
    localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(favorites));
    set({ favorites });
  },
}));
