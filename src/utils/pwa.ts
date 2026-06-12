import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

export const readInstallPromptDismissed = (storage: Storage = localStorage): boolean => {
  try {
    return storage.getItem(OMED_STORAGE_KEYS.pwaInstallDismissed) === 'true';
  } catch {
    return false;
  }
};

export const writeInstallPromptDismissed = (dismissed: boolean, storage: Storage = localStorage): boolean => {
  try {
    storage.setItem(OMED_STORAGE_KEYS.pwaInstallDismissed, dismissed ? 'true' : 'false');
    return true;
  } catch {
    return false;
  }
};

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || import.meta.env.DEV) return null;
  try {
    return await navigator.serviceWorker.register('/service-worker.js');
  } catch (error) {
    console.error('Service worker registration failed', error);
    return null;
  }
};

export const isStandaloneDisplay = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
};
