import { describe, expect, it } from 'vitest';
import { validateBookFile, validateCatalog, validateTranslationIndex, normalizeBookId } from '../bibleDataValidation';

describe('bibleDataValidation', () => {
  it('normalise les ids de livres sans retirer les accents utiles', () => {
    expect(normalizeBookId('  Jean  ')).toBe('jean');
    expect(normalizeBookId('1   Corinthiens')).toBe('1 corinthiens');
  });

  it('rejette un catalogue invalide', () => {
    expect(() => validateCatalog({ schemaVersion: 2, translations: [] })).toThrow(/schemaVersion/);
  });

  it('rejette un index invalide', () => {
    expect(() => validateTranslationIndex({ translationId: 'lsg', name: 'LSG', shortName: 'LSG', language: 'fr', books: [{ id: 'jean' }] })).toThrow(/testament/);
  });

  it('rejette un livre, chapitre ou verset invalide', () => {
    expect(() => validateBookFile({ translationId: 'lsg', bookId: 'jean', name: 'Jean', chapters: [] })).toThrow(/chapters/);
    expect(() => validateBookFile({ translationId: 'lsg', bookId: 'jean', name: 'Jean', chapters: [{ chapter: 0, verses: [{ verse: 1, text: 'x' }] }] })).toThrow(/chapter/);
    expect(() => validateBookFile({ translationId: 'lsg', bookId: 'jean', name: 'Jean', chapters: [{ chapter: 1, verses: [{ verse: '1', text: 42 }] }] })).toThrow(/verse/);
  });
});
