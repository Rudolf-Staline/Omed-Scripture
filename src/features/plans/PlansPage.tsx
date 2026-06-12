import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarRange, ChevronRight, Compass } from 'lucide-react';
import { usePlansStore } from '../../store/usePlansStore';
import { READING_PLANS, type ReadingPlan } from '../../data/readingPlans';
import { PageCanvas } from '../../components/layout/PageCanvas';
import { PageHero } from '../../components/layout/PageHero';
import { TimelinePath } from '../../components/layout/TimelinePath';

type Bucket = { id: string; label: string; plans: ReadingPlan[] };

const bucketFor = (plan: ReadingPlan): string => {
  if (plan.status === 'planned') return 'avenir';
  if (plan.durationDays <= 7) return 'court';
  if (plan.durationDays <= 21) return 'nourri';
  return 'long';
};

const BUCKET_LABELS: Record<string, string> = {
  court: 'Brefs · une semaine',
  nourri: 'Nourris · deux à trois semaines',
  long: 'Au long cours',
  avenir: 'À venir',
};

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const progress = usePlansStore((state) => state.progress);
  const startPlan = usePlansStore((state) => state.startPlan);

  const openPlan = (planId: string, isPlanned: boolean) => {
    if (isPlanned) return;
    if (!progress[planId]) startPlan(planId);
    navigate(`/plans/${planId}`);
  };

  const buckets = useMemo<Bucket[]>(() => {
    const order = ['court', 'nourri', 'long', 'avenir'];
    const map = new Map<string, ReadingPlan[]>();
    READING_PLANS.forEach((plan) => {
      const key = bucketFor(plan);
      map.set(key, [...(map.get(key) ?? []), plan]);
    });
    return order.filter((id) => map.has(id)).map((id) => ({ id, label: BUCKET_LABELS[id], plans: map.get(id)! }));
  }, []);

  // Parcours recommandé : celui en cours le plus récent, sinon le premier bref.
  const recommended = useMemo(() => {
    const inProgress = READING_PLANS
      .filter((plan) => plan.status !== 'planned' && progress[plan.id] && progress[plan.id].completedDays.length < plan.durationDays)
      .sort((a, b) => progress[b.id].startDate - progress[a.id].startDate)[0];
    if (inProgress) return inProgress;
    return READING_PLANS.find((plan) => plan.status !== 'planned' && !progress[plan.id]) ?? null;
  }, [progress]);

  return (
    <PageCanvas width="wide" className="space-y-7">
      <PageHero
        kicker="Parcours de lecture"
        title="Avancer avec constance"
        icon={CalendarRange}
        intro="Des chemins sobres, organisés en étapes lisibles, pour installer un rythme sans transformer la lecture en tableau de bord."
      >
        {recommended && (
          <button
            type="button"
            onClick={() => openPlan(recommended.id, false)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-accent-gold/30 bg-accent-gold/8 p-4 text-left transition-colors hover:border-accent-gold/50"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-gold"><Compass size={13} /> Recommandé aujourd'hui</span>
              <span className="mt-1 block truncate font-display text-lg text-text-primary">{recommended.title}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-accent-gold" />
          </button>
        )}
      </PageHero>

      {recommended && (
        <TimelinePath
          className="mb-7"
          items={recommended.readings.slice(0, 3).map((reading, index) => ({
            id: reading.day,
            title: <>Jour {reading.day}{reading.title ? ` · ${reading.title}` : ''}</>,
            meta: index === 0 ? 'Point de départ conseillé' : 'Prochaine balise',
            active: index === 0,
            body: <span>{reading.passages.map((passage) => passage.chapterEnd ? `${passage.bookId} ${passage.chapterStart}–${passage.chapterEnd}` : `${passage.bookId} ${passage.chapterStart}`).join(', ')}</span>,
            action: <button type="button" onClick={() => openPlan(recommended.id, false)} className="text-sm font-semibold text-accent-brown hover:text-accent-gold">Ouvrir</button>,
          }))}
        />
      )}

      {buckets.map((bucket) => (
        <section key={bucket.id}>
          <h2 className="mb-3 flex items-center gap-3 font-display text-lg text-text-primary">
            {bucket.label}
            <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {bucket.plans.map((plan, index) => {
              const planProgress = progress[plan.id];
              const isStarted = Boolean(planProgress);
              const isPlanned = plan.status === 'planned';
              const completed = isStarted ? planProgress.completedDays.length : 0;
              const percentage = isStarted ? Math.round((completed / plan.durationDays) * 100) : 0;

              return (
                <article
                  key={plan.id}
                  onClick={() => openPlan(plan.id, isPlanned)}
                  className={`group relative overflow-hidden omed-card p-5 transition-all ${isPlanned ? 'opacity-70' : 'cursor-pointer hover:-translate-y-0.5 hover:border-accent-gold/35'}`}
                >
                  <div className="absolute right-4 top-3 font-display text-5xl text-accent-gold/10">{String(index + 1).padStart(2, '0')}</div>
                  <div className="relative flex min-h-full flex-col">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold leading-tight text-text-primary">{plan.title}</h3>
                      {isPlanned ? (
                        <span className="shrink-0 rounded-full border border-border bg-bg-secondary px-2.5 py-0.5 text-xs font-semibold text-text-muted">À venir</span>
                      ) : isStarted ? (
                        <span className="shrink-0 rounded-full border border-accent-sage/35 bg-accent-sage/12 px-2.5 py-0.5 text-xs font-semibold text-accent-sage">En cours</span>
                      ) : null}
                    </div>
                    <p className="mb-5 flex-1 font-body text-sm leading-7 text-text-secondary">{plan.description}</p>

                    {isStarted ? (
                      <div>
                        <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                          <span>{completed}/{plan.durationDays} jours</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
                          <div className="h-full rounded-full bg-accent-gold transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-sm font-semibold text-text-muted">{plan.durationDays} étapes</span>
                        {!isPlanned && <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-brown group-hover:text-accent-gold">Commencer <ChevronRight size={15} /></span>}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </PageCanvas>
  );
};
