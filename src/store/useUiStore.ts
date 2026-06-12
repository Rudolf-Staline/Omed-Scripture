import { create } from 'zustand';
import type { DailyVerse } from '../utils/dailyVerse';

// État d'interface éphémère (jamais persisté) : command palette et méditation.
interface UiState {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  meditationVerse: DailyVerse | null;
  openMeditation: (verse: DailyVerse) => void;
  closeMeditation: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  meditationVerse: null,
  openMeditation: (verse) => set({ meditationVerse: verse, commandPaletteOpen: false }),
  closeMeditation: () => set({ meditationVerse: null }),
}));
