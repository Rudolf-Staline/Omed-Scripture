import { describe, expect, it } from 'vitest';
import { buildCommands, filterCommands } from '../commandPalette';
import { THEMES } from '../../data/themes';

const READER_PATH = '/read/lsg/jean/3';

describe('commandPalette', () => {
  it('builds navigation, action and theme commands', () => {
    const commands = buildCommands(READER_PATH);

    const reader = commands.find((c) => c.id === 'go-reader');
    expect(reader?.to).toBe(READER_PATH);

    expect(commands.some((c) => c.kind === 'action' && c.actionId === 'meditation')).toBe(true);
    expect(commands.filter((c) => c.kind === 'theme')).toHaveLength(THEMES.length);
  });

  it('exposes a navigate command for every main route', () => {
    const targets = buildCommands(READER_PATH)
      .filter((c) => c.kind === 'navigate')
      .map((c) => c.to);
    ['/', '/review', '/search', '/favorites', '/notes', '/prayer', '/plans', '/settings', '/about'].forEach((route) => {
      expect(targets).toContain(route);
    });
  });

  it('returns all commands for an empty query', () => {
    const commands = buildCommands(READER_PATH);
    expect(filterCommands(commands, '')).toHaveLength(commands.length);
    expect(filterCommands(commands, '   ')).toHaveLength(commands.length);
  });

  it('matches accent-insensitively', () => {
    const commands = buildCommands(READER_PATH);
    const byAccent = filterCommands(commands, 'priere');
    expect(byAccent.some((c) => c.to === '/prayer')).toBe(true);

    const meditation = filterCommands(commands, 'méditer');
    expect(meditation.some((c) => c.actionId === 'meditation')).toBe(true);
  });

  it('ranks label prefix matches above keyword matches', () => {
    const commands = buildCommands(READER_PATH);
    const results = filterCommands(commands, 'rech');
    // "Recherche" (label prefix) should come before keyword-only matches.
    expect(results[0].to).toBe('/search');
  });

  it('finds progress, memory and study commands', () => {
    const commands = buildCommands(READER_PATH);
    expect(filterCommands(commands, 'score').some((c) => c.to === '/review')).toBe(true);
    expect(filterCommands(commands, 'reprise').some((c) => c.to === '/review')).toBe(true);
    expect(filterCommands(commands, 'mémoire').some((c) => c.to === '/memory')).toBe(true);
    expect(filterCommands(commands, 'étude').some((c) => c.to === '/study')).toBe(true);
    expect(filterCommands(commands, 'beta').some((c) => c.to === '/about')).toBe(true);
  });

  it('returns nothing for an unknown term', () => {
    expect(filterCommands(buildCommands(READER_PATH), 'zzzzzz')).toEqual([]);
  });

  it('finds themes by name and scheme keyword', () => {
    const commands = buildCommands(READER_PATH);
    expect(filterCommands(commands, 'encre').some((c) => c.themeId === 'Nocturne')).toBe(true);
    expect(filterCommands(commands, 'sombre').some((c) => c.kind === 'theme')).toBe(true);
  });
});
