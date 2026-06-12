import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText, CalendarCheck2, Check, Circle, Layers, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { READING_PLANS, type ReadingPlanDay } from '../../data/readingPlans';
import { usePlansStore } from '../../store/usePlansStore';
import { getBookName } from '../../utils/bibleBooks';
import { clampChapterForBook } from '../../utils/bibleNavigation';
import { recordReadingDay } from '../../utils/readingActivity';
import { NotFoundPage } from '../not-found/NotFoundPage';

const passageLabel = (passage: { bookId: string; chapterStart: number; chapterEnd?: number }) =>
  `${getBookName(passage.bookId)} ${passage.chapterStart}${passage.chapterEnd ? `-${passage.chapterEnd}` : ''}`;

export const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const plan = READING_PLANS.find((item) => item.id === planId);
  const progress = usePlansStore((state) => state.progress);
  const startPlan = usePlansStore((state) => state.startPlan);
  const markDayComplete = usePlansStore((state) => state.markDayComplete);
  const unmarkDayComplete = usePlansStore((state) => state.unmarkDayComplete);

  if (!plan || plan.status === 'planned') return <NotFoundPage />;

  const planProgress = progress[plan.id];
  const completed = new Set(planProgress?.completedDays ?? []);
  const percent = Math.round((completed.size / plan.durationDays) * 100);
  const isFinished = completed.size >= plan.durationDays;
  const nextDay = plan.readings.find((reading) => !completed.has(reading.day)) ?? plan.readings[plan.readings.length - 1];

  const ensureStarted = () => {
    if (!planProgress) {
      startPlan(plan.id);
      toast.success('Plan commencé.');
    }
  };

  const openPassage = (bookId: string, chapter: number) => {
    ensureStarted();
    navigate(`/read/lsg/${bookId}/${clampChapterForBook(bookId, chapter)}`);
  };

  const openDay = (day = nextDay) => {
    const passage = day?.passages[0];
    if (passage) openPassage(passage.bookId, passage.chapterStart);
  };

  const completeDay = (day: ReadingPlanDay) => {
    ensureStarted();
    markDayComplete(plan.id, day.day);
    recordReadingDay(); // compte aussi pour la série quotidienne unifiée
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to="/plans" className="inline-flex min-h-10 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-text-secondary hover:bg-bg-card hover:text-text-primary"><ArrowLeft size={17} /> Catalogue</Link>

      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {plan.theme && <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold/12 px-2.5 py-0.5 text-xs font-bold text-accent-gold"><Layers size={12} /> {plan.theme}</span>}
          <span className="inline-flex items-center gap-1 rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs font-semibold text-text-secondary"><CalendarCheck2 size={12} /> {plan.durationDays} jours</span>
        </div>
        <h1 className="mt-2.5 text-3xl font-bold text-text-primary">{plan.title}</h1>
        <p className="mt-2 leading-7 text-text-secondary">{plan.description}</p>
        <div className="mt-5"><div className="mb-2 flex justify-between text-sm font-semibold text-text-secondary"><span>{completed.size}/{plan.durationDays} jours terminés</span><span>{percent}%</span></div><div className="h-2 rounded-full bg-bg-secondary"><div className="h-full rounded-full bg-accent-gold" style={{ width: `${percent}%` }} /></div></div>
      </header>

      {/* Aujourd'hui — quoi faire en 3 secondes */}
      {!isFinished ? (
        <section className="rounded-[1.7rem] border border-accent-gold/35 bg-accent-gold/8 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{planProgress ? 'À lire maintenant' : 'Commencer'}</p>
          <h2 className="mt-1 text-2xl font-bold text-text-primary">Jour {nextDay.day}{nextDay.title ? ` · ${nextDay.title}` : ''}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {nextDay.passages.map((passage) => (
              <button key={`${passage.bookId}-${passage.chapterStart}`} type="button" onClick={() => openPassage(passage.bookId, passage.chapterStart)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-bg-card px-3 text-sm font-semibold text-text-primary hover:border-accent-gold/45">
                <BookOpenText size={14} /> {passageLabel(passage)}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => openDay(nextDay)} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-5 font-semibold text-white"><PlayCircle size={19} /> Lire aujourd’hui</button>
            <button type="button" onClick={() => completeDay(nextDay)} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-bg-card px-5 font-semibold text-text-primary"><Check size={18} /> Marquer comme terminé</button>
          </div>
        </section>
      ) : (
        <section className="rounded-[1.7rem] border border-accent-sage/40 bg-accent-sage/10 p-5 text-center">
          <p className="text-lg font-bold text-accent-sage">Plan terminé 🎉</p>
          <p className="mt-1 text-sm text-text-secondary">Vous avez parcouru les {plan.durationDays} jours. Relisez un jour quand vous le souhaitez.</p>
        </section>
      )}

      {/* Parcours jour par jour */}
      <section className="space-y-2.5">
        <h2 className="text-xl font-bold text-text-primary">Le parcours</h2>
        {plan.readings.map((reading) => {
          const done = completed.has(reading.day);
          const isNext = !isFinished && nextDay.day === reading.day && !done;
          return (
            <article key={reading.day} className={`rounded-2xl border p-4 ${isNext ? 'border-accent-gold/45 bg-accent-gold/8' : 'border-border bg-bg-card'}`}>
              <div className="flex gap-3">
                <button type="button" onClick={() => done ? unmarkDayComplete(plan.id, reading.day) : completeDay(reading)} className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${done ? 'bg-accent-sage text-white' : 'bg-bg-secondary text-text-muted hover:text-accent-gold'}`} aria-label={done ? `Marquer le jour ${reading.day} comme non terminé` : `Marquer le jour ${reading.day} comme terminé`}>
                  {done ? <Check size={17} /> : <Circle size={17} />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-bold ${done ? 'text-text-muted line-through' : 'text-text-primary'}`}>Jour {reading.day}{reading.title ? ` · ${reading.title}` : ''}</p>
                    {isNext && <span className="rounded-full bg-accent-gold/14 px-2 py-0.5 text-xs font-semibold text-accent-gold">À lire</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {reading.passages.map((passage) => (
                      <button key={`${passage.bookId}-${passage.chapterStart}`} type="button" onClick={() => openPassage(passage.bookId, passage.chapterStart)} className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-bg-secondary px-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary">
                        <BookOpenText size={13} /> {passageLabel(passage)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
