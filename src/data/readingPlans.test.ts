import { describe, expect, it } from 'vitest';
import { READING_PLANS } from './readingPlans';
import { BIBLE_BOOKS } from './bibleBooks';

const readyPlans = READING_PLANS.filter((plan) => plan.status !== 'planned');

describe('READING_PLANS integrity', () => {
  it('has unique plan ids', () => {
    const ids = READING_PLANS.map((plan) => plan.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ready plans cover exactly their announced duration', () => {
    readyPlans.forEach((plan) => {
      expect(plan.readings).toHaveLength(plan.durationDays);
      plan.readings.forEach((reading, index) => {
        expect(reading.day).toBe(index + 1);
        expect(reading.passages.length).toBeGreaterThan(0);
      });
    });
  });

  it('only references known books and valid chapters', () => {
    readyPlans.forEach((plan) => {
      plan.readings.forEach((reading) => {
        reading.passages.forEach((passage) => {
          const book = BIBLE_BOOKS.find((b) => b.id === passage.bookId);
          expect(book, `${plan.id} jour ${reading.day} : livre inconnu "${passage.bookId}"`).toBeDefined();
          expect(passage.chapterStart).toBeGreaterThanOrEqual(1);
          expect(passage.chapterStart).toBeLessThanOrEqual(book!.chapters);
          if (passage.chapterEnd !== undefined) {
            expect(passage.chapterEnd).toBeGreaterThanOrEqual(passage.chapterStart);
            expect(passage.chapterEnd).toBeLessThanOrEqual(book!.chapters);
          }
        });
      });
    });
  });

  it('keeps the annual plan honestly marked as planned while empty', () => {
    const annual = READING_PLANS.find((plan) => plan.id === 'bible-year-planned');
    expect(annual).toBeDefined();
    expect(annual!.readings.length === 0 ? annual!.status : 'ready').toBe('planned');
  });
});
