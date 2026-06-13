import { describe, expect, it } from 'vitest';
import { getReviewCenterSummary, sortIsoDateDesc, sortOldestPrayerFirst } from '../reviewCenter';

describe('reviewCenter helpers', () => {
  it('summarizes clear and active review states', () => {
    expect(getReviewCenterSummary({ memoryDue: 0, studyDrafts: 0, activePrayers: 0, activePlans: 0 })).toMatchObject({ totalActions: 0, clear: true });
    expect(getReviewCenterSummary({ memoryDue: 2, studyDrafts: 1, activePrayers: 3, activePlans: 1 })).toMatchObject({ totalActions: 7, clear: false, headline: '7 points à reprendre' });
  });

  it('sorts dated items by newest update first', () => {
    const items = [{ id: 'old', updatedAt: '2026-01-01T08:00:00.000Z' }, { id: 'new', updatedAt: '2026-02-01T08:00:00.000Z' }];
    expect(sortIsoDateDesc(items).map((item) => item.id)).toEqual(['new', 'old']);
  });

  it('sorts prayers by the oldest prayed or modified date first', () => {
    const items = [
      { id: 'recent', dateAdded: 1, dateModified: 20, lastPrayedAt: 30 },
      { id: 'old', dateAdded: 1, dateModified: 10 },
    ];
    expect(sortOldestPrayerFirst(items).map((item) => item.id)).toEqual(['old', 'recent']);
  });
});
