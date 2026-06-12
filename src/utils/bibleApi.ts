import type { Verse, SearchResult } from '../types/bible';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import { FEATURED_TRANSLATIONS, BOLLS_VERSIONS, BIBLE_API_VERSIONS } from '../data/translations';
import { getBollsChapter, searchBollsVerses } from './bibleProviders/bollsProvider';
import { getBibleApiChapter } from './bibleProviders/bibleApiProvider';
import { getScriptureApiChapter } from './bibleProviders/scriptureApiProvider';
import { getStaticChapter } from './bibleProviders/staticProvider';

export type { Verse, SearchResult };
export { BIBLE_BOOKS, FEATURED_TRANSLATIONS };

export const getChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  // Provider statique local : prioritaire s'il fournit le chapitre.
  const staticVerses = await getStaticChapter(translation, book, chapter);
  if (staticVerses && staticVerses.length > 0) {
    return staticVerses;
  }

  if (BOLLS_VERSIONS[translation]) {
    return getBollsChapter(translation, book, chapter);
  } else if (BIBLE_API_VERSIONS.includes(translation)) {
    return getBibleApiChapter(translation, book, chapter);
  } else {
    return getScriptureApiChapter(translation, book, chapter);
  }
};

export const searchVerses = async (
  translation: string,
  query: string
): Promise<SearchResult[]> => {
  // Currently, search is only implemented through bolls.life
  return searchBollsVerses(translation, query);
};
