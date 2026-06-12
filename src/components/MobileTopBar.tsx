import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Command, Cloud, CloudOff } from 'lucide-react';
import { useUiStore } from '../store/useUiStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Barre d'application mobile — nouvelle zone de shell absente jusqu'ici sur
 * petit écran (qui n'avait qu'un dock en bas). Donne une marque persistante,
 * l'accès à la palette de commandes et un témoin de synchronisation.
 */
export const MobileTopBar: React.FC = () => {
  const navigate = useNavigate();
  const openCommandPalette = useUiStore((state) => state.openCommandPalette);
  const synced = useSettingsStore((state) => state.synced);
  const user = useAuthStore((state) => state.user);
  const online = synced && Boolean(user);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-bg-primary/92 px-4 py-2.5 backdrop-blur-xl lg:hidden">
      <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2.5 text-left" aria-label="Accueil Omed Scripture">
        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-accent-gold/30 bg-accent-gold/10 text-accent-gold">
          <span className="omed-starfield absolute inset-0" aria-hidden="true" />
          <Compass size={17} strokeWidth={1.5} className="relative" />
        </span>
        <span className="font-display text-lg font-semibold leading-none tracking-tight text-text-primary">Omed</span>
      </button>

      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted"
          aria-label={online ? 'Synchronisation active' : 'Données locales'}
          title={online ? 'Sync active' : 'Sync locale'}
        >
          {online ? <Cloud size={16} className="text-accent-sage" /> : <CloudOff size={16} />}
        </span>
        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Ouvrir la palette de commandes"
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-bg-card/55 px-2.5 text-text-muted transition-colors hover:border-accent-gold/35 hover:text-text-primary"
        >
          <Command size={15} strokeWidth={1.6} />
        </button>
      </div>
    </header>
  );
};
