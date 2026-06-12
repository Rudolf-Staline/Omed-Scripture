import { describe, expect, it } from 'vitest';
import { isStandaloneDisplay, readInstallPromptDismissed, writeInstallPromptDismissed } from '../pwa';

describe('pwa helpers', () => {
  it('reports not standalone in the vitest environment', () => {
    expect(isStandaloneDisplay()).toBe(false);
  });

  it('validates the install prompt dismissed flag as a boolean string', () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, value); },
    } as Storage;
    expect(readInstallPromptDismissed(storage)).toBe(false);
    expect(writeInstallPromptDismissed(true, storage)).toBe(true);
    expect(readInstallPromptDismissed(storage)).toBe(true);
  });
});
