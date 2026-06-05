import { describe, expect, it } from 'vitest';
import { createBackup, validateBackup } from '../backups';

describe('backup validation', () => {
  it('accepts complete backups with reading position', () => {
    const backup = createBackup({
      settings: {
        defaultTranslation: 'kjv',
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
      position: { translation: 'kjv', bookId: 'jean', chapter: 3 },
    });

    expect(validateBackup(backup)).toBe(true);
  });

  it('rejects backups without valid position', () => {
    expect(validateBackup({ schemaVersion: 1, exportedAt: new Date().toISOString(), settings: {}, favorites: [], highlights: {}, notes: [], progress: {} })).toBe(false);
  });
});
