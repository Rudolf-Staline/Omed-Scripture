import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChapter } from '../bibleApi';
import * as staticProvider from '../bibleProviders/staticProvider';
import * as bollsProvider from '../bibleProviders/bollsProvider';

vi.mock('../bibleProviders/staticProvider', () => ({
  getStaticChapter: vi.fn(),
}));

vi.mock('../bibleProviders/bollsProvider', () => ({
  getBollsChapter: vi.fn(),
  searchBollsVerses: vi.fn(),
}));

describe('bibleApi getChapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses static provider first for lsg and returns verses if available', async () => {
    const mockVerses = [{ book_id: 'jean', book_name: 'Jean', chapter: 3, verse: 16, text: 'Test' }];
    vi.mocked(staticProvider.getStaticChapter).mockResolvedValueOnce(mockVerses);

    const verses = await getChapter('lsg', 'jean', 3);

    expect(staticProvider.getStaticChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
    expect(bollsProvider.getBollsChapter).not.toHaveBeenCalled();
    expect(verses).toEqual(mockVerses);
  });

  it('falls back to bolls provider if static provider returns null for lsg', async () => {
    const mockBollsVerses = [{ book_id: 'jean', book_name: 'Jean', chapter: 3, verse: 16, text: 'Bolls' }];
    vi.mocked(staticProvider.getStaticChapter).mockResolvedValueOnce(null);
    vi.mocked(bollsProvider.getBollsChapter).mockResolvedValueOnce(mockBollsVerses);

    const verses = await getChapter('lsg', 'jean', 3);

    expect(staticProvider.getStaticChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
    expect(bollsProvider.getBollsChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
    expect(verses).toEqual(mockBollsVerses);
  });

  it('does not use static provider for non-lsg translations', async () => {
    const mockBollsVerses = [{ book_id: 'jean', book_name: 'Jean', chapter: 3, verse: 16, text: 'Darby' }];
    vi.mocked(bollsProvider.getBollsChapter).mockResolvedValueOnce(mockBollsVerses);

    const verses = await getChapter('darby', 'jean', 3);

    expect(staticProvider.getStaticChapter).not.toHaveBeenCalled();
    expect(bollsProvider.getBollsChapter).toHaveBeenCalledWith('darby', 'jean', 3);
    expect(verses).toEqual(mockBollsVerses);
  });
});
