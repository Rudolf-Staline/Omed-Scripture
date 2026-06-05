import { create } from 'zustand';
import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  sessionExpired: boolean;
  login: (user: User, token: string, expiresInSeconds?: number) => void;
  logout: () => void;
  restoreSession: () => void;
  expireSession: () => void;
}

const clearStoredSession = () => {
  localStorage.removeItem(OMED_STORAGE_KEYS.authToken);
  localStorage.removeItem(OMED_STORAGE_KEYS.authUser);
  localStorage.removeItem(OMED_STORAGE_KEYS.authExpiresAt);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  sessionExpired: false,
  login: (user, token, expiresInSeconds = 3600) => {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(OMED_STORAGE_KEYS.authToken, token);
    localStorage.setItem(OMED_STORAGE_KEYS.authUser, JSON.stringify(user));
    localStorage.setItem(OMED_STORAGE_KEYS.authExpiresAt, String(expiresAt));
    set({ user, token, sessionExpired: false });
  },
  logout: () => {
    clearStoredSession();
    set({ user: null, token: null, sessionExpired: false });
  },
  restoreSession: () => {
    const token = localStorage.getItem(OMED_STORAGE_KEYS.authToken);
    const userStr = localStorage.getItem(OMED_STORAGE_KEYS.authUser);
    const expiresAt = Number(localStorage.getItem(OMED_STORAGE_KEYS.authExpiresAt) || '0');

    if (!token || !userStr) return;

    if (!expiresAt || Date.now() >= expiresAt) {
      clearStoredSession();
      set({ user: null, token: null, sessionExpired: true });
      return;
    }

    try {
      const user = JSON.parse(userStr) as User;
      set({ user, token, sessionExpired: false });
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      clearStoredSession();
      set({ user: null, token: null, sessionExpired: true });
    }
  },
  expireSession: () => {
    clearStoredSession();
    set({ user: null, token: null, sessionExpired: true });
  },
}));
