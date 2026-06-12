import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, CalendarRange, CheckCircle2, ChevronRight, Copy, Feather, HandHeart, Heart, NotebookPen, Orbit, Share2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useUiStore } from '../../store/useUiStore';
import { READING_PLANS } from '../../data/readingPlans';
import { DAILY_VERSE_TRANSLATION } from '../../data/dailyVerses';
import { formatBibleReference, getBookName } from '../../utils/bibleBooks';
import { getDailyVerse } from '../../utils/dailyVerse';
import { getReadingStreak, getWeekActivity } from '../../utils/readingActivity';

const getGreeting = (hour: number): string => {
  if (hour < 5) return 'Veille nocturne';
  if (hour < 12) return 'Office du matin';
  if (hour < 18) return 'Heure d’étude';
  return 'Vêpres numériques';
};

const parseVerseId = (verseId: string) => {
  const [translation, bookId, chapter, verse] = verseId.split('-');
  return { translation, bookId, chapter: Number(chapter), verse: Number(verse) };
};

export const HomePage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const notes = useNotesStore((state) => state.notes);
  const progress = usePlansStore((state) => state.progress);
  const prayers = usePrayerStore((state) => state.prayers);
  const synced = useSettingsStore((state) => state.synced);
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
    () => [...notes].sort((a, b) => (b.dateModified ?? 0) - (a.dateModified ?? 0)).slice(0, 3),
    [notes]
  );
  const recentFavorites = useMemo(
    () => [...favorites].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 2),
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
    return activePlan.plan.readings.find((reading) => !done.has(reading.day)) ?? null;
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
      return;
    }
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
  };

  const planPercent = activePlan ? Math.round((activePlan.planProgress.completedDays.length / activePlan.plan.durationDays) * 100) : 0;

  return (
    <div className="codex-home space-y-7 md:space-y-10">
      <section className="chapel-portal relative min-h-[34rem] overflow-hidden rounded-[2.4rem] border border-border bg-bg-card/58 p-5 shadow-[var(--shadow-panel)] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1.05fr)_22rem] lg:gap-8 lg:p-10 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="omed-starfield pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full border border-accent-gold/20" />
        <div className="pointer-events-none absolute right-1/4 top-10 hidden h-[75%] w-px bg-gradient-to-b from-transparent via-accent-gold/25 to-transparent lg:block" />

        <div className="relative flex min-h-[29rem] flex-col justify-between">
          <div>
            <p className="omed-kicker mb-5">{getGreeting(new Date().getHours())} · Codex Chapel</p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-text-primary sm:text-6xl md:text-7xl xl:text-8xl">
              Ouvre le manuscrit, puis laisse la marge guider l’étude.
            </h1>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_15rem] md:items-end">
            <Link to={continuePath} className="group relative overflow-hidden rounded-[2rem] border border-accent-gold/35 bg-accent-gold/14 p-5 transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-gold/45">
              <span className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gold text-[#181008] transition-transform group-hover:translate-x-1">
                <BookOpenText size={22} strokeWidth={1.5} />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-gold">Reprendre la lecture</p>
              <h2 className="mt-5 font-display text-4xl font-semibold text-text-primary sm:text-5xl">{getBookName(bookId)} {chapter}</h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-text-secondary">Retour direct à ta dernière position avec la traduction {translation.toUpperCase()} et l’espace de lecture complet.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-gold">Entrer dans le lecteur <ChevronRight size={17} /></span>
            </Link>

            <div className="rounded-[1.7rem] border border-border bg-bg-primary/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Rythme</p>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-5xl text-text-primary">{streak}</span>
                <span className="pb-2 text-sm font-semibold text-text-secondary">jour{streak > 1 ? 's' : ''} d’élan</span>
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1.5" aria-label={`${readThisWeek} jours lus cette semaine`}>
                {weekActivity.map((day) => (
                  <span key={day.label} className="flex flex-col items-center gap-1 text-[0.62rem] uppercase text-text-muted">
                    <span className={`h-7 w-full rounded-full border ${day.read ? 'border-accent-gold/40 bg-accent-gold/65' : 'border-border bg-bg-card/55'}`} />
                    {day.label.slice(0, 1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="relative mt-7 flex flex-col justify-between rounded-[2rem] border border-border bg-bg-primary/64 p-5 backdrop-blur-xl lg:mt-0">
          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <p className="omed-kicker">Pièce éditoriale</p>
              <span className="rounded-full border border-border px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-text-muted">{DAILY_VERSE_TRANSLATION.toUpperCase()}</span>
            </div>
            <blockquote className="font-display text-2xl leading-[1.35] text-text-primary sm:text-3xl lg:text-[2rem]">
              “{dailyVerse.text}”
            </blockquote>
            <Link to={dailyVersePath} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-gold">
              {dailyReference} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            <button type="button" onClick={handleFavoriteDailyVerse} className="min-h-12 rounded-2xl border border-border bg-bg-card/65 text-text-secondary transition-colors hover:text-accent-gold" aria-label="Ajouter le verset du jour aux favoris">
              <Heart size={18} className={`mx-auto ${dailyIsFavorite ? 'fill-accent-gold text-accent-gold' : ''}`} />
            </button>
            <button type="button" onClick={handleCopyDailyVerse} className="min-h-12 rounded-2xl border border-border bg-bg-card/65 text-text-secondary transition-colors hover:text-accent-gold" aria-label="Copier le verset du jour">
              <Copy size={18} className="mx-auto" />
            </button>
            <button type="button" onClick={handleShareDailyVerse} className="min-h-12 rounded-2xl border border-border bg-bg-card/65 text-text-secondary transition-colors hover:text-accent-gold" aria-label="Partager le verset du jour">
              <Share2 size={18} className="mx-auto" />
            </button>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem] xl:items-start">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-border bg-bg-card/52 p-5 shadow-[var(--shadow-soft)] sm:p-7 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="omed-kicker">Parcours</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary sm:text-4xl">Cheminer sans dashboard.</h2>
            </div>
            <Link to="/plans" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold">
              Tous les plans <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="rounded-[1.8rem] border border-accent-gold/30 bg-accent-gold/10 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gold text-[#181008]"><CalendarRange size={21} /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-gold">En cours</p>
                  <p className="mt-1 font-display text-xl text-text-primary">{activePlan?.plan.title ?? 'Aucun parcours actif'}</p>
                </div>
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-bg-primary/60">
                <div className="h-full rounded-full bg-accent-gold" style={{ width: `${planPercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-text-secondary">{activePlan ? `${activePlan.planProgress.completedDays.length} / ${activePlan.plan.durationDays} offices complétés` : 'Choisis un plan pour transformer la lecture en itinéraire.'}</p>
            </div>

            <div className="rounded-[1.8rem] border border-border bg-bg-primary/45 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">Prochaine station</p>
              {activePlan && nextPlanDay ? (
                <div className="mt-4">
                  <h3 className="font-display text-3xl text-text-primary">Jour {nextPlanDay.day} · {nextPlanDay.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {nextPlanDay.passages.map((passage) => (
                      <Link key={`${passage.bookId}-${passage.chapterStart}`} to={`/read/${translation}/${passage.bookId}/${passage.chapterStart}`} className="rounded-full border border-border bg-bg-card/80 px-4 py-2 text-sm font-semibold text-text-secondary hover:border-accent-gold/40 hover:text-accent-gold">
                        {formatBibleReference(passage.bookId, passage.chapterStart)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-text-secondary">Aucun itinéraire actif : démarre un parcours depuis la bibliothèque.</div>
              )}
            </div>
          </div>
        </div>

        <aside className="rounded-[2.2rem] border border-border bg-bg-primary/58 p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="omed-kicker">Carnet vivant</p>
              <h2 className="mt-2 font-display text-3xl text-text-primary">Marge personnelle</h2>
            </div>
            <Feather className="text-accent-gold" size={28} strokeWidth={1.25} />
          </div>

          <div className="mt-6 space-y-3">
            {recentNotes.map((note) => {
              const parsed = parseVerseId(note.verseId);
              return (
                <Link key={note.id} to={`/read/${parsed.translation}/${parsed.bookId}/${parsed.chapter}`} className="block rounded-[1.4rem] border border-border bg-bg-card/55 p-4 transition-colors hover:border-accent-gold/35">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><NotebookPen size={14} /> Note</div>
                  <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{note.text}</p>
                </Link>
              );
            })}
            {recentNotes.length === 0 && <p className="rounded-[1.4rem] border border-dashed border-border p-4 text-sm text-text-secondary">Tes prochaines annotations apparaîtront ici.</p>}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {recentFavorites.map((favorite) => (
              <Link key={favorite.id} to={`/read/${favorite.translation}/${favorite.bookId}/${favorite.chapter}`} className="rounded-[1.4rem] border border-border bg-bg-card/42 p-4 hover:border-accent-gold/35">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><Heart size={14} /> Favori</div>
                <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{favorite.text}</p>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-border bg-bg-card/45 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-text-muted"><HandHeart size={14} /> Prière</div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{recentPrayer ? recentPrayer.title : 'Aucune prière active enregistrée.'}</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <button type="button" onClick={() => openMeditation(dailyVerse)} className="group min-h-24 rounded-[1.7rem] border border-border bg-bg-card/48 p-5 text-left transition-colors hover:border-accent-gold/40">
          <Sparkles className="mb-3 text-accent-gold" size={22} />
          <span className="font-semibold text-text-primary">Ouvrir une méditation</span>
        </button>
        <Link to="/search" className="min-h-24 rounded-[1.7rem] border border-border bg-bg-card/48 p-5 transition-colors hover:border-accent-gold/40">
          <Orbit className="mb-3 text-accent-sage" size={22} />
          <span className="font-semibold text-text-primary">Explorer les Écritures</span>
        </Link>
        <div className="min-h-24 rounded-[1.7rem] border border-border bg-bg-card/48 p-5">
          <CheckCircle2 className={`mb-3 ${synced ? 'text-accent-sage' : 'text-text-muted'}`} size={22} />
          <span className="font-semibold text-text-primary">{synced ? 'Synchronisation active' : 'Mode local, sync discrète'}</span>
        </div>
      </section>
    </div>
  );
};
