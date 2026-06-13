export interface ReviewCenterCounts {
  memoryDue: number;
  studyDrafts: number;
  activePrayers: number;
  activePlans: number;
}

export interface ReviewCenterSummary extends ReviewCenterCounts {
  totalActions: number;
  clear: boolean;
  headline: string;
}

export const getReviewCenterSummary = (counts: ReviewCenterCounts): ReviewCenterSummary => {
  const totalActions = counts.memoryDue + counts.studyDrafts + counts.activePrayers + counts.activePlans;
  const clear = totalActions === 0;
  const headline = clear
    ? 'Rien de pressant aujourd’hui'
    : `${totalActions} point${totalActions > 1 ? 's' : ''} à reprendre`;

  return { ...counts, totalActions, clear, headline };
};

export const sortIsoDateDesc = <T extends { updatedAt?: string; createdAt?: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => Date.parse(b.updatedAt ?? b.createdAt ?? '') - Date.parse(a.updatedAt ?? a.createdAt ?? ''));

export const sortOldestPrayerFirst = <T extends { lastPrayedAt?: number; dateModified: number; dateAdded: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.lastPrayedAt ?? a.dateModified ?? a.dateAdded) - (b.lastPrayedAt ?? b.dateModified ?? b.dateAdded));
