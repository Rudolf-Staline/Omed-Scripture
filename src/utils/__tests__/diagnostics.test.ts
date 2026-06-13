import { describe, expect, it } from 'vitest';
import { createDiagnosticsSnapshot, createDiagnosticsText, diagnosticsContainSensitiveTerms } from '../diagnostics';

describe('diagnostics', () => {
  it('creates a stable non-personal diagnostic snapshot', () => {
    const snapshot = createDiagnosticsSnapshot({
      userAgent: 'Vitest Browser',
      online: true,
      route: '/settings',
      theme: 'Light',
      syncEnabled: false,
      date: new Date('2026-06-13T10:00:00.000Z'),
    });

    expect(snapshot).toEqual({
      app: 'Omed Scripture',
      version: '0.1.0-beta',
      userAgent: 'Vitest Browser',
      online: true,
      route: '/settings',
      theme: 'Light',
      syncEnabled: false,
      generatedAt: '2026-06-13T10:00:00.000Z',
    });
  });

  it('formats diagnostics without user content or account fields', () => {
    const text = createDiagnosticsText({
      userAgent: 'Vitest Browser',
      online: false,
      route: '/about',
      theme: 'Nocturne',
      syncEnabled: true,
      date: new Date('2026-06-13T10:00:00.000Z'),
    });

    expect(text).toContain('version: 0.1.0-beta');
    expect(text).toContain('route: /about');
    expect(diagnosticsContainSensitiveTerms(text)).toBe(false);
  });
});
