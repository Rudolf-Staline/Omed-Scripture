import type { SearchResult } from '../types/bible';
import type { BibleSearchIndexEntry } from '../types/bibleData';
import { normalizeBookId, validateSearchIndex } from './bibleDataValidation';
import { getBibleCatalog } from './staticBibleProvider';

const searchIndexCache = new Map<string, Promise<BibleSearchIndexEntry[] | null>>();

export const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const fetchSearchIndex = async (translationId: string): Promise<BibleSearchIndexEntry[] | null> => {
  const normalized = normalizeBookId(translationId);
  if (!searchIndexCache.has(normalized)) {
    searchIndexCache.set(normalized, (async () => {
      const catalog = await getBibleCatalog();
      const meta = catalog?.translations.find((item) => item.id === normalized);
      if (!meta?.searchIndexPath) return null;
      try {
        const response = await fetch(meta.searchIndexPath, { cache: 'force-cache' });
        if (!response.ok) return null;
        return validateSearchIndex(await response.json());
      } catch (error) {
        if (import.meta.env.DEV) console.debug('[localBibleSearch] search index unavailable', error);
        return null;
      }
    })());
  }
  return searchIndexCache.get(normalized) ?? null;
};

export const clearLocalBibleSearchCache = (): void => {
  searchIndexCache.clear();
};

export interface LocalBibleSearchResponse {
  available: boolean;
  results: SearchResult[];
}

export const searchLocalBible = async (
  translationId: string,
  query: string,
  options: { limit?: number } = {}
): Promise<LocalBibleSearchResponse> => {
  const clean = normalizeSearchText(query);
  if (!clean) return { available: false, results: [] };
  const index = await fetchSearchIndex(translationId);
  if (!index) return { available: false, results: [] };
  const terms = clean.split(' ').filter(Boolean);
  const limit = options.limit ?? 50;
  const results: SearchResult[] = [];
  for (const entry of index) {
    const haystack = entry.normalizedText || normalizeSearchText(entry.text);
    if (terms.every((term) => haystack.includes(term))) {
      results.push({
        reference: entry.reference,
        text: entry.text,
        translation_id: translationId,
        book_id: entry.bookId,
        chapter_id: `${entry.bookId}.${entry.chapter}`,
        source: 'local',
      });
    }
    if (results.length >= limit) break;
  }
  return { available: true, results };
};
