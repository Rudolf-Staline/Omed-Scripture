export type ProgressLevel = 'repos' | 'leger' | 'solide' | 'profond';

export interface DailyProgressBreakdown {
  reading: number;
  routine: number;
  memory: number;
  study: number;
  prayer: number;
  plan: number;
  notes: number;
}

export interface DailyProgressScore {
  dayKey: string;
  score: number;
  level: ProgressLevel;
  completedItems: string[];
  missingItems: string[];
  breakdown: DailyProgressBreakdown;
}
