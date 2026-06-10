import type { Verse, SearchResult } from '../../types/bible';
import { BOLLS_VERSIONS } from '../../data/translations';
import { BOOK_NUMBERS, BIBLE_BOOKS } from '../../data/bibleBooks';

export const getBollsChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  const bollsId = BOLLS_VERSIONS[translation];
  if (!bollsId) throw new Error(`Unsupported bolls.life translation: ${translation}`);

  const bookNr = BOOK_NUMBERS[book.toLowerCase()];
  if (!bookNr) throw new Error(`Unknown book: ${book}`);

  const res = await fetch(`https://bolls.life/get-chapter/${bollsId}/${bookNr}/${chapter}/`);
  if (!res.ok) throw new Error('Failed to fetch chapter from bolls.life');
  const data = await res.json();

  return (data || []).map((v: { pk: number; verse: number; text: string }) => ({
    book_id: book.toLowerCase(),
    book_name: book,
    chapter: chapter,
    verse: v.verse,
    text: v.text.trim(),
  }));
};

export const searchBollsVerses = async (
  translation: string,
  query: string
): Promise<SearchResult[]> => {
  const bollsSearchMap: Record<string, string> = {
    lsg: 'FRLSG',
    darby: 'FRDBY',
    kjv: 'KJV',
    web: 'WEB',
    bbe: 'YLT', // Fallback to YLT
  };

  const bollsId = bollsSearchMap[translation] || 'FRLSG';

  try {
    const res = await fetch(`https://bolls.life/search/${bollsId}/?search=${encodeURIComponent(query)}&match_case=false&match_whole_word=false`);
    if (!res.ok) return [];
    const data = await res.json();

    const getBookIdByNumber = (num: number): string => {
      const entry = Object.entries(BOOK_NUMBERS).find((entry) => entry[1] === num);
      return entry ? entry[0] : 'genese';
    };

    return (data || []).map((v: { book: number; chapter: number; verse: number; text: string }) => {
      const bookId = getBookIdByNumber(v.book);
      const bookName = BIBLE_BOOKS.find((b) => b.id === bookId)?.name || bookId;
      const ref = `${bookName} ${v.chapter}:${v.verse}`;

      return {
        reference: ref,
        text: v.text.replace(/<[^>]+>/g, ''), // Strip HTML tags
        translation_id: translation,
        book_id: bookId,
        chapter_id: v.chapter.toString(),
      };
    });
  } catch (err) {
    console.error("Erreur de recherche bolls.life:", err);
    return [];
  }
};
