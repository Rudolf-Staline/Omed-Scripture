import { describe, expect, it } from 'vitest';
import { CROSS_REFERENCES, formatCrossReference, getCrossReferencesForChapter, getCrossReferencesForVerse } from './crossReferences';

describe('crossReferences', () => {
  it('has unique ids', () => {
    const ids = CROSS_REFERENCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('finds references for a specific verse', () => {
    const targets = getCrossReferencesForVerse('jean', 3, 16);
    expect(targets.some((t) => t.bookId === 'romains' && t.chapter === 5 && t.verseStart === 8)).toBe(true);
  });

  it('matches a verse inside a source range', () => {
    // Matthieu 6:9-13 source → verse 11 should still match
    expect(getCrossReferencesForVerse('matthieu', 6, 11).length).toBeGreaterThan(0);
    expect(getCrossReferencesForVerse('matthieu', 6, 99)).toEqual([]);
  });

  it('finds references for a whole chapter and de-duplicates', () => {
    const targets = getCrossReferencesForChapter('jean', 3);
    const keys = targets.map((t) => `${t.bookId}-${t.chapter}-${t.verseStart}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('returns [] when nothing matches', () => {
    expect(getCrossReferencesForVerse('jonas', 2, 1)).toEqual([]);
  });

  it('formats references with and without a range', () => {
    expect(formatCrossReference({ bookId: 'romains', chapter: 5, verseStart: 8 })).toBe('Romains 5:8');
    expect(formatCrossReference({ bookId: 'luc', chapter: 11, verseStart: 2, verseEnd: 4 })).toBe('Luc 11:2-4');
  });
});
