import { BookOpenText, Bookmark, Boxes, CalendarRange, Compass, HandHeart, Home, NotebookPen, Settings, UserCircle } from 'lucide-react';
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

export const buildNavGroups = (readerPath: string): NavGroup[] => [
  {
    id: 'principal',
    label: 'Principal',
    items: [
      { to: '/', label: 'Accueil', icon: Home, end: true },
      { to: readerPath, label: 'Bible', icon: BookOpenText },
      { to: '/plans', label: 'Plans', icon: CalendarRange },
      { to: '/discover', label: 'Découvrir', icon: Compass },
      { to: '/me', label: 'Moi', icon: UserCircle },
    ],
  },
  {
    id: 'personnel',
    label: 'Personnel',
    items: [
      { to: '/notes', label: 'Notes', icon: NotebookPen },
      { to: '/favorites', label: 'Favoris', icon: Bookmark },
      { to: '/prayer', label: 'Prière', icon: HandHeart },
      { to: '/collections', label: 'Collections', icon: Boxes },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = { to: '/settings', label: 'Paramètres', icon: Settings };

export const buildMobilePrimary = (readerPath: string): NavItem[] => [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: readerPath, label: 'Bible', icon: BookOpenText },
  { to: '/plans', label: 'Plans', icon: CalendarRange },
  { to: '/discover', label: 'Découvrir', icon: Compass },
];

export const MOBILE_MORE_ITEMS: NavItem[] = [
  { to: '/me', label: 'Moi', icon: UserCircle },
  { to: '/more', label: 'Plus', icon: UserCircle },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/favorites', label: 'Favoris', icon: Bookmark },
  { to: '/prayer', label: 'Prière', icon: HandHeart },
  { to: '/settings', label: 'Paramètres', icon: Settings },
];
