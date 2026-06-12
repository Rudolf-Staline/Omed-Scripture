import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Layers } from 'lucide-react';
import type { ReadingPlan } from '../../data/readingPlans';

interface PlanCardProps {
  plan: ReadingPlan;
  completedDays: number[];
  /** Affichage compact pour les rails horizontaux. */
  compact?: boolean;
}

const difficultyLabel: Record<NonNullable<ReadingPlan['difficulty']>, string> = {
  facile: 'Facile',
  moyen: 'Intermédiaire',
  'engagé': 'Engagé',
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, completedDays, compact = false }) => {
  const started = completedDays.length > 0;
  const finished = completedDays.length >= plan.durationDays;
  const percent = Math.min(100, Math.round((completedDays.length / plan.durationDays) * 100));
  const done = new Set(completedDays);
  const nextReading = plan.readings.find((reading) => !done.has(reading.day));

  return (
    <article className={`flex flex-col rounded-[1.5rem] border border-border bg-bg-card p-4 shadow-[var(--shadow-soft)] ${compact ? 'w-64 shrink-0' : ''}`}>
      <div className="flex items-center gap-2">
        {plan.theme && <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold/12 px-2.5 py-0.5 text-xs font-bold text-accent-gold"><Layers size={12} /> {plan.theme}</span>}
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs font-semibold text-text-secondary"><Clock size={12} /> {plan.durationDays} j</span>
      </div>

      <h3 className="mt-2.5 text-lg font-bold leading-tight text-text-primary">{plan.title}</h3>
      {!compact && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-secondary">{plan.description}</p>}

      {plan.difficulty && <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{difficultyLabel[plan.difficulty]}{plan.category ? ` · ${plan.category}` : ''}</p>}

      {started && !finished && (
        <div className="mt-3">
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-text-muted"><span>{completedDays.length}/{plan.durationDays} jours</span><span>{percent}%</span></div>
          <div className="h-2 rounded-full bg-bg-secondary"><div className="h-full rounded-full bg-accent-gold" style={{ width: `${percent}%` }} /></div>
          {nextReading && <p className="mt-2 truncate text-xs text-text-secondary">Prochain : Jour {nextReading.day}{nextReading.title ? ` · ${nextReading.title}` : ''}</p>}
        </div>
      )}
      {finished && <p className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-accent-sage/14 px-2.5 py-0.5 text-xs font-bold text-accent-sage">Terminé · 100%</p>}

      <Link to={`/plans/${plan.id}`} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-accent-gold px-4 font-semibold text-white">
        {finished ? 'Revoir' : started ? 'Continuer' : 'Commencer'} <ChevronRight size={18} />
      </Link>
    </article>
  );
};
