import type { Theme } from '../store/useSettingsStore';

export interface ThemeMeta {
  id: Theme;
  /** Classe appliquée sur <html>, ex. theme-dark */
  cssClass: string;
  label: string;
  mood: string;
  scheme: 'dark' | 'light';
  /** Échantillons pour l'aperçu : [fond, surface, accent, secondaire] */
  swatch: [string, string, string, string];
}

// Atlas Nocturne — cinq ambiances. Les clés Light/Sepia/Dark restent valides
// pour la rétrocompatibilité des préférences déjà enregistrées.
export const THEMES: ThemeMeta[] = [
  {
    id: 'Dark',
    cssClass: 'theme-dark',
    label: 'Nuit d’observatoire',
    mood: 'Bleu-sarcelle profond et laiton',
    scheme: 'dark',
    swatch: ['#0a1517', '#182c2a', '#cba968', '#4fa093'],
  },
  {
    id: 'Nocturne',
    cssClass: 'theme-nocturne',
    label: 'Encre profonde',
    mood: 'Nuit minimale, lune d’argent',
    scheme: 'dark',
    swatch: ['#070b0d', '#141d21', '#97b6c4', '#5aa79a'],
  },
  {
    id: 'Light',
    cssClass: 'theme-light',
    label: 'Atlas de jour',
    mood: 'Vélin froid de cartographe',
    scheme: 'light',
    swatch: ['#e9ece5', '#fcfdf8', '#8c6c2b', '#387b70'],
  },
  {
    id: 'Aube',
    cssClass: 'theme-aube',
    label: 'Aube',
    mood: 'Lumière douce, rose et ambre',
    scheme: 'light',
    swatch: ['#f3ebe5', '#fffaf5', '#b07a3e', '#bf6948'],
  },
  {
    id: 'Sepia',
    cssClass: 'theme-sepia',
    label: 'Parchemin',
    mood: 'Chaleur nostalgique',
    scheme: 'light',
    swatch: ['#ece0cb', '#fff3dc', '#a87a32', '#5f7250'],
  },
];

const FALLBACK = THEMES[0];

export const getThemeMeta = (theme: Theme): ThemeMeta =>
  THEMES.find((entry) => entry.id === theme) ?? FALLBACK;

export const THEME_CLASSES = THEMES.map((entry) => entry.cssClass);
