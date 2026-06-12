import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenText,
  Bookmark,
  CalendarRange,
  ChevronRight,
  Cloud,
  CloudOff,
  Copy,
  Flame,
  HandHeart,
  Heart,
  Moon,
  NotebookPen,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUiStore } from '../../store/useUiStore';
import { READING_PLANS } from '../../data/readingPlans';
import { formatBibleReference, getBookName } from '../../utils/bibleBooks';
import { getDailyVerse } from '../../utils/dailyVerse';
import { DAILY_VERSE_TRANSLATION } from '../../data/dailyVerses';
import { getReadingStreak, getWeekActivity } from '../../utils/readingActivity';

const QUICK_LINKS = [
  { label: 'Lire', to: '/reader', description: 'Reprendre le fil de la lecture.', icon: BookOpenText },
  { label: 'Recherche', to: '/search', description: 'Interroger le texte sans quitter le rythme.', icon: Search },
  { label: 'Notes', to: '/notes', description: 'Relire vos annotations personnelles.', icon: NotebookPen },
  { label: 'Prière', to: '/prayer', description: 'Déposer et suivre vos prières.', icon: HandHeart },
  { label: 'Parcours', to: '/plans', description: 'Avancer jour après jour.', icon: CalendarRange },
];

const getGreeting = (hour: number): string => {
  if (hour < 5) return 'Veille paisible';
  if (hour < 12) return 'Lumière du matin';
  if (hour < 18) return 'Cœur du jour';
  return 'Heure du soir';
};

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const notes = useNotesStore((state) => state.notes);
  const progress = usePlansStore((state) => state.progress);
  const synced = useSettingsStore((state) => state.synced);
  const user = useAuthStore((state) => state.user);
  const openMeditation = useUiStore((state) => state.openMeditation);

  const continuePath = `/read/${translation}/${bookId}/${chapter}`;

  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const weekActivity = useMemo(() => getWeekActivity(), []);
  const streak = useMemo(() => getReadingStreak(), []);
  const readThisWeek = weekActivity.filter((day) => day.read).length;

  const dailyReference = formatBibleReference(dailyVerse.bookId, dailyVerse.chapter, dailyVerse.verse);
  // Le verset du jour est en LSG : on le rattache à cette traduction pour le
  // lien, le favori et le partage, quelle que soit la traduction par défaut.
  const dailyVersePath = `/read/${DAILY_VERSE_TRANSLATION}/${dailyVerse.bookId}/${dailyVerse.chapter}`;
  const dailyVerseId = `${DAILY_VERSE_TRANSLATION}-${dailyVerse.bookId}-${dailyVerse.chapter}-${dailyVerse.verse}`;
  const dailyIsFavorite = favorites.some((f) => f.id === dailyVerseId);
  const dailyShareText = `« ${dailyVerse.text} »\n— ${dailyReference} (${DAILY_VERSE_TRANSLATION.toUpperCase()})`;

  const recentNotes = useMemo(
    () => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)).slice(0, 2),
    [notes]
  );
  const recentFavorites = useMemo(
    () => [...favorites].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 2),
    [favorites]
  );

  const activePlan = useMemo(() => {
    const candidates = READING_PLANS
      .filter((plan) => plan.status !== 'planned' && progress[plan.id])
      .map((plan) => ({ plan, planProgress: progress[plan.id] }))
      .filter(({ plan, planProgress }) => planProgress.completedDays.length < plan.durationDays);
    if (candidates.length === 0) return null;
    return candidates.sort((a, b) => b.planProgress.startDate - a.planProgress.startDate)[0];
  }, [progress]);

  const nextPlanDay = useMemo(() => {
    if (!activePlan) return null;
    const done = new Set(activePlan.planProgress.completedDays);
    const reading = activePlan.plan.readings.find((r) => !done.has(r.day));
    return reading ?? null;
  }, [activePlan]);

  const handleCopyDailyVerse = async () => {
    try {
      await navigator.clipboard.writeText(dailyShareText);
      toast.success('Verset copié !');
    } catch {
      toast.error('Impossible de copier le verset.');
    }
  };

  const handleShareDailyVerse = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: dailyReference, text: dailyShareText });
        return;
      } catch {
        // partage annulé par l'utilisateur : ne rien faire
        return;
      }
    }
    await handleCopyDailyVerse();
  };

  const handleFavoriteDailyVerse = () => {
    if (dailyIsFavorite) {
      removeFavorite(dailyVerseId);
      toast('Retiré des favoris', { icon: '💔' });
    } else {
      addFavorite({
        id: dailyVerseId,
        translation: DAILY_VERSE_TRANSLATION,
        bookId: dailyVerse.bookId,
        chapter: dailyVerse.chapter,
        verse: dailyVerse.verse,
        text: dailyVerse.text,
        dateAdded: Date.now(),
      });
      toast.success('Ajouté aux favoris !');
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="reading-surface relative overflow-hidden p-6 md:p-9 lg:p-10">
        <div className="omed-starfield pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-accent-gold/20 bg-accent-gold/8" />
        <div className="pointer-events-none absolute bottom-0 left-8 h-px w-40 bg-gradient-to-r from-accent-gold/70 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="omed-kicker mb-4">{getGreeting(new Date().getHours())} · accueil</p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-text-primary md:text-5xl">
              Reprendre dans {getBookName(bookId)}, chapitre {chapter}.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-text-secondary">
              Un point d’entrée calme pour revenir au texte, retrouver vos traces et poursuivre sans bruit.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2" role="img" aria-label={`${readThisWeek} jours de lecture cette semaine`}>
                {weekActivity.map((day) => (
                  <span key={day.dayKey} className="flex flex-col items-center gap-1">
                    <span
                      className={clsx(
                        'block h-2.5 w-2.5 rounded-full transition-colors',
                        day.read ? 'bg-accent-gold' : 'bg-bg-secondary border border-border',
                        day.isToday && 'ring-2 ring-accent-gold/35 ring-offset-1 ring-offset-transparent'
                      )}
                    />
                    <span className="text-[10px] font-semibold uppercase text-text-muted">{day.label}</span>
                  </span>
                ))}
              </div>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-brown/30 bg-accent-brown/10 px-3 py-1 text-xs font-semibold text-accent-brown">
                  <Flame size={13} strokeWidth={1.7} />
                  {streak} jour{streak > 1 ? 's' : ''} de suite
                </span>
              )}
              <span className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                synced && user
                  ? 'border-accent-sage/35 bg-accent-sage/10 text-accent-sage'
                  : 'border-border bg-bg-card/55 text-text-muted'
              )}>
                {synced && user ? <Cloud size={13} strokeWidth={1.7} /> : <CloudOff size={13} strokeWidth={1.7} />}
                {synced && user ? 'Sync Drive active' : 'Données locales'}
              </span>
            </div>
          </div>

          <div className="rounded-[1.65rem] border border-border bg-bg-card/70 p-5 shadow-[var(--shadow-panel)]">
            <p className="text-sm text-text-muted">Position conservée</p>
            <p className="mt-2 font-display text-3xl text-text-primary">{getBookName(bookId)} {chapter}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-accent-gold">{translation.toUpperCase()}</p>
            <div className="my-5 h-px bg-gradient-to-r from-accent-gold/50 via-border to-transparent" />
            <Link to={continuePath} className="omed-button-primary w-full px-5 py-3">
              Continuer la lecture <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="omed-panel relative overflow-hidden p-6 md:p-8" aria-labelledby="daily-verse-title">
        <div className="pointer-events-none absolute inset-y-6 left-6 w-px bg-gradient-to-b from-transparent via-accent-gold/40 to-transparent" />
        <div className="relative pl-5 md:pl-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p id="daily-verse-title" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
              <Sparkles size={15} strokeWidth={1.5} />
              Verset du jour
            </p>
            <p className="text-xs text-text-muted">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <blockquote className="max-w-3xl font-body text-xl leading-9 text-text-primary md:text-2xl md:leading-10">
            « {dailyVerse.text} »
          </blockquote>
          <p className="mt-4 font-display text-base font-semibold text-accent-gold">— {dailyReference}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link to={dailyVersePath} className="omed-button-primary min-h-11 px-4 text-sm">
              <BookOpenText size={16} strokeWidth={1.6} />
              Ouvrir le chapitre
            </Link>
            <button type="button" onClick={handleCopyDailyVerse} className="omed-button-ghost min-h-11 px-4 text-sm" aria-label="Copier le verset du jour">
              <Copy size={16} strokeWidth={1.6} />
              Copier
            </button>
            <button type="button" onClick={handleShareDailyVerse} className="omed-button-ghost min-h-11 px-4 text-sm" aria-label="Partager le verset du jour">
              <Share2 size={16} strokeWidth={1.6} />
              Partager
            </button>
            <button type="button" onClick={() => openMeditation(dailyVerse)} className="omed-button-secondary min-h-11 px-4 text-sm" aria-label="Méditer le verset du jour en plein écran">
              <Moon size={16} strokeWidth={1.6} />
              Méditer
            </button>
            <button
              type="button"
              onClick={handleFavoriteDailyVerse}
              aria-pressed={dailyIsFavorite}
              aria-label={dailyIsFavorite ? 'Retirer le verset du jour des favoris' : 'Ajouter le verset du jour aux favoris'}
              className={clsx(
                'inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors',
                dailyIsFavorite
                  ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold'
                  : 'omed-button-ghost'
              )}
            >
              <Heart size={16} strokeWidth={1.6} className={dailyIsFavorite ? 'fill-accent-gold' : ''} />
              {dailyIsFavorite ? 'Dans vos favoris' : 'Favori'}
            </button>
          </div>

          <p className="mt-5 border-t border-border/60 pt-4 text-sm leading-6 text-text-muted">
            Passage suggéré aujourd’hui : <Link to={dailyVersePath} className="font-semibold text-accent-brown hover:text-accent-gold">{getBookName(dailyVerse.bookId)} {dailyVerse.chapter}</Link>, à lire en entier pour habiter le contexte.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="omed-panel-soft p-5 md:p-6">
          <div className="mb-5">
            <p className="omed-kicker">Accès rapide</p>
            <h2 className="mt-2 font-display text-2xl text-text-primary">Outils de lecture</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="group flex items-start gap-4 rounded-2xl border border-border bg-bg-card/45 p-4 transition-colors hover:border-accent-gold/35 hover:bg-bg-card/80">
                <span className="mt-0.5 rounded-xl border border-border bg-bg-secondary p-2 text-accent-gold">
                  <link.icon size={18} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-semibold text-text-primary">{link.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-text-secondary">{link.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <section className="omed-panel-soft p-5 md:p-6" aria-labelledby="active-plan-title">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="active-plan-title" className="font-display text-2xl text-text-primary">Parcours en cours</h2>
              <Link to="/plans" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Explorer</Link>
            </div>
            {activePlan ? (
              <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-text-primary">{activePlan.plan.title}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                    {activePlan.planProgress.completedDays.length}/{activePlan.plan.durationDays} jours
                  </p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent-gold transition-all duration-500"
                    style={{ width: `${Math.round((activePlan.planProgress.completedDays.length / activePlan.plan.durationDays) * 100)}%` }}
                  />
                </div>
                {nextPlanDay && (
                  <Link to={`/plans/${activePlan.plan.id}`} className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-accent-gold/25 bg-accent-gold/8 p-3.5 transition-colors hover:border-accent-gold/45">
                    <span className="text-sm leading-6 text-text-secondary">
                      <span className="font-semibold text-text-primary">Jour {nextPlanDay.day}</span>
                      {nextPlanDay.title ? ` · ${nextPlanDay.title}` : ''}
                    </span>
                    <ChevronRight size={17} className="shrink-0 text-accent-gold" />
                  </Link>
                )}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">
                Aucun parcours en cours. Choisissez un rythme — sept jours suffisent pour commencer.
              </p>
            )}
          </section>

          <section className="omed-panel-soft p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-text-primary">Notes récentes</h2>
              <Link to="/notes" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Tout voir</Link>
            </div>
            {recentNotes.length > 0 ? (
              <div className="space-y-3">
                {recentNotes.map((note) => {
                  const [noteTranslation = '', noteBook = '', noteChapter = '', noteVerse = ''] = note.verseId.split('-');
                  return (
                    <Link key={note.id} to={`/read/${noteTranslation}/${noteBook}/${noteChapter}`} className="block rounded-2xl border border-border bg-bg-card/45 p-4 hover:border-accent-gold/30">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">{formatBibleReference(noteBook, noteChapter, noteVerse)}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{note.text}</p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Vos notes apparaîtront ici dès qu’un verset sera annoté.</p>
            )}
          </section>

          <section className="omed-panel-soft p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-xl text-text-primary"><Bookmark size={17} className="text-accent-gold" /> Derniers favoris</h2>
              <Link to="/favorites" className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Ouvrir</Link>
            </div>
            {recentFavorites.length > 0 ? recentFavorites.map((favorite) => (
              <p key={favorite.id} className="mb-3 border-l border-accent-gold/40 pl-3 text-sm italic leading-6 text-text-secondary">{formatBibleReference(favorite.bookId, favorite.chapter, favorite.verse)} · {favorite.text}</p>
            )) : <p className="text-sm leading-6 text-text-muted">Aucun passage sauvegardé pour le moment.</p>}
          </section>
        </div>
      </section>
    </div>
  );
};
