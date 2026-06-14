import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MorePage } from '../MorePage';

// Mocks stores
jest.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (sel: (s: { user: null }) => unknown) => sel({ user: null }),
}));

jest.mock('../../../store/useSettingsStore', () => ({
  useSettingsStore: (sel: (s: { synced: boolean }) => unknown) => sel({ synced: false }),
}));

jest.mock('../../../store/useNotesStore', () => ({
  useNotesStore: (sel: (s: { notes: never[] }) => unknown) => sel({ notes: [] }),
}));

jest.mock('../../../store/useFavoritesStore', () => ({
  useFavoritesStore: (sel: (s: { favorites: never[] }) => unknown) => sel({ favorites: [] }),
}));

jest.mock('../../../store/useMemoryStore', () => ({
  useMemoryStore: (sel: (s: { memoryVerses: never[] }) => unknown) => sel({ memoryVerses: [] }),
}));

jest.mock('../../../store/usePrayerStore', () => ({
  usePrayerStore: (sel: (s: { prayers: never[] }) => unknown) => sel({ prayers: [] }),
}));

jest.mock('../../../store/useDailyRoutineStore', () => ({
  useDailyRoutineStore: (sel: (s: { days: never[] }) => unknown) => sel({ days: [] }),
}));

jest.mock('../../../utils/readingActivity', () => ({
  getReadingDays: () => [],
}));

jest.mock('../../../utils/dailyActivity', () => ({
  getUnifiedDailyActivity: () => [],
  getUnifiedStreak: () => 0,
  timestampsToDayKeys: () => [],
}));

jest.mock('../../../utils/memory', () => ({
  getMemoryStats: () => ({ due: 0, total: 0 }),
}));

describe('MorePage', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Espace personnel/i)).toBeInTheDocument();
  });

  it('renders Paramètres menu item', () => {
    render(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Paramètres/i)).toBeInTheDocument();
  });

  it('renders stats grid cards', () => {
    render(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Favoris/i)).toBeInTheDocument();
    expect(screen.getByText(/À revoir/i)).toBeInTheDocument();
    expect(screen.getByText(/Prières/i)).toBeInTheDocument();
  });

  it('renders sync badge', () => {
    render(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Local/i)).toBeInTheDocument();
  });

  it('renders Export et sauvegarde section', () => {
    render(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Export et sauvegarde/i)).toBeInTheDocument();
  });
});
