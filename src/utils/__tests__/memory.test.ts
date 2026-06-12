import { describe, expect, it } from 'vitest';
import { getDueMemoryVerses, getMemoryStats, scheduleMemoryReview } from '../memory';
import type { MemoryVerse } from '../../types/memory';

const baseItem: MemoryVerse = {
  id: 'm1',
  verseId: 'lsg-jean-3-16',
  translation: 'lsg',
  bookId: 'jean',
  chapter: 3,
  verse: 16,
  text: 'Car Dieu a tant aimé le monde...',
  reference: 'Jean 3:16',
  addedAt: '2026-01-01T08:00:00.000Z',
  updatedAt: '2026-01-01T08:00:00.000Z',
  dueAt: '2026-01-01T08:00:00.000Z',
  intervalDays: 0,
  easeFactor: 2.5,
  reviewCount: 0,
  lapses: 0,
  status: 'learning',
};

describe('memory scheduling helpers', () => {
  it('returns due memory verses sorted by due date', () => {
    const now = new Date('2026-01-02T08:00:00.000Z');
    const items = [
      { ...baseItem, id: 'future', dueAt: '2026-01-03T08:00:00.000Z' },
      { ...baseItem, id: 'past-2', dueAt: '2026-01-01T07:00:00.000Z' },
      { ...baseItem, id: 'past-1', dueAt: '2026-01-01T06:00:00.000Z' },
    ];
    expect(getDueMemoryVerses(items, now).map((item) => item.id)).toEqual(['past-1', 'past-2']);
  });

  it('schedules again soon and counts a lapse', () => {
    const reviewed = scheduleMemoryReview(baseItem, 'again', new Date('2026-01-02T08:00:00.000Z'));
    expect(reviewed.status).toBe('learning');
    expect(reviewed.lapses).toBe(1);
    expect(reviewed.reviewCount).toBe(1);
    expect(reviewed.dueAt).toBe('2026-01-02T08:10:00.000Z');
  });

  it('promotes long-running reviews to mastered', () => {
    const reviewed = scheduleMemoryReview({ ...baseItem, intervalDays: 10, reviewCount: 4, status: 'reviewing' }, 'easy', new Date('2026-01-02T08:00:00.000Z'));
    expect(reviewed.status).toBe('mastered');
    expect(reviewed.intervalDays).toBeGreaterThanOrEqual(21);
  });

  it('summarizes memory stats', () => {
    const stats = getMemoryStats([
      baseItem,
      { ...baseItem, id: 'm2', status: 'mastered', dueAt: '2026-01-05T08:00:00.000Z' },
    ], new Date('2026-01-02T08:00:00.000Z'));
    expect(stats).toMatchObject({ total: 2, due: 1, mastered: 1, learning: 1 });
  });
});
