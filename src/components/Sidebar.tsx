import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useBibleStore } from '../store/useBibleStore';
import { useUiStore } from '../store/useUiStore';
import { Cloud, Compass, Command, MoreHorizontal, Search } from 'lucide-react';
import clsx from 'clsx';
import { buildNavGroups, buildMobilePrimary, MOBILE_MORE_ITEMS, SETTINGS_ITEM } from '../data/navigation';

const railLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
  'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200',
  isActive
    ? 'bg-bg-card/90 text-text-primary shadow-[0_18px_45px_-35px_var(--color-shadow)]'
    : 'text-text-secondary hover:bg-bg-card/55 hover:text-text-primary'
);

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const { translation, bookId, chapter } = useBibleStore();
  const openCommandPalette = useUiStore((state) => state.openCommandPalette);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const readerPath = `/read/${translation}/${bookId}/${chapter}`;
  const navGroups = buildNavGroups(readerPath);
  const mobilePrimary = buildMobilePrimary(readerPath);
  const isMoreActive = MOBILE_MORE_ITEMS.some((item) => location.pathname.startsWith(item.to));

  useEffect(() => {
    if (!showMore) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMore(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showMore]);

  return (
    <>
      {/* ===== Rail latéral desktop, regroupé par domaines ===== */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col border-r border-border bg-bg-secondary/86 shadow-[18px_0_70px_-60px_var(--color-shadow)] backdrop-blur-xl">
        <div className="px-6 pb-5 pt-8">
          <button type="button" onClick={() => navigate('/')} className="group flex w-full items-center gap-3 text-left" aria-label="Retour à l'accueil Omed Scripture">
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-accent-gold/30 bg-accent-gold/10 text-accent-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span className="omed-starfield absolute inset-0" aria-hidden="true" />
              <Compass size={22} strokeWidth={1.4} className="relative" />
            </span>
            <span>
              <span className="block font-display text-[1.42rem] font-semibold leading-none tracking-tight text-text-primary">Omed</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-text-muted">Scripture</span>
            </span>
          </button>

          <button
            type="button"
            onClick={openCommandPalette}
            className="mt-5 flex w-full items-center gap-2 rounded-xl border border-border bg-bg-card/50 px-3 py-2.5 text-sm text-text-muted transition-colors hover:border-accent-gold/35 hover:text-text-primary"
            aria-label="Ouvrir la palette de commandes"
          >
            <Search size={15} strokeWidth={1.6} />
            <span className="flex-1 text-left">Commandes…</span>
            <span className="flex items-center gap-0.5 rounded-md border border-border px-1.5 py-0.5 text-[11px] font-semibold">
              <Command size={10} /> K
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 pb-4" aria-label="Navigation principale">
          {navGroups.map((group) => (
            <div key={group.id}>
              <p className="px-3.5 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink key={item.label} to={item.to} className={railLinkClass} end={item.end}>
                    {({ isActive }) => (
                      <>
                        <span className={clsx('absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent-gold transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
                        <item.icon size={18} strokeWidth={1.45} className={isActive ? 'text-accent-gold' : 'text-text-muted group-hover:text-accent-gold'} />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="m-4 mt-auto omed-card p-4">
          {user ? (
            <div className="mb-4 flex items-center gap-3">
              {user.picture ? <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full ring-1 ring-border" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-brown text-bg-card font-bold">{user.name.charAt(0)}</div>}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">{user.name}</div>
                <div className="truncate text-xs text-text-muted">{user.email}</div>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => navigate('/login')} className="mb-4 w-full rounded-xl border border-border px-3 py-2 text-left text-sm text-text-secondary hover:border-accent-gold/40 hover:text-text-primary">Se connecter</button>
          )}

          <div className="space-y-1.5 border-t border-border/70 pt-3">
            <NavLink to={SETTINGS_ITEM.to} className={railLinkClass}>
              <SETTINGS_ITEM.icon size={17} strokeWidth={1.5} />
              {SETTINGS_ITEM.label}
            </NavLink>
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-text-muted">
              <Cloud size={17} strokeWidth={1.5} className={synced ? 'text-accent-sage' : ''} />
              <span>{synced ? 'Sync active' : 'Sync locale'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Dock de navigation mobile ===== */}
      {showMore && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-transparent lg:hidden"
          aria-label="Fermer le menu mobile"
          onClick={() => setShowMore(false)}
        />
      )}

      <nav className="omed-mobile-nav fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg-card/96 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_50px_-34px_var(--color-shadow)] backdrop-blur-xl lg:hidden" aria-label="Navigation mobile">
        {showMore && (
          <div id="mobile-more-menu" role="menu" className="absolute bottom-full right-2 mb-2 w-56 overflow-hidden rounded-3xl border border-border bg-bg-card/98 p-2 shadow-[var(--shadow-panel)] backdrop-blur-xl">
            {MOBILE_MORE_ITEMS.map((item) => (
              <NavLink key={item.label} to={item.to} onClick={() => setShowMore(false)} className={({ isActive }) => clsx('flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-colors', isActive ? 'bg-accent-gold/12 text-accent-gold' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary')}>
                <item.icon size={18} strokeWidth={1.45} />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="grid grid-cols-5 gap-1">
          {mobilePrimary.map((item) => (
            <NavLink key={item.label} to={item.to} onClick={() => setShowMore(false)} className={({ isActive }) => clsx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 py-1 text-[11px] font-semibold transition-colors', isActive ? 'bg-accent-gold/12 text-accent-gold' : 'text-text-muted hover:text-text-primary')} end={item.end}>
              <item.icon size={19} strokeWidth={1.45} />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setShowMore((open) => !open)} aria-label="Afficher les destinations supplémentaires" className={clsx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 py-1 text-[11px] font-semibold transition-colors', isMoreActive || showMore ? 'bg-accent-gold/12 text-accent-gold' : 'text-text-muted hover:text-text-primary')} aria-expanded={showMore} aria-controls="mobile-more-menu">
            <MoreHorizontal size={19} strokeWidth={1.45} />
            <span>Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
};
