import { describe, expect, it } from 'vitest';
import { STUDY_PROMPTS, getStudyPromptOrGeneric, getStudyPromptsForReference } from './studyPrompts';

describe('studyPrompts', () => {
  it('has unique ids and non-empty prompt groups', () => {
    const ids = STUDY_PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of STUDY_PROMPTS) {
      expect(p.prompts.observation.length).toBeGreaterThan(0);
      expect(p.prompts.interpretation.length).toBeGreaterThan(0);
      expect(p.prompts.application.length).toBeGreaterThan(0);
      expect(p.prompts.prayer.length).toBeGreaterThan(0);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it('finds prompts for a known reference', () => {
    expect(getStudyPromptsForReference('jean', 3)[0]?.id).toBe('jean-3');
    expect(getStudyPromptsForReference('jonas', 2)).toEqual([]);
  });

  it('falls back to generic prompts when none dedicated', () => {
    const generic = getStudyPromptOrGeneric('jonas', 2);
    expect(generic.observation.length).toBeGreaterThan(0);
    expect(generic.prayer.length).toBeGreaterThan(0);
  });
});
