import { BIBLE_BOOKS } from './bibleApi';

const normalize = (bookId: string): string => bookId.trim().toLowerCase();

export const getBookName = (bookId: string): string =>
  BIBLE_BOOKS.find((book) => normalize(book.id) === normalize(bookId))?.name || bookId;

export const getBookOrder = (bookId: string): number => {
  const index = BIBLE_BOOKS.findIndex((book) => normalize(book.id) === normalize(bookId));
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

export const formatBibleReference = (bookId: string, chapter: number | string, verse?: number | string): string => {
  const suffix = verse === undefined ? String(chapter) : `${chapter}:${verse}`;
  return `${getBookName(bookId)} ${suffix}`;
};
