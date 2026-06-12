import { TOPICS, type Topic } from '../data/topics';
import { READING_PLANS } from '../data/readingPlans';
import type { PreferredTopicId } from '../types/onboarding';
import type { SearchResult } from './bibleApi';
import { getBookName } from './bibleBooks';

export const getRecommendedTopics = (preferredTopics: PreferredTopicId[], limit = 4): Topic[] => {
  const preferred = preferredTopics.map((id) => TOPICS.find((topic) => topic.id === id)).filter((topic): topic is Topic => Boolean(topic));
  const fallback = TOPICS.filter((topic) => !preferred.some((item) => item.id === topic.id));
  return [...preferred, ...fallback].slice(0, limit);
};

export const getPopularTopics = (limit = 6): Topic[] => TOPICS.filter((topic) => topic.references && topic.references.length > 0).slice(0, limit);

export const getSuggestedPassages = (topics: Topic[], limit = 6) => topics.flatMap((topic) => (topic.references ?? []).map((reference) => ({ ...reference, topicId: topic.id, topicLabel: topic.label }))).slice(0, limit);

export const getPlansForTopic = (topic: Topic) => (topic.planIds ?? []).map((id) => READING_PLANS.find((plan) => plan.id === id)).filter((plan): plan is NonNullable<typeof plan> => Boolean(plan));

export const groupSearchResultsByBook = (results: SearchResult[]) => {
  const groups = new Map<string, { bookId: string; name: string; items: SearchResult[] }>();
  results.forEach((result) => {
    const existing = groups.get(result.book_id);
    if (existing) existing.items.push(result);
    else groups.set(result.book_id, { bookId: result.book_id, name: getBookName(result.book_id), items: [result] });
  });
  return Array.from(groups.values());
};
