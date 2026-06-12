import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Bookmark, CalendarRange, CheckCircle2, ChevronRight, Copy, HandHeart, Heart, NotebookPen, Search, Settings, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { DAILY_VERSE_TRANSLATION } from '../../data/dailyVerses';
import { READING_PLANS } from '../../data/readingPlans';
import { FEATURED_TRANSLATIONS } from '../../data/translations';
import { formatBibleReference, getBookName } from '../../utils/bibleBooks';
import { getDailyVerse } from '../../utils/dailyVerse';

const formatDate = (value?: number) => value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const notes = useNotesStore((state) => state.notes);
  const progress = usePlansStore((state) => state.progress);
  const prayers = usePrayerStore((state) => state.prayers);
  const synced = useSettingsStore((state) => state.synced);

  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const dailyReference = formatBibleReference(dailyVerse.bookId, dailyVerse.chapter, dailyVerse.verse);
  const dailyVersePath = `/read/${DAILY_VERSE_TRANSLATION}/${dailyVerse.bookId}/${dailyVerse.chapter}`;
  const dailyVerseId = `${DAILY_VERSE_TRANSLATION}-${dailyVerse.bookId}-${dailyVerse.chapter}-${dailyVerse.verse}`;
  const dailyIsFavorite = favorites.some((favorite) => favorite.id === dailyVerseId);
  const dailyShareText = `« ${dailyVerse.text} »\n— ${dailyReference} (${DAILY_VERSE_TRANSLATION.toUpperCase()})`;
  const continuePath = `/read/${translation}/${bookId}/${chapter}`;
  const translationLabel = FEATURED_TRANSLATIONS.find((item) => item.id === translation)?.short ?? translation.toUpperCase();

  const activePlan = useMemo(() => {
    return READING_PLANS
      .filter((plan) => plan.status !== 'planned' && progress[plan.id])
      .map((plan) => ({ plan, planProgress: progress[plan.id] }))
      .filter(({ plan, planProgress }) => planProgress.completedDays.length < plan.durationDays)
      .sort((a, b) => b.planProgress.startDate - a.planProgress.startDate)[0] ?? null;
  }, [progress]);

  const nextPlanDay = useMemo(() => {
    if (!activePlan) return null;
    const done = new Set(activePlan.planProgress.completedDays);
    return activePlan.plan.readings.find((reading) => !done.has(reading.day)) ?? null;
  }, [activePlan]);

  const latestNote = useMemo(() => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0))[0], [notes]);
  const latestFavorite = useMemo(() => [...favorites].sort((a, b) => b.dateAdded - a.dateAdded)[0], [favorites]);
  const latestPrayer = useMemo(() => [...prayers].sort((a, b) => b.dateModified - a.dateModified)[0], [prayers]);

  const copyDailyVerse = async () => {
    try {
      await navigator.clipboard.writeText(dailyShareText);
      toast.success('Verset copié.');
    } catch {
      toast.error('Impossible de copier le verset.');
    }
  };

  const shareDailyVerse = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: dailyReference, text: dailyShareText });
        return;
      } catch {
        return;
      }
    }
    await copyDailyVerse();
  };

  const toggleDailyFavorite = () => {
    if (dailyIsFavorite) {
      removeFavorite(dailyVerseId);
      toast('Retiré des favoris', { icon: '💔' });
      return;
    }
    addFavorite({ id: dailyVerseId, translation: DAILY_VERSE_TRANSLATION, bookId: dailyVerse.bookId, chapter: dailyVerse.chapter, verse: dailyVerse.verse, text: dailyVerse.text, dateAdded: Date.now() });
    toast.success('Ajouté aux favoris.');
  };

  const planPercent = activePlan ? Math.round((activePlan.planProgress.completedDays.length / activePlan.plan.durationDays) * 100) : 0;
  const shortcuts = [
    { to: continuePath, label: 'Bible', icon: BookOpenText },
    { to: '/plans', label: 'Plans', icon: CalendarRange },
    { to: '/search', label: 'Recherche', icon: Search },
    { to: '/notes', label: 'Notes', icon: NotebookPen },
    { to: '/prayer', label: 'Prière', icon: HandHeart },
    { to: '/favorites', label: 'Favoris', icon: Bookmark },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-text-secondary">Bonjour</p>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Omed Scripture</h1>
        </div>
        <Link to="/settings" className="flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-bg-card px-3 text-sm font-semibold text-text-secondary hover:text-text-primary" aria-label="Ouvrir les paramètres">
          <Settings size={18} /> <span className="hidden sm:inline">{synced ? 'Sync active' : 'Paramètres'}</span>
        </Link>
      </header>

      <section className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">Verset du jour</p>
            <h2 className="mt-1 text-xl font-bold text-text-primary">{dailyReference}</h2>
          </div>
          <button type="button" onClick={toggleDailyFavorite} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-secondary text-accent-gold" aria-label={dailyIsFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <Heart size={20} className={dailyIsFavorite ? 'fill-current' : ''} />
          </button>
        </div>
        <p className="text-xl leading-9 text-text-primary sm:text-2xl">“{dailyVerse.text}”</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Link to={dailyVersePath} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white"><BookOpenText size={18} /> Lire le chapitre</Link>
          <button type="button" onClick={copyDailyVerse} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-primary px-4 font-semibold text-text-primary"><Copy size={18} /> Copier</button>
          <button type="button" onClick={shareDailyVerse} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-primary px-4 font-semibold text-text-primary"><Share2 size={18} /> Partager</button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Continuer la lecture</p>
          <h2 className="mt-2 text-2xl font-bold text-text-primary">{getBookName(bookId)} {chapter}</h2>
          <p className="mt-1 text-sm text-text-secondary">{translationLabel} · dernière position sauvegardée</p>
          <Link to={continuePath} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white">Continuer <ChevronRight size={18} /></Link>
        </section>

        <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Plan en cours</p>
          {activePlan ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-text-primary">{activePlan.plan.title}</h2>
              <p className="mt-1 text-sm text-text-secondary">Prochaine lecture : {nextPlanDay?.title ?? 'Plan terminé'}</p>
              <div className="mt-4 h-2 rounded-full bg-bg-secondary"><div className="h-full rounded-full bg-accent-gold" style={{ width: `${planPercent}%` }} /></div>
              <Link to={`/plans/${activePlan.plan.id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white">Continuer le plan <ChevronRight size={18} /></Link>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-2xl font-bold text-text-primary">Commencer un plan</h2>
              <p className="mt-1 text-sm text-text-secondary">Choisissez une lecture guidée courte et réaliste.</p>
              <Link to="/plans" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white">Voir les plans <ChevronRight size={18} /></Link>
            </>
          )}
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-text-primary">Raccourcis</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {shortcuts.map((item) => <Link key={item.label} to={item.to} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border border-border bg-bg-card p-3 text-center font-semibold text-text-primary hover:border-accent-gold/45"><item.icon className="text-accent-gold" size={22} />{item.label}</Link>)}
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
        <h2 className="text-lg font-bold text-text-primary">Activité récente</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Link to="/notes" className="rounded-2xl bg-bg-secondary p-4"><NotebookPen size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernière note</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestNote ? `${formatDate(latestNote.dateModified)} · ${latestNote.text}` : 'Aucune note pour le moment.'}</p></Link>
          <Link to="/favorites" className="rounded-2xl bg-bg-secondary p-4"><Bookmark size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernier favori</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestFavorite ? `${getBookName(latestFavorite.bookId)} ${latestFavorite.chapter}:${latestFavorite.verse}` : 'Aucun favori enregistré.'}</p></Link>
          <Link to="/prayer" className="rounded-2xl bg-bg-secondary p-4"><CheckCircle2 size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernière prière</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestPrayer ? `${formatDate(latestPrayer.dateModified)} · ${latestPrayer.title}` : 'Votre journal de prière est prêt.'}</p></Link>
        </div>
      </section>
    </div>
  );
};
