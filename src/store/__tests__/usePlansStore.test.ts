import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { OMED_STORAGE_KEYS } from '../../constants/storageKeys';

vi.mock('../../utils/driveSync', () => ({
  syncFileToDrive: vi.fn().mockResolvedValue(undefined),
  DRIVE_FILES: { plans: 'plans.json' },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

describe('usePlansStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStore = async () => {
    vi.resetModules();
    const { usePlansStore } = await import('../usePlansStore');
    return usePlansStore;
  };

  it('loads initial state from empty localStorage', async () => {
    const store = await setupStore();
    expect(store.getState().progress).toEqual({});
  });

  it('loads initial state from valid localStorage', async () => {
    const mockPlans = { 'plan-1': { planId: 'plan-1', completedDays: [1, 2], startDate: 123 } };
    localStorage.setItem(OMED_STORAGE_KEYS.plans, JSON.stringify(mockPlans));

    const store = await setupStore();
    expect(store.getState().progress).toEqual(mockPlans);
  });

  it('loads initial state from invalid localStorage', async () => {
    localStorage.setItem(OMED_STORAGE_KEYS.plans, 'invalid');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const store = await setupStore();
    expect(store.getState().progress).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('starts a plan and writes to localStorage', async () => {
    const store = await setupStore();
    store.getState().startPlan('plan-2');

    const state = store.getState().progress;
    expect(state['plan-2']).toBeDefined();
    expect(state['plan-2'].planId).toBe('plan-2');
    expect(state['plan-2'].completedDays).toEqual([]);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.plans)!)).toEqual(state);
  });

  it('marks a day complete', async () => {
    const mockPlans = { 'plan-1': { planId: 'plan-1', completedDays: [], startDate: 123 } };
    localStorage.setItem(OMED_STORAGE_KEYS.plans, JSON.stringify(mockPlans));

    const store = await setupStore();
    store.getState().markDayComplete('plan-1', 1);

    expect(store.getState().progress['plan-1'].completedDays).toEqual([1]);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.plans)!)).toEqual(store.getState().progress);
  });

  it('unmarks a day complete', async () => {
    const mockPlans = { 'plan-1': { planId: 'plan-1', completedDays: [1, 2], startDate: 123 } };
    localStorage.setItem(OMED_STORAGE_KEYS.plans, JSON.stringify(mockPlans));

    const store = await setupStore();
    store.getState().unmarkDayComplete('plan-1', 2);

    expect(store.getState().progress['plan-1'].completedDays).toEqual([1]);
    expect(JSON.parse(localStorage.getItem(OMED_STORAGE_KEYS.plans)!)).toEqual(store.getState().progress);
  });

  it('does not touch other localStorage keys', async () => {
    localStorage.setItem('other_key', 'val');
    const store = await setupStore();
    store.getState().startPlan('plan-1');
    expect(localStorage.getItem('other_key')).toBe('val');
  });

  it('calls syncFileToDrive if user is authenticated and synced', async () => {
    const store = await setupStore();
    const { useAuthStore } = await import('../useAuthStore');
    const { useSettingsStore } = await import('../useSettingsStore');
    const { syncFileToDrive } = await import('../../utils/driveSync');

    useAuthStore.setState({ token: 'fake-token' });
    useSettingsStore.setState({ synced: true });

    store.getState().startPlan('plan-3');

    expect(syncFileToDrive).toHaveBeenCalledWith('plans.json', expect.any(Object), 'fake-token');
  });
});
