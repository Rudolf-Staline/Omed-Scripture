import { getBookName } from '../utils/bibleBooks';

// Références croisées LOCALES et ORIGINALES.
//
// Important (licence) : ce fichier ne contient AUCUN texte biblique ni aucune
// base de cross-references tierce protégée. On référence uniquement des
// passages (livre / chapitre / verset) reliés par un thème évident, rédigés à la
// main pour Omed Scripture. La structure est prête à recevoir, plus tard, des
// données autorisées et documentées (voir docs/CONTENT_GOVERNANCE.md).

export type CrossReferenceRelation =
  | 'theme'
  | 'quotation'
  | 'echo'
  | 'parallel'
  | 'fulfillment'
  | 'contrast';

export interface VerseRange {
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface CrossReferenceTarget extends VerseRange {
  relation: CrossReferenceRelation;
  note?: string;
}

export interface CrossReference {
  id: string;
  source: VerseRange;
  targets: CrossReferenceTarget[];
}

export const CROSS_REFERENCES: CrossReference[] = [
  {
    id: 'jean-3-16',
    source: { bookId: 'jean', chapter: 3, verseStart: 16 },
    targets: [
      { bookId: 'romains', chapter: 5, verseStart: 8, relation: 'theme', note: 'L’amour de Dieu démontré.' },
      { bookId: '1 jean', chapter: 4, verseStart: 9, relation: 'echo', note: 'Dieu a envoyé son Fils.' },
    ],
  },
  {
    id: 'jean-1-1',
    source: { bookId: 'jean', chapter: 1, verseStart: 1 },
    targets: [
      { bookId: 'genese', chapter: 1, verseStart: 1, relation: 'echo', note: '« Au commencement… »' },
    ],
  },
  {
    id: 'psaumes-23-1',
    source: { bookId: 'psaumes', chapter: 23, verseStart: 1 },
    targets: [
      { bookId: 'jean', chapter: 10, verseStart: 11, relation: 'fulfillment', note: 'Le bon berger.' },
    ],
  },
  {
    id: 'matthieu-6-9',
    source: { bookId: 'matthieu', chapter: 6, verseStart: 9, verseEnd: 13 },
    targets: [
      { bookId: 'luc', chapter: 11, verseStart: 2, verseEnd: 4, relation: 'parallel', note: 'La prière enseignée.' },
    ],
  },
  {
    id: 'esaie-53',
    source: { bookId: 'ésaïe', chapter: 53, verseStart: 1, verseEnd: 12 },
    targets: [
      { bookId: 'actes', chapter: 8, verseStart: 32, verseEnd: 35, relation: 'quotation', note: 'Lu par l’eunuque éthiopien.' },
    ],
  },
];

// Vrai si la portée [chapter, verse] correspond à la source (verset précis ou
// inclus dans une plage source).
const sourceMatchesVerse = (source: VerseRange, chapter: number, verse: number): boolean => {
  if (source.chapter !== chapter) return false;
  const end = source.verseEnd ?? source.verseStart;
  return verse >= source.verseStart && verse <= end;
};

export const getCrossReferencesForVerse = (
  bookId: string,
  chapter: number,
  verse: number,
): CrossReferenceTarget[] => {
  const targets = CROSS_REFERENCES
    .filter((ref) => ref.source.bookId === bookId && sourceMatchesVerse(ref.source, chapter, verse))
    .flatMap((ref) => ref.targets);
  return dedupeTargets(targets);
};

export const getCrossReferencesForChapter = (
  bookId: string,
  chapter: number,
): CrossReferenceTarget[] => {
  const targets = CROSS_REFERENCES
    .filter((ref) => ref.source.bookId === bookId && ref.source.chapter === chapter)
    .flatMap((ref) => ref.targets);
  return dedupeTargets(targets);
};

const targetKey = (t: VerseRange): string => `${t.bookId}-${t.chapter}-${t.verseStart}-${t.verseEnd ?? t.verseStart}`;

const dedupeTargets = (targets: CrossReferenceTarget[]): CrossReferenceTarget[] => {
  const seen = new Set<string>();
  return targets.filter((t) => {
    const key = targetKey(t);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// « Romains 5:8 » ou « Luc 11:2-4 ».
export const formatCrossReference = (range: VerseRange): string => {
  const base = `${getBookName(range.bookId)} ${range.chapter}:${range.verseStart}`;
  return range.verseEnd && range.verseEnd !== range.verseStart ? `${base}-${range.verseEnd}` : base;
};
