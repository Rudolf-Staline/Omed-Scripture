import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookMarked, BookOpenText, Bookmark, Brain, CalendarRange, Check, ChevronRight, Compass, Copy, Flame, HandHeart, Heart, NotebookPen, Settings, Share2, Sparkles, Sun, WifiOff, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBibleStore } from '../../store/useBibleStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useDailyRoutineStore, todayKey } from '../../store/useDailyRoutineStore';
import { DAILY_VERSE_TRANSLATION } from '../../data/dailyVerses';
import { READING_PLANS } from '../../data/readingPlans';
import { FEATURED_TRANSLATIONS } from '../../data/translations';
import { getBookName } from '../../utils/bibleBooks';
import { getDailyRoutineContent } from '../../utils/dailyRoutine';
import { getReadingDays } from '../../utils/readingActivity';
import { getUnifiedDailyActivity, getUnifiedStreak, getUnifiedWeek, timestampsToDayKeys } from '../../utils/dailyActivity';
import { getPersonalizedDailyPrompt, getTodayGoalStatus } from '../../utils/dailyGoals';
import { useOnlineStatus } from '../../utils/useOnlineStatus';
import { useReminderStore } from '../../store/useReminderStore';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useStudyStore } from '../../store/useStudyStore';
import { getOfflineLibrarySummary } from '../../utils/offlineLibrary';
import { formatDueLabel, getDueMemoryVerses, getMemoryStats } from '../../utils/memory';
import { InstallPrompt } from '../../components/InstallPrompt';

const formatDate = (value?: number) => value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'Bonne nuit';
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bel après-midi';
  return 'Bonne soirée';
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { translation, bookId, chapter } = useBibleStore();
  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const notes = useNotesStore((state) => state.notes);
  const progress = usePlansStore((state) => state.progress);
  const prayers = usePrayerStore((state) => state.prayers);
  const synced = useSettingsStore((state) => state.synced);
  const preferences = useOnboardingStore((state) => state.preferences);
  const reminder = useReminderStore((state) => state.preferences);
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const studySessions = useStudyStore((state) => state.sessions);
  const createStudySession = useStudyStore((state) => state.createStudySession);
  const isOnline = useOnlineStatus();
  const offlineSummary = getOfflineLibrarySummary();

  const routineDays = useDailyRoutineStore((state) => state.days);
  const completeDay = useDailyRoutineStore((state) => state.completeDay);
  const setRoutineNote = useDailyRoutineStore((state) => state.setNote);

  const routine = useMemo(() => getDailyRoutineContent(), []);
  const dayKey = useMemo(() => todayKey(), []);
  const today = routineDays.find((day) => day.date === dayKey);
  const routineDone = Boolean(today?.completedAt);
  const goalStatus = getTodayGoalStatus(preferences, routineDays);
  const dailyPrompt = getPersonalizedDailyPrompt(preferences);
  const [noteDraft, setNoteDraft] = useState(today?.note ?? '');

  const dailyVerse = routine.verse;
  const dailyReference = routine.verseReference;
  const dailyVersePath = `/read/${DAILY_VERSE_TRANSLATION}/${dailyVerse.bookId}/${dailyVerse.chapter}`;
  const dailyVerseId = routine.verseId;
  const dailyIsFavorite = favorites.some((favorite) => favorite.id === dailyVerseId);
  const dailyShareText = `« ${dailyVerse.text} »\n— ${dailyReference} (${DAILY_VERSE_TRANSLATION.toUpperCase()})`;
  const continuePath = `/read/${translation}/${bookId}/${chapter}`;
  const translationLabel = FEATURED_TRANSLATIONS.find((item) => item.id === translation)?.short ?? translation.toUpperCase();
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const unifiedDays = useMemo(() => getUnifiedDailyActivity({
    readingDays: getReadingDays(),
    routineCompletedDays: routineDays.filter((day) => day.completedAt).map((day) => day.date),
    extraDays: timestampsToDayKeys(prayers.map((prayer) => prayer.lastPrayedAt)),
    noteTimestamps: [
      ...notes.map((note) => note.dateAdded),
      ...studySessions.map((session) => Date.parse(session.updatedAt)).filter((time) => !Number.isNaN(time)),
    ],
  }), [routineDays, prayers, notes, studySessions]);
  const unifiedStreak = useMemo(() => getUnifiedStreak(unifiedDays), [unifiedDays]);
  const week = useMemo(() => getUnifiedWeek(unifiedDays), [unifiedDays]);
  const memoryStats = useMemo(() => getMemoryStats(memoryVerses), [memoryVerses]);
  const nextMemoryVerse = useMemo(() => getDueMemoryVerses(memoryVerses)[0] ?? [...memoryVerses].sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))[0], [memoryVerses]);
  const latestStudySession = useMemo(() => [...studySessions].filter((session) => session.status !== 'archived').sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] ?? null, [studySessions]);

  const activePlan = useMemo(() => {
    return READING_PLANS
      .filter((plan) => plan.status !== 'planned' && progress[plan.id])
      .map((plan) => ({ plan, planProgress: progress[plan.id] }))
      .filter(({ plan, planProgress }) => planProgress.completedDays.length < plan.durationDays)
      .sort((a, b) => b.planProgress.startDate - a.planProgress.startDate)[0] ?? null;
  }, [progress]);

  const completedPlans = useMemo(
    () => READING_PLANS.filter((plan) => progress[plan.id] && progress[plan.id].completedDays.length >= plan.durationDays).length,
    [progress]
  );

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

  const saveNoteDraft = () => {
    setRoutineNote(dayKey, noteDraft.trim());
    if (noteDraft.trim()) toast.success('Note du jour enregistrée.');
  };

  const completeRoutine = () => {
    if (noteDraft.trim()) setRoutineNote(dayKey, noteDraft.trim());
    completeDay(dayKey, {
      verseRef: dailyReference,
      prayerPromptId: routine.prayer.id,
      readingReference: routine.reading.reference,
      ...(noteDraft.trim() ? { note: noteDraft.trim() } : {}),
    });
    toast.success('Routine du jour validée 🙏');
  };

  const planPercent = activePlan ? Math.round((activePlan.planProgress.completedDays.length / activePlan.plan.durationDays) * 100) : 0;
  const createHomeStudySession = () => {
    const reference = `${getBookName(bookId)} ${chapter}`;
    const id = createStudySession({ translation, bookId, chapter, reference, title: `Étude — ${reference}` });
    navigate(`/study/${id}`);
  };
  const shortcuts = [
    { to: continuePath, label: 'Bible', icon: BookOpenText },
    { to: '/plans', label: 'Plans', icon: CalendarRange },
    { to: '/discover', label: 'Découvrir', icon: Compass },
    { to: '/study', label: 'Études', icon: BookMarked },
    { to: '/notes', label: 'Notes', icon: NotebookPen },
    { to: '/prayer', label: 'Prière', icon: HandHeart },
    { to: '/favorites', label: 'Favoris', icon: Bookmark },
    { to: '/memory', label: 'Mémoriser', icon: Brain },
    { to: '/collections', label: 'Collections', icon: Bookmark },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-accent-gold"><Sun size={16} /> {greeting()}</p>
          <h1 className="mt-0.5 text-2xl font-bold capitalize tracking-tight text-text-primary">{todayLabel}</h1>
          <p className="mt-1 text-sm text-text-muted">{synced ? 'Synchronisation active' : 'Données enregistrées localement'} · {goalStatus.label}{preferences.preferredReminderTime ? ` · ${preferences.preferredReminderTime}` : ''}</p>
        </div>
        <Link to="/me" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-bg-card text-text-secondary hover:text-text-primary" aria-label="Ouvrir mon espace">
          <Settings size={19} />
        </Link>
      </header>

      <InstallPrompt />

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-bg-card p-4 text-sm text-text-secondary">
          <WifiOff size={18} className={isOnline ? 'text-accent-sage' : 'text-accent-brown'} />
          <span><strong className="text-text-primary">{isOnline ? 'En ligne' : 'Hors ligne'}</strong><br />{offlineSummary.chapters.length} chapitre(s) disponibles en cache.</span>
        </div>
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-bg-card p-4 text-sm text-text-secondary">
          <Bell size={18} className={reminder.enabled ? 'text-accent-gold' : 'text-text-muted'} />
          <span><strong className="text-text-primary">Rappel quotidien</strong><br />{reminder.enabled ? `Prévu à ${reminder.time} pendant une session ouverte.` : 'Désactivé. Activez-le dans Paramètres.'}</span>
        </div>
      </section>

      {/* Verset du jour */}
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
        <p className="font-body text-xl leading-9 text-text-primary sm:text-2xl">“{dailyVerse.text}”</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Link to={dailyVersePath} className="col-span-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white sm:col-span-1"><BookOpenText size={18} /> Lire</Link>
          <button type="button" onClick={copyDailyVerse} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-primary px-4 font-semibold text-text-primary"><Copy size={18} /> Copier</button>
          <button type="button" onClick={shareDailyVerse} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-primary px-4 font-semibold text-text-primary"><Share2 size={18} /> Partager</button>
        </div>
      </section>


      <section className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-gold"><BookMarked size={14} /> Étude biblique</p>
            <h2 className="mt-1 text-xl font-bold text-text-primary">{latestStudySession ? latestStudySession.title : 'Approfondir le passage actuel'}</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{latestStudySession ? `${latestStudySession.reference} · ${latestStudySession.status === 'draft' ? 'brouillon en cours' : 'dernière session'}` : `Créez une session Observation · Interprétation · Application · Prière sur ${getBookName(bookId)} ${chapter}.`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {latestStudySession && <Link to={`/study/${latestStudySession.id}`} className="inline-flex min-h-11 items-center rounded-2xl bg-accent-gold px-4 font-bold text-white">Continuer</Link>}
            <button type="button" onClick={createHomeStudySession} className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">Nouvelle étude</button>
          </div>
        </div>
      </section>

      {/* Routine quotidienne */}
      <section className={`rounded-[2rem] border p-5 shadow-[var(--shadow-soft)] sm:p-6 ${routineDone ? 'border-accent-sage/45 bg-accent-sage/8' : 'border-border bg-bg-card'}`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-gold"><Sparkles size={14} /> Ma routine du jour</p>
            <h2 className="mt-1 text-xl font-bold text-text-primary">{routineDone ? 'Routine accomplie' : 'Trois pas pour aujourd’hui'}</h2><p className="mt-1 text-sm text-text-secondary">{dailyPrompt}</p>
          </div>
          {routineDone && <span className="flex items-center gap-1.5 rounded-full bg-accent-sage/18 px-3 py-1.5 text-sm font-bold text-accent-sage"><Check size={15} /> Fait</span>}
        </div>

        <div className="space-y-3">
          <Link to={routine.readingPath} className="flex items-center gap-3 rounded-2xl border border-border bg-bg-primary/60 p-3 hover:border-accent-gold/40">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/14 text-accent-gold"><BookOpenText size={19} /></span>
            <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wide text-text-muted">Lecture courte</span><span className="block font-semibold text-text-primary">{routine.reading.reference}</span><span className="block truncate text-sm text-text-secondary">{routine.reading.summary}</span></span>
            <ChevronRight size={18} className="text-text-muted" />
          </Link>

          <div className="rounded-2xl border border-border bg-bg-primary/60 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-gold/14 text-accent-gold"><HandHeart size={19} /></span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-wide text-text-muted">Prière guidée · {routine.prayer.focus}</span><span className="block font-semibold text-text-primary">{routine.prayer.title}</span></span>
            </div>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{routine.prayer.prompt}</p>
          </div>

          <div className="rounded-2xl border border-border bg-bg-primary/60 p-3">
            <label htmlFor="routine-note" className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-muted"><NotebookPen size={14} className="text-accent-gold" /> Note rapide du jour</label>
            <textarea
              id="routine-note"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              onBlur={saveNoteDraft}
              rows={2}
              placeholder="Ce que je retiens, une intention, une prière…"
              className="w-full resize-none rounded-xl border border-border bg-bg-card px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/35"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={completeRoutine}
          disabled={routineDone}
          className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 font-semibold transition-colors ${routineDone ? 'cursor-default border border-accent-sage/40 bg-accent-sage/12 text-accent-sage' : 'bg-accent-gold text-white hover:opacity-95'}`}
        >
          {routineDone ? <><Check size={18} /> Routine terminée</> : <><Check size={18} /> Commencer aujourd’hui</>}
        </button>
      </section>


      <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-gold/14 text-accent-gold"><Brain size={21} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Mémorisation</p>
            <h2 className="mt-1 text-xl font-bold text-text-primary">{memoryStats.due} verset{memoryStats.due > 1 ? 's' : ''} à revoir</h2>
            <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
              {nextMemoryVerse ? `${nextMemoryVerse.reference} · ${formatDueLabel(nextMemoryVerse.dueAt)}` : 'Ajoutez un verset depuis le lecteur pour lancer votre première révision.'}
            </p>
          </div>
          <Link to="/memory" className="inline-flex min-h-11 shrink-0 items-center rounded-2xl bg-accent-gold px-4 text-sm font-semibold text-white">Réviser</Link>
        </div>
      </section>

      {/* Progression */}
      <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">Ma progression</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-accent-gold/12 px-3 py-1 text-sm font-bold text-accent-gold"><Flame size={15} /> {unifiedStreak} jour{unifiedStreak > 1 ? 's' : ''}</span>
        </div>
        <p className="mb-3 text-sm text-text-secondary">Série quotidienne — un jour compte dès qu’une lecture, une routine, une prière ou une note est faite.</p>
        <div className="grid grid-cols-7 gap-1.5">
          {week.map((day) => (
            <div key={day.dayKey} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-text-muted">{day.label}</span>
              <span className={`flex h-9 w-full items-center justify-center rounded-xl text-xs font-bold ${day.active ? 'bg-accent-gold text-white' : day.isToday ? 'border border-accent-gold/50 text-accent-gold' : 'bg-bg-secondary text-text-muted'}`}>
                {day.active ? <Check size={15} /> : day.label[0]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-bg-secondary p-3"><p className="text-xl font-bold text-text-primary">{completedPlans}</p><p className="text-xs text-text-muted">Plans finis</p></div>
          <div className="rounded-2xl bg-bg-secondary p-3"><p className="text-xl font-bold text-text-primary">{favorites.length}</p><p className="text-xs text-text-muted">Favoris</p></div>
        </div>
      </section>

      {/* Continuer */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Continuer la lecture</p>
          <h2 className="mt-2 text-2xl font-bold text-text-primary">{getBookName(bookId)} {chapter}</h2>
          <p className="mt-1 text-sm text-text-secondary">{translationLabel} · dernière position</p>
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

      {/* Raccourcis */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-text-primary">Raccourcis</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {shortcuts.map((item) => <Link key={item.label} to={item.to} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-3xl border border-border bg-bg-card p-3 text-center text-sm font-semibold text-text-primary hover:border-accent-gold/45"><item.icon className="text-accent-gold" size={22} />{item.label}</Link>)}
        </div>
      </section>

      {/* Activité récente */}
      <section className="rounded-[1.7rem] border border-border bg-bg-card p-5">
        <h2 className="text-lg font-bold text-text-primary">Activité récente</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link to="/notes" className="rounded-2xl bg-bg-secondary p-4"><NotebookPen size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernière note</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestNote ? `${formatDate(latestNote.dateModified)} · ${latestNote.text}` : 'Aucune note pour le moment.'}</p></Link>
          <Link to="/favorites" className="rounded-2xl bg-bg-secondary p-4"><Bookmark size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernier favori</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestFavorite ? `${getBookName(latestFavorite.bookId)} ${latestFavorite.chapter}:${latestFavorite.verse}` : 'Aucun favori enregistré.'}</p></Link>
          <Link to="/prayer" className="rounded-2xl bg-bg-secondary p-4"><HandHeart size={18} className="text-accent-gold" /><p className="mt-2 font-semibold text-text-primary">Dernière prière</p><p className="mt-1 line-clamp-2 text-sm text-text-secondary">{latestPrayer ? `${formatDate(latestPrayer.dateModified)} · ${latestPrayer.title}` : 'Votre journal de prière est prêt.'}</p></Link>
        </div>
      </section>
    </div>
  );
};
