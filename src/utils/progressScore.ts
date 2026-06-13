import type { DailyProgressBreakdown, DailyProgressScore, ProgressLevel } from '../types/progress';
import type { MemoryVerse } from '../types/memory';
import type { StudySession } from '../types/study';
import type { Note } from '../store/useNotesStore';
import type { PrayerEntry } from '../store/usePrayerStore';
import type { PlanProgress } from '../store/usePlansStore';
import { formatDayKey } from './readingActivity';

const WEIGHTS: DailyProgressBreakdown = {
  reading: 20,
  routine: 20,
  memory: 15,
  study: 15,
  prayer: 15,
  plan: 10,
  notes: 5,
};

const emptyBreakdown = (): DailyProgressBreakdown => ({ reading: 0, routine: 0, memory: 0, study: 0, prayer: 0, plan: 0, notes: 0 });

export interface DailyProgressInput {
  dayKey?: string;
  referenceDate?: Date;
  readingDays?: string[];
  routineCompletedDays?: string[];
  memoryVerses?: MemoryVerse[];
  studySessions?: StudySession[];
  prayers?: PrayerEntry[];
  planProgress?: Record<string, PlanProgress>;
  notes?: Note[];
}

const isSameDayKey = (value: string | number | undefined, dayKey: string): boolean => {
  if (value === undefined) return false;
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return formatDayKey(date) === dayKey;
};

const wasMemoryReviewedOnDay = (verse: MemoryVerse, dayKey: string): boolean =>
  verse.reviewHistory?.some((event) => isSameDayKey(event.reviewedAt, dayKey)) ?? isSameDayKey(verse.lastReviewedAt, dayKey);

const isMemoryDueByDay = (verse: MemoryVerse, dayKey: string): boolean => {
  const due = new Date(verse.dueAt);
  if (Number.isNaN(due.getTime())) return false;
  return formatDayKey(due) <= dayKey;
};

const wasStudyActiveOnDay = (session: StudySession, dayKey: string): boolean =>
  isSameDayKey(session.completedAt, dayKey) || isSameDayKey(session.updatedAt, dayKey) || isSameDayKey(session.createdAt, dayKey);

const wasNoteActiveOnDay = (note: Note, dayKey: string): boolean =>
  isSameDayKey(note.dateAdded, dayKey) || isSameDayKey(note.dateModified, dayKey);

const wasPlanAdvancedOnDay = (plan: PlanProgress, dayKey: string): boolean =>
  Boolean(plan.completedAtByDay && Object.values(plan.completedAtByDay).some((completedAt) => isSameDayKey(completedAt, dayKey)));

const getLevel = (score: number): ProgressLevel => {
  if (score >= 75) return 'profond';
  if (score >= 50) return 'solide';
  if (score >= 25) return 'leger';
  return 'repos';
};

export const getProgressLevelLabel = (level: ProgressLevel): string => ({
  repos: 'Repos',
  leger: 'Léger',
  solide: 'Solide',
  profond: 'Profond',
}[level]);

export const getDailyProgressScore = (input: DailyProgressInput = {}): DailyProgressScore => {
  const dayKey = input.dayKey ?? formatDayKey(input.referenceDate ?? new Date());
  const breakdown = emptyBreakdown();
  const completedItems: string[] = [];
  const missingItems: string[] = [];

  if (input.readingDays?.includes(dayKey)) {
    breakdown.reading = WEIGHTS.reading;
    completedItems.push('Lecture du jour');
  } else {
    missingItems.push('Lire un court passage');
  }

  if (input.routineCompletedDays?.includes(dayKey)) {
    breakdown.routine = WEIGHTS.routine;
    completedItems.push('Routine quotidienne');
  } else {
    missingItems.push('Valider la routine douce');
  }

  const memoryVerses = input.memoryVerses ?? [];
  const dueMemory = memoryVerses.filter((verse) => isMemoryDueByDay(verse, dayKey));
  const reviewedToday = memoryVerses.some((verse) => wasMemoryReviewedOnDay(verse, dayKey));
  if (memoryVerses.length === 0) {
    completedItems.push('Mémoire non configurée');
  } else if (reviewedToday || dueMemory.length === 0) {
    breakdown.memory = WEIGHTS.memory;
    completedItems.push(dueMemory.length === 0 ? 'Mémoire à jour' : 'Révision mémoire');
  } else {
    missingItems.push(`Réviser ${dueMemory.length} verset${dueMemory.length > 1 ? 's' : ''}`);
  }

  const studySessions = input.studySessions ?? [];
  if (studySessions.some((session) => session.status !== 'archived' && wasStudyActiveOnDay(session, dayKey))) {
    breakdown.study = WEIGHTS.study;
    completedItems.push('Étude biblique avancée');
  } else if (studySessions.length > 0) {
    missingItems.push('Continuer une étude');
  }

  const prayers = input.prayers ?? [];
  if (prayers.some((prayer) => isSameDayKey(prayer.lastPrayedAt, dayKey))) {
    breakdown.prayer = WEIGHTS.prayer;
    completedItems.push('Prière marquée');
  } else if (prayers.some((prayer) => prayer.status === 'active')) {
    missingItems.push('Prier une intention');
  }

  const plans = Object.values(input.planProgress ?? {});
  if (plans.some((plan) => wasPlanAdvancedOnDay(plan, dayKey))) {
    breakdown.plan = WEIGHTS.plan;
    completedItems.push('Plan de lecture avancé');
  } else if (plans.length > 0) {
    missingItems.push('Continuer un plan');
  }

  const notes = input.notes ?? [];
  if (notes.some((note) => wasNoteActiveOnDay(note, dayKey))) {
    breakdown.notes = WEIGHTS.notes;
    completedItems.push('Note du jour');
  }

  const rawScore = Object.values(breakdown).reduce((total, points) => total + points, 0);
  const score = Math.max(0, Math.min(100, rawScore));
  return { dayKey, score, level: getLevel(score), completedItems, missingItems, breakdown };
};

export const getWeeklyProgressScores = (input: Omit<DailyProgressInput, 'dayKey'> = {}): DailyProgressScore[] => {
  const reference = input.referenceDate ?? new Date();
  const monday = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const weekday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - weekday);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
    return getDailyProgressScore({ ...input, dayKey: formatDayKey(date), referenceDate: date });
  });
};

export const getProgressSuggestion = (score: DailyProgressScore): string => {
  if (score.missingItems.length > 0) return score.missingItems[0];
  if (score.score >= 75) return 'Tout est bien nourri aujourd’hui. Tu peux simplement demeurer dans ce rythme.';
  if (score.score >= 50) return 'Un rythme solide se dessine. Une courte prière peut prolonger ce moment.';
  if (score.score >= 25) return 'Une étape légère suffit : reprendre un verset ou ouvrir la lecture.';
  return 'Commence doucement : une lecture courte ou une prière suffit pour reprendre.';
};
