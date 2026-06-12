import { create } from 'zustand';
import { syncFileToDrive, DRIVE_FILES } from '../utils/driveSync';
import { useAuthStore } from './useAuthStore';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export type FontSize = 'S' | 'M' | 'L' | 'XL';
export type LineHeight = 'Normal' | 'Relaxed' | 'Large';
export type FontFamily = 'Lora' | 'Inter';
export type Theme = 'Light' | 'Sepia' | 'Dark';
export type Language = 'Français' | 'English';
export type ReadingWidth = 'Narrow' | 'Comfortable' | 'Wide';
export type ReadingDensity = 'Compact' | 'Aired';

export interface Settings {
  defaultTranslation: string;
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
  theme: Theme;
  language: Language;
  readingWidth: ReadingWidth;
  readingDensity: ReadingDensity;
  showVerseNumbers: boolean;
}

interface SettingsState {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loadSettings: (settings: Settings) => void;
  synced: boolean;
  setSynced: (synced: boolean) => void;
}

const DEFAULT_SETTINGS: Settings = {
  defaultTranslation: 'lsg',
  fontSize: 'M',
  lineHeight: 'Relaxed',
  fontFamily: 'Lora',
  theme: 'Light',
  language: 'Français',
  readingWidth: 'Comfortable',
  readingDensity: 'Aired',
  showVerseNumbers: true,
};

const getInitialSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(OMED_STORAGE_KEYS.settings);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    console.error('Failed to read settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
};

const getInitialSynced = (): boolean => {
  try {
    return localStorage.getItem(OMED_STORAGE_KEYS.synced) === 'true';
  } catch {
    return false;
  }
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getInitialSettings(),
  synced: getInitialSynced(),
  updateSettings: (newSettings) =>
    set((state) => {
      const updated = { ...state.settings, ...newSettings };
      localStorage.setItem(OMED_STORAGE_KEYS.settings, JSON.stringify(updated));

      const token = useAuthStore.getState().token;
      if (token && state.synced) {
        syncFileToDrive(DRIVE_FILES.settings, updated, token).catch(console.error);
      }

      return { settings: updated };
    }),
  loadSettings: (settings) => {
    const merged = { ...DEFAULT_SETTINGS, ...settings };
    localStorage.setItem(OMED_STORAGE_KEYS.settings, JSON.stringify(merged));
    set({ settings: merged });
  },
  setSynced: (synced) => {
    localStorage.setItem(OMED_STORAGE_KEYS.synced, String(synced));
    set({ synced });
  },
}));
