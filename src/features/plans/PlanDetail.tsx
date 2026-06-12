import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText, CalendarCheck2, Check, Circle, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { READING_PLANS } from '../../data/readingPlans';
import { usePlansStore } from '../../store/usePlansStore';
import { getBookName } from '../../utils/bibleBooks';
import { NotFoundPage } from '../not-found/NotFoundPage';

const formatPassage = (passage: { bookId: string; chapterStart: number; chapterEnd?: number }) => `${getBookName(passage.bookId)} ${passage.chapterStart}${passage.chapterEnd ? `-${passage.chapterEnd}` : ''}`;

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
  const nextDay = plan.readings.find((reading) => !completed.has(reading.day)) ?? plan.readings[0];

  const ensureStarted = () => {
    if (!planProgress) {
      startPlan(plan.id);
      toast.success('Plan commencé.');
    }
  };

  const openReading = (day = nextDay) => {
    ensureStarted();
    const passage = day?.passages[0];
    if (passage) navigate(`/read/lsg/${passage.bookId}/${passage.chapterStart}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link to="/plans" className="inline-flex min-h-10 items-center gap-2 rounded-2xl px-3 text-sm font-semibold text-text-secondary hover:bg-bg-card hover:text-text-primary"><ArrowLeft size={17} /> Tous les plans</Link>

      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><CalendarCheck2 size={15} /> {plan.durationDays} jours</p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">{plan.title}</h1>
        <p className="mt-3 leading-7 text-text-secondary">{plan.description}</p>
        <div className="mt-5"><div className="mb-2 flex justify-between text-sm font-semibold text-text-secondary"><span>{completed.size}/{plan.durationDays} jours terminés</span><span>{percent}%</span></div><div className="h-2 rounded-full bg-bg-secondary"><div className="h-full rounded-full bg-accent-gold" style={{ width: `${percent}%` }} /></div></div>
        <button type="button" onClick={() => openReading()} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-accent-gold px-5 font-semibold text-white"><PlayCircle size={19} /> {planProgress ? 'Continuer' : 'Commencer'}</button>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-text-primary">Lectures du plan</h2>
        {plan.readings.map((reading) => {
          const done = completed.has(reading.day);
          const isNext = nextDay?.day === reading.day && !done;
          return (
            <article key={reading.day} className={`rounded-3xl border p-4 ${isNext ? 'border-accent-gold/45 bg-accent-gold/8' : 'border-border bg-bg-card'}`}>
              <div className="flex gap-3">
                <button type="button" onClick={() => done ? unmarkDayComplete(plan.id, reading.day) : (ensureStarted(), markDayComplete(plan.id, reading.day))} className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? 'bg-accent-sage text-white' : 'bg-bg-secondary text-text-muted'}`} aria-label={done ? `Marquer le jour ${reading.day} comme non terminé` : `Marquer le jour ${reading.day} comme terminé`}>
                  {done ? <Check size={17} /> : <Circle size={17} />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="font-bold text-text-primary">Jour {reading.day} · {reading.title}</p>{isNext && <span className="rounded-full bg-accent-gold/14 px-2 py-0.5 text-xs font-semibold text-accent-gold">Aujourd’hui</span>}</div>
                  <p className="mt-1 text-sm text-text-secondary">{reading.passages.map(formatPassage).join(', ')}</p>
                  <button type="button" onClick={() => openReading(reading)} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-2xl border border-border bg-bg-primary px-3 text-sm font-semibold text-text-primary"><BookOpenText size={16} /> Lire</button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
