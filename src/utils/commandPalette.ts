import type { Theme } from '../store/useSettingsStore';
import { THEMES } from '../data/themes';

export type CommandKind = 'navigate' | 'theme' | 'action';

export interface PaletteCommand {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords: string[];
  kind: CommandKind;
  to?: string;
  themeId?: Theme;
  actionId?: 'meditation';
}

// Catalogue de commandes. `readerPath` permet de reprendre la lecture en cours.
export const buildCommands = (readerPath: string): PaletteCommand[] => {
  const navigation: PaletteCommand[] = [
    { id: 'go-home', label: 'Accueil', group: 'Aller à', kind: 'navigate', to: '/', keywords: ['accueil', 'home', 'aujourd', 'tableau'] },
    { id: 'go-reader', label: 'Reprendre la lecture', group: 'Aller à', kind: 'navigate', to: readerPath, keywords: ['lire', 'lecture', 'lecteur', 'bible', 'continuer'] },
    { id: 'go-search', label: 'Recherche', group: 'Aller à', kind: 'navigate', to: '/search', keywords: ['recherche', 'chercher', 'trouver', 'search'] },
    { id: 'go-favorites', label: 'Favoris', group: 'Aller à', kind: 'navigate', to: '/favorites', keywords: ['favoris', 'marque', 'pages', 'versets'] },
    { id: 'go-memory', label: 'Mémorisation', group: 'Aller à', kind: 'navigate', to: '/memory', keywords: ['memoire', 'mémoire', 'memoriser', 'mémoriser', 'reviser', 'réviser', 'versets'] },
    { id: 'go-study', label: 'Études bibliques', group: 'Aller à', kind: 'navigate', to: '/study', keywords: ['etude', 'étude', 'biblique', 'observation', 'interpretation', 'application'] },
    { id: 'go-notes', label: 'Notes', group: 'Aller à', kind: 'navigate', to: '/notes', keywords: ['notes', 'carnet', 'annotations'] },
    { id: 'go-prayer', label: 'Carnet de prière', group: 'Aller à', kind: 'navigate', to: '/prayer', keywords: ['priere', 'prière', 'journal', 'gratitude'] },
    { id: 'go-plans', label: 'Plans de lecture', group: 'Aller à', kind: 'navigate', to: '/plans', keywords: ['parcours', 'plans', 'plan', 'lecture'] },
    { id: 'go-settings', label: 'Paramètres', group: 'Aller à', kind: 'navigate', to: '/settings', keywords: ['reglages', 'réglages', 'parametres', 'paramètres', 'settings', 'theme'] },
  ];

  const actions: PaletteCommand[] = [
    { id: 'action-meditation', label: 'Entrer en méditation', hint: 'Verset du jour, plein écran', group: 'Actions', kind: 'action', actionId: 'meditation', keywords: ['meditation', 'méditation', 'méditer', 'respirer', 'calme', 'plein', 'ecran'] },
  ];

  const themes: PaletteCommand[] = THEMES.map((theme) => ({
    id: `theme-${theme.id}`,
    label: `Thème : ${theme.label}`,
    hint: theme.mood,
    group: 'Apparence',
    kind: 'theme',
    themeId: theme.id,
    keywords: ['theme', 'thème', 'apparence', 'couleur', theme.label.toLowerCase(), theme.scheme === 'dark' ? 'sombre' : 'clair'],
  }));

  return [...navigation, ...actions, ...themes];
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

// Filtre et classe les commandes : priorité aux libellés qui commencent par le
// terme, puis ceux qui le contiennent, puis les correspondances de mots-clés.
export const filterCommands = (commands: PaletteCommand[], query: string): PaletteCommand[] => {
  const term = normalize(query.trim());
  if (!term) return commands;

  const scored = commands
    .map((command) => {
      const label = normalize(command.label);
      let score = -1;
      if (label.startsWith(term)) score = 3;
      else if (label.includes(term)) score = 2;
      else if (command.keywords.some((keyword) => normalize(keyword).includes(term))) score = 1;
      return { command, score };
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((entry) => entry.command);
};
