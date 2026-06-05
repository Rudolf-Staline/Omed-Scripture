import { OMED_STORAGE_KEYS } from '../constants/storageKeys';
import type { FavoriteVerse } from '../store/useFavoritesStore';
import type { Highlight } from '../store/useHighlightsStore';
import type { Note } from '../store/useNotesStore';
import type { PlanProgress } from '../store/usePlansStore';
import type { Settings } from '../store/useSettingsStore';
import type { BibleState } from '../store/useBibleStore';

export const BACKUP_SCHEMA_VERSION = 1;

export type ReadingPositionBackup = Pick<BibleState, 'translation' | 'bookId' | 'chapter'>;

export interface OmedBackup {
  schemaVersion: number;
  exportedAt: string;
  settings: Settings;
  favorites: FavoriteVerse[];
  highlights: Record<string, Highlight>;
  notes: Note[];
  progress: Record<string, PlanProgress>;
  position: ReadingPositionBackup;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isValidReadingPosition = (value: unknown): value is ReadingPositionBackup => {
  if (!isRecord(value)) return false;
  return (
    typeof value.translation === 'string' &&
    typeof value.bookId === 'string' &&
    typeof value.chapter === 'number' &&
    Number.isInteger(value.chapter) &&
    value.chapter > 0
  );
};

export const isValidArray = <T>(value: unknown): value is T[] => Array.isArray(value);
export const isValidRecord = <T>(value: unknown): value is Record<string, T> => isRecord(value);

export const validateBackup = (value: unknown): value is OmedBackup => {
  if (!isRecord(value)) return false;
  return (
    typeof value.schemaVersion === 'number' &&
    typeof value.exportedAt === 'string' &&
    isRecord(value.settings) &&
    Array.isArray(value.favorites) &&
    isRecord(value.highlights) &&
    Array.isArray(value.notes) &&
    isRecord(value.progress) &&
    isValidReadingPosition(value.position)
  );
};

export const createBackup = (data: Omit<OmedBackup, 'schemaVersion' | 'exportedAt'>): OmedBackup => ({
  schemaVersion: BACKUP_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  ...data,
});

export const backupLocalDataBeforeRestore = (storage: Storage = localStorage): string => {
  const snapshot = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    values: Object.values(OMED_STORAGE_KEYS).reduce<Record<string, string | null>>((acc, key) => {
      acc[key] = storage.getItem(key);
      return acc;
    }, {}),
  };

  const key = `omed_scripture_pre_restore_${Date.now()}`;
  storage.setItem(key, JSON.stringify(snapshot));
  return key;
};
