export type OnboardingGoal = 'daily_reading' | 'study' | 'prayer' | 'plan' | 'notes';
export type DailyGoalMinutes = 5 | 10 | 15 | 'free';
export type PreferredTopicId = 'foi' | 'paix' | 'sagesse' | 'courage' | 'priere' | 'famille' | 'pardon' | 'esperance';

export interface OnboardingPreferences {
  completed: boolean;
  skipped: boolean;
  completedAt?: string;
  preferredTranslation: string;
  primaryGoal: OnboardingGoal;
  topics: PreferredTopicId[];
  dailyGoalMinutes: DailyGoalMinutes;
  preferredReminderTime?: string;
}
