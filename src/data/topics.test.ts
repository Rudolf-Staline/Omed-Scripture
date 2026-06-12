import { describe, expect, it } from 'vitest';
import { TOPICS, getTopicById } from './topics';
import { BIBLE_BOOKS } from '../utils/bibleApi';
import { READING_PLANS } from './readingPlans';

describe('topics data', () => {
  it('exposes unique ids and non-empty queries', () => {
    const ids = TOPICS.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
    TOPICS.forEach((topic) => {
      expect(topic.query.trim().length).toBeGreaterThan(0);
      expect(topic.label.trim().length).toBeGreaterThan(0);
      expect(topic.description.trim().length).toBeGreaterThan(0);
    });
  });

  it('only references real book ids so /read links stay valid', () => {
    const bookIds = new Set(BIBLE_BOOKS.map((book) => book.id));
    TOPICS.forEach((topic) => {
      (topic.references ?? []).forEach((ref) => {
        expect(bookIds.has(ref.bookId)).toBe(true);
        expect(ref.chapter).toBeGreaterThan(0);
      });
    });
  });

  it('only references existing reading plans', () => {
    const planIds = new Set(READING_PLANS.map((plan) => plan.id));
    TOPICS.forEach((topic) => {
      (topic.planIds ?? []).forEach((id) => {
        expect(planIds.has(id)).toBe(true);
      });
    });
  });

  it('looks up topics by id', () => {
    expect(getTopicById('foi')?.label).toBe('Foi');
    expect(getTopicById('inconnu')).toBeUndefined();
  });
});
