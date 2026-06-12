import { describe, expect, it } from 'vitest';
import { THEMES, THEME_CLASSES, getThemeMeta } from './themes';

describe('themes catalog', () => {
  it('keeps the legacy theme keys for backward compatibility', () => {
    const ids = THEMES.map((t) => t.id);
    ['Light', 'Sepia', 'Dark'].forEach((legacy) => expect(ids).toContain(legacy));
  });

  it('adds the two new Atlas Nocturne themes', () => {
    const ids = THEMES.map((t) => t.id);
    expect(ids).toContain('Nocturne');
    expect(ids).toContain('Aube');
  });

  it('exposes unique css classes prefixed with theme-', () => {
    expect(new Set(THEME_CLASSES).size).toBe(THEME_CLASSES.length);
    THEME_CLASSES.forEach((cls) => expect(cls.startsWith('theme-')).toBe(true));
  });

  it('provides four swatch colors per theme', () => {
    THEMES.forEach((theme) => {
      expect(theme.swatch).toHaveLength(4);
      theme.swatch.forEach((color) => expect(color).toMatch(/^#[0-9a-f]{6}$/i));
    });
  });

  it('resolves metadata with a safe fallback', () => {
    expect(getThemeMeta('Aube').cssClass).toBe('theme-aube');
    // Valeur inconnue → premier thème par défaut.
    expect(getThemeMeta('Inconnu' as never).id).toBe(THEMES[0].id);
  });
});
