import { BIBLE_BOOKS } from '../data/bibleBooks';
import { FEATURED_TRANSLATIONS } from '../data/translations';

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: string;
}

export type Testament = 'AT' | 'NT';

const FALLBACK_TRANSLATION = 'lsg';
const FALLBACK_BOOK_ID = 'jean';

// Normalisation insensible aux accents et à la casse pour la recherche de livre.
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

export const getBooksByTestament = (): Record<Testament, BibleBook[]> => ({
  AT: BIBLE_BOOKS.filter((book) => book.testament === 'AT'),
  NT: BIBLE_BOOKS.filter((book) => book.testament === 'NT'),
});

// Recherche rapide de livre (accent/casse-insensible) sur le nom et l'identifiant.
export const searchBooks = (query: string, books: BibleBook[] = BIBLE_BOOKS): BibleBook[] => {
  const term = normalize(query);
  if (!term) return books;
  return books.filter((book) => normalize(book.name).includes(term) || normalize(book.id).includes(term));
};

export const getBookById = (bookId: string | undefined): BibleBook | undefined =>
  BIBLE_BOOKS.find((book) => book.id === bookId);

// Livre supporté, avec repli déterministe (Jean) si l'identifiant est inconnu.
export const getSupportedBook = (bookId: string | undefined): BibleBook =>
  getBookById(bookId)
  ?? getBookById(FALLBACK_BOOK_ID)
  ?? BIBLE_BOOKS[0];

// Traduction supportée, avec repli sur la LSG.
export const getSupportedTranslation = (value: string | undefined): string =>
  FEATURED_TRANSLATIONS.some((item) => item.id === value) ? value! : FALLBACK_TRANSLATION;

// Borne le chapitre dans [1, nbChapitres] du livre ciblé.
export const clampChapterForBook = (
  bookId: string | undefined,
  rawChapter: string | number | undefined
): number => {
  const book = getSupportedBook(bookId);
  const parsed = Number.parseInt(String(rawChapter ?? 1), 10);
  const value = Number.isFinite(parsed) ? parsed : 1;
  return Math.min(Math.max(value, 1), book.chapters);
};

export const getTranslationLabel = (translationId: string): string =>
  FEATURED_TRANSLATIONS.find((item) => item.id === translationId)?.short ?? translationId.toUpperCase();
