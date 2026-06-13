import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { clearStaticBibleProviderCache, getBibleCatalog, getStaticBook, getStaticChapter, getStaticTranslationIndex, hasStaticTranslation, listStaticTranslations } from '../staticProvider';

const CATALOG = {
  schemaVersion: 1,
  translations: [
    { id: 'lsg', name: 'Louis Segond 1910', shortName: 'LSG', language: 'fr', direction: 'ltr', source: 'fixture', license: 'Public Domain', availability: 'partial', indexPath: '/bibles/lsg/index.json', searchIndexPath: '/bibles/lsg/search-index.json' },
    { id: 'web', name: 'World English Bible', shortName: 'WEB', language: 'en', direction: 'ltr', source: 'api', license: 'api-only', availability: 'api-only' },
  ],
};

const INDEX = {
  translationId: 'lsg',
  name: 'Louis Segond 1910',
  shortName: 'LSG',
  language: 'fr',
  books: [{ id: 'jean', osisId: 'John', name: 'Jean', abbreviation: 'Jn', testament: 'new', order: 43, chapterCount: 21, path: '/bibles/lsg/jean.json', availableChapters: [3] }],
};

const BOOK = {
  translationId: 'lsg',
  bookId: 'jean',
  name: 'Jean',
  chapters: [{ chapter: 3, verses: [{ verse: 16, text: 'Car Dieu a tant aimé le monde...' }] }],
};

const ok = (body: unknown) => ({ ok: true, json: async () => body });
const notFound = () => ({ ok: false, json: async () => ({}) });

const mockFetch = (overrides: Record<string, unknown> = {}) => vi.fn(async (url: string) => {
  if (url === '/bibles/catalog.json') return overrides.catalog ?? ok(CATALOG);
  if (url === '/bibles/lsg/index.json') return overrides.index ?? ok(INDEX);
  if (url === '/bibles/lsg/jean.json') return overrides.book ?? ok(BOOK);
  return notFound();
});

describe('staticBibleProvider', () => {
  beforeEach(() => {
    clearStaticBibleProviderCache();
    vi.stubGlobal('fetch', mockFetch());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearStaticBibleProviderCache();
  });

  it('charge le catalogue et liste les traductions statiques', async () => {
    await expect(getBibleCatalog()).resolves.toMatchObject({ schemaVersion: 1 });
    await expect(listStaticTranslations()).resolves.toHaveLength(1);
    await expect(hasStaticTranslation('lsg')).resolves.toBe(true);
    await expect(hasStaticTranslation('web')).resolves.toBe(false);
  });

  it('charge index, livre et chapitre', async () => {
    await expect(getStaticTranslationIndex('lsg')).resolves.toMatchObject({ translationId: 'lsg' });
    await expect(getStaticBook('lsg', 'jean')).resolves.toMatchObject({ bookId: 'jean' });
    await expect(getStaticChapter('lsg', 'jean', 3)).resolves.toEqual([{ book_id: 'jean', book_name: 'Jean', chapter: 3, verse: 16, text: 'Car Dieu a tant aimé le monde...' }]);
  });

  it('retourne null si un fichier manque', async () => {
    vi.stubGlobal('fetch', mockFetch({ book: notFound() }));
    await expect(getStaticChapter('lsg', 'jean', 3)).resolves.toBeNull();
  });

  it('retourne null si le JSON est malformé ou invalide', async () => {
    vi.stubGlobal('fetch', mockFetch({ index: ok({ books: 'nope' }) }));
    await expect(getStaticTranslationIndex('lsg')).resolves.toBeNull();
  });
});
