export type StudySessionStatus = 'draft' | 'completed' | 'archived';

export interface StudySession {
  id: string;
  title: string;
  translation: string;
  bookId: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  reference: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  status: StudySessionStatus;
  observation: string;
  interpretation: string;
  application: string;
  prayer: string;
  tags: string[];
  linkedNoteIds?: string[];
  linkedPrayerIds?: string[];
  linkedCollectionIds?: string[];
}

export type StudySessionInput = Pick<StudySession, 'translation' | 'bookId' | 'chapter' | 'reference'> &
  Partial<Pick<StudySession, 'title' | 'verseStart' | 'verseEnd' | 'observation' | 'interpretation' | 'application' | 'prayer' | 'tags' | 'linkedNoteIds' | 'linkedPrayerIds' | 'linkedCollectionIds'>>;

export type StudySessionPatch = Partial<Omit<StudySession, 'id' | 'createdAt'>>;
