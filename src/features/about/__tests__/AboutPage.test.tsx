import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AboutPage } from '../AboutPage';

// Mock stores
vi.mock('../../../store/useSettingsStore', () => ({
  useSettingsStore: () => ({
    settings: { theme: 'dark' },
    synced: false,
  }),
}));

vi.mock('../../../utils/diagnostics', () => ({
  createDiagnosticsText: () => 'diagnostic-mock-text',
  APP_VERSION: '0.1.0-test',
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  configurable: true,
});

describe('AboutPage', () => {
  it('renders without crashing', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(html).toContain('Omed Scripture');
  });

  it('renders the copy diagnostic button', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(html).toContain('Copier diagnostic');
  });

  it('renders features grid', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(html).toContain('Lecture et recherche');
    expect(html).toContain('PWA et hors ligne');
  });

  it('renders limites beta section via Callout', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(html).toContain('Limites honnêtes de la bêta');
  });

  it('renders GitHub Issues link', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(html).toContain('GitHub Issues');
  });
});
