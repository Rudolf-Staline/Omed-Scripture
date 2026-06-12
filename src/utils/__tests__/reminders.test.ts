import { beforeEach, describe, expect, it } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';
import { DEFAULT_REMINDER_PREFERENCES, isValidReminderTime, readReminderPreferences, sanitizeReminderPreferences, writeReminderPreferences } from '../reminders';

const createStorage = (): Storage => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    key: () => null,
    get length() { return Object.keys(store).length; },
  } as Storage;
};

describe('reminders utils', () => {
  let storage: Storage;

  beforeEach(() => {
    storage = createStorage();
  });

  it('validates reminder times', () => {
    expect(isValidReminderTime('08:30')).toBe(true);
    expect(isValidReminderTime('24:00')).toBe(false);
    expect(isValidReminderTime('bad')).toBe(false);
  });

  it('returns defaults for invalid localStorage', () => {
    storage.setItem(OMED_STORAGE_KEYS.reminders, 'broken');
    expect(readReminderPreferences(storage)).toEqual(DEFAULT_REMINDER_PREFERENCES);
  });

  it('sanitizes invalid shape without destructive migration', () => {
    const sanitized = sanitizeReminderPreferences({ enabled: true, time: '99:99', useNotifications: 'yes' });
    expect(sanitized.enabled).toBe(true);
    expect(sanitized.time).toBe('08:00');
    expect(sanitized.useNotifications).toBe(false);
  });

  it('writes and reads preferences while leaving other keys alone', () => {
    storage.setItem('other_key', 'keep');
    writeReminderPreferences({ enabled: true, time: '07:15', useNotifications: false, updatedAt: '2026-06-12T00:00:00.000Z' }, storage);
    expect(readReminderPreferences(storage).time).toBe('07:15');
    expect(storage.getItem('other_key')).toBe('keep');
  });
});
