import type {
  BibleBookFile,
  BibleBookMeta,
  BibleCatalog,
  BibleChapterFile,
  BibleSearchIndexEntry,
  BibleTranslationIndex,
  BibleTranslationMeta,
  BibleVerseFile,
} from '../types/bibleData';

export class BibleDataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BibleDataValidationError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown, path: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new BibleDataValidationError(`${path} doit être une chaîne non vide.`);
  }
  return value;
};

const asPositiveInteger = (value: unknown, path: string): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    throw new BibleDataValidationError(`${path} doit être un entier positif.`);
  }
  return value;
};

const asStringArray = (value: unknown, path: string): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    throw new BibleDataValidationError(`${path} doit être une liste de chaînes non vides.`);
  }
  return value;
};

export const normalizeBookId = (value: string): string =>
  value.trim().toLowerCase().normalize('NFC').replace(/\s+/g, ' ');

const validateTranslationMeta = (value: unknown, path: string): BibleTranslationMeta => {
  if (!isRecord(value)) throw new BibleDataValidationError(`${path} doit être un objet.`);
  const direction = asString(value.direction, `${path}.direction`);
  if (direction !== 'ltr' && direction !== 'rtl') throw new BibleDataValidationError(`${path}.direction doit valoir ltr ou rtl.`);
  const availability = asString(value.availability, `${path}.availability`);
  if (!['static', 'api-only', 'partial'].includes(availability)) {
    throw new BibleDataValidationError(`${path}.availability est invalide.`);
  }
  return {
    id: normalizeBookId(asString(value.id, `${path}.id`)),
    name: asString(value.name, `${path}.name`),
    shortName: asString(value.shortName, `${path}.shortName`),
    language: asString(value.language, `${path}.language`),
    direction,
    source: asString(value.source, `${path}.source`),
    license: asString(value.license, `${path}.license`),
    availability: availability as BibleTranslationMeta['availability'],
    indexPath: typeof value.indexPath === 'string' ? value.indexPath : undefined,
    searchIndexPath: typeof value.searchIndexPath === 'string' ? value.searchIndexPath : undefined,
    notes: typeof value.notes === 'string' ? value.notes : undefined,
  };
};

export const validateCatalog = (value: unknown): BibleCatalog => {
  if (!isRecord(value)) throw new BibleDataValidationError('catalog doit être un objet.');
  if (value.schemaVersion !== 1) throw new BibleDataValidationError('catalog.schemaVersion doit valoir 1.');
  if (!Array.isArray(value.translations)) throw new BibleDataValidationError('catalog.translations doit être une liste.');
  const translations = value.translations.map((item, index) => validateTranslationMeta(item, `catalog.translations[${index}]`));
  const ids = new Set<string>();
  for (const translation of translations) {
    if (ids.has(translation.id)) throw new BibleDataValidationError(`Traduction dupliquée: ${translation.id}.`);
    ids.add(translation.id);
    if ((translation.availability === 'static' || translation.availability === 'partial') && !translation.indexPath) {
      throw new BibleDataValidationError(`${translation.id} doit définir indexPath.`);
    }
  }
  return { schemaVersion: 1, translations };
};

const validateBookMeta = (value: unknown, path: string): BibleBookMeta => {
  if (!isRecord(value)) throw new BibleDataValidationError(`${path} doit être un objet.`);
  const testament = asString(value.testament, `${path}.testament`);
  if (testament !== 'old' && testament !== 'new') throw new BibleDataValidationError(`${path}.testament doit valoir old ou new.`);
  const availableChapters = value.availableChapters === undefined ? undefined : asStringArray(
    Array.isArray(value.availableChapters) ? value.availableChapters.map(String) : value.availableChapters,
    `${path}.availableChapters`
  ).map((item) => asPositiveInteger(Number(item), `${path}.availableChapters[]`));
  return {
    id: normalizeBookId(asString(value.id, `${path}.id`)),
    osisId: asString(value.osisId, `${path}.osisId`),
    name: asString(value.name, `${path}.name`),
    abbreviation: asString(value.abbreviation, `${path}.abbreviation`),
    testament,
    order: asPositiveInteger(value.order, `${path}.order`),
    chapterCount: asPositiveInteger(value.chapterCount, `${path}.chapterCount`),
    path: asString(value.path, `${path}.path`),
    availableChapters,
  };
};

export const validateTranslationIndex = (value: unknown): BibleTranslationIndex => {
  if (!isRecord(value)) throw new BibleDataValidationError('translation index doit être un objet.');
  if (!Array.isArray(value.books)) throw new BibleDataValidationError('translation index.books doit être une liste.');
  const books = value.books.map((item, index) => validateBookMeta(item, `books[${index}]`));
  const ids = new Set<string>();
  for (const book of books) {
    if (ids.has(book.id)) throw new BibleDataValidationError(`Livre dupliqué: ${book.id}.`);
    ids.add(book.id);
  }
  return {
    translationId: normalizeBookId(asString(value.translationId, 'translationId')),
    name: asString(value.name, 'name'),
    shortName: asString(value.shortName, 'shortName'),
    language: asString(value.language, 'language'),
    direction: value.direction === 'rtl' ? 'rtl' : 'ltr',
    books,
  };
};

const validateVerse = (value: unknown, path: string): BibleVerseFile => {
  if (!isRecord(value)) throw new BibleDataValidationError(`${path} doit être un objet.`);
  return {
    verse: asPositiveInteger(value.verse, `${path}.verse`),
    text: asString(value.text, `${path}.text`),
  };
};

const validateChapter = (value: unknown, path: string): BibleChapterFile => {
  if (!isRecord(value)) throw new BibleDataValidationError(`${path} doit être un objet.`);
  if (!Array.isArray(value.verses) || value.verses.length === 0) throw new BibleDataValidationError(`${path}.verses doit être une liste non vide.`);
  return {
    chapter: asPositiveInteger(value.chapter, `${path}.chapter`),
    verses: value.verses.map((item, index) => validateVerse(item, `${path}.verses[${index}]`)),
  };
};

export const validateBookFile = (value: unknown): BibleBookFile => {
  if (!isRecord(value)) throw new BibleDataValidationError('book file doit être un objet.');
  if (!Array.isArray(value.chapters) || value.chapters.length === 0) throw new BibleDataValidationError('book file.chapters doit être une liste non vide.');
  const chapters = value.chapters.map((item, index) => validateChapter(item, `chapters[${index}]`));
  const chapterIds = new Set<number>();
  for (const chapter of chapters) {
    if (chapterIds.has(chapter.chapter)) throw new BibleDataValidationError(`Chapitre dupliqué: ${chapter.chapter}.`);
    chapterIds.add(chapter.chapter);
  }
  return {
    translationId: normalizeBookId(asString(value.translationId, 'translationId')),
    bookId: normalizeBookId(asString(value.bookId, 'bookId')),
    name: asString(value.name, 'name'),
    chapters,
  };
};

export const validateSearchIndex = (value: unknown): BibleSearchIndexEntry[] => {
  if (!Array.isArray(value)) throw new BibleDataValidationError('search-index doit être une liste.');
  return value.map((item, index) => {
    if (!isRecord(item)) throw new BibleDataValidationError(`search-index[${index}] doit être un objet.`);
    return {
      bookId: normalizeBookId(asString(item.bookId, `search-index[${index}].bookId`)),
      chapter: asPositiveInteger(item.chapter, `search-index[${index}].chapter`),
      verse: asPositiveInteger(item.verse, `search-index[${index}].verse`),
      reference: asString(item.reference, `search-index[${index}].reference`),
      text: asString(item.text, `search-index[${index}].text`),
      normalizedText: asString(item.normalizedText, `search-index[${index}].normalizedText`),
    };
  });
};
