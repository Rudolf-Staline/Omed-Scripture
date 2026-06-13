import { describe, expect, it } from 'vitest';
import { createBackup, validateBackup } from '../backups';

describe('backup validation', () => {
  it('accepts complete backups with reading position', () => {
    const backup = createBackup({
      settings: {
        defaultTranslation: 'lsg',
        fontSize: 'M',
        lineHeight: 'Relaxed',
        fontFamily: 'Lora',
        theme: 'Light',
        language: 'Français',
        readingWidth: 'Comfortable',
        readingDensity: 'Aired',
        showVerseNumbers: true,
      },
      favorites: [],
      highlights: {},
      notes: [],
      progress: {},
      position: { translation: 'lsg', bookId: 'jean', chapter: 3 },
    });

    expect(validateBackup(backup)).toBe(true);
  });

  it('rejects backups without valid position', () => {
    expect(validateBackup({ schemaVersion: 1, exportedAt: new Date().toISOString(), settings: {}, favorites: [], highlights: {}, notes: [], progress: {} })).toBe(false);
  });

  it('accepts legacy backups without prayers and new backups with prayers', () => {
    const base = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      settings: {},
      favorites: [],
      highlights: {},
      notes: [],
      progress: {},
      position: { translation: 'lsg', bookId: 'jean', chapter: 3 },
    };

    expect(validateBackup(base)).toBe(true);
    expect(validateBackup({ ...base, prayers: [] })).toBe(true);
    expect(validateBackup({ ...base, studySessions: [] })).toBe(true);
    expect(validateBackup({ ...base, prayers: 'invalide' })).toBe(false);
    expect(validateBackup({ ...base, studySessions: 'invalide' })).toBe(false);
  });
});
