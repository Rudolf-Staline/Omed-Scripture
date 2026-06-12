import { describe, expect, it } from 'vitest';
import { buildMobilePrimary, buildNavGroups, MOBILE_MORE_ITEMS } from '../navigation';

const hasUniqueLabels = (labels: string[]) => new Set(labels).size === labels.length;

describe('navigation configuration', () => {
  it('keeps desktop primary navigation unique and free of mobile-only More', () => {
    const groups = buildNavGroups('/read/lsg/jean/3');
    const primary = groups.find((group) => group.id === 'principal');
    expect(primary).toBeDefined();
    const labels = primary?.items.map((item) => item.label) ?? [];
    expect(hasUniqueLabels(labels)).toBe(true);
    expect(labels).toEqual(['Accueil', 'Bible', 'Plans', 'Découvrir', 'Moi']);
    expect(labels).not.toContain('Plus');
  });

  it('keeps the mobile dock focused and moves secondary links into the overflow menu', () => {
    const mobileLabels = buildMobilePrimary('/read/lsg/jean/3').map((item) => item.label);
    const moreLabels = MOBILE_MORE_ITEMS.map((item) => item.label);
    expect(mobileLabels).toEqual(['Accueil', 'Bible', 'Plans', 'Découvrir']);
    expect(moreLabels).toContain('Plus');
    expect(moreLabels).toContain('Moi');
    expect(moreLabels).toContain('Collections');
  });
});
