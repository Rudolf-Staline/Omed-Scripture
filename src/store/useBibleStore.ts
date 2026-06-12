import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { FEATURED_TRANSLATIONS } from '../data/translations';

export interface BibleState {
  translation: string;
  bookId: string;
  chapter: number;
  compareTranslation: string | null;
  setPosition: (translation: string, bookId: string, chapter: number) => void;
  setCompareTranslation: (translation: string | null) => void;
}

const FALLBACK_POSITION = { translation: 'lsg', bookId: 'jean', chapter: 3 };

const normalizePosition = (position: unknown) => {
  if (!position || typeof position !== 'object') return FALLBACK_POSITION;

  const candidate = position as Partial<Pick<BibleState, 'translation' | 'bookId' | 'chapter'>>;
  const translation = FEATURED_TRANSLATIONS.some((item) => item.id === candidate.translation)
    ? candidate.translation!
    : FALLBACK_POSITION.translation;
  const book = BIBLE_BOOKS.find((item) => item.id === candidate.bookId)
    ?? BIBLE_BOOKS.find((item) => item.id === FALLBACK_POSITION.bookId)
    ?? BIBLE_BOOKS[0];
  const parsedChapter = Number.parseInt(String(candidate.chapter ?? FALLBACK_POSITION.chapter), 10);
  const chapter = Number.isFinite(parsedChapter) ? Math.min(Math.max(parsedChapter, 1), book.chapters) : FALLBACK_POSITION.chapter;

  return { translation, bookId: book.id, chapter };
};

const getInitialPosition = () => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.biblePosition);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.translation && parsed.bookId && parsed.chapter) {
        return normalizePosition(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to read position from localStorage', e);
  }
  return FALLBACK_POSITION;
};

export const useBibleStore = create<BibleState>((set) => ({
  ...getInitialPosition(),
  compareTranslation: null,
  setPosition: (translation, bookId, chapter) => set((state) => {
     const normalized = normalizePosition({ translation, bookId, chapter });
     const newState = { ...normalized, compareTranslation: state.compareTranslation };
     localStorage.setItem(OMED_STORAGE_KEYS.biblePosition, JSON.stringify(newState));
     
     const token = useAuthStore.getState().token;
     const synced = useSettingsStore.getState().synced;
     if (token && synced) {
        syncFileToDrive(DRIVE_FILES.position, newState, token).catch(console.error);
     }
     
     return newState;
  }),
  setCompareTranslation: (compareTranslation) => set({ compareTranslation }),
}));
