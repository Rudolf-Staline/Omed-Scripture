import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { clearLocalBibleSearchCache, normalizeSearchText, searchLocalBible } from '../localBibleSearch';
import { clearStaticBibleProviderCache } from '../staticBibleProvider';

const catalog = { schemaVersion: 1, translations: [{ id: 'lsg', name: 'Louis Segond 1910', shortName: 'LSG', language: 'fr', direction: 'ltr', source: 'fixture', license: 'PD', availability: 'partial', indexPath: '/bibles/lsg/index.json', searchIndexPath: '/bibles/lsg/search-index.json' }] };
const searchIndex = [
  { bookId: 'jean', chapter: 3, verse: 16, reference: 'Jean 3:16', text: 'Car Dieu a tant aimé le monde', normalizedText: 'car dieu a tant aime le monde' },
  { bookId: 'jean', chapter: 3, verse: 17, reference: 'Jean 3:17', text: 'Dieu a envoyé son Fils', normalizedText: 'dieu a envoye son fils' },
];

const ok = (body: unknown) => ({ ok: true, json: async () => body });

describe('localBibleSearch', () => {
  beforeEach(() => {
    clearLocalBibleSearchCache();
    clearStaticBibleProviderCache();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url === '/bibles/catalog.json') return ok(catalog);
      if (url === '/bibles/lsg/search-index.json') return ok(searchIndex);
      return { ok: false, json: async () => ({}) };
    }));
  });

  afterEach(() => vi.restoreAllMocks());

  it('normalise accents et casse', () => {
    expect(normalizeSearchText('ÉTERNEL Aimé')).toBe('eternel aime');
  });

  it('recherche localement avec limite et référence', async () => {
    const response = await searchLocalBible('lsg', 'DIEU aimé', { limit: 1 });
    expect(response.available).toBe(true);
    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({ reference: 'Jean 3:16', source: 'local' });
  });

  it("gère l'absence d'index", async () => {
    const response = await searchLocalBible('web', 'love');
    expect(response).toEqual({ available: false, results: [] });
  });
});
