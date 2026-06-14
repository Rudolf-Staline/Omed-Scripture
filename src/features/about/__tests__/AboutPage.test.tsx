import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../AboutPage';

// Mock stores
jest.mock('../../../store/useSettingsStore', () => ({
  useSettingsStore: () => ({
    settings: { theme: 'dark' },
    synced: false,
  }),
}));

jest.mock('../../../utils/diagnostics', () => ({
  createDiagnosticsText: () => 'diagnostic-mock-text',
  APP_VERSION: '0.1.0-test',
}));

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
  configurable: true,
});

describe('AboutPage', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Omed Scripture/i)).toBeInTheDocument();
  });

  it('renders the copy diagnostic button from src/ui Button', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /Copier diagnostic/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders features grid', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Lecture et recherche/i)).toBeInTheDocument();
    expect(screen.getByText(/PWA et hors ligne/i)).toBeInTheDocument();
  });

  it('renders limites beta section via Callout', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Limites honnêtes de la bêta/i)).toBeInTheDocument();
  });

  it('renders GitHub Issues link', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /GitHub Issues/i })).toBeInTheDocument();
  });
});
