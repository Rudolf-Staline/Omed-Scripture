import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export interface ReminderPreferences {
  enabled: boolean;
  time: string;
  useNotifications: boolean;
  updatedAt: string;
}

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  enabled: false,
  time: '08:00',
  useNotifications: false,
  updatedAt: new Date(0).toISOString(),
};

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidReminderTime = (value: unknown): value is string =>
  typeof value === 'string' && TIME_PATTERN.test(value);

export const sanitizeReminderPreferences = (value: unknown): ReminderPreferences => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return DEFAULT_REMINDER_PREFERENCES;
  const record = value as Record<string, unknown>;
  return {
    enabled: typeof record.enabled === 'boolean' ? record.enabled : DEFAULT_REMINDER_PREFERENCES.enabled,
    time: isValidReminderTime(record.time) ? record.time : DEFAULT_REMINDER_PREFERENCES.time,
    useNotifications: typeof record.useNotifications === 'boolean' ? record.useNotifications : false,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
  };
};

export const readReminderPreferences = (storage: Storage = localStorage): ReminderPreferences => {
  try {
    return sanitizeReminderPreferences(JSON.parse(storage.getItem(OMED_STORAGE_KEYS.reminders) ?? 'null'));
  } catch {
    return DEFAULT_REMINDER_PREFERENCES;
  }
};

export const writeReminderPreferences = (preferences: ReminderPreferences, storage: Storage = localStorage): boolean => {
  try {
    storage.setItem(OMED_STORAGE_KEYS.reminders, JSON.stringify(sanitizeReminderPreferences(preferences)));
    return true;
  } catch (error) {
    console.error('Failed to save reminder preferences', error);
    return false;
  }
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

export const requestReminderPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
};
