export const OMED_STORAGE_KEYS = {
  authToken: 'auth_token',
  authUser: 'auth_user',
  authExpiresAt: 'auth_expires_at',
  biblePosition: 'omed_bible_position',
  favorites: 'omed_bible_favorites',
  highlights: 'omed_bible_highlights',
  notes: 'omed_bible_notes',
  settings: 'omed_bible_settings',
  synced: 'omed_bible_synced',
  plans: 'omed_bible_plans',
  chapterCache: 'omed_bible_recent_chapters',
  prayers: 'omed_bible_prayers',
  searchHistory: 'omed_bible_search_history',
  readingActivity: 'omed_bible_reading_activity',
  dailyRoutine: 'omed_bible_daily_routine',
} as const;

export const OMED_LOCAL_STORAGE_KEYS = Object.values(OMED_STORAGE_KEYS);

export const clearOmedLocalData = (storage: Storage = localStorage): string[] => {
  OMED_LOCAL_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
  return [...OMED_LOCAL_STORAGE_KEYS];
};
