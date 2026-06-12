import { cacheChapter, clearChapterCache, getCachedChapterEntry, pinCachedChapter, readCacheEntries, removeCachedChapter } from './chapterCache';
import type { CachedChapterEntry } from './chapterCache';
import { getChapter } from './bibleApi';
import type { Verse } from './bibleApi';

export type OfflineChapterMeta = Pick<CachedChapterEntry, 'translation' | 'bookId' | 'chapter' | 'savedAt' | 'source' | 'verseCount' | 'sizeApprox' | 'pinned' | 'updatedAt'>;

export interface OfflineLibrarySummary {
  chapters: OfflineChapterMeta[];
  manualCount: number;
  recentCount: number;
  totalSizeApprox: number;
  lastUpdatedAt: number | null;
}

const toMeta = (entry: CachedChapterEntry): OfflineChapterMeta => ({
  translation: entry.translation,
  bookId: entry.bookId,
  chapter: entry.chapter,
  savedAt: entry.savedAt,
  source: entry.source,
  verseCount: entry.verseCount,
  sizeApprox: entry.sizeApprox,
  pinned: entry.pinned,
  updatedAt: entry.updatedAt,
});

export const getOfflineLibrarySummary = (storage: Storage = localStorage): OfflineLibrarySummary => {
  const chapters = readCacheEntries(storage).map(toMeta).sort((a, b) => b.updatedAt - a.updatedAt);
  return {
    chapters,
    manualCount: chapters.filter((chapter) => chapter.pinned).length,
    recentCount: chapters.filter((chapter) => !chapter.pinned).length,
    totalSizeApprox: chapters.reduce((sum, chapter) => sum + (chapter.sizeApprox ?? 0), 0),
    lastUpdatedAt: chapters.length ? Math.max(...chapters.map((chapter) => chapter.updatedAt)) : null,
  };
};

export const isChapterAvailableOffline = (translation: string, bookId: string, chapter: number, storage: Storage = localStorage): boolean =>
  Boolean(getCachedChapterEntry(translation, bookId, chapter, storage));

export const saveChapterForOffline = async (
  translation: string,
  bookId: string,
  chapter: number,
  options: { verses?: Verse[]; storage?: Storage } = {}
): Promise<OfflineChapterMeta> => {
  const storage = options.storage ?? localStorage;
  const verses = options.verses ?? getCachedChapterEntry(translation, bookId, chapter, storage)?.verses ?? await getChapter(translation, bookId, chapter);
  const ok = cacheChapter(translation, bookId, chapter, verses, { pinned: true, source: 'manual', storage });
  if (!ok) throw new Error('Impossible de sauvegarder ce chapitre hors ligne. Le stockage local est peut-être plein.');
  const entry = getCachedChapterEntry(translation, bookId, chapter, storage);
  if (!entry || !pinCachedChapter(translation, bookId, chapter, storage)) throw new Error('Le chapitre a été chargé mais pas conservé hors ligne.');
  return toMeta(getCachedChapterEntry(translation, bookId, chapter, storage) ?? entry);
};

export const removeOfflineChapter = (translation: string, bookId: string, chapter: number, storage: Storage = localStorage): boolean =>
  removeCachedChapter(translation, bookId, chapter, storage);

export const cleanRecentChapterCache = (storage: Storage = localStorage): boolean =>
  clearChapterCache({ includePinned: false, storage });

export const clearOfflineLibrary = (storage: Storage = localStorage): boolean =>
  clearChapterCache({ includePinned: true, storage });

export const formatApproxSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};
