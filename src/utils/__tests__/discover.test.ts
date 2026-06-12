import { describe, expect, it } from 'vitest';
import { getPlansForTopic, getPopularTopics, getRecommendedTopics, getSuggestedPassages, groupSearchResultsByBook } from '../discover';
import { getTopicById } from '../../data/topics';

describe('discover utils', () => {
  it('prioritizes onboarding topics', () => {
    expect(getRecommendedTopics(['paix', 'courage'], 2).map((topic) => topic.id)).toEqual(['paix', 'courage']);
  });

  it('exposes popular passages and linked plans', () => {
    const popular = getPopularTopics(2);
    expect(getSuggestedPassages(popular, 2)).toHaveLength(2);
    const topic = getTopicById('paix');
    expect(topic && getPlansForTopic(topic).length).toBeGreaterThan(0);
  });

  it('groups search results by book', () => {
    const groups = groupSearchResultsByBook([
      { book_id: 'jean', chapter_id: '3', text: 'test', reference: 'Jean 3:16', translation_id: 'lsg' },
      { book_id: 'jean', chapter_id: '14', text: 'test', reference: 'Jean 14:1', translation_id: 'lsg' },
      { book_id: 'romains', chapter_id: '8', text: 'test', reference: 'Romains 8:1', translation_id: 'lsg' },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0].items).toHaveLength(2);
  });
});
