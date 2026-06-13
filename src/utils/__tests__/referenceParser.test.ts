import { describe, expect, it } from 'vitest';
import { parseReference, referenceToReadPath, resolveBookId } from '../referenceParser';

describe('parseReference', () => {
  it('parses "Jean 3:16"', () => {
    expect(parseReference('Jean 3:16')).toEqual({ bookId: 'jean', chapter: 3, verse: 16 });
  });

  it('is accent- and case-insensitive', () => {
    expect(parseReference('ESAIE 53')).toEqual({ bookId: 'ésaïe', chapter: 53 });
    expect(parseReference('  psaume 23  ')).toEqual({ bookId: 'psaumes', chapter: 23 });
  });

  it('handles spaces and dots as separators', () => {
    expect(parseReference('Jn 3 16')).toEqual({ bookId: 'jean', chapter: 3, verse: 16 });
    expect(parseReference('Mt 6.9')).toEqual({ bookId: 'matthieu', chapter: 6, verse: 9 });
  });

  it('handles numbered books', () => {
    expect(parseReference('1 jean 4:9')).toEqual({ bookId: '1 jean', chapter: 4, verse: 9 });
    expect(parseReference('1co 13')).toEqual({ bookId: '1 corinthiens', chapter: 13 });
  });

  it('returns null for unknown books or invalid input', () => {
    expect(parseReference('Hogwarts 3:16')).toBeNull();
    expect(parseReference('')).toBeNull();
    expect(parseReference('just words')).toBeNull();
  });

  it('rejects out-of-range chapters', () => {
    expect(parseReference('Jean 99')).toBeNull(); // Jean a 21 chapitres
  });

  it('builds a reader path', () => {
    expect(referenceToReadPath({ bookId: 'jean', chapter: 3, verse: 16 })).toBe('/read/lsg/jean/3');
  });
});

describe('resolveBookId', () => {
  it('resolves names, ids and abbreviations', () => {
    expect(resolveBookId('Genèse')).toBe('genese');
    expect(resolveBookId('ps')).toBe('psaumes');
    expect(resolveBookId('inconnu')).toBeNull();
  });
});
