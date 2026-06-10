import type { Verse } from '../../types/bible';
import { FRENCH_TO_ENGLISH_BOOKS } from '../../data/bibleBooks';
import { BIBLE_API_VERSIONS } from '../../data/translations';

export const getBibleApiChapter = async (
  translation: string,
  book: string,
  chapter: number
): Promise<Verse[]> => {
  if (!BIBLE_API_VERSIONS.includes(translation)) {
    throw new Error(`Unsupported bible-api.com translation: ${translation}`);
  }

  const apiBookName = FRENCH_TO_ENGLISH_BOOKS[book.toLowerCase()] || book;
  const singleChapterBooks = ['abdias', 'philémon', '2 jean', '3 jean', 'jude'];
  const extraParams = singleChapterBooks.includes(book.toLowerCase())
    ? '&single_chapter_book_matching=indifferent'
    : '';

  const res = await fetch(`/bible-api/${encodeURIComponent(apiBookName)}+${chapter}?translation=${translation}${extraParams}`);
  if (!res.ok) throw new Error('Failed to fetch chapter from bible-api.com');
  const data = await res.json();

  return data.verses || [];
};
