import { describe, expect, it } from 'vitest';
import { sanitizeNotes } from '../../store/useNotesStore';
import { sanitizePrayers } from '../../store/usePrayerStore';
import { sanitizePlanProgress } from '../../store/usePlansStore';
import { sanitizeMemoryVerses } from '../../store/useMemoryStore';
import { sanitizeCollections } from '../../store/useCollectionsStore';
import { sanitizeOnboarding } from '../../store/useOnboardingStore';
import { sanitizeStudySessions } from '../study';

/**
 * Tests de non-régression des données : on garantit que d'anciennes données
 * localStorage (versions antérieures, champs optionnels absents) ne cassent pas
 * l'application après l'ajout des nouvelles fonctionnalités. Les sanitizers sont
 * des fonctions pures : aucune dépendance à localStorage, aucun risque de flaky.
 *
 * Contrat vérifié pour chaque store :
 *  - les données valides anciennes survivent ;
 *  - les champs optionnels manquants sont tolérés ;
 *  - les entrées invalides sont ignorées proprement (jamais de throw) ;
 *  - JSON corrompu / types inattendus → valeur sûre par défaut.
 */

const corruptInputs: unknown[] = [null, undefined, 0, 'corrupted-json-string', true, NaN, { not: 'an array' }];

describe('data compatibility — list sanitizers never throw on garbage', () => {
  const listSanitizers: Array<[string, (v: unknown) => unknown[]]> = [
    ['notes', sanitizeNotes],
    ['prayers', sanitizePrayers],
    ['memory', sanitizeMemoryVerses],
    ['collections', sanitizeCollections],
    ['study', sanitizeStudySessions],
  ];

  it.each(listSanitizers)('%s → [] for any corrupt input', (_name, sanitize) => {
    for (const input of corruptInputs) {
      expect(() => sanitize(input)).not.toThrow();
      expect(Array.isArray(sanitize(input))).toBe(true);
    }
  });

  it.each(listSanitizers)('%s → drops malformed entries inside an array', (_name, sanitize) => {
    expect(sanitize([null, 42, 'x', {}, { id: 'partial' }])).toEqual([]);
  });
});

describe('data compatibility — old notes without optional tags survive', () => {
  it('keeps a legacy note that has no tags array', () => {
    const legacy = { id: 'n1', verseId: 'lsg-jean-3-16', text: 'Ancienne note', verseText: 'Car Dieu…', dateAdded: 100, dateModified: 100 };
    const result = sanitizeNotes([legacy]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('n1');
    expect(result[0].tags ?? []).toEqual([]);
  });
});

describe('data compatibility — old prayers without prayedCount survive', () => {
  it('keeps a legacy prayer lacking prayedCount/lastPrayedAt/answeredAt', () => {
    const legacy = { id: 'p1', title: 'Pour la paix', content: 'Donne ta paix.', category: 'demande', status: 'active', dateAdded: 1, dateModified: 1 };
    const result = sanitizePrayers([legacy]);
    expect(result).toHaveLength(1);
    expect(result[0].prayedCount).toBeUndefined();
  });

  it('rejects a prayer whose new optional field has a wrong type', () => {
    const bad = { id: 'p2', title: 'X', content: 'Y', category: 'demande', status: 'active', dateAdded: 1, dateModified: 1, prayedCount: 'three' };
    expect(sanitizePrayers([bad])).toEqual([]);
  });
});

describe('data compatibility — old plan progress without per-day timestamps', () => {
  it('keeps completedDays and backfills completedAtByDay', () => {
    const legacy = { 'john-21': { planId: 'john-21', completedDays: [1, 2, 3], startDate: 1000 } };
    const result = sanitizePlanProgress(legacy);
    expect(result['john-21'].completedDays).toEqual([1, 2, 3]);
    expect(result['john-21'].completedAtByDay).toEqual({});
  });

  it('returns {} for corrupt plan progress', () => {
    expect(sanitizePlanProgress('nope')).toEqual({});
    expect(sanitizePlanProgress(null)).toEqual({});
  });
});

describe('data compatibility — old memory verses without review history', () => {
  it('keeps the verse and defaults reviewHistory to []', () => {
    const legacy = { id: 'm1', verseId: 'lsg-jean-3-16', translation: 'lsg', bookId: 'jean', chapter: 3, verse: 16, text: 'Car Dieu a tant aimé le monde', reference: 'Jean 3:16' };
    const result = sanitizeMemoryVerses([legacy]);
    expect(result).toHaveLength(1);
    expect(result[0].reviewHistory).toEqual([]);
    expect(result[0].easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});

describe('data compatibility — old study sessions without completedAt', () => {
  it('keeps a legacy completed session and tolerates missing completedAt', () => {
    const legacy = { id: 's1', title: 'Étude de Jean 3', translation: 'lsg', bookId: 'jean', chapter: 3, status: 'completed' };
    const result = sanitizeStudySessions([legacy]);
    expect(result).toHaveLength(1);
    expect(result[0].completedAt).toBeUndefined();
    expect(result[0].createdAt).toBeTruthy();
  });
});

describe('data compatibility — collections with partial item refs', () => {
  it('keeps a valid collection and drops malformed items', () => {
    const legacy = {
      id: 'c1', title: 'Mes versets',
      items: [
        { id: 'i1', type: 'verse', refId: 'lsg-jean-3-16', label: 'Jean 3:16' },
        { id: 'i2', label: 'sans refId' }, // invalide → ignoré
      ],
    };
    const result = sanitizeCollections([legacy]);
    expect(result).toHaveLength(1);
    expect(result[0].items).toHaveLength(1);
    expect(result[0].items[0].id).toBe('i1');
  });
});

describe('data compatibility — onboarding partial/missing keys', () => {
  it('merges partial preferences with defaults', () => {
    const result = sanitizeOnboarding({ completed: true });
    expect(result.completed).toBe(true);
    expect(result.skipped).toBe(false);
    expect(typeof result.preferredTranslation).toBe('string');
  });

  it('returns defaults for corrupt onboarding data', () => {
    const result = sanitizeOnboarding('broken');
    expect(result.completed).toBe(false);
  });
});
