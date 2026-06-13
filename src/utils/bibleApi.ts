import type { Verse, SearchResult } from '../types/bible';
import type { ChapterSource } from '../types/bibleData';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { FEATURED_TRANSLATIONS, BOLLS_VERSIONS, BIBLE_API_VERSIONS } from '../data/translations';
import { getBollsChapter, searchBollsVerses } from './bibleProviders/bollsProvider';
import { getBibleApiChapter } from './bibleProviders/bibleApiProvider';
import { getScriptureApiChapter } from './bibleProviders/scriptureApiProvider';
import { getStaticChapter } from './staticBibleProvider';
import { getCachedChapter, cacheChapter } from './chapterCache';
import { searchLocalBible } from './localBibleSearch';

export type { Verse, SearchResult };
export { BIBLE_BOOKS, FEATURED_TRANSLATIONS };

export interface ChapterLoadResult {
  verses: Verse[];
  source: ChapterSource;
}

const getRemoteChapter = (translation: string, book: string, chapter: number): Promise<Verse[]> => {
  if (BOLLS_VERSIONS[translation]) {
    return getBollsChapter(translation, book, chapter);
  }
  if (BIBLE_API_VERSIONS.includes(translation)) {
    return getBibleApiChapter(translation, book, chapter);
  }
  return getScriptureApiChapter(translation, book, chapter);
};

export const getChapterWithSource = async (
  translation: string,
  book: string,
  chapter: number
): Promise<ChapterLoadResult> => {
  const staticVerses = await getStaticChapter(translation, book, chapter);
  if (staticVerses && staticVerses.length > 0) {
    return { verses: staticVerses, source: 'static' };
  }

  const cachedVerses = getCachedChapter(translation, book, chapter);
  if (cachedVerses && cachedVerses.length > 0) {
    return { verses: cachedVerses, source: 'cache' };
  }

  const remoteVerses = await getRemoteChapter(translation, book, chapter);
  cacheChapter(translation, book, chapter, remoteVerses);
  return { verses: remoteVerses, source: 'api' };
};

export const getChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  const result = await getChapterWithSource(translation, book, chapter);
  return result.verses;
};

export interface SearchLoadResult {
  results: SearchResult[];
  source: 'local' | 'api';
}

export const searchVersesWithSource = async (
  translation: string,
  query: string
): Promise<SearchLoadResult> => {
  const local = await searchLocalBible(translation, query);
  if (local.available) {
    return { results: local.results, source: 'local' };
  }
  const remote = await searchBollsVerses(translation, query);
  return { results: remote.map((item) => ({ ...item, source: 'api' as const })), source: 'api' };
};

export const searchVerses = async (
  translation: string,
  query: string
): Promise<SearchResult[]> => {
  const result = await searchVersesWithSource(translation, query);
  return result.results;
};
