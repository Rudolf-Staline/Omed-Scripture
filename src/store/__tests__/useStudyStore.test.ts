import { beforeEach, describe, expect, it } from 'vitest';

const memoryStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  } as Storage;
})();
Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true });

import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { useStudyStore } from '../useStudyStore';
import { MAX_STUDY_SESSIONS } from '../../utils/study';

describe('useStudyStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useStudyStore.setState({ sessions: [] });
  });

  it('creates, updates, completes, archives and deletes a study session', () => {
    const id = useStudyStore.getState().createStudySession({ translation: 'lsg', bookId: 'jean', chapter: 3, reference: 'Jean 3' });
    expect(useStudyStore.getState().sessions[0]).toMatchObject({ id, title: 'Étude — Jean 3', status: 'draft' });

    useStudyStore.getState().updateStudySession(id, { observation: 'Le texte parle de nouvelle naissance.', tags: ['foi'] });
    expect(useStudyStore.getState().sessions[0].observation).toContain('nouvelle naissance');

    useStudyStore.getState().completeStudySession(id);
    expect(useStudyStore.getState().sessions[0].status).toBe('completed');
    expect(useStudyStore.getState().sessions[0].completedAt).toEqual(expect.any(String));

    useStudyStore.getState().archiveStudySession(id);
    expect(useStudyStore.getState().sessions[0].status).toBe('archived');

    useStudyStore.getState().deleteStudySession(id);
    expect(useStudyStore.getState().sessions).toEqual([]);
  });

  it('sanitizes invalid loaded data and does not destroy unrelated localStorage', () => {
    localStorage.setItem('unrelated', 'keep');
    useStudyStore.getState().loadStudySessions([
      { bad: 'data' },
      { id: 's1', title: 'Étude', translation: 'lsg', bookId: 'jean', chapter: 3, reference: 'Jean 3', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', status: 'completed', completedAt: '2026-01-02T00:00:00.000Z', observation: 'Observer', interpretation: '', application: '', prayer: '', tags: ['paix'] },
      { id: 's1', title: 'Doublon', translation: 'lsg', bookId: 'jean', chapter: 3, reference: 'Jean 3' },
    ]);
    expect(useStudyStore.getState().sessions).toHaveLength(1);
    expect(useStudyStore.getState().sessions[0].completedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(localStorage.getItem(OMED_STORAGE_KEYS.studySessions)).toContain('Observer');
    expect(localStorage.getItem('unrelated')).toBe('keep');
  });

  it('limits the number of sessions persisted', () => {
    const sessions = Array.from({ length: MAX_STUDY_SESSIONS + 10 }, (_, index) => ({
      id: `s${index}`,
      title: `Étude ${index}`,
      translation: 'lsg',
      bookId: 'jean',
      chapter: 3,
      reference: 'Jean 3',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: `2026-01-01T00:00:${String(index % 60).padStart(2, '0')}.000Z`,
      status: 'draft',
      observation: '',
      interpretation: '',
      application: '',
      prayer: '',
      tags: [],
    }));
    useStudyStore.getState().loadStudySessions(sessions);
    expect(useStudyStore.getState().sessions).toHaveLength(MAX_STUDY_SESSIONS);
  });
});
