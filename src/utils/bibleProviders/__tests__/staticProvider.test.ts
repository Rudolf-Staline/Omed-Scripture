import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStaticChapter } from '../staticProvider';

describe('staticProvider', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('successfully reads a static chapter', async () => {
    // Mock the index.json fetch
    const indexResponse = {
      ok: true,
      json: async () => ({ books: ['jean'] }),
    };

    // Mock the jean.json fetch
    const bookResponse = {
      ok: true,
      json: async () => ({
        bookId: 'jean',
        bookName: 'Jean',
        chapters: {
          '3': [{ verse: 16, text: 'Car Dieu a tant aimé le monde' }],
        },
      }),
    };

    vi.mocked(fetch).mockImplementation(async (url) => {
      if (url.toString().includes('index.json')) return indexResponse as Response;
      if (url.toString().includes('jean.json')) return bookResponse as Response;
      return { ok: false } as Response;
    });

    const verses = await getStaticChapter('lsg', 'jean', 3);

    expect(verses).not.toBeNull();
    expect(verses).toHaveLength(1);
    expect(verses![0]).toEqual({
      book_id: 'jean',
      book_name: 'Jean',
      chapter: 3,
      verse: 16,
      text: 'Car Dieu a tant aimé le monde',
    });
  });

  it('returns null if the book is not in the index', async () => {
    const indexResponse = {
      ok: true,
      json: async () => ({ books: ['genese'] }), // only genese
    };

    vi.mocked(fetch).mockResolvedValueOnce(indexResponse as Response);

    const verses = await getStaticChapter('lsg', 'jean', 3);

    expect(verses).toBeNull();
  });

  it('returns null if the chapter is missing', async () => {
    const indexResponse = {
      ok: true,
      json: async () => ({ books: ['jean'] }),
    };

    const bookResponse = {
      ok: true,
      json: async () => ({
        bookId: 'jean',
        bookName: 'Jean',
        chapters: { '1': [] }, // chapter 3 is missing
      }),
    };

    vi.mocked(fetch).mockImplementation(async (url) => {
      if (url.toString().includes('index.json')) return indexResponse as Response;
      if (url.toString().includes('jean.json')) return bookResponse as Response;
      return { ok: false } as Response;
    });

    const verses = await getStaticChapter('lsg', 'jean', 3);

    expect(verses).toBeNull();
  });

  it('returns null on network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network failure'));

    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    const verses = await getStaticChapter('lsg', 'jean', 3);

    expect(verses).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
