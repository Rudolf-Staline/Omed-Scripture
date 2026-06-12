import { create } from 'zustand';
import { DEFAULT_REMINDER_PREFERENCES, getNotificationPermission, readReminderPreferences, requestReminderPermission, sanitizeReminderPreferences, writeReminderPreferences } from '../utils/reminders';
import type { ReminderPreferences } from '../utils/reminders';

interface ReminderState {
  preferences: ReminderPreferences;
  permission: NotificationPermission | 'unsupported';
  loadReminders: (value?: unknown) => void;
  updateReminders: (patch: Partial<ReminderPreferences>) => void;
  requestPermission: () => Promise<NotificationPermission | 'unsupported'>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  preferences: readReminderPreferences(),
  permission: getNotificationPermission(),
  loadReminders: (value?: unknown) => {
    const next = value === undefined ? readReminderPreferences() : sanitizeReminderPreferences(value);
    writeReminderPreferences(next);
    set({ preferences: next });
  },
  updateReminders: (patch) => {
    const next = sanitizeReminderPreferences({ ...get().preferences, ...patch, updatedAt: new Date().toISOString() });
    if (!writeReminderPreferences(next)) return;
    set({ preferences: next, permission: getNotificationPermission() });
  },
  requestPermission: async () => {
    const permission = await requestReminderPermission();
    set({ permission });
    if (permission === 'granted') get().updateReminders({ useNotifications: true });
    return permission;
  },
}));

export { DEFAULT_REMINDER_PREFERENCES };
