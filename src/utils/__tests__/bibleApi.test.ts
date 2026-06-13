import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Verse } from '../../types/bible';

vi.mock('../staticBibleProvider', () => ({
  getStaticChapter: vi.fn(),
}));

vi.mock('../chapterCache', () => ({
  getCachedChapter: vi.fn(),
  cacheChapter: vi.fn(),
}));

vi.mock('../localBibleSearch', () => ({
  searchLocalBible: vi.fn(),
}));

vi.mock('../bibleProviders/bollsProvider', () => ({
  getBollsChapter: vi.fn(),
  searchBollsVerses: vi.fn(),
}));

import { getChapterWithSource, searchVersesWithSource } from '../bibleApi';
import { getStaticChapter } from '../staticBibleProvider';
import { getCachedChapter, cacheChapter } from '../chapterCache';
import { searchLocalBible } from '../localBibleSearch';
import { getBollsChapter, searchBollsVerses } from '../bibleProviders/bollsProvider';

const staticVerse: Verse = { book_id: 'jean', book_name: 'Jean', chapter: 3, verse: 16, text: 'Statique' };
const cacheVerse: Verse = { ...staticVerse, text: 'Cache' };
const bollsVerse: Verse = { ...staticVerse, text: 'API' };

describe('bibleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getStaticChapter).mockResolvedValue(null);
    vi.mocked(getCachedChapter).mockReturnValue(null);
    vi.mocked(getBollsChapter).mockResolvedValue([bollsVerse]);
    vi.mocked(searchLocalBible).mockResolvedValue({ available: false, results: [] });
    vi.mocked(searchBollsVerses).mockResolvedValue([{ reference: 'Jean 3:16', text: 'API', translation_id: 'lsg', book_id: 'jean', chapter_id: 'jean.3' }]);
  });

  it('privilégie le chapitre statique', async () => {
    vi.mocked(getStaticChapter).mockResolvedValue([staticVerse]);
    const result = await getChapterWithSource('lsg', 'jean', 3);
    expect(result).toEqual({ verses: [staticVerse], source: 'static' });
    expect(getCachedChapter).not.toHaveBeenCalled();
    expect(getBollsChapter).not.toHaveBeenCalled();
  });

  it('fallback vers le cache local avant API', async () => {
    vi.mocked(getCachedChapter).mockReturnValue([cacheVerse]);
    const result = await getChapterWithSource('lsg', 'jean', 3);
    expect(result).toEqual({ verses: [cacheVerse], source: 'cache' });
    expect(getBollsChapter).not.toHaveBeenCalled();
  });

  it('fallback vers API et met en cache', async () => {
    const result = await getChapterWithSource('lsg', 'jean', 3);
    expect(result).toEqual({ verses: [bollsVerse], source: 'api' });
    expect(cacheChapter).toHaveBeenCalledWith('lsg', 'jean', 3, [bollsVerse]);
  });

  it('privilégie la recherche locale quand disponible', async () => {
    const localResult = { reference: 'Jean 3:16', text: 'local', translation_id: 'lsg', book_id: 'jean', chapter_id: 'jean.3', source: 'local' as const };
    vi.mocked(searchLocalBible).mockResolvedValue({ available: true, results: [localResult] });
    await expect(searchVersesWithSource('lsg', 'Dieu')).resolves.toEqual({ results: [localResult], source: 'local' });
    expect(searchBollsVerses).not.toHaveBeenCalled();
  });

  it('fallback vers la recherche API sans index local', async () => {
    const result = await searchVersesWithSource('lsg', 'Dieu');
    expect(result.source).toBe('api');
    expect(result.results[0].source).toBe('api');
  });
});
