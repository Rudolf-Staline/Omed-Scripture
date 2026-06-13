import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import { DRIVE_FILES, syncFileToDrive } from '../utils/driveSync';
import { formatStudyReference, sanitizeStudySessions } from '../utils/study';
import type { StudySession, StudySessionInput, StudySessionPatch } from '../types/study';
import { useAuthStore } from './useAuthStore';
import { useSettingsStore } from './useSettingsStore';

interface StudyState {
  sessions: StudySession[];
  createStudySession: (input: StudySessionInput) => string;
  updateStudySession: (id: string, patch: StudySessionPatch) => void;
  deleteStudySession: (id: string) => void;
  completeStudySession: (id: string) => void;
  archiveStudySession: (id: string) => void;
  loadStudySessions: (value: unknown) => void;
  sanitizeStudySessions: (value: unknown) => StudySession[];
}

const getStorage = (): Storage | undefined => typeof localStorage === 'undefined' ? undefined : localStorage;
const makeId = () => `study_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const readInitial = (storage: Storage | undefined = getStorage()): StudySession[] => {
  if (!storage) return [];
  try {
    const stored = storage.getItem(OMED_STORAGE_KEYS.studySessions);
    return stored ? sanitizeStudySessions(JSON.parse(stored)) : [];
  } catch (error) {
    console.error('Failed to read study sessions', error);
    return [];
  }
};

const persist = (sessions: StudySession[], storage: Storage | undefined = getStorage()) => {
  if (!storage) return;
  try {
    storage.setItem(OMED_STORAGE_KEYS.studySessions, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to persist study sessions', error);
  }

  const token = useAuthStore.getState().token;
  const synced = useSettingsStore.getState().synced;
  if (token && synced) {
    syncFileToDrive(DRIVE_FILES.studySessions, sessions, token).catch(console.error);
  }
};

export const useStudyStore = create<StudyState>((set) => ({
  sessions: readInitial(),
  createStudySession: (input) => {
    const id = makeId();
    set((state) => {
      const now = new Date().toISOString();
      const reference = input.reference || formatStudyReference(input);
      const session = {
        id,
        title: input.title || `Étude — ${reference}`,
        translation: input.translation,
        bookId: input.bookId,
        chapter: input.chapter,
        verseStart: input.verseStart,
        verseEnd: input.verseEnd,
        reference,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        observation: input.observation ?? '',
        interpretation: input.interpretation ?? '',
        application: input.application ?? '',
        prayer: input.prayer ?? '',
        tags: input.tags ?? [],
        linkedNoteIds: input.linkedNoteIds ?? [],
        linkedPrayerIds: input.linkedPrayerIds ?? [],
        linkedCollectionIds: input.linkedCollectionIds ?? [],
      } satisfies StudySession;
      const next = sanitizeStudySessions([session, ...state.sessions]);
      persist(next);
      return { sessions: next };
    });
    return id;
  },
  updateStudySession: (id, patch) => set((state) => {
    const next = sanitizeStudySessions(state.sessions.map((session) => session.id === id ? { ...session, ...patch, updatedAt: new Date().toISOString() } : session));
    persist(next);
    return { sessions: next };
  }),
  deleteStudySession: (id) => set((state) => {
    const next = state.sessions.filter((session) => session.id !== id);
    persist(next);
    return { sessions: next };
  }),
  completeStudySession: (id) => set((state) => {
    const next = state.sessions.map((session) => session.id === id ? { ...session, status: 'completed' as const, updatedAt: new Date().toISOString() } : session);
    persist(next);
    return { sessions: next };
  }),
  archiveStudySession: (id) => set((state) => {
    const next = state.sessions.map((session) => session.id === id ? { ...session, status: 'archived' as const, updatedAt: new Date().toISOString() } : session);
    persist(next);
    return { sessions: next };
  }),
  loadStudySessions: (value) => {
    const sessions = sanitizeStudySessions(value);
    persist(sessions);
    set({ sessions });
  },
  sanitizeStudySessions,
}));
