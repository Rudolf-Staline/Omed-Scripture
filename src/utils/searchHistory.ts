import { OMED_STORAGE_KEYS } from '../constants/storageKeys';

const MAX_HISTORY_ENTRIES = 8;

export const getSearchHistory = (storage: Storage = localStorage): string[] => {
  try {
    const raw = storage.getItem(OMED_STORAGE_KEYS.searchHistory);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0);
  } catch {
    return [];
  }
};

export const addSearchHistoryEntry = (query: string, storage: Storage = localStorage): string[] => {
  const cleaned = query.trim();
  if (!cleaned) return getSearchHistory(storage);

  const history = getSearchHistory(storage).filter(
    (entry) => entry.toLowerCase() !== cleaned.toLowerCase()
  );
  const updated = [cleaned, ...history].slice(0, MAX_HISTORY_ENTRIES);

  try {
    storage.setItem(OMED_STORAGE_KEYS.searchHistory, JSON.stringify(updated));
  } catch {
    // L'historique est un confort : ignorer les erreurs de stockage.
  }
  return updated;
};

export const clearSearchHistory = (storage: Storage = localStorage): void => {
  try {
    storage.removeItem(OMED_STORAGE_KEYS.searchHistory);
  } catch {
    // idem
  }
};
