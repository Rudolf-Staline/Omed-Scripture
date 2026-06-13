export type BibleTextDirection = 'ltr' | 'rtl';
export type BibleDataAvailability = 'static' | 'api-only' | 'partial';
export type BibleTestament = 'old' | 'new';
export type ChapterSource = 'static' | 'cache' | 'api';

export interface BibleTranslationMeta {
  id: string;
  name: string;
  shortName: string;
  language: string;
  direction: BibleTextDirection;
  source: string;
  license: string;
  availability: BibleDataAvailability;
  indexPath?: string;
  searchIndexPath?: string;
  notes?: string;
}

export interface BibleCatalog {
  schemaVersion: 1;
  translations: BibleTranslationMeta[];
}

export interface BibleBookMeta {
  id: string;
  osisId: string;
  name: string;
  abbreviation: string;
  testament: BibleTestament;
  order: number;
  chapterCount: number;
  path: string;
  availableChapters?: number[];
}

export interface BibleTranslationIndex {
  translationId: string;
  name: string;
  shortName: string;
  language: string;
  direction?: BibleTextDirection;
  books: BibleBookMeta[];
}

export interface BibleVerseFile {
  verse: number;
  text: string;
}

export interface BibleChapterFile {
  chapter: number;
  verses: BibleVerseFile[];
}

export interface BibleBookFile {
  translationId: string;
  bookId: string;
  name: string;
  chapters: BibleChapterFile[];
}

export interface BibleSearchIndexEntry {
  bookId: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  normalizedText: string;
}
