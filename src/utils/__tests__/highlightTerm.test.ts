import { describe, expect, it } from 'vitest';
import { splitByTerm } from '../highlightTerm';

describe('splitByTerm', () => {
  it('returns the full text when the term is empty', () => {
    expect(splitByTerm('Dieu est amour', '')).toEqual([{ text: 'Dieu est amour', match: false }]);
    expect(splitByTerm('Dieu est amour', '   ')).toEqual([{ text: 'Dieu est amour', match: false }]);
  });

  it('marks matching segments case-insensitively', () => {
    expect(splitByTerm('Car Dieu a tant aimé', 'dieu')).toEqual([
      { text: 'Car ', match: false },
      { text: 'Dieu', match: true },
      { text: ' a tant aimé', match: false },
    ]);
  });

  it('handles multiple occurrences', () => {
    const segments = splitByTerm('amour, encore amour', 'amour');
    expect(segments.filter((s) => s.match)).toHaveLength(2);
    expect(segments.map((s) => s.text).join('')).toBe('amour, encore amour');
  });

  it('escapes regex special characters', () => {
    expect(splitByTerm('a+b et a+b', 'a+b')).toEqual([
      { text: 'a+b', match: true },
      { text: ' et ', match: false },
      { text: 'a+b', match: true },
    ]);
  });
});
