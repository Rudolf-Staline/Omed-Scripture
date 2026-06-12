import type { RoutineDay } from '../store/useDailyRoutineStore';
import type { OnboardingPreferences } from '../types/onboarding';
import { TOPICS, type Topic } from '../data/topics';
import { getUnifiedStreak, getUnifiedWeek } from './dailyActivity';
import { formatDayKey } from './readingActivity';

export interface TodayGoalStatus {
  dayKey: string;
  completed: boolean;
  targetMinutes: OnboardingPreferences['dailyGoalMinutes'];
  label: string;
}

export const getTodayGoalStatus = (preferences: OnboardingPreferences, routineDays: RoutineDay[], date: Date = new Date()): TodayGoalStatus => {
  const dayKey = formatDayKey(date);
  const completed = Boolean(routineDays.find((day) => day.date === dayKey)?.completedAt);
  const label = preferences.dailyGoalMinutes === 'free' ? 'Objectif libre' : `${preferences.dailyGoalMinutes} min avec Dieu`;
  return { dayKey, completed, targetMinutes: preferences.dailyGoalMinutes, label };
};

export const getRecommendedTopic = (preferences: OnboardingPreferences, date: Date = new Date()): Topic => {
  const candidates = preferences.topics
    .map((id) => TOPICS.find((topic) => topic.id === id))
    .filter((topic): topic is Topic => Boolean(topic));
  const pool = candidates.length > 0 ? candidates : TOPICS;
  const index = (date.getFullYear() + date.getMonth() + date.getDate()) % pool.length;
  return pool[index];
};

export const getPersonalizedDailyPrompt = (preferences: OnboardingPreferences, date: Date = new Date()): string => {
  const topic = getRecommendedTopic(preferences, date);
  const goalMap: Record<OnboardingPreferences['primaryGoal'], string> = {
    daily_reading: 'Lis lentement et garde une phrase à vivre aujourd’hui.',
    study: 'Observe le contexte, note un mot répété et formule une question.',
    prayer: 'Transforme le passage en prière simple et honnête.',
    plan: 'Avance d’une étape réaliste, même courte.',
    notes: 'Écris une ligne : ce que ce texte révèle, demande ou promet.',
  };
  return `${topic.label} · ${goalMap[preferences.primaryGoal]}`;
};

export const getWeeklyGoalProgress = (routineDays: RoutineDay[], date: Date = new Date()) => {
  const completed = routineDays.filter((day) => day.completedAt).map((day) => day.date);
  const week = getUnifiedWeek(completed, date);
  const completedThisWeek = week.filter((day) => day.active).length;
  return {
    week,
    completedThisWeek,
    totalDays: week.length,
    percent: Math.round((completedThisWeek / week.length) * 100),
    streak: getUnifiedStreak(completed, date),
  };
};
