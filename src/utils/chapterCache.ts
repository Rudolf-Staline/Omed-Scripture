import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import type { Verse } from './bibleApi';

export interface CachedChapterEntry {
  key: string;
  translation: string;
  bookId: string;
  chapter: number;
  verses: Verse[];
  updatedAt: number;
  savedAt?: number;
  source: 'recent' | 'manual' | 'book';
  verseCount: number;
  sizeApprox?: number;
  pinned: boolean;
}

const STORAGE_KEY = OMED_STORAGE_KEYS.chapterCache;
export const MAX_CACHED_CHAPTERS = 50;
const MAX_CACHE_BYTES = 3_500_000;

export const buildChapterCacheKey = (translation: string, bookId: string, chapter: number): string =>
  `${translation}:${bookId}:${chapter}`;

const isVerse = (value: unknown): value is Verse => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.verse === 'number' && typeof record.text === 'string';
};

const estimateBytes = (value: unknown): number => {
  try {
    return new Blob([JSON.stringify(value)]).size;
  } catch {
    return JSON.stringify(value ?? '').length;
  }
};

const normalizeEntry = (entry: unknown): CachedChapterEntry | null => {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) return null;
  const record = entry as Record<string, unknown>;
  const verses = Array.isArray(record.verses) ? record.verses.filter(isVerse) : [];
  const key = typeof record.key === 'string' ? record.key : '';
  const [keyTranslation, keyBookId, keyChapter] = key.split(':');
  const translation = typeof record.translation === 'string' ? record.translation : keyTranslation;
  const bookId = typeof record.bookId === 'string' ? record.bookId : keyBookId;
  const chapter = typeof record.chapter === 'number' && Number.isInteger(record.chapter) ? record.chapter : Number(keyChapter);
  const updatedAt = typeof record.updatedAt === 'number' ? record.updatedAt : Date.now();
  const savedAt = typeof record.savedAt === 'number' ? record.savedAt : undefined;
  const source = record.source === 'manual' || record.source === 'book' ? record.source : 'recent';
  const pinned = typeof record.pinned === 'boolean' ? record.pinned : source !== 'recent';

  if (!translation || !bookId || !Number.isInteger(chapter) || chapter < 1 || verses.length === 0) return null;

  return {
    key: buildChapterCacheKey(translation, bookId, chapter),
    translation,
    bookId,
    chapter,
    verses,
    updatedAt,
    savedAt,
    source,
    verseCount: typeof record.verseCount === 'number' ? record.verseCount : verses.length,
    sizeApprox: typeof record.sizeApprox === 'number' ? record.sizeApprox : estimateBytes(verses),
    pinned,
  };
};

export const parseCache = (raw: string | null): CachedChapterEntry[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry).filter((entry): entry is CachedChapterEntry => Boolean(entry));
  } catch (error) {
    console.error('Failed to parse chapter cache', error);
    return [];
  }
};

export const readCacheEntries = (storage: Storage = localStorage): CachedChapterEntry[] => {
  if (typeof storage === 'undefined') return [];
  return parseCache(storage.getItem(STORAGE_KEY));
};

const trimEntries = (entries: CachedChapterEntry[]): CachedChapterEntry[] => {
  const unique = new Map<string, CachedChapterEntry>();
  entries.forEach((entry) => unique.set(entry.key, entry));
  const sorted = Array.from(unique.values()).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  const next: CachedChapterEntry[] = [];
  let total = 0;
  for (const entry of sorted) {
    const bytes = entry.sizeApprox ?? estimateBytes(entry.verses);
    const canKeep = next.length < MAX_CACHED_CHAPTERS && (entry.pinned || total + bytes <= MAX_CACHE_BYTES);
    if (!canKeep && !entry.pinned) continue;
    next.push({ ...entry, sizeApprox: bytes });
    total += bytes;
    if (next.length >= MAX_CACHED_CHAPTERS) break;
  }
  return next;
};

export const saveCacheEntries = (entries: CachedChapterEntry[], storage: Storage = localStorage): boolean => {
  if (typeof storage === 'undefined') return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(trimEntries(entries)));
    return true;
  } catch (error) {
    console.error('Failed to save chapter cache', error);
    const reduced = trimEntries(entries).filter((entry) => entry.pinned).slice(0, 25);
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(reduced));
      return true;
    } catch {
      return false;
    }
  }
};

export const getCachedChapterEntry = (
  translation: string,
  bookId: string,
  chapter: number,
  storage: Storage = localStorage
): CachedChapterEntry | null => {
  const key = buildChapterCacheKey(translation, bookId, chapter);
  return readCacheEntries(storage).find((entry) => entry.key === key) ?? null;
};

export const getCachedChapter = (
  translation: string,
  bookId: string,
  chapter: number
): Verse[] | null => getCachedChapterEntry(translation, bookId, chapter)?.verses ?? null;

export const cacheChapter = (
  translation: string,
  bookId: string,
  chapter: number,
  verses: Verse[],
  options: { pinned?: boolean; source?: CachedChapterEntry['source']; storage?: Storage } = {}
): boolean => {
  const storage = options.storage ?? localStorage;
  const key = buildChapterCacheKey(translation, bookId, chapter);
  const existing = readCacheEntries(storage).filter((entry) => entry.key !== key);
  const previous = readCacheEntries(storage).find((entry) => entry.key === key);
  const pinned = options.pinned ?? previous?.pinned ?? false;
  const source = options.source ?? (pinned ? 'manual' : 'recent');

  return saveCacheEntries([
    {
      key,
      translation,
      bookId,
      chapter,
      verses,
      updatedAt: Date.now(),
      savedAt: pinned ? previous?.savedAt ?? Date.now() : previous?.savedAt,
      source,
      verseCount: verses.length,
      sizeApprox: estimateBytes(verses),
      pinned,
    },
    ...existing,
  ], storage);
};

export const pinCachedChapter = (
  translation: string,
  bookId: string,
  chapter: number,
  storage: Storage = localStorage
): boolean => {
  const key = buildChapterCacheKey(translation, bookId, chapter);
  const entries = readCacheEntries(storage);
  const entry = entries.find((item) => item.key === key);
  if (!entry) return false;
  return saveCacheEntries(entries.map((item) => item.key === key ? { ...item, pinned: true, source: 'manual', savedAt: Date.now() } : item), storage);
};

export const removeCachedChapter = (
  translation: string,
  bookId: string,
  chapter: number,
  storage: Storage = localStorage
): boolean => {
  const key = buildChapterCacheKey(translation, bookId, chapter);
  return saveCacheEntries(readCacheEntries(storage).filter((entry) => entry.key !== key), storage);
};

export const clearChapterCache = (options: { includePinned?: boolean; storage?: Storage } = {}): boolean => {
  const storage = options.storage ?? localStorage;
  const entries = options.includePinned ? [] : readCacheEntries(storage).filter((entry) => entry.pinned);
  return saveCacheEntries(entries, storage);
};
