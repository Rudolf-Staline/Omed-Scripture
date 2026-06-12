import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Cloud, Search, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBibleStore } from '../store/useBibleStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUiStore } from '../store/useUiStore';
import { buildMobilePrimary, buildNavGroups, MOBILE_MORE_ITEMS, SETTINGS_ITEM } from '../data/navigation';

const desktopLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
  'flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition-colors',
  isActive ? 'bg-accent-gold text-white shadow-[var(--shadow-soft)]' : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
);

const MobileNavLink: React.FC<{
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  end?: boolean;
}> = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => clsx(
      'flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.68rem] font-semibold',
      isActive ? 'bg-accent-gold/14 text-accent-gold' : 'text-text-muted hover:bg-bg-secondary hover:text-text-primary'
    )}
  >
    <Icon size={20} strokeWidth={1.8} />
    <span className="truncate">{label}</span>
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const { translation, bookId, chapter } = useBibleStore();
  const openCommandPalette = useUiStore((state) => state.openCommandPalette);
  const navigate = useNavigate();
  const location = useLocation();
  const readerPath = `/read/${translation}/${bookId}/${chapter}`;
  const navGroups = buildNavGroups(readerPath);
  const mobilePrimary = buildMobilePrimary(readerPath);
  const moreActive = MOBILE_MORE_ITEMS.some((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));

  return (
    <>
      <aside className="hidden border-r border-border bg-bg-card/80 px-4 py-5 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col" aria-label="Navigation principale">
        <button type="button" onClick={() => navigate('/')} className="mb-6 flex items-center gap-3 rounded-3xl px-2 py-2 text-left hover:bg-bg-secondary" aria-label="Retour à l’accueil">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gold text-white"><UserCircle size={22} /></span>
          <span>
            <span className="block text-base font-bold text-text-primary">Omed Scripture</span>
            <span className="block text-xs text-text-muted">Bible, plans, prière</span>
          </span>
        </button>

        <button type="button" onClick={openCommandPalette} className="mb-5 flex min-h-11 items-center gap-3 rounded-2xl border border-border bg-bg-primary px-4 text-sm font-semibold text-text-secondary hover:text-text-primary" aria-label="Ouvrir la recherche et les commandes">
          <Search size={17} /> Rechercher ou ouvrir
        </button>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto" aria-label="Sections">
          {navGroups.map((group) => (
            <div key={group.id}>
              <p className="mb-2 px-4 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-text-muted">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={`${group.id}-${item.label}`} to={item.to} end={item.end} className={desktopLinkClass}>
                    <item.icon size={19} strokeWidth={1.8} /> {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-5 space-y-2 border-t border-border pt-4">
          <NavLink to={SETTINGS_ITEM.to} className={desktopLinkClass}><SETTINGS_ITEM.icon size={19} />{SETTINGS_ITEM.label}</NavLink>
          <div className="flex items-center justify-between rounded-2xl bg-bg-secondary px-4 py-3 text-xs text-text-secondary">
            <span className="flex items-center gap-2"><Cloud size={15} className={synced ? 'text-accent-sage' : 'text-text-muted'} /> {synced ? 'Sync active' : 'Sync locale'}</span>
            <button type="button" onClick={() => { if (!user) navigate('/login'); }} className="font-semibold text-accent-gold">{user ? 'Compte' : 'Connexion'}</button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-2 bottom-[calc(0.5rem+env(safe-area-inset-bottom))] z-50 grid grid-cols-5 gap-1 rounded-[1.7rem] border border-border bg-bg-card/95 p-2 shadow-[var(--shadow-panel)] backdrop-blur-xl lg:hidden" aria-label="Onglets principaux">
        {mobilePrimary.map((item) => <MobileNavLink key={item.label} {...item} />)}
        <NavLink to="/more" className={clsx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.68rem] font-semibold', moreActive ? 'bg-accent-gold/14 text-accent-gold' : 'text-text-muted hover:bg-bg-secondary hover:text-text-primary')}>
          <UserCircle size={20} strokeWidth={1.8} />
          <span>Plus</span>
        </NavLink>
      </nav>
    </>
  );
};
