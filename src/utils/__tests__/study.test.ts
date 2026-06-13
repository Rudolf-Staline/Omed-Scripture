import { describe, expect, it } from 'vitest';
import { MAX_STUDY_SESSIONS, formatStudyReference, getStudyStats, sanitizeStudySessions } from '../study';

describe('study utils', () => {
  it('formats chapter and verse references', () => {
    expect(formatStudyReference({ bookId: 'jean', chapter: 3 })).toBe('Jean 3');
    expect(formatStudyReference({ bookId: 'jean', chapter: 3, verseStart: 16 })).toBe('Jean 3:16');
    expect(formatStudyReference({ bookId: 'jean', chapter: 3, verseStart: 16, verseEnd: 18 })).toBe('Jean 3:16-18');
  });

  it('sanitizes invalid, duplicate and oversized study sessions', () => {
    const long = 'x'.repeat(7000);
    const input = [
      { id: 'bad' },
      { id: 's1', title: '  Jean 3 ', translation: 'lsg', bookId: 'jean', chapter: 3, reference: '', createdAt: 'bad', updatedAt: 'bad', status: 'unknown', observation: long, tags: ['foi', 'foi', ''] },
      { id: 's1', title: 'Duplicate', translation: 'lsg', bookId: 'jean', chapter: 3, reference: 'Jean 3' },
    ];

    const sessions = sanitizeStudySessions(input);
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({ id: 's1', title: 'Jean 3', status: 'draft', reference: 'Jean 3', tags: ['foi'] });
    expect(sessions[0].observation.length).toBeLessThanOrEqual(6000);
  });

  it('computes stats and caps session count', () => {
    const now = new Date('2026-06-13T00:00:00.000Z');
    const many = Array.from({ length: MAX_STUDY_SESSIONS + 5 }, (_, index) => ({
      id: `s${index}`,
      title: `Session ${index}`,
      translation: 'lsg',
      bookId: 'jean',
      chapter: 3,
      reference: 'Jean 3',
      createdAt: index === 0 ? '2026-06-01T00:00:00.000Z' : '2026-05-01T00:00:00.000Z',
      updatedAt: `2026-06-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`,
      status: index % 3 === 0 ? 'completed' : 'draft',
      observation: '',
      interpretation: '',
      application: '',
      prayer: '',
      tags: [],
    }));
    const sessions = sanitizeStudySessions(many);
    expect(sessions).toHaveLength(MAX_STUDY_SESSIONS);
    const stats = getStudyStats(sessions, now);
    expect(stats.total).toBe(MAX_STUDY_SESSIONS);
    expect(stats.completed).toBeGreaterThan(0);
    expect(stats.thisMonth).toBeGreaterThan(0);
  });
});
