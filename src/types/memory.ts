export type MemoryReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export type MemoryVerseStatus = 'learning' | 'reviewing' | 'mastered';

export interface MemoryReviewEvent {
  reviewedAt: string;
  grade: MemoryReviewGrade;
}

export interface MemoryVerse {
  id: string;
  verseId: string;
  translation: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  addedAt: string;
  updatedAt: string;
  dueAt: string;
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  lapses: number;
  status: MemoryVerseStatus;
  lastReviewedAt?: string;
  reviewHistory?: MemoryReviewEvent[];
}

export interface MemoryVerseInput {
  verseId: string;
  translation: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}
