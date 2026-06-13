import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export type PrayerCategory = 'gratitude' | 'demande' | 'confession' | 'intercession' | 'meditation' | 'autre';
export type PrayerStatus = 'active' | 'answered' | 'archived';

export interface PrayerEntry {
  id: string;
  title: string;
  content: string;
  category: PrayerCategory;
  status: PrayerStatus;
  dateAdded: number;
  dateModified: number;
  verseRef?: string; // référence libre, ex. "Jean 3:16"
  prayedCount?: number; // nombre de fois où l'utilisateur a marqué "j'ai prié"
  lastPrayedAt?: number; // dernier horodatage "j'ai prié"
  answeredAt?: number; // date d'exaucement (quand status devient "answered")
}

export const PRAYER_CATEGORIES: PrayerCategory[] = ['gratitude', 'demande', 'confession', 'intercession', 'meditation', 'autre'];
export const PRAYER_STATUSES: PrayerStatus[] = ['active', 'answered', 'archived'];

interface PrayerState {
  prayers: PrayerEntry[];
  addPrayer: (entry: Omit<PrayerEntry, 'id' | 'status' | 'dateAdded' | 'dateModified'>) => string;
  updatePrayer: (id: string, patch: Partial<Pick<PrayerEntry, 'title' | 'content' | 'category' | 'verseRef'>>) => void;
  setPrayerStatus: (id: string, status: PrayerStatus) => void;
  markPrayed: (id: string) => void;
  removePrayer: (id: string) => void;
  loadPrayers: (prayers: PrayerEntry[]) => void;
}

const isPrayerEntry = (value: unknown): value is PrayerEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as PrayerEntry;
  return (
    typeof entry.id === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.content === 'string' &&
    PRAYER_CATEGORIES.includes(entry.category) &&
    PRAYER_STATUSES.includes(entry.status) &&
    typeof entry.dateAdded === 'number' &&
    typeof entry.dateModified === 'number' &&
    (entry.prayedCount === undefined || typeof entry.prayedCount === 'number') &&
    (entry.lastPrayedAt === undefined || typeof entry.lastPrayedAt === 'number') &&
    (entry.answeredAt === undefined || typeof entry.answeredAt === 'number')
  );
};

const sanitizePrayers = (value: unknown): PrayerEntry[] =>
  Array.isArray(value) ? value.filter(isPrayerEntry) : [];

export { sanitizePrayers };

const getInitialPrayers = (): PrayerEntry[] => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.prayers);
    if (stored) return sanitizePrayers(JSON.parse(stored));
  } catch (e) {
    console.error('Failed to read prayers from localStorage', e);
  }
  return [];
};

const persistPrayers = (prayers: PrayerEntry[]) => {
  localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify(prayers));

  const token = useAuthStore.getState().token;
  const synced = useSettingsStore.getState().synced;
  if (token && synced) {
    syncFileToDrive(DRIVE_FILES.prayers, prayers, token).catch(console.error);
  }
};

export const usePrayerStore = create<PrayerState>((set) => ({
  prayers: getInitialPrayers(),
  addPrayer: (entry) => {
    const now = Date.now();
    const id = `prayer-${now}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => {
      const newEntry: PrayerEntry = {
        ...entry,
        id,
        status: 'active',
        dateAdded: now,
        dateModified: now,
      };
      const prayers = [newEntry, ...state.prayers];
      persistPrayers(prayers);
      return { prayers };
    });
    return id;
  },
  updatePrayer: (id, patch) =>
    set((state) => {
      const prayers = state.prayers.map((entry) =>
        entry.id === id ? { ...entry, ...patch, dateModified: Date.now() } : entry
      );
      persistPrayers(prayers);
      return { prayers };
    }),
  setPrayerStatus: (id, status) =>
    set((state) => {
      const now = Date.now();
      const prayers = state.prayers.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status,
              dateModified: now,
              ...(status === 'answered' ? { answeredAt: entry.answeredAt ?? now } : {}),
            }
          : entry
      );
      persistPrayers(prayers);
      return { prayers };
    }),
  markPrayed: (id) =>
    set((state) => {
      const now = Date.now();
      const prayers = state.prayers.map((entry) =>
        entry.id === id
          ? { ...entry, prayedCount: (entry.prayedCount ?? 0) + 1, lastPrayedAt: now, dateModified: now }
          : entry
      );
      persistPrayers(prayers);
      return { prayers };
    }),
  removePrayer: (id) =>
    set((state) => {
      const prayers = state.prayers.filter((entry) => entry.id !== id);
      persistPrayers(prayers);
      return { prayers };
    }),
  loadPrayers: (prayers) => {
    const sanitized = sanitizePrayers(prayers);
    localStorage.setItem(OMED_STORAGE_KEYS.prayers, JSON.stringify(sanitized));
    set({ prayers: sanitized });
  },
}));
