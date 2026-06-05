import { describe, expect, it } from 'vitest';
import { clearOmedLocalData, OMED_LOCAL_STORAGE_KEYS } from './storageKeys';

describe('clearOmedLocalData', () => {
  it('removes only Omed Scripture local storage keys', () => {
    const storage = new Map<string, string>();
    OMED_LOCAL_STORAGE_KEYS.forEach((key) => storage.set(key, 'value'));
    storage.set('third_party_value', 'keep');

    const fakeStorage = {
      removeItem: (key: string) => {
        storage.delete(key);
      },
    } as unknown as Storage;

    const removed = clearOmedLocalData(fakeStorage);

    expect(removed).toEqual(OMED_LOCAL_STORAGE_KEYS);
    expect(storage.has('third_party_value')).toBe(true);
    OMED_LOCAL_STORAGE_KEYS.forEach((key) => expect(storage.has(key)).toBe(false));
  });
});
