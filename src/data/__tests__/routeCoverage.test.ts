import { describe, expect, it } from 'vitest';
import { APP_ROUTE_PATHS } from '../routes';
import { buildCommands } from '../../utils/commandPalette';
import { buildMobilePrimary, buildNavGroups, MOBILE_MORE_ITEMS, SETTINGS_ITEM } from '../navigation';

const routePatterns = new Set<string>(APP_ROUTE_PATHS);
const readerPath = '/read/lsg/jean/3';
const toPattern = (path: string) => {
  if (path.startsWith('/read/')) return '/read/:translation/:bookId/:chapter';
  if (/^\/plans\/[^/]+$/.test(path)) return '/plans/:planId';
  if (/^\/study\/[^/]+$/.test(path)) return '/study/:sessionId';
  return path;
};

describe('route coverage', () => {
  it('declares the V1 route surface in App', () => {
    expect(APP_ROUTE_PATHS).toEqual([
      '/login', '/onboarding', '/', '/reader', '/read/:translation/:bookId/:chapter', '/search', '/discover',
      '/favorites', '/notes', '/prayer', '/plans', '/plans/:planId', '/settings', '/me', '/collections',
      '/memory', '/review', '/study', '/study/:sessionId', '/more', '*',
    ]);
  });

  it('keeps navigation and command palette links pointed at existing routes', () => {
    const navTargets = [
      ...buildNavGroups(readerPath).flatMap((group) => group.items.map((item) => item.to)),
      ...buildMobilePrimary(readerPath).map((item) => item.to),
      ...MOBILE_MORE_ITEMS.map((item) => item.to),
      SETTINGS_ITEM.to,
      ...buildCommands(readerPath).filter((command) => command.kind === 'navigate').map((command) => command.to ?? ''),
    ];

    expect(navTargets).not.toContain('/more');
    navTargets.forEach((target) => expect(routePatterns.has(toPattern(target))).toBe(true));
  });
});
