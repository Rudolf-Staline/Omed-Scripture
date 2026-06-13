import { describe, expect, it } from 'vitest';
import { buildNavGroups, buildMobilePrimary, MOBILE_MORE_ITEMS, SETTINGS_ITEM } from './navigation';

const READER = '/read/lsg/jean/3';

describe('navigation', () => {
  it('injects the dynamic reader path into the Bible entry', () => {
    const groups = buildNavGroups(READER);
    const bible = groups.flatMap((g) => g.items).find((item) => item.label === 'Bible');
    expect(bible?.to).toBe(READER);
  });

  it('groups destinations into clear modern Bible app sections', () => {
    const groups = buildNavGroups(READER);
    expect(groups.map((g) => g.id)).toEqual(['principal', 'personnel']);
    expect(new Set(groups.map((g) => g.id)).size).toBe(groups.length);
  });

  it('marks only the home entry as exact-match', () => {
    const items = buildNavGroups(READER).flatMap((g) => g.items);
    const ends = items.filter((item) => item.end);
    expect(ends).toHaveLength(1);
    expect(ends[0].to).toBe('/');
  });

  it('mobile dock keeps four primary destinations and Settings lives in More', () => {
    expect(buildMobilePrimary(READER)).toHaveLength(4);
    expect(MOBILE_MORE_ITEMS.some((item) => item.to === SETTINGS_ITEM.to)).toBe(true);
  });

  it('together the rail covers every main route', () => {
    const railTargets = new Set([
      ...buildNavGroups(READER).flatMap((g) => g.items.map((i) => i.to)),
      SETTINGS_ITEM.to,
    ]);
    ['/', READER, '/discover', '/plans', '/favorites', '/memory', '/notes', '/prayer', '/settings'].forEach((route) => {
      expect(railTargets.has(route)).toBe(true);
    });
  });
});
