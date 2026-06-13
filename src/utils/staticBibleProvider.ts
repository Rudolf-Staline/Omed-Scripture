import type { Verse } from '../types/bible';
import type { BibleBookFile, BibleCatalog, BibleChapterFile, BibleTranslationIndex, BibleTranslationMeta } from '../types/bibleData';
import { normalizeBookId, validateBookFile, validateCatalog, validateTranslationIndex } from './bibleDataValidation';

export type StaticBibleProviderResult<T> = { ok: true; data: T } | { ok: false; error: string };

const CATALOG_PATH = '/bibles/catalog.json';
const catalogCache: { value?: BibleCatalog; promise?: Promise<BibleCatalog | null> } = {};
const indexCache = new Map<string, Promise<BibleTranslationIndex | null>>();
const bookCache = new Map<string, Promise<BibleBookFile | null>>();

const isDev = (): boolean => Boolean(import.meta.env?.DEV);

const debug = (message: string, error?: unknown): void => {
  if (isDev()) console.debug(`[staticBibleProvider] ${message}`, error ?? '');
};

const fetchJson = async (path: string): Promise<unknown | null> => {
  try {
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    debug(`fetch failed: ${path}`, error);
    return null;
  }
};

export const clearStaticBibleProviderCache = (): void => {
  catalogCache.value = undefined;
  catalogCache.promise = undefined;
  indexCache.clear();
  bookCache.clear();
};

export const getBibleCatalog = async (): Promise<BibleCatalog | null> => {
  if (catalogCache.value) return catalogCache.value;
  if (!catalogCache.promise) {
    catalogCache.promise = fetchJson(CATALOG_PATH).then((json) => {
      if (!json) return null;
      try {
        const catalog = validateCatalog(json);
        catalogCache.value = catalog;
        return catalog;
      } catch (error) {
        debug('catalog validation failed', error);
        return null;
      }
    });
  }
  return catalogCache.promise;
};

const getTranslationMeta = async (translationId: string): Promise<BibleTranslationMeta | null> => {
  const catalog = await getBibleCatalog();
  const normalized = normalizeBookId(translationId);
  return catalog?.translations.find((item) => item.id === normalized) ?? null;
};

export const listStaticTranslations = async (): Promise<BibleTranslationMeta[]> => {
  const catalog = await getBibleCatalog();
  return catalog?.translations.filter((item) => item.availability === 'static' || item.availability === 'partial') ?? [];
};

export const hasStaticTranslation = async (translationId: string): Promise<boolean> => {
  const meta = await getTranslationMeta(translationId);
  return Boolean(meta && (meta.availability === 'static' || meta.availability === 'partial') && meta.indexPath);
};

export const getStaticTranslationIndex = async (translationId: string): Promise<BibleTranslationIndex | null> => {
  const normalized = normalizeBookId(translationId);
  if (!indexCache.has(normalized)) {
    indexCache.set(normalized, (async () => {
      const meta = await getTranslationMeta(normalized);
      if (!meta?.indexPath) return null;
      const json = await fetchJson(meta.indexPath);
      if (!json) return null;
      try {
        const index = validateTranslationIndex(json);
        return index.translationId === normalized ? index : null;
      } catch (error) {
        debug(`index validation failed: ${normalized}`, error);
        return null;
      }
    })());
  }
  return indexCache.get(normalized) ?? null;
};

export const getStaticBook = async (translationId: string, bookId: string): Promise<BibleBookFile | null> => {
  const normalizedTranslation = normalizeBookId(translationId);
  const normalizedBook = normalizeBookId(bookId);
  const cacheKey = `${normalizedTranslation}:${normalizedBook}`;
  if (!bookCache.has(cacheKey)) {
    bookCache.set(cacheKey, (async () => {
      const index = await getStaticTranslationIndex(normalizedTranslation);
      const bookMeta = index?.books.find((item) => item.id === normalizedBook);
      if (!bookMeta) return null;
      const json = await fetchJson(bookMeta.path);
      if (!json) return null;
      try {
        const book = validateBookFile(json);
        return book.translationId === normalizedTranslation && book.bookId === normalizedBook ? book : null;
      } catch (error) {
        debug(`book validation failed: ${cacheKey}`, error);
        return null;
      }
    })());
  }
  return bookCache.get(cacheKey) ?? null;
};

export const getStaticChapter = async (
  translationId: string,
  bookId: string,
  chapter: number
): Promise<Verse[] | null> => {
  if (!Number.isInteger(chapter) || chapter < 1) return null;
  const normalizedTranslation = normalizeBookId(translationId);
  const normalizedBook = normalizeBookId(bookId);
  const [index, book] = await Promise.all([
    getStaticTranslationIndex(normalizedTranslation),
    getStaticBook(normalizedTranslation, normalizedBook),
  ]);
  if (!index || !book) return null;
  const bookMeta = index.books.find((item) => item.id === normalizedBook);
  const chapterData: BibleChapterFile | undefined = book.chapters.find((item) => item.chapter === chapter);
  if (!bookMeta || !chapterData) return null;
  return chapterData.verses.map((verse) => ({
    book_id: normalizedBook,
    book_name: bookMeta.name,
    chapter,
    verse: verse.verse,
    text: verse.text,
  }));
};

export const getStaticChapterResult = async (
  translationId: string,
  bookId: string,
  chapter: number
): Promise<StaticBibleProviderResult<Verse[]>> => {
  const verses = await getStaticChapter(translationId, bookId, chapter);
  return verses ? { ok: true, data: verses } : { ok: false, error: 'Chapitre statique indisponible.' };
};
