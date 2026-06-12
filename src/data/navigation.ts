import { Home, BookOpenText, Search, Bookmark, NotebookPen, HandHeart, CalendarRange, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** `true` si la route ne doit matcher qu'exactement (accueil). */
  end?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

// Navigation regroupée par domaines de sens (Atlas → rails thématiques).
// `readerPath` est dynamique car « Lire » reprend la dernière position.
export const buildNavGroups = (readerPath: string): NavGroup[] => [
  {
    id: 'lecture',
    label: 'Lecture',
    items: [
      { to: '/', label: 'Accueil', icon: Home, end: true },
      { to: readerPath, label: 'Lire', icon: BookOpenText },
      { to: '/search', label: 'Recherche', icon: Search },
      { to: '/plans', label: 'Parcours', icon: CalendarRange },
    ],
  },
  {
    id: 'carnet',
    label: 'Carnet',
    items: [
      { to: '/favorites', label: 'Marque-pages', icon: Bookmark },
      { to: '/notes', label: 'Notes', icon: NotebookPen },
      { to: '/prayer', label: 'Prière', icon: HandHeart },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = { to: '/settings', label: 'Préférences', icon: SlidersHorizontal };

// Dock mobile : 4 destinations primaires + bouton « Plus ».
export const buildMobilePrimary = (readerPath: string): NavItem[] => [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: readerPath, label: 'Lire', icon: BookOpenText },
  { to: '/search', label: 'Recherche', icon: Search },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
];

export const MOBILE_MORE_ITEMS: NavItem[] = [
  { to: '/favorites', label: 'Marque-pages', icon: Bookmark },
  { to: '/prayer', label: 'Prière', icon: HandHeart },
  { to: '/plans', label: 'Parcours', icon: CalendarRange },
  { to: '/settings', label: 'Préférences', icon: SlidersHorizontal },
];
