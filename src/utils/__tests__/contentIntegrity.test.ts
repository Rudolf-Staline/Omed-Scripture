import { describe, expect, it } from 'vitest';
import { BIBLE_BOOKS } from '../../data/bibleBooks';
import { READING_PLANS } from '../../data/readingPlans';
import { CROSS_REFERENCES } from '../../data/crossReferences';
import { STUDY_PROMPTS } from '../../data/studyPrompts';

const BOOK_IDS = new Set(BIBLE_BOOKS.map((b) => b.id));
const chaptersFor = (id: string) => BIBLE_BOOKS.find((b) => b.id === id)?.chapters ?? 0;

const expectValidPassage = (label: string, bookId: string, chapter: number) => {
  expect(BOOK_IDS.has(bookId), `${label}: book "${bookId}" inconnu`).toBe(true);
  expect(chapter, `${label}: chapitre ${chapter} hors limites de ${bookId}`).toBeGreaterThanOrEqual(1);
  expect(chapter, `${label}: chapitre ${chapter} hors limites de ${bookId}`).toBeLessThanOrEqual(chaptersFor(bookId));
};

describe('content integrity — reading plans', () => {
  it('every plan passage points to a real book and chapter', () => {
    for (const plan of READING_PLANS) {
      for (const day of plan.readings) {
        for (const p of day.passages) {
          expectValidPassage(`plan ${plan.id} j${day.day}`, p.bookId, p.chapterStart);
          if (p.chapterEnd) expectValidPassage(`plan ${plan.id} j${day.day} end`, p.bookId, p.chapterEnd);
        }
      }
    }
  });
});

describe('content integrity — cross references', () => {
  it('all sources and targets reference real books/chapters', () => {
    for (const ref of CROSS_REFERENCES) {
      expectValidPassage(`xref ${ref.id} source`, ref.source.bookId, ref.source.chapter);
      for (const t of ref.targets) expectValidPassage(`xref ${ref.id} target`, t.bookId, t.chapter);
    }
  });
});

describe('content integrity — study prompts', () => {
  it('all references point to real books/chapters', () => {
    for (const prompt of STUDY_PROMPTS) {
      expectValidPassage(`prompt ${prompt.id}`, prompt.reference.bookId, prompt.reference.chapter);
    }
  });
});

describe('content integrity — no duplicate ids across content sets', () => {
  it('plans, cross-references and study prompts each have unique ids', () => {
    const planIds = READING_PLANS.map((p) => p.id);
    const xrefIds = CROSS_REFERENCES.map((r) => r.id);
    const promptIds = STUDY_PROMPTS.map((p) => p.id);
    expect(new Set(planIds).size).toBe(planIds.length);
    expect(new Set(xrefIds).size).toBe(xrefIds.length);
    expect(new Set(promptIds).size).toBe(promptIds.length);
  });
});
