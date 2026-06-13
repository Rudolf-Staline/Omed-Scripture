import { describe, expect, it } from 'vitest';
import { getDailyProgressScore, getProgressLevelLabel, getProgressSuggestion, getWeeklyProgressScores } from '../progressScore';
import type { MemoryVerse } from '../../types/memory';
import type { StudySession } from '../../types/study';

const dayKey = '2026-06-13';
const iso = '2026-06-13T10:00:00.000Z';
const oldIso = '2026-06-12T10:00:00.000Z';

const memoryVerse = (patch: Partial<MemoryVerse> = {}): MemoryVerse => ({
  id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16,
  text: 'texte', reference: 'Jean 3:16', addedAt: oldIso, updatedAt: oldIso, dueAt: oldIso,
  intervalDays: 0, easeFactor: 2.5, reviewCount: 0, lapses: 0, status: 'learning', ...patch,
});

const studySession = (patch: Partial<StudySession> = {}): StudySession => ({
  id: 's1', title: 'Étude', translation: 'lsg', bookId: 'jean', chapter: 3, reference: 'Jean 3',
  createdAt: oldIso, updatedAt: oldIso, status: 'draft', observation: '', interpretation: '', application: '', prayer: '', tags: [], ...patch,
});

describe('progressScore', () => {
  it('returns an empty score for an empty day', () => {
    expect(getDailyProgressScore({ dayKey })).toMatchObject({ score: 0, level: 'repos', breakdown: { reading: 0, routine: 0 } });
  });

  it('scores routine alone', () => {
    expect(getDailyProgressScore({ dayKey, routineCompletedDays: [dayKey] }).score).toBe(20);
  });

  it('scores reading plus routine', () => {
    expect(getDailyProgressScore({ dayKey, readingDays: [dayKey], routineCompletedDays: [dayKey] }).score).toBe(40);
  });

  it('does not count due memory when it was not reviewed', () => {
    const score = getDailyProgressScore({ dayKey, memoryVerses: [memoryVerse()] });
    expect(score.breakdown.memory).toBe(0);
    expect(score.missingItems).toContain('Réviser 1 verset');
  });

  it('counts due memory reviewed today', () => {
    const score = getDailyProgressScore({ dayKey, memoryVerses: [memoryVerse({ reviewHistory: [{ reviewedAt: iso, grade: 'good' }] })] });
    expect(score.breakdown.memory).toBe(15);
  });

  it('counts memory as current when nothing is due', () => {
    const score = getDailyProgressScore({ dayKey, memoryVerses: [memoryVerse({ dueAt: '2026-06-20T10:00:00.000Z' })] });
    expect(score.breakdown.memory).toBe(15);
  });

  it('scores draft and completed study activity', () => {
    expect(getDailyProgressScore({ dayKey, studySessions: [studySession({ updatedAt: iso, status: 'draft' })] }).breakdown.study).toBe(15);
    expect(getDailyProgressScore({ dayKey, studySessions: [studySession({ completedAt: iso, status: 'completed' })] }).breakdown.study).toBe(15);
  });

  it('scores prayer, plan and notes activity on the day only', () => {
    expect(getDailyProgressScore({ dayKey, prayers: [{ id: 'p1', title: 'P', content: 'C', category: 'gratitude', status: 'active', dateAdded: 1, dateModified: 1, lastPrayedAt: Date.parse(iso) }] }).breakdown.prayer).toBe(15);
    expect(getDailyProgressScore({ dayKey, planProgress: { p: { planId: 'p', completedDays: [1], startDate: 1, completedAtByDay: { 1: Date.parse(iso) } } } }).breakdown.plan).toBe(10);
    expect(getDailyProgressScore({ dayKey, notes: [{ id: 'n1', verseId: 'v', text: 'n', verseText: 'v', dateAdded: Date.parse(iso), dateModified: Date.parse(iso) }] }).breakdown.notes).toBe(5);
    expect(getDailyProgressScore({ dayKey, notes: [{ id: 'n1', verseId: 'v', text: 'n', verseText: 'v', dateAdded: Date.parse(oldIso), dateModified: Date.parse(oldIso) }] }).breakdown.notes).toBe(0);
  });

  it('keeps score bounded and assigns correct levels', () => {
    const full = getDailyProgressScore({ dayKey, readingDays: [dayKey], routineCompletedDays: [dayKey], memoryVerses: [memoryVerse({ reviewHistory: [{ reviewedAt: iso, grade: 'easy' }] })], studySessions: [studySession({ updatedAt: iso })], prayers: [{ id: 'p1', title: 'P', content: 'C', category: 'gratitude', status: 'active', dateAdded: 1, dateModified: 1, lastPrayedAt: Date.parse(iso) }], planProgress: { p: { planId: 'p', completedDays: [1], startDate: 1, completedAtByDay: { 1: Date.parse(iso) } } }, notes: [{ id: 'n1', verseId: 'v', text: 'n', verseText: 'v', dateAdded: Date.parse(iso), dateModified: Date.parse(iso) }] });
    expect(full.score).toBe(100);
    expect(full.level).toBe('profond');
    expect(getDailyProgressScore({ dayKey, routineCompletedDays: [dayKey] }).level).toBe('repos');
    expect(getDailyProgressScore({ dayKey, readingDays: [dayKey], routineCompletedDays: [dayKey] }).level).toBe('leger');
    expect(getDailyProgressScore({ dayKey, readingDays: [dayKey], routineCompletedDays: [dayKey], memoryVerses: [memoryVerse({ dueAt: '2026-06-20T10:00:00.000Z' })] }).level).toBe('solide');
  });

  it('labels levels, suggestions and weekly scores', () => {
    expect(getProgressLevelLabel('leger')).toBe('Léger');
    expect(getProgressSuggestion(getDailyProgressScore({ dayKey }))).toContain('Lire');
    expect(getWeeklyProgressScores({ referenceDate: new Date('2026-06-13T12:00:00.000Z') })).toHaveLength(7);
  });
});
