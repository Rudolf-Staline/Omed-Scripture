import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS } from '../../data/readingPlans';

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = usePlansStore((state) => state.progress);
  const startPlan = usePlansStore((state) => state.startPlan);

  const handlePlanClick = (planId: string, isPlanned: boolean) => {
    if (isPlanned) return;
    if (!progress[planId]) {
      startPlan(planId);
    }
    navigate(`/plans/${planId}`);
  };

  return (
    <div className="mx-auto max-w-5xl py-4 md:py-8">
      <section className="mb-8 omed-card p-6 md:p-8">
        <p className="omed-kicker mb-3">Parcours de lecture</p>
        <h1 className="flex items-center gap-3 font-display text-4xl font-semibold tracking-tight text-text-primary">
          <Calendar className="text-accent-gold" strokeWidth={1.5} />
          Avancer avec constance
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">Des parcours sobres, organisés en étapes lisibles, pour installer un rythme sans transformer la lecture en tableau de bord.</p>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {READING_PLANS.map((plan, index) => {
          const planProgress = progress[plan.id];
          const isStarted = !!planProgress;
          const isPlanned = plan.status === 'planned';
          const completed = isStarted ? planProgress.completedDays.length : 0;
          const remaining = plan.durationDays - completed;
          const percentage = isStarted ? Math.round((completed / plan.durationDays) * 100) : 0;

          return (
            <article
              key={plan.id}
              onClick={() => handlePlanClick(plan.id, isPlanned)}
              className={`group relative overflow-hidden omed-card p-6 transition-all ${
                isPlanned ? 'opacity-70' : 'cursor-pointer hover:-translate-y-0.5 hover:border-accent-gold/35'
              }`}
            >
              <div className="absolute right-5 top-5 font-display text-6xl text-accent-gold/10">{String(index + 1).padStart(2, '0')}</div>
              <div className="relative flex min-h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <h2 className="font-display text-2xl font-semibold leading-tight text-text-primary">{plan.title}</h2>
                  {isPlanned ? (
                    <span className="rounded-full border border-border bg-bg-secondary px-2.5 py-1 text-xs font-semibold text-text-muted">À venir</span>
                  ) : isStarted ? (
                    <span className="rounded-full border border-accent-sage/35 bg-accent-sage/12 px-2.5 py-1 text-xs font-semibold text-accent-sage">En cours</span>
                  ) : null}
                </div>
                <p className="mb-7 flex-1 font-body text-sm leading-7 text-text-secondary">{plan.description}</p>

                {isStarted ? (
                  <div>
                    <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                      <span>{completed}/{plan.durationDays} jours</span>
                      <span>{remaining} restants</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                      <div className="h-full rounded-full bg-accent-gold transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-semibold text-text-muted">{plan.durationDays} étapes</span>
                    {!isPlanned && <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-brown group-hover:text-accent-gold">Commencer <ChevronRight size={16} /></span>}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
