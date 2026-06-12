import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getStaticChapter } from '../staticProvider';

const VALID_INDEX = {
  translationId: 'lsg',
  name: 'Louis Segond 1910',
  language: 'fr',
  source: 'static',
  books: [
    {
      id: 'jean',
      name: 'Jean',
      abbreviation: 'Jn',
      testament: 'new',
      chapterCount: 21,
      order: 43,
    },
  ],
};

const VALID_BOOK = {
  translationId: 'lsg',
  bookId: 'jean',
  bookName: 'Jean',
  chapters: {
    '3': [
      { verse: 16, text: 'Car Dieu a tant aimé le monde...' },
      { verse: 17, text: "Dieu, en effet, n'a pas envoyé son Fils..." },
    ],
  },
};

const ok = (body: unknown) => ({ ok: true, json: async () => body });
const notFound = () => ({ ok: false, json: async () => ({}) });

/**
 * Construit un mock de fetch qui répond différemment selon l'URL demandée.
 */
const mockFetch = (handlers: Record<string, () => unknown>) => {
  return vi.fn(async (url: string) => {
    if (url.endsWith('/index.json') && handlers.index) return handlers.index();
    if (url.endsWith('/jean.json') && handlers.book) return handlers.book();
    return notFound();
  });
};

describe('staticProvider.getStaticChapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch({}));
  });

  it('retourne un chapitre statique valide', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({ index: () => ok(VALID_INDEX), book: () => ok(VALID_BOOK) })
    );

    const verses = await getStaticChapter('lsg', 'jean', 3);

    expect(verses).not.toBeNull();
    expect(verses).toHaveLength(2);
    expect(verses?.[0]).toEqual({
      book_id: 'jean',
      book_name: 'Jean',
      chapter: 3,
      verse: 16,
      text: 'Car Dieu a tant aimé le monde...',
    });
  });

  it("retourne null si l'index est absent", async () => {
    vi.stubGlobal('fetch', mockFetch({ index: () => notFound() }));

    expect(await getStaticChapter('lsg', 'jean', 3)).toBeNull();
  });

  it("retourne null si le livre est absent de l'index", async () => {
    const indexWithoutJean = { ...VALID_INDEX, books: [] };
    vi.stubGlobal('fetch', mockFetch({ index: () => ok(indexWithoutJean) }));

    expect(await getStaticChapter('lsg', 'jean', 3)).toBeNull();
  });

  it('retourne null si le fichier du livre est absent', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({ index: () => ok(VALID_INDEX), book: () => notFound() })
    );

    expect(await getStaticChapter('lsg', 'jean', 3)).toBeNull();
  });

  it('retourne null si le chapitre est absent', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({ index: () => ok(VALID_INDEX), book: () => ok(VALID_BOOK) })
    );

    expect(await getStaticChapter('lsg', 'jean', 99)).toBeNull();
  });

  it('retourne null si le JSON est invalide', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        index: () => ({
          ok: true,
          json: async () => {
            throw new SyntaxError('Unexpected token');
          },
        }),
      })
    );

    expect(await getStaticChapter('lsg', 'jean', 3)).toBeNull();
  });

  it('retourne null si la structure du chapitre est invalide', async () => {
    const brokenBook = {
      chapters: { '3': [{ verse: '16', text: 42 }] },
    };
    vi.stubGlobal(
      'fetch',
      mockFetch({ index: () => ok(VALID_INDEX), book: () => ok(brokenBook) })
    );

    expect(await getStaticChapter('lsg', 'jean', 3)).toBeNull();
  });
});
