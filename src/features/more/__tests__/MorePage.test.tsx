import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MorePage } from '../MorePage';

// Mocks stores
vi.mock('../../../store/useAuthStore', () => ({
  useAuthStore: (sel: (s: { user: null }) => unknown) => sel({ user: null }),
}));

vi.mock('../../../store/useSettingsStore', () => ({
  useSettingsStore: (sel: (s: { synced: boolean }) => unknown) => sel({ synced: false }),
}));

vi.mock('../../../store/useNotesStore', () => ({
  useNotesStore: (sel: (s: { notes: never[] }) => unknown) => sel({ notes: [] }),
}));

vi.mock('../../../store/useFavoritesStore', () => ({
  useFavoritesStore: (sel: (s: { favorites: never[] }) => unknown) => sel({ favorites: [] }),
}));

vi.mock('../../../store/useMemoryStore', () => ({
  useMemoryStore: (sel: (s: { memoryVerses: never[] }) => unknown) => sel({ memoryVerses: [] }),
}));

vi.mock('../../../store/usePrayerStore', () => ({
  usePrayerStore: (sel: (s: { prayers: never[] }) => unknown) => sel({ prayers: [] }),
}));

vi.mock('../../../store/useDailyRoutineStore', () => ({
  useDailyRoutineStore: (sel: (s: { days: never[] }) => unknown) => sel({ days: [] }),
}));

vi.mock('../../../utils/readingActivity', () => ({
  getReadingDays: () => [],
}));

vi.mock('../../../utils/dailyActivity', () => ({
  getUnifiedDailyActivity: () => [],
  getUnifiedStreak: () => 0,
  timestampsToDayKeys: () => [],
}));

vi.mock('../../../utils/memory', () => ({
  getMemoryStats: () => ({ due: 0, total: 0 }),
}));

describe('MorePage', () => {
  it('renders without crashing', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(html).toContain('Espace personnel');
  });

  it('renders Paramètres menu item', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(html).toContain('Paramètres');
  });

  it('renders stats grid cards', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(html).toContain('Notes');
    expect(html).toContain('Favoris');
    expect(html).toContain('À revoir');
    expect(html).toContain('Prières');
  });

  it('renders sync badge', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(html).toContain('Local');
  });

  it('renders Export et sauvegarde section', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    );
    expect(html).toContain('Export et sauvegarde');
  });
});
