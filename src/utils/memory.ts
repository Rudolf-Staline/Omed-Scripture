import type { MemoryReviewGrade, MemoryVerse } from '../types/memory';

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export interface MemoryStats {
  total: number;
  due: number;
  mastered: number;
  learning: number;
  reviewing: number;
  nextDueAt?: string;
}

const addDays = (date: Date, days: number): string => new Date(date.getTime() + days * DAY).toISOString();

export const isMemoryDue = (item: MemoryVerse, now: Date = new Date()): boolean =>
  Date.parse(item.dueAt) <= now.getTime();

export const getDueMemoryVerses = (items: MemoryVerse[], now: Date = new Date()): MemoryVerse[] =>
  items
    .filter((item) => isMemoryDue(item, now))
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt));

export const scheduleMemoryReview = (
  item: MemoryVerse,
  grade: MemoryReviewGrade,
  now: Date = new Date()
): MemoryVerse => {
  const previousInterval = Math.max(0, item.intervalDays);
  const previousEase = Math.max(1.3, item.easeFactor || 2.5);

  let intervalDays = previousInterval;
  let easeFactor = previousEase;
  let lapses = item.lapses;
  let status: MemoryVerse['status'] = item.status;
  let dueAt: string;

  if (grade === 'again') {
    intervalDays = 0;
    easeFactor = Math.max(1.3, previousEase - 0.25);
    lapses += 1;
    status = 'learning';
    dueAt = new Date(now.getTime() + 10 * MINUTE).toISOString();
  } else {
    const multiplier = grade === 'hard' ? 1.2 : grade === 'good' ? previousEase : previousEase + 0.8;
    const minimum = grade === 'hard' ? 1 : grade === 'good' ? 2 : 4;
    intervalDays = Math.max(minimum, Math.ceil(Math.max(1, previousInterval) * multiplier));
    easeFactor = Math.max(1.3, previousEase + (grade === 'easy' ? 0.15 : grade === 'hard' ? -0.15 : 0.03));
    status = intervalDays >= 21 && item.reviewCount >= 3 ? 'mastered' : 'reviewing';
    dueAt = addDays(now, intervalDays);
  }

  const reviewedAt = now.toISOString();
  const reviewHistory = [
    { reviewedAt, grade },
    ...(item.reviewHistory ?? []),
  ].slice(0, 50);

  return {
    ...item,
    intervalDays,
    easeFactor,
    lapses,
    status,
    dueAt,
    lastReviewedAt: reviewedAt,
    reviewHistory,
    updatedAt: reviewedAt,
    reviewCount: item.reviewCount + 1,
  };
};

export const getMemoryStats = (items: MemoryVerse[], now: Date = new Date()): MemoryStats => {
  const dueItems = getDueMemoryVerses(items, now);
  const futureDue = items
    .map((item) => item.dueAt)
    .filter((dueAt) => Date.parse(dueAt) > now.getTime())
    .sort((a, b) => Date.parse(a) - Date.parse(b));

  return {
    total: items.length,
    due: dueItems.length,
    mastered: items.filter((item) => item.status === 'mastered').length,
    learning: items.filter((item) => item.status === 'learning').length,
    reviewing: items.filter((item) => item.status === 'reviewing').length,
    nextDueAt: dueItems[0]?.dueAt ?? futureDue[0],
  };
};

export const formatDueLabel = (isoDate: string, now: Date = new Date()): string => {
  const due = Date.parse(isoDate);
  if (Number.isNaN(due)) return 'date inconnue';
  const diff = due - now.getTime();
  if (diff <= 0) return 'à réviser maintenant';
  if (diff < DAY) {
    const hours = Math.max(1, Math.ceil(diff / (60 * MINUTE)));
    return `dans ${hours} h`;
  }
  const days = Math.ceil(diff / DAY);
  return `dans ${days} j`;
};
