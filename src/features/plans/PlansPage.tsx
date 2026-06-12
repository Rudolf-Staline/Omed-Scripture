import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { READING_PLANS } from '../../data/readingPlans';
import { usePlansStore } from '../../store/usePlansStore';

const PlanCard: React.FC<{ plan: (typeof READING_PLANS)[number]; completed: number; started: boolean }> = ({ plan, completed, started }) => {
  const percent = Math.round((completed / plan.durationDays) * 100);
  return (
    <article className="rounded-[1.7rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-text-primary">{plan.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">{plan.description}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary"><Clock size={14} /> {plan.durationDays} j</span>
      </div>
      {started && <div className="mt-4"><div className="mb-2 flex justify-between text-xs font-semibold text-text-muted"><span>{completed}/{plan.durationDays} jours</span><span>{percent}%</span></div><div className="h-2 rounded-full bg-bg-secondary"><div className="h-full rounded-full bg-accent-gold" style={{ width: `${percent}%` }} /></div></div>}
      <Link to={`/plans/${plan.id}`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white">{started ? 'Continuer' : 'Commencer'} <ChevronRight size={18} /></Link>
    </article>
  );
};

export const PlansPage: React.FC = () => {
  const progress = usePlansStore((state) => state.progress);
  const availablePlans = READING_PLANS.filter((plan) => plan.status !== 'planned');
  const inProgress = useMemo(() => availablePlans.filter((plan) => progress[plan.id] && progress[plan.id].completedDays.length < plan.durationDays), [availablePlans, progress]);
  const recommended = useMemo(() => availablePlans.filter((plan) => !progress[plan.id]), [availablePlans, progress]);
  const completed = useMemo(() => availablePlans.filter((plan) => progress[plan.id]?.completedDays.length >= plan.durationDays), [availablePlans, progress]);
  const shortPlans = recommended.filter((plan) => plan.durationDays <= 7);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><CalendarRange size={15} /> Plans</p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">Lire avec un plan simple</h1>
        <p className="mt-2 max-w-2xl text-text-secondary">Retrouvez vos plans en cours, puis choisissez une lecture recommandée sans contenu artificiel.</p>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold text-text-primary">En cours</h2><span className="text-sm text-text-muted">{inProgress.length}</span></div>
        {inProgress.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{inProgress.map((plan) => <PlanCard key={plan.id} plan={plan} completed={progress[plan.id].completedDays.length} started />)}</div> : <div className="rounded-3xl border border-dashed border-border bg-bg-card p-6 text-text-secondary">Aucun plan en cours. Commencez un plan recommandé ci-dessous.</div>}
      </section>

      {shortPlans.length > 0 && <section><h2 className="mb-3 text-xl font-bold text-text-primary">Courts</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shortPlans.map((plan) => <PlanCard key={plan.id} plan={plan} completed={0} started={false} />)}</div></section>}

      <section>
        <h2 className="mb-3 text-xl font-bold text-text-primary">Recommandés</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{recommended.map((plan) => <PlanCard key={plan.id} plan={plan} completed={0} started={false} />)}</div>
      </section>

      {completed.length > 0 && <section><h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-text-primary"><CheckCircle2 className="text-accent-sage" size={20} /> Terminés</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{completed.map((plan) => <PlanCard key={plan.id} plan={plan} completed={plan.durationDays} started />)}</div></section>}
    </div>
  );
};
