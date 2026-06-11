import type { Verse } from '../../types/bible';

/**
 * Provider biblique statique local.
 *
 * Lit des fichiers JSON pré-générés servis depuis `public/bibles/` :
 *   - `/bibles/{translation}/index.json` : déclare la traduction et ses livres.
 *   - `/bibles/{translation}/{bookId}.json` : contient les chapitres du livre.
 *
 * Le provider est volontairement tolérant : toute anomalie (fichier absent,
 * JSON invalide, structure inattendue, chapitre manquant) renvoie `null`
 * plutôt que de lever une erreur, afin de ne jamais interrompre l'UI et de
 * laisser le fallback réseau prendre le relais.
 */

interface StaticIndexBook {
  id: string;
  name: string;
}

interface StaticIndex {
  books: StaticIndexBook[];
}

interface StaticChapterVerse {
  verse: number;
  text: string;
}

interface StaticBookFile {
  chapters: Record<string, StaticChapterVerse[]>;
}

const isDev = (): boolean => {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
};

const debug = (message: string, error?: unknown): void => {
  if (isDev()) {
    console.debug(`[staticProvider] ${message}`, error ?? '');
  }
};

const fetchJson = async (url: string): Promise<unknown | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    debug(`fetch failed: ${url}`, error);
    return null;
  }
};

const findIndexBook = (data: unknown, bookId: string): StaticIndexBook | null => {
  if (!data || typeof data !== 'object') return null;
  const books = (data as Partial<StaticIndex>).books;
  if (!Array.isArray(books)) return null;

  const book = books.find(
    (b): b is StaticIndexBook =>
      Boolean(b) &&
      typeof b === 'object' &&
      (b as StaticIndexBook).id === bookId
  );
  return book ?? null;
};

const parseChapterVerses = (
  data: unknown,
  chapter: number
): StaticChapterVerse[] | null => {
  if (!data || typeof data !== 'object') return null;
  const chapters = (data as Partial<StaticBookFile>).chapters;
  if (!chapters || typeof chapters !== 'object') return null;

  const raw = (chapters as Record<string, unknown>)[String(chapter)];
  if (!Array.isArray(raw)) return null;

  const verses: StaticChapterVerse[] = [];
  for (const item of raw) {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof (item as StaticChapterVerse).verse !== 'number' ||
      typeof (item as StaticChapterVerse).text !== 'string'
    ) {
      return null;
    }
    verses.push({
      verse: (item as StaticChapterVerse).verse,
      text: (item as StaticChapterVerse).text,
    });
  }
  return verses;
};

/**
 * Tente de charger un chapitre depuis le provider statique local.
 * Renvoie les versets si tout est valide, sinon `null`.
 */
export const getStaticChapter = async (
  translation: string,
  bookId: string,
  chapter: number
): Promise<Verse[] | null> => {
  const indexData = await fetchJson(`/bibles/${translation}/index.json`);
  if (!indexData) return null;

  const indexBook = findIndexBook(indexData, bookId);
  if (!indexBook) return null;

  const bookData = await fetchJson(`/bibles/${translation}/${bookId}.json`);
  if (!bookData) return null;

  const verses = parseChapterVerses(bookData, chapter);
  if (!verses) return null;

  return verses.map((v) => ({
    book_id: bookId,
    book_name: indexBook.name,
    chapter,
    verse: v.verse,
    text: v.text,
  }));
};
