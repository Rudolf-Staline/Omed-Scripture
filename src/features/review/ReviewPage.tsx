import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, BookOpenText, Brain, CheckCircle2, HandHeart, ListChecks, NotebookPen, RotateCcw } from 'lucide-react';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { READING_PLANS } from '../../data/readingPlans';
import { useBibleStore } from '../../store/useBibleStore';
import { useDailyRoutineStore } from '../../store/useDailyRoutineStore';
import { useMemoryStore } from '../../store/useMemoryStore';
import { useNotesStore } from '../../store/useNotesStore';
import { usePlansStore } from '../../store/usePlansStore';
import { usePrayerStore } from '../../store/usePrayerStore';
import { useStudyStore } from '../../store/useStudyStore';
import { getBookName } from '../../utils/bibleBooks';
import { formatDueLabel, getDueMemoryVerses } from '../../utils/memory';
import { getDailyProgressScore, getProgressLevelLabel, getProgressSuggestion } from '../../utils/progressScore';
import { getReadingDays } from '../../utils/readingActivity';
import { getReviewCenterSummary, sortIsoDateDesc, sortOldestPrayerFirst } from '../../utils/reviewCenter';

const Card: React.FC<{ icon: React.ReactNode; eyebrow: string; title: string; text: string; to: string; action: string }> = ({ icon, eyebrow, title, text, to, action }) => (
  <article className="rounded-[1.7rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)]">
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-gold/14 text-accent-gold">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-text-primary">{title}</h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-secondary">{text}</p>
      </div>
    </div>
    <Link to={to} className="mt-4 inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">{action}</Link>
  </article>
);

const planPassageLabel = (bookId: string, chapterStart: number, chapterEnd?: number): string => {
  const book = getBookName(bookId);
  return chapterEnd && chapterEnd !== chapterStart ? `${book} ${chapterStart}-${chapterEnd}` : `${book} ${chapterStart}`;
};

export const ReviewPage: React.FC = () => {
  const { translation, bookId, chapter } = useBibleStore();
  const memoryVerses = useMemoryStore((state) => state.memoryVerses);
  const sessions = useStudyStore((state) => state.sessions);
  const prayers = usePrayerStore((state) => state.prayers);
  const progress = usePlansStore((state) => state.progress);
  const notes = useNotesStore((state) => state.notes);
  const routineDays = useDailyRoutineStore((state) => state.days);

  const dailyScore = useMemo(() => getDailyProgressScore({
    readingDays: getReadingDays(),
    routineCompletedDays: routineDays.filter((day) => day.completedAt).map((day) => day.date),
    memoryVerses,
    studySessions: sessions,
    prayers,
    planProgress: progress,
    notes,
  }), [memoryVerses, notes, prayers, progress, routineDays, sessions]);

  const dueMemory = useMemo(() => getDueMemoryVerses(memoryVerses), [memoryVerses]);
  const studyDrafts = useMemo(() => sortIsoDateDesc(sessions.filter((session) => session.status === 'draft')), [sessions]);
  const activePrayers = useMemo(() => sortOldestPrayerFirst(prayers.filter((prayer) => prayer.status === 'active')), [prayers]);
  const activePlanTasks = useMemo(() => READING_PLANS
    .filter((plan) => plan.status !== 'planned' && progress[plan.id])
    .map((plan) => {
      const done = new Set(progress[plan.id].completedDays);
      const next = plan.readings.find((reading) => !done.has(reading.day));
      return next ? { plan, next } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)), [progress]);

  const summary = getReviewCenterSummary({ memoryDue: dueMemory.length, studyDrafts: studyDrafts.length, activePrayers: activePrayers.length, activePlans: activePlanTasks.length });
  const currentReaderPath = `/read/${translation}/${bookId}/${chapter}`;
  const nextMemory = dueMemory[0];
  const nextStudy = studyDrafts[0];
  const nextPrayer = activePrayers[0];
  const nextPlan = activePlanTasks[0];
  const completedLabels = dailyScore.completedItems.length > 0 ? dailyScore.completedItems : ['Aucun module à cocher pour le moment'];
  const suggestedLabels = dailyScore.missingItems.length > 0 ? dailyScore.missingItems : ['Lecture libre ou nouvelle étude'];

  return (
    <PageCanvas width="wide" className="space-y-6">
      <PageHero kicker="Aujourd’hui" title="Centre de reprise" icon={ListChecks} intro="Voici ce qui peut nourrir ton rythme aujourd’hui, sans pression ni culpabilité." actions={<Link to={currentReaderPath} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-bold text-white"><BookOpenText size={18} /> Lire maintenant</Link>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4 lg:col-span-2"><p className="text-2xl font-bold text-text-primary">{dailyScore.score}/100 · {getProgressLevelLabel(dailyScore.level)}</p><p className="text-sm text-text-muted">rythme du jour</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{summary.memoryDue}</p><p className="text-sm text-text-muted">versets dus</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{summary.studyDrafts}</p><p className="text-sm text-text-muted">études</p></div>
          <div className="rounded-3xl border border-border bg-bg-primary/65 p-4"><p className="text-2xl font-bold text-text-primary">{summary.activePrayers}</p><p className="text-sm text-text-muted">prières</p></div>
        </div>
      </PageHero>

      <section className="rounded-[1.8rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">Score quotidien</p>
            <h2 className="mt-1 text-2xl font-bold text-text-primary">{dailyScore.score}/100 · {getProgressLevelLabel(dailyScore.level)}</h2>
            <p className="mt-2 text-text-secondary">Prochaine étape : {getProgressSuggestion(dailyScore)}</p>
          </div>
          <RotateCcw className="text-accent-gold" size={30} aria-hidden="true" />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {Object.entries(dailyScore.breakdown).map(([key, value]) => <div key={key} className="rounded-2xl bg-bg-secondary p-3"><p className="text-xs font-semibold uppercase text-text-muted">{key}</p><p className="text-lg font-bold text-text-primary">{value}</p></div>)}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div><h3 className="font-bold text-text-primary">Complété</h3><ul className="mt-2 space-y-1 text-sm text-text-secondary">{completedLabels.map((item) => <li key={item}>• {item}</li>)}</ul></div>
          <div><h3 className="font-bold text-text-primary">Proposé</h3><ul className="mt-2 space-y-1 text-sm text-text-secondary">{suggestedLabels.map((item) => <li key={item}>• {item}</li>)}</ul></div>
        </div>
      </section>

      {summary.clear && <section className="rounded-[1.8rem] border border-dashed border-border bg-bg-card p-8 text-center"><CheckCircle2 className="mx-auto text-accent-sage" size={42} /><h2 className="mt-4 text-2xl font-bold text-text-primary">Tout est à jour</h2><p className="mx-auto mt-2 max-w-xl text-text-secondary">Aucun verset dû, aucune étude en brouillon, aucun plan actif à reprendre. Tu peux lire librement ou démarrer une nouvelle étude.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Link to={currentReaderPath} className="inline-flex min-h-11 items-center rounded-2xl bg-accent-gold px-4 font-bold text-white">Lire</Link><Link to="/study" className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 font-semibold text-text-primary">Nouvelle étude</Link></div></section>}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card icon={<Brain size={21} />} eyebrow="Mémorisation" title={`${dueMemory.length} verset${dueMemory.length > 1 ? 's' : ''} à revoir`} text={nextMemory ? `${nextMemory.reference} · ${formatDueLabel(nextMemory.dueAt)}` : 'Aucun verset dû pour le moment.'} to="/memory" action="Réviser" />
        <Card icon={<BookMarked size={21} />} eyebrow="Études" title={`${studyDrafts.length} brouillon${studyDrafts.length > 1 ? 's' : ''}`} text={nextStudy ? `${nextStudy.title} · ${nextStudy.reference}` : 'Aucune étude en attente.'} to={nextStudy ? `/study/${nextStudy.id}` : '/study'} action={nextStudy ? 'Continuer' : 'Nouvelle étude'} />
        <Card icon={<HandHeart size={21} />} eyebrow="Prière" title={`${activePrayers.length} intention${activePrayers.length > 1 ? 's' : ''} active${activePrayers.length > 1 ? 's' : ''}`} text={nextPrayer ? nextPrayer.title : 'Aucune prière active à reprendre.'} to="/prayer" action="Ouvrir le carnet" />
        <Card icon={<NotebookPen size={21} />} eyebrow="Plans" title={`${activePlanTasks.length} plan${activePlanTasks.length > 1 ? 's' : ''} en cours`} text={nextPlan ? `${nextPlan.plan.title} · jour ${nextPlan.next.day} · ${nextPlan.next.passages.map((passage) => planPassageLabel(passage.bookId, passage.chapterStart, passage.chapterEnd)).join(', ')}` : 'Aucun plan actif en attente.'} to={nextPlan ? `/plans/${nextPlan.plan.id}` : '/plans'} action={nextPlan ? 'Continuer le plan' : 'Choisir un plan'} />
      </section>
    </PageCanvas>
  );
};
