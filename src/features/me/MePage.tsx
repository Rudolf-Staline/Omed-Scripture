import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, BookOpenText, Bookmark, Boxes, Brain, Cloud, Flame, HandHeart, NotebookPen, Settings, Sparkles, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useBibleStore } from '../../store/useBibleStore';
import { useCollectionsStore } from '../../store/useCollectionsStore';
import { useDailyRoutineStore } from '../../store/useDailyRoutineStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHighlightsStore } from '../../store/useHighlightsStore';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useNotesStore } from '../../store/useNotesStore';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { getTodayGoalStatus, getWeeklyGoalProgress } from '../../utils/dailyGoals';
import { getBookName } from '../../utils/bibleBooks';
import { getMemoryStats, formatDueLabel } from '../../utils/memory';
import { getOfflineLibrarySummary, formatApproxSize } from '../../utils/offlineLibrary';
import { useReminderStore } from '../../store/useReminderStore';
import { useStudyStore } from '../../store/useStudyStore';

export const MePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const synced = useSettingsStore((state) => state.synced);
  const { translation, bookId, chapter } = useBibleStore();
  const preferences = useOnboardingStore((state) => state.preferences);
  const days = useDailyRoutineStore((state) => state.days);
  const favorites = useFavoritesStore((state) => state.favorites);
  const notes = useNotesStore((state) => state.notes);
  const prayers = usePrayerStore((state) => state.prayers);
  const highlights = useHighlightsStore((state) => state.highlights);
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const progress = usePlansStore((state) => state.progress);
  const collections = useCollectionsStore((state) => state.collections);
  const studySessions = useStudyStore((state) => state.sessions);
  const goal = getTodayGoalStatus(preferences, days);
  const weekly = getWeeklyGoalProgress(days);
  const reminder = useReminderStore((state) => state.preferences);
  const offlineSummary = getOfflineLibrarySummary();
  const memoryStats = getMemoryStats(memoryVerses);
  const activePlans = Object.values(progress).filter((plan) => plan.completedDays.length > 0).length;
  const draftStudyCount = studySessions.filter((session) => session.status === 'draft').length;
  const completedStudyCount = studySessions.filter((session) => session.status === 'completed').length;

  const stats = [
    { label: 'Série', value: `${weekly.streak} j`, icon: Flame },
    { label: 'Semaine', value: `${weekly.completedThisWeek}/7`, icon: Sparkles },
    { label: 'Études', value: studySessions.length, icon: BookMarked },
    { label: 'Notes', value: notes.length, icon: NotebookPen },
    { label: 'Favoris', value: favorites.length, icon: Bookmark },
    { label: 'Mémoire', value: memoryStats.due, icon: Brain },
    { label: 'Prières', value: prayers.length, icon: HandHeart },
    { label: 'Surlignages', value: Object.keys(highlights).length, icon: BookOpenText },
    { label: 'Collections', value: collections.length, icon: Boxes },
    { label: 'Offline', value: offlineSummary.chapters.length, icon: Cloud },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.picture ? <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-3xl" /> : <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-gold/15 text-accent-gold"><UserCircle size={34} /></div>}
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">Moi</p><h1 className="text-3xl font-bold text-text-primary">{user?.name ?? 'Profil local'}</h1><p className="text-text-secondary">{synced ? 'Synchronisation Google Drive active' : 'Données locales sur cet appareil'}</p></div>
          </div>
          <Link to="/settings" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border px-4 font-semibold text-text-primary"><Settings size={18} /> Paramètres</Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{stats.map((stat) => <article key={stat.label} className="rounded-3xl border border-border bg-bg-card p-4"><stat.icon size={18} className="text-accent-gold" /><p className="mt-3 text-2xl font-bold text-text-primary">{stat.value}</p><p className="text-sm text-text-muted">{stat.label}</p></article>)}</section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-bold text-text-primary">Études bibliques</h2><p className="mt-2 text-text-secondary">{studySessions.length} session(s), {draftStudyCount} brouillon(s), {completedStudyCount} terminée(s).</p></div>
            <Link to="/study" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-bold text-white"><BookMarked size={18} /> Voir mes études</Link>
          </div>
        </article>
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5">
          <h2 className="text-xl font-bold text-text-primary">Objectif quotidien</h2>
          <p className="mt-2 text-text-secondary">{goal.label} · {goal.completed ? 'terminé aujourd’hui' : 'encore à vivre aujourd’hui'} · {activePlans} plan(s) démarré(s).</p>
          <div className="mt-4 grid grid-cols-7 gap-1.5">{weekly.week.map((day) => <span key={day.dayKey} className={`flex h-10 items-center justify-center rounded-xl text-xs font-bold ${day.active ? 'bg-accent-gold text-white' : day.isToday ? 'border border-accent-gold text-accent-gold' : 'bg-bg-secondary text-text-muted'}`}>{day.label}</span>)}</div>
        </article>
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5">
          <h2 className="text-xl font-bold text-text-primary">Reprendre</h2>
          <p className="mt-2 text-text-secondary">Dernière position : {getBookName(bookId)} {chapter} · {translation.toUpperCase()}</p>
          <Link to={`/read/${translation}/${bookId}/${chapter}`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-bold text-white"><BookOpenText size={18} /> Ouvrir la Bible</Link>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5"><Brain className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Mémorisation</h2><p className="mt-2 text-sm text-text-secondary">{memoryStats.due} verset(s) à revoir, {memoryStats.mastered} maîtrisé(s). Prochaine révision : {memoryStats.nextDueAt ? formatDueLabel(memoryStats.nextDueAt) : 'aucune'}.</p><Link to="/memory" className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">Réviser</Link></article>
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5"><Cloud className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Hors ligne</h2><p className="mt-2 text-sm text-text-secondary">{offlineSummary.manualCount} chapitre(s) sauvegardé(s), {offlineSummary.recentCount} récent(s), {formatApproxSize(offlineSummary.totalSizeApprox)} estimés. Le cache reste local à cet appareil.</p><Link to="/settings" className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">Gérer les téléchargements</Link></article>
        <article className="rounded-[1.7rem] border border-border bg-bg-card p-5"><Sparkles className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Rappel quotidien</h2><p className="mt-2 text-sm text-text-secondary">{reminder.enabled ? `Actif à ${reminder.time} pendant une session ouverte.` : 'Désactivé. Aucun push en arrière-plan n’est promis.'}</p><Link to="/settings" className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">Configurer</Link></article>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/collections" className="rounded-[1.7rem] border border-border bg-bg-card p-5 hover:border-accent-gold/45"><Boxes className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Collections spirituelles</h2><p className="mt-2 text-sm text-text-secondary">Regroupez versets, notes et prières autour d’un thème personnel.</p></Link>
        <Link to="/settings" className="rounded-[1.7rem] border border-border bg-bg-card p-5 hover:border-accent-gold/45"><Cloud className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Sync / export</h2><p className="mt-2 text-sm text-text-secondary">Sauvegardez ou exportez vos données sans casser le stockage local.</p></Link>
        <Link to="/onboarding" className="rounded-[1.7rem] border border-border bg-bg-card p-5 hover:border-accent-gold/45"><Sparkles className="text-accent-gold" /><h2 className="mt-3 text-xl font-bold text-text-primary">Préférences</h2><p className="mt-2 text-sm text-text-secondary">Ajustez objectifs, thèmes et rappel préféré.</p></Link>
      </section>
    </div>
  );
};
