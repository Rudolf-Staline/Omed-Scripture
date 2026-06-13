import { getBookName } from './bibleBooks';
import type { StudySession, StudySessionStatus } from '../types/study';

export const MAX_STUDY_SESSIONS = 300;
export const STUDY_TEXT_LIMIT = 6000;
export const STUDY_TITLE_LIMIT = 120;
export const STUDY_REFERENCE_LIMIT = 80;
export const STUDY_TAG_LIMIT = 28;
export const MAX_STUDY_TAGS = 12;

const STATUSES: StudySessionStatus[] = ['draft', 'completed', 'archived'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isIsoString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

export const truncateStudyText = (value: unknown, limit = STUDY_TEXT_LIMIT): string => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, limit);
};

const sanitizeStringList = (value: unknown, limit = 50): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((entry): string[] => {
    if (typeof entry !== 'string') return [];
    const clean = entry.trim().slice(0, STUDY_TAG_LIMIT);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return [];
    seen.add(key);
    return [clean];
  }).slice(0, limit);
};

export const sanitizeStudyTags = (value: unknown): string[] => sanitizeStringList(value, MAX_STUDY_TAGS);

export const formatStudyReference = (input: { bookId: string; chapter: number; verseStart?: number; verseEnd?: number }): string => {
  const base = `${getBookName(input.bookId)} ${input.chapter}`;
  if (!input.verseStart) return base;
  if (input.verseEnd && input.verseEnd !== input.verseStart) return `${base}:${input.verseStart}-${input.verseEnd}`;
  return `${base}:${input.verseStart}`;
};

export const sanitizeStudySessions = (value: unknown): StudySession[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const now = new Date().toISOString();

  return value.flatMap((entry): StudySession[] => {
    if (!isRecord(entry)) return [];
    const id = typeof entry.id === 'string' ? entry.id.trim().slice(0, 80) : '';
    const title = truncateStudyText(entry.title, STUDY_TITLE_LIMIT);
    const translation = typeof entry.translation === 'string' ? entry.translation.trim().slice(0, 24) : '';
    const bookId = typeof entry.bookId === 'string' ? entry.bookId.trim().slice(0, 40) : '';
    const chapter = typeof entry.chapter === 'number' && Number.isInteger(entry.chapter) && entry.chapter > 0 ? entry.chapter : 0;
    if (!id || !title || !translation || !bookId || !chapter || seen.has(id)) return [];
    seen.add(id);

    const verseStart = typeof entry.verseStart === 'number' && Number.isInteger(entry.verseStart) && entry.verseStart > 0 ? entry.verseStart : undefined;
    const verseEnd = typeof entry.verseEnd === 'number' && Number.isInteger(entry.verseEnd) && entry.verseEnd > 0 ? entry.verseEnd : undefined;
    const reference = truncateStudyText(entry.reference, STUDY_REFERENCE_LIMIT) || formatStudyReference({ bookId, chapter, verseStart, verseEnd });

    return [{
      id,
      title,
      translation,
      bookId,
      chapter,
      ...(verseStart ? { verseStart } : {}),
      ...(verseEnd ? { verseEnd } : {}),
      reference,
      createdAt: isIsoString(entry.createdAt) ? entry.createdAt : now,
      updatedAt: isIsoString(entry.updatedAt) ? entry.updatedAt : now,
      status: STATUSES.includes(entry.status as StudySessionStatus) ? entry.status as StudySessionStatus : 'draft',
      observation: truncateStudyText(entry.observation),
      interpretation: truncateStudyText(entry.interpretation),
      application: truncateStudyText(entry.application),
      prayer: truncateStudyText(entry.prayer),
      tags: sanitizeStudyTags(entry.tags),
      linkedNoteIds: sanitizeStringList(entry.linkedNoteIds),
      linkedPrayerIds: sanitizeStringList(entry.linkedPrayerIds),
      linkedCollectionIds: sanitizeStringList(entry.linkedCollectionIds),
    }];
  })
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, MAX_STUDY_SESSIONS);
};

export const getStudyStats = (sessions: StudySession[], referenceDate: Date = new Date()) => {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();
  return {
    total: sessions.length,
    drafts: sessions.filter((session) => session.status === 'draft').length,
    completed: sessions.filter((session) => session.status === 'completed').length,
    archived: sessions.filter((session) => session.status === 'archived').length,
    thisMonth: sessions.filter((session) => {
      const date = new Date(session.createdAt);
      return date.getMonth() === month && date.getFullYear() === year;
    }).length,
  };
};
