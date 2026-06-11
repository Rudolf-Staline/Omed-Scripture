import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Verse } from '../../types/bible';

vi.mock('../bibleProviders/staticProvider', () => ({
  getStaticChapter: vi.fn(),
}));

vi.mock('../bibleProviders/bollsProvider', () => ({
  getBollsChapter: vi.fn(),
  searchBollsVerses: vi.fn(),
}));

import { getChapter } from '../bibleApi';
import { getStaticChapter } from '../bibleProviders/staticProvider';
import { getBollsChapter } from '../bibleProviders/bollsProvider';

const staticVerse: Verse = {
  book_id: 'jean',
  book_name: 'Jean',
  chapter: 3,
  verse: 16,
  text: 'Car Dieu a tant aimé le monde...',
};

const bollsVerse: Verse = { ...staticVerse, text: 'Texte bolls' };

describe('getChapter — provider statique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('utilise le provider statique quand il réussit', async () => {
    vi.mocked(getStaticChapter).mockResolvedValue([staticVerse]);
    vi.mocked(getBollsChapter).mockResolvedValue([bollsVerse]);

    const result = await getChapter('lsg', 'jean', 3);

    expect(result).toEqual([staticVerse]);
    expect(getStaticChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
    expect(getBollsChapter).not.toHaveBeenCalled();
  });

  it('fallback vers le provider existant quand le statique retourne null', async () => {
    vi.mocked(getStaticChapter).mockResolvedValue(null);
    vi.mocked(getBollsChapter).mockResolvedValue([bollsVerse]);

    const result = await getChapter('lsg', 'jean', 3);

    expect(result).toEqual([bollsVerse]);
    expect(getStaticChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
    expect(getBollsChapter).toHaveBeenCalledWith('lsg', 'jean', 3);
  });
});
