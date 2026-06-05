import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { BookOpenText, Search, Bookmark, NotebookPen, CalendarRange, SlidersHorizontal, Cloud, Home } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/search', icon: Search, label: 'Recherche' },
  { to: '/favorites', icon: Bookmark, label: 'Marque-pages' },
  { to: '/notes', icon: NotebookPen, label: 'Notes' },
  { to: '/plans', icon: CalendarRange, label: 'Parcours' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
  'group relative flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-all duration-200',
  isActive
    ? 'border-accent-gold/35 bg-bg-card text-text-primary shadow-[0_18px_45px_-35px_var(--color-shadow)]'
    : 'border-transparent text-text-secondary hover:border-border hover:bg-bg-card/55 hover:text-text-primary'
);

export const Sidebar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const navigate = useNavigate();

  return (
    <>
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col border-r border-border bg-bg-secondary/82 backdrop-blur-xl">
        <div className="relative px-6 pb-7 pt-8">
          <button type="button" onClick={() => navigate('/')} className="group flex w-full items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-gold/30 bg-accent-gold/10 text-accent-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <BookOpenText size={22} strokeWidth={1.45} />
            </span>
            <span>
              <span className="block font-display text-[1.42rem] font-semibold leading-none tracking-tight text-text-primary">Omed</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-text-muted">Scripture</span>
            </span>
          </button>
          <p className="mt-6 max-w-[13rem] text-sm leading-relaxed text-text-secondary">Un scriptorium discret pour lire, noter et revenir au texte.</p>
        </div>

        <div className="px-5 pb-3 text-[11px] font-semibold text-text-muted tracking-[0.2em] uppercase">Navigation</div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass} end={item.to === '/'}>
              {({ isActive }) => (
                <>
                  <span className={clsx('absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-accent-gold transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
                  <item.icon size={18} strokeWidth={1.45} className={isActive ? 'text-accent-gold' : 'text-text-muted group-hover:text-accent-gold'} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="m-4 mt-auto rounded-2xl border border-border bg-bg-card/55 p-4">
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
            <NavLink to="/settings" className={navLinkClass}>
              <SlidersHorizontal size={17} strokeWidth={1.5} />
              Préférences
            </NavLink>
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-text-muted">
              <Cloud size={17} strokeWidth={1.5} className={synced ? 'text-accent-sage' : ''} />
              <span>{synced ? 'Sync active' : 'Sync locale'}</span>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-6 border-t border-border bg-bg-card/96 px-1.5 py-2 shadow-[0_-18px_50px_-34px_var(--color-shadow)] backdrop-blur-xl lg:hidden">
        {[...navItems, { to: '/settings', icon: SlidersHorizontal, label: 'Réglages' }].map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => clsx('flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition-colors', isActive ? 'bg-accent-gold/12 text-accent-gold' : 'text-text-muted hover:text-text-primary')}>
            <item.icon size={18} strokeWidth={1.45} />
            <span className="max-w-full truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
