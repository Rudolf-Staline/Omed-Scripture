import { BIBLE_BOOKS } from '../data/bibleBooks';

// Analyse une référence biblique tapée en clair (« Jean 3:16 », « Jn 3 »,
// « 1 jean 2 5 », « psaume 23 ») en {bookId, chapter, verse?}.
// Insensible aux accents, à la casse et à la ponctuation. Aucune dépendance
// lourde ; aucune donnée externe.

export interface ParsedReference {
  bookId: string;
  chapter: number;
  verse?: number;
}

const normalize = (value: string): string =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();

// Abréviations françaises usuelles → id canonique (les ids gardent leurs accents).
const ABBREVIATIONS: Record<string, string> = {
  gn: 'genese', gen: 'genese', ex: 'exode', lv: 'levitique', nb: 'nombres', dt: 'deutéronome',
  ps: 'psaumes', pr: 'proverbes', ec: 'ecclésiaste', es: 'ésaïe', esa: 'ésaïe', jr: 'jérémie',
  mt: 'matthieu', mc: 'marc', lc: 'luc', jn: 'jean', ac: 'actes', rm: 'romains', rom: 'romains',
  '1co': '1 corinthiens', '2co': '2 corinthiens', ga: 'galates', ep: 'éphésiens',
  ph: 'philippiens', phil: 'philippiens', col: 'colossiens', he: 'hébreux', heb: 'hébreux',
  jc: 'jacques', ja: 'jacques', ap: 'apocalypse', '1jn': '1 jean', '2jn': '2 jean', '3jn': '3 jean',
};

const ALIASES: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const book of BIBLE_BOOKS) {
    map.set(normalize(book.id), book.id);
    map.set(normalize(book.name), book.id);
  }
  // « psaume » (singulier) → « psaumes ».
  map.set('psaume', 'psaumes');
  for (const [abbr, id] of Object.entries(ABBREVIATIONS)) map.set(abbr, id);
  return map;
})();

const chaptersFor = (bookId: string): number => BIBLE_BOOKS.find((b) => b.id === bookId)?.chapters ?? 0;

export const resolveBookId = (raw: string): string | null => {
  const key = normalize(raw).replace(/\.$/, '');
  return ALIASES.get(key) ?? ALIASES.get(key.replace(/\s+/g, '')) ?? null;
};

export const parseReference = (input: string): ParsedReference | null => {
  if (!input) return null;
  const normalized = normalize(input);
  // book = lettres (avec éventuel chiffre+espace en tête), puis chapitre[:verset].
  const match = normalized.match(/^((?:[1-3]\s*)?[a-z][a-z .]*?)\s*(\d{1,3})(?:\s*[:.\s]\s*(\d{1,3}))?$/);
  if (!match) return null;

  const bookId = resolveBookId(match[1]);
  if (!bookId) return null;

  const chapter = Number.parseInt(match[2], 10);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > chaptersFor(bookId)) return null;

  if (match[3] === undefined) return { bookId, chapter };
  const verse = Number.parseInt(match[3], 10);
  if (!Number.isInteger(verse) || verse < 1) return { bookId, chapter };
  return { bookId, chapter, verse };
};

export const referenceToReadPath = (ref: ParsedReference, translation = 'lsg'): string =>
  `/read/${translation}/${ref.bookId}/${ref.chapter}`;
