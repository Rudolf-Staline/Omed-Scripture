import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import { DRIVE_FILES, syncFileToDrive } from '../utils/driveSync';
import { scheduleMemoryReview } from '../utils/memory';
import type { MemoryReviewGrade, MemoryVerse, MemoryVerseInput } from '../types/memory';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

const MAX_MEMORY_VERSES = 300;
const STATUS_VALUES: MemoryVerse['status'][] = ['learning', 'reviewing', 'mastered'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIsoString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

export const sanitizeMemoryVerses = (value: unknown): MemoryVerse[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((entry): MemoryVerse[] => {
    if (!isRecord(entry)) return [];
    if (
      typeof entry.id !== 'string' ||
      typeof entry.verseId !== 'string' ||
      typeof entry.translation !== 'string' ||
      typeof entry.bookId !== 'string' ||
      !isPositiveInteger(entry.chapter) ||
      !isPositiveInteger(entry.verse) ||
      typeof entry.text !== 'string' ||
      typeof entry.reference !== 'string' ||
      seen.has(entry.id)
    ) return [];

    seen.add(entry.id);
    const now = new Date().toISOString();
    const status = STATUS_VALUES.includes(entry.status as MemoryVerse['status']) ? entry.status as MemoryVerse['status'] : 'learning';

    return [{
      id: entry.id,
      verseId: entry.verseId,
      translation: entry.translation,
      bookId: entry.bookId,
      chapter: entry.chapter,
      verse: entry.verse,
      text: entry.text.slice(0, 1200),
      reference: entry.reference.slice(0, 120),
      addedAt: isIsoString(entry.addedAt) ? entry.addedAt : now,
      updatedAt: isIsoString(entry.updatedAt) ? entry.updatedAt : now,
      dueAt: isIsoString(entry.dueAt) ? entry.dueAt : now,
      intervalDays: typeof entry.intervalDays === 'number' && entry.intervalDays >= 0 ? entry.intervalDays : 0,
      easeFactor: typeof entry.easeFactor === 'number' && entry.easeFactor >= 1.3 ? entry.easeFactor : 2.5,
      reviewCount: typeof entry.reviewCount === 'number' && entry.reviewCount >= 0 ? Math.floor(entry.reviewCount) : 0,
      lapses: typeof entry.lapses === 'number' && entry.lapses >= 0 ? Math.floor(entry.lapses) : 0,
      status,
      ...(isIsoString(entry.lastReviewedAt) ? { lastReviewedAt: entry.lastReviewedAt } : {}),
    }];
  }).slice(0, MAX_MEMORY_VERSES);
};

const getStorage = (): Storage | undefined => typeof localStorage === 'undefined' ? undefined : localStorage;

const readInitial = (storage: Storage | undefined = getStorage()): MemoryVerse[] => {
  if (!storage) return [];
  try {
    const stored = storage.getItem(OMED_STORAGE_KEYS.memory);
    return stored ? sanitizeMemoryVerses(JSON.parse(stored)) : [];
  } catch (error) {
    console.error('Failed to read memory verses', error);
    return [];
  }
};

const persist = (items: MemoryVerse[], storage: Storage | undefined = getStorage()) => {
  if (!storage) return;
  try {
    storage.setItem(OMED_STORAGE_KEYS.memory, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to persist memory verses', error);
  }
};

const syncIfEnabled = (items: MemoryVerse[]) => {
  const token = useAuthStore.getState().token;
  const synced = useSettingsStore.getState().synced;
  if (token && synced) syncFileToDrive(DRIVE_FILES.memory, items, token).catch(console.error);
};

const makeId = (verseId: string) => `memory_${verseId}_${Date.now()}`;

interface MemoryState {
  memoryVerses: MemoryVerse[];
  addMemoryVerse: (input: MemoryVerseInput) => string;
  removeMemoryVerse: (id: string) => void;
  reviewMemoryVerse: (id: string, grade: MemoryReviewGrade) => void;
  loadMemoryVerses: (value: unknown) => void;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memoryVerses: readInitial(),
  addMemoryVerse: (input) => {
    const existing = get().memoryVerses.find((item) => item.verseId === input.verseId && item.translation === input.translation);
    if (existing) return existing.id;

    const now = new Date().toISOString();
    const id = makeId(input.verseId);
    const item: MemoryVerse = {
      id,
      verseId: input.verseId,
      translation: input.translation,
      bookId: input.bookId,
      chapter: input.chapter,
      verse: input.verse,
      text: input.text,
      reference: input.reference,
      addedAt: now,
      updatedAt: now,
      dueAt: now,
      intervalDays: 0,
      easeFactor: 2.5,
      reviewCount: 0,
      lapses: 0,
      status: 'learning',
    };

    set((state) => {
      const next = sanitizeMemoryVerses([item, ...state.memoryVerses]);
      persist(next);
      syncIfEnabled(next);
      return { memoryVerses: next };
    });
    return id;
  },
  removeMemoryVerse: (id) => set((state) => {
    const next = state.memoryVerses.filter((item) => item.id !== id);
    persist(next);
    syncIfEnabled(next);
    return { memoryVerses: next };
  }),
  reviewMemoryVerse: (id, grade) => set((state) => {
    const next = state.memoryVerses.map((item) => item.id === id ? scheduleMemoryReview(item, grade) : item);
    persist(next);
    syncIfEnabled(next);
    return { memoryVerses: next };
  }),
  loadMemoryVerses: (value) => {
    const next = sanitizeMemoryVerses(value);
    persist(next);
    set({ memoryVerses: next });
  },
}));
