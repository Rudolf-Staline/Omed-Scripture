import { describe, expect, it } from 'vitest';
import {
  clampChapterForBook,
  getBooksByTestament,
  getSupportedBook,
  getSupportedTranslation,
  getTranslationLabel,
  searchBooks,
} from '../bibleNavigation';

describe('bibleNavigation', () => {
  it('splits books into Old and New Testament', () => {
    const { AT, NT } = getBooksByTestament();
    expect(AT.length).toBeGreaterThan(0);
    expect(NT.length).toBeGreaterThan(0);
    expect(AT.every((book) => book.testament === 'AT')).toBe(true);
    expect(NT.every((book) => book.testament === 'NT')).toBe(true);
  });

  it('searches books accent- and case-insensitively', () => {
    expect(searchBooks('jean').some((book) => book.id === 'jean')).toBe(true);
    expect(searchBooks('ESAIE').some((book) => book.id === 'ésaïe')).toBe(true);
    expect(searchBooks('genese').some((book) => book.id === 'genese')).toBe(true);
    expect(searchBooks('')).toHaveLength(getBooksByTestament().AT.length + getBooksByTestament().NT.length);
    expect(searchBooks('zzzznotabook')).toHaveLength(0);
  });

  it('falls back to a real book for unknown ids', () => {
    expect(getSupportedBook('jean').id).toBe('jean');
    expect(getSupportedBook('inconnu').id).toBe('jean');
    expect(getSupportedBook(undefined).id).toBe('jean');
  });

  it('falls back to lsg for unsupported translations', () => {
    expect(getSupportedTranslation('lsg')).toBe('lsg');
    expect(getSupportedTranslation('zzz')).toBe('lsg');
    expect(getSupportedTranslation(undefined)).toBe('lsg');
  });

  it('clamps the chapter within the book bounds', () => {
    expect(clampChapterForBook('jean', 3)).toBe(3);
    expect(clampChapterForBook('jean', 0)).toBe(1);
    expect(clampChapterForBook('jean', 999)).toBe(21); // Jean a 21 chapitres
    expect(clampChapterForBook('jean', 'abc')).toBe(1);
    expect(clampChapterForBook('inconnu', 2)).toBe(2); // repli Jean
  });

  it('labels translations', () => {
    expect(getTranslationLabel('lsg')).toBe('LSG');
    expect(getTranslationLabel('zzz')).toBe('ZZZ');
  });
});
