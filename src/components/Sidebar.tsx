import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { BookOpenText, ChevronUp, Cloud, Command, Compass, MoreHorizontal, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBibleStore } from '../store/useBibleStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUiStore } from '../store/useUiStore';
import { buildMobilePrimary, buildNavGroups, MOBILE_MORE_ITEMS, SETTINGS_ITEM } from '../data/navigation';
import { getBookName } from '../utils/bibleBooks';

const railItemClass = ({ isActive }: { isActive: boolean }) => clsx(
  'group relative flex h-14 w-14 items-center justify-center rounded-[1.35rem] border text-text-muted transition-all duration-200',
  isActive
    ? 'border-accent-gold/55 bg-accent-gold/16 text-accent-gold shadow-[0_20px_55px_-34px_var(--color-shadow)]'
    : 'border-transparent hover:border-border hover:bg-bg-card/70 hover:text-text-primary'
);

const MobileNavLink: React.FC<{
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  end?: boolean;
  prominent?: boolean;
  onClick?: () => void;
}> = ({ to, label, icon: Icon, end, prominent, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) => clsx(
      'relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 text-[0.68rem] font-semibold transition-all',
      prominent ? '-mt-7 min-h-[4.65rem] min-w-[4.65rem] flex-none border border-accent-gold/45 bg-accent-gold text-[#181008] shadow-[0_18px_46px_-24px_var(--color-shadow)]' : '',
      !prominent && isActive ? 'bg-bg-card text-accent-gold' : !prominent ? 'text-text-muted hover:bg-bg-card/70 hover:text-text-primary' : '',
      prominent && isActive ? 'ring-4 ring-accent-gold/20' : ''
    )}
  >
    <Icon size={prominent ? 24 : 19} strokeWidth={1.55} />
    <span>{label}</span>
  </NavLink>
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
  const flatItems = navGroups.flatMap((group) => group.items);
  const byLabel = Object.fromEntries(flatItems.map((item) => [item.label, item]));
  const instrumentGroups = [
    { id: 'lire', label: 'Lire', items: [byLabel.Accueil, byLabel.Lire].filter(Boolean) },
    { id: 'etudier', label: 'Étudier', items: [byLabel.Recherche].filter(Boolean) },
    { id: 'cheminer', label: 'Cheminer', items: [byLabel.Parcours].filter(Boolean) },
    { id: 'personnel', label: 'Personnel', items: [byLabel['Marque-pages'], byLabel.Notes, byLabel.Prière].filter(Boolean) },
  ];
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
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[6.25rem] lg:flex-col lg:items-center border-r border-border/70 bg-bg-deep/78 py-5 shadow-[24px_0_90px_-72px_var(--color-shadow)] backdrop-blur-2xl" aria-label="Rail d’instruments Omed">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.6rem] border border-accent-gold/35 bg-bg-card/60 text-accent-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          aria-label="Retour à l’accueil Omed Scripture"
        >
          <span className="omed-starfield absolute inset-0 opacity-70" aria-hidden="true" />
          <Compass size={28} strokeWidth={1.35} className="relative" />
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-bg-card/45 text-text-muted transition-colors hover:border-accent-gold/35 hover:text-accent-gold"
          aria-label="Ouvrir la palette de commandes"
          title="Commandes"
        >
          <Command size={19} strokeWidth={1.45} />
        </button>

        <nav className="mt-7 flex flex-1 flex-col items-center gap-6 overflow-y-auto px-3" aria-label="Navigation principale">
          {instrumentGroups.map((group) => (
            <div key={group.id} className="flex flex-col items-center gap-2">
              <p className="vertical-rail-label text-[0.62rem] font-bold uppercase tracking-[0.22em] text-text-muted">{group.label}</p>
              <div className="flex flex-col items-center gap-2">
                {group.items.map((item) => (
                  <NavLink key={item.label} to={item.to} end={item.end} className={railItemClass} title={item.label} aria-label={item.label}>
                    {({ isActive }) => (
                      <>
                        <span className={clsx('absolute -right-1 h-8 w-1 rounded-full bg-accent-gold transition-opacity', isActive ? 'opacity-100' : 'opacity-0')} />
                        <item.icon size={21} strokeWidth={1.45} />
                        <span className="pointer-events-none absolute left-[4.45rem] z-40 whitespace-nowrap rounded-xl border border-border bg-bg-card px-3 py-2 text-xs font-semibold text-text-primary opacity-0 shadow-[var(--shadow-panel)] transition-opacity group-hover:opacity-100">
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3 border-t border-border/70 pt-4">
          <button
            type="button"
            onClick={() => navigate(readerPath)}
            className="group flex h-14 w-14 items-center justify-center rounded-[1.3rem] border border-accent-gold/25 bg-accent-gold/10 text-accent-gold transition-transform hover:-translate-y-0.5"
            title={`Reprendre ${getBookName(bookId)} ${chapter}`}
            aria-label={`Reprendre la lecture ${getBookName(bookId)} ${chapter}`}
          >
            <BookOpenText size={21} strokeWidth={1.5} />
          </button>
          <NavLink to={SETTINGS_ITEM.to} className={railItemClass} title={SETTINGS_ITEM.label} aria-label={SETTINGS_ITEM.label}>
            <SETTINGS_ITEM.icon size={20} strokeWidth={1.45} />
          </NavLink>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-bg-card/45 text-text-muted" title={synced ? 'Synchronisé' : 'Hors synchro'}>
            {synced ? <Cloud size={17} strokeWidth={1.45} className="text-accent-sage" /> : <Sparkles size={17} strokeWidth={1.45} />}
          </div>
          <button type="button" onClick={() => { if (!user) navigate('/login'); }} className="h-9 w-9 overflow-hidden rounded-full border border-border bg-bg-card text-center text-xs font-bold leading-9 text-text-secondary transition-colors hover:border-accent-gold/40 hover:text-accent-gold" title={user?.email ?? 'Se connecter'} aria-label={user ? `Profil ${user.email}` : 'Se connecter'}>
            {(user?.email?.[0] ?? 'O').toUpperCase()}
          </button>
        </div>
      </aside>

      <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 lg:hidden">
        {showMore && (
          <div className="mb-3 rounded-[1.8rem] border border-border bg-bg-card/96 p-3 shadow-[var(--shadow-panel)] backdrop-blur-xl" role="dialog" aria-label="Navigation secondaire">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="omed-kicker">Instruments</p>
              <button type="button" onClick={() => setShowMore(false)} className="rounded-full p-2 text-text-muted hover:bg-bg-secondary" aria-label="Fermer le menu secondaire">
                <ChevronUp size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MOBILE_MORE_ITEMS.map((item) => (
                <NavLink key={item.label} to={item.to} onClick={() => setShowMore(false)} className={({ isActive }) => clsx('flex min-h-12 items-center gap-2 rounded-2xl border px-3 text-sm font-semibold', isActive ? 'border-accent-gold/40 bg-accent-gold/12 text-accent-gold' : 'border-border bg-bg-secondary/60 text-text-secondary')}>
                  <item.icon size={17} strokeWidth={1.5} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
        <nav className="grid grid-cols-[1fr_1fr_auto_1fr_1fr] items-end gap-1 rounded-[2rem] border border-border bg-bg-primary/94 p-2 shadow-[0_24px_80px_-36px_var(--color-shadow)] backdrop-blur-2xl" aria-label="Dock de navigation mobile">
          <MobileNavLink {...mobilePrimary[0]} />
          <MobileNavLink {...mobilePrimary[2]} />
          <MobileNavLink to={readerPath} label="Lire" icon={BookOpenText} prominent />
          <MobileNavLink {...mobilePrimary[3]} />
          <button
            type="button"
            onClick={() => setShowMore((value) => !value)}
            aria-expanded={showMore}
            className={clsx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 text-[0.68rem] font-semibold transition-all', isMoreActive || showMore ? 'bg-bg-card text-accent-gold' : 'text-text-muted hover:bg-bg-card/70')}
          >
            <MoreHorizontal size={20} strokeWidth={1.55} />
            <span>Plus</span>
          </button>
        </nav>
      </div>

      <button
        type="button"
        onClick={openCommandPalette}
        className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-bg-card/90 text-text-muted shadow-[var(--shadow-soft)] backdrop-blur-xl transition-colors hover:text-accent-gold lg:hidden"
        aria-label="Ouvrir la recherche et les commandes"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>
    </>
  );
};
