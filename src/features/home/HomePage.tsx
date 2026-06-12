import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenText,
  CalendarRange,
  ChevronRight,
  Copy,
  Flame,
  HandHeart,
  Heart,
  Moon,
  NotebookPen,
  Share2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useUiStore } from '../../store/useUiStore';
import { READING_PLANS } from '../../data/readingPlans';
import { formatBibleReference, getBookName } from '../../utils/bibleBooks';
import { getDailyVerse } from '../../utils/dailyVerse';
import { DAILY_VERSE_TRANSLATION } from '../../data/dailyVerses';
import { getReadingStreak, getWeekActivity } from '../../utils/readingActivity';
import { StatTile } from '../../components/layout/StatTile';
import { SectionRail } from '../../components/layout/SectionRail';
import { StudyPanel } from '../../components/layout/StudyPanel';

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
  const prayers = usePrayerStore((state) => state.prayers);
  const openMeditation = useUiStore((state) => state.openMeditation);

  const continuePath = `/read/${translation}/${bookId}/${chapter}`;

  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const weekActivity = useMemo(() => getWeekActivity(), []);
  const streak = useMemo(() => getReadingStreak(), []);
  const readThisWeek = weekActivity.filter((day) => day.read).length;

  const dailyReference = formatBibleReference(dailyVerse.bookId, dailyVerse.chapter, dailyVerse.verse);
  const dailyVersePath = `/read/${DAILY_VERSE_TRANSLATION}/${dailyVerse.bookId}/${dailyVerse.chapter}`;
  const dailyVerseId = `${DAILY_VERSE_TRANSLATION}-${dailyVerse.bookId}-${dailyVerse.chapter}-${dailyVerse.verse}`;
  const dailyIsFavorite = favorites.some((f) => f.id === dailyVerseId);
  const dailyShareText = `« ${dailyVerse.text} »\n— ${dailyReference} (${DAILY_VERSE_TRANSLATION.toUpperCase()})`;

  const recentNotes = useMemo(
    () => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)).slice(0, 2),
    [notes]
  );
  const recentFavorites = useMemo(
    () => [...favorites].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 3),
    [favorites]
  );
  const recentPrayer = useMemo(
    () => [...prayers].filter((p) => p.status === 'active').sort((a, b) => b.dateModified - a.dateModified)[0] ?? null,
    [prayers]
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
    return activePlan.plan.readings.find((r) => !done.has(r.day)) ?? null;
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
    <div className="space-y-9 md:space-y-12">
      {/* ===== Porte d'entrée : reprise de lecture dominante ===== */}
      <section className="reading-surface relative overflow-hidden p-6 md:p-10 lg:p-12">
        <div className="omed-starfield pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full border border-accent-gold/15 bg-accent-gold/8" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="omed-kicker mb-4">{getGreeting(new Date().getHours())} · scriptorium</p>
            <h1 className="max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-text-primary md:text-6xl">
              Reprendre dans {getBookName(bookId)}, chapitre {chapter}.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-text-secondary">
              Votre atlas personnel des Écritures : revenez au texte, retrouvez vos traces, avancez sans bruit.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={continuePath} className="omed-button-primary px-5 py-3 text-sm">
                Continuer la lecture <ChevronRight size={17} />
              </Link>
              <button type="button" onClick={() => openMeditation(dailyVerse)} className="omed-button-secondary px-5 py-3 text-sm" aria-label="Entrer en méditation">
                <Moon size={16} strokeWidth={1.6} /> Méditer
              </button>
            </div>
          </div>

          <StudyPanel title={`${getBookName(bookId)} ${chapter}`} eyebrow="Position conservée" icon={BookOpenText}>
            <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">{translation.toUpperCase()}</p>
            <div className="my-5 h-px bg-gradient-to-r from-accent-gold/50 via-border to-transparent" />
            <div className="flex items-center gap-2" role="img" aria-label={`${readThisWeek} jours de lecture cette semaine`}>
              {weekActivity.map((day) => (
                <span key={day.dayKey} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className={`block h-2 w-full rounded-full ${day.read ? 'bg-accent-gold' : 'bg-bg-secondary'} ${day.isToday ? 'ring-1 ring-accent-gold/50' : ''}`} />
                  <span className="text-[10px] font-semibold uppercase text-text-muted">{day.label}</span>
                </span>
              ))}
            </div>
          </StudyPanel>
        </div>
      </section>

      {/* ===== Zone « Aujourd'hui » : statistiques + verset du jour en pièce forte ===== */}
      <section aria-labelledby="today-title" className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 id="today-title" className="font-display text-2xl text-text-primary">Aujourd'hui</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={Flame} label="Série" value={streak} hint={streak > 0 ? `${streak} jour${streak > 1 ? 's' : ''} de suite` : 'Reprenez aujourd’hui'} />
            <StatTile icon={CalendarRange} label="Cette semaine" value={`${readThisWeek}/7`} hint="jours de lecture" />
            <StatTile icon={NotebookPen} label="Notes" value={notes.length} hint="annotations gardées" />
            <StatTile icon={HandHeart} label="Prières" value={prayers.filter((p) => p.status === 'active').length} hint="en cours" />
          </div>

          <article className="omed-panel relative overflow-hidden p-6 md:p-7" aria-labelledby="daily-verse-title">
            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p id="daily-verse-title" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
                  <Sparkles size={15} strokeWidth={1.5} /> Verset du jour
                </p>
                <p className="text-xs text-text-muted">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
              <blockquote className="font-body text-xl leading-9 text-text-primary md:text-2xl md:leading-10">« {dailyVerse.text} »</blockquote>
              <p className="mt-4 font-display text-base font-semibold text-accent-gold">— {dailyReference}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Link to={dailyVersePath} className="omed-button-primary min-h-11 px-4 text-sm"><BookOpenText size={16} strokeWidth={1.6} /> Ouvrir le chapitre</Link>
                <button type="button" onClick={() => openMeditation(dailyVerse)} className="omed-button-secondary min-h-11 px-4 text-sm" aria-label="Méditer ce verset"><Moon size={16} strokeWidth={1.6} /> Méditer</button>
                <button type="button" onClick={handleCopyDailyVerse} className="omed-button-ghost min-h-11 px-3 text-sm" aria-label="Copier le verset du jour"><Copy size={16} strokeWidth={1.6} /></button>
                <button type="button" onClick={handleShareDailyVerse} className="omed-button-ghost min-h-11 px-3 text-sm" aria-label="Partager le verset du jour"><Share2 size={16} strokeWidth={1.6} /></button>
                <button type="button" onClick={handleFavoriteDailyVerse} aria-pressed={dailyIsFavorite} aria-label={dailyIsFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${dailyIsFavorite ? 'border-accent-gold/45 bg-accent-gold/12 text-accent-gold' : 'omed-button-ghost'}`}>
                  <Heart size={16} strokeWidth={1.6} className={dailyIsFavorite ? 'fill-accent-gold' : ''} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== Zone « Carnet personnel » + « Parcours » : composition asymétrique ===== */}
      <section aria-labelledby="library-title" className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 id="library-title" className="font-display text-2xl text-text-primary">Votre carnet</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <SectionRail title="Notes récentes" to="/notes" kicker="Étude">
              {recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {recentNotes.map((note) => {
                    const [t = '', b = '', c = '', v = ''] = note.verseId.split('-');
                    return (
                      <Link key={note.id} to={`/read/${t}/${b}/${c}`} className="block rounded-2xl border border-border bg-bg-card/45 p-4 transition-colors hover:border-accent-gold/30">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">{formatBibleReference(b, c, v)}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{note.text}</p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Vos notes apparaîtront ici dès qu'un verset sera annoté.</p>
              )}
            </SectionRail>

            <SectionRail title="Dernière prière" to="/prayer" actionLabel="Le carnet" kicker="Prière">
              {recentPrayer ? (
                <Link to="/prayer" className="block rounded-2xl border border-border bg-bg-card/45 p-4 transition-colors hover:border-accent-gold/30">
                  <p className="font-semibold text-text-primary">{recentPrayer.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-secondary">{recentPrayer.content}</p>
                </Link>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Déposez une intention, une gratitude ou une demande dans le carnet de prière.</p>
              )}
            </SectionRail>
          </div>

          <div className="space-y-5">
            <SectionRail title="Parcours en cours" to="/plans" actionLabel="Explorer" kicker="Avancer">
              {activePlan ? (
                <div>
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-text-primary">{activePlan.plan.title}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{activePlan.planProgress.completedDays.length}/{activePlan.plan.durationDays} jours</p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                    <div className="h-full rounded-full bg-accent-gold transition-all duration-500" style={{ width: `${Math.round((activePlan.planProgress.completedDays.length / activePlan.plan.durationDays) * 100)}%` }} />
                  </div>
                  {nextPlanDay && (
                    <Link to={`/plans/${activePlan.plan.id}`} className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-accent-gold/25 bg-accent-gold/8 p-3.5 transition-colors hover:border-accent-gold/45">
                      <span className="text-sm leading-6 text-text-secondary"><span className="font-semibold text-text-primary">Jour {nextPlanDay.day}</span>{nextPlanDay.title ? ` · ${nextPlanDay.title}` : ''}</span>
                      <ChevronRight size={17} className="shrink-0 text-accent-gold" />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Aucun parcours en cours. Sept jours suffisent pour commencer.</p>
              )}
            </SectionRail>

            <SectionRail title="Derniers favoris" to="/favorites" actionLabel="Ouvrir" kicker="Garder">
              {recentFavorites.length > 0 ? (
                <ul className="space-y-3">
                  {recentFavorites.map((favorite) => (
                    <li key={favorite.id}>
                      <Link to={`/read/${favorite.translation}/${favorite.bookId}/${favorite.chapter}`} className="block border-l-2 border-accent-gold/40 pl-3 transition-colors hover:border-accent-gold">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold">{formatBibleReference(favorite.bookId, favorite.chapter, favorite.verse)}</p>
                        <p className="mt-1 line-clamp-1 text-sm italic leading-6 text-text-secondary">{favorite.text}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-text-muted">Aucun passage sauvegardé pour le moment.</p>
              )}
            </SectionRail>
          </div>
        </div>
      </section>
    </div>
  );
};
