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
  loadFavorites: (favorites: unknown) => void;
}

const isFavoriteVerse = (value: unknown): value is FavoriteVerse => {
  if (!value || typeof value !== 'object') return false;
  const verse = value as FavoriteVerse;
  return (
    typeof verse.id === 'string' &&
    typeof verse.translation === 'string' &&
    typeof verse.bookId === 'string' &&
    Number.isInteger(verse.chapter) &&
    verse.chapter > 0 &&
    Number.isInteger(verse.verse) &&
    verse.verse > 0 &&
    typeof verse.text === 'string' &&
    typeof verse.dateAdded === 'number'
  );
};

export const sanitizeFavorites = (value: unknown): FavoriteVerse[] =>
  Array.isArray(value) ? value.filter(isFavoriteVerse) : [];

const getInitialFavorites = (): FavoriteVerse[] => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.favorites);
    if (stored) {
      return sanitizeFavorites(JSON.parse(stored));
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
    const sanitized = sanitizeFavorites(favorites);
    localStorage.setItem(OMED_STORAGE_KEYS.favorites, JSON.stringify(sanitized));
    set({ favorites: sanitized });
  },
}));
