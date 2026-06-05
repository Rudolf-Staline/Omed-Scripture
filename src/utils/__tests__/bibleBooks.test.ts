import { describe, expect, it } from 'vitest';
import { getBookName, getBookOrder, formatBibleReference } from '../bibleBooks';

describe('bibleBooks helpers', () => {
  it('returns readable French book names', () => {
    expect(getBookName('genese')).toBe('Genèse');
    expect(getBookName('jean')).toBe('Jean');
  });

  it('sorts books in canonical biblical order', () => {
    expect(getBookOrder('genese')).toBeLessThan(getBookOrder('exode'));
    expect(getBookOrder('malachie')).toBeLessThan(getBookOrder('matthieu'));
    expect(getBookOrder('jean')).toBeLessThan(getBookOrder('romains'));
  });

  it('formats readable references', () => {
    expect(formatBibleReference('genese', 1, 1)).toBe('Genèse 1:1');
  });
});
