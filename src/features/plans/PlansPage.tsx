import React, { useMemo, useState } from 'react';
import { CalendarRange, CheckCircle2 } from 'lucide-react';
import { READING_PLANS } from '../../data/readingPlans';
import { usePlansStore } from '../../store/usePlansStore';
import { PlanCard } from '../../components/plans/PlanCard';
import { PlanFilterChips } from '../../components/plans/PlanFilterChips';
import { DURATION_FILTERS, filterPlans, getPlanThemes, type DurationFilterId, type PlanFilters } from '../../utils/planCatalog';

const Section: React.FC<{ title: string; count?: number; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, count, icon, children }) => (
  <section>
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-bold text-text-primary">{title}</h2>
      {count !== undefined && <span className="text-sm text-text-muted">{count}</span>}
    </div>
    {children}
  </section>
);

export const PlansPage: React.FC = () => {
  const progress = usePlansStore((state) => state.progress);
  const [filters, setFilters] = useState<PlanFilters>({ duration: 'all', theme: 'all' });

  const availablePlans = useMemo(() => READING_PLANS.filter((plan) => plan.status !== 'planned'), []);
  const themes = useMemo(() => getPlanThemes(availablePlans), [availablePlans]);

  const completedDaysFor = (planId: string) => progress[planId]?.completedDays ?? [];

  const inProgress = useMemo(
    () => availablePlans.filter((plan) => progress[plan.id] && progress[plan.id].completedDays.length < plan.durationDays),
    [availablePlans, progress]
  );
  const completed = useMemo(
    () => availablePlans.filter((plan) => (progress[plan.id]?.completedDays.length ?? 0) >= plan.durationDays),
    [availablePlans, progress]
  );

  // Catalogue filtrable (hors plans déjà en cours / terminés).
  const catalogue = useMemo(() => {
    const inProgressIds = new Set(inProgress.map((plan) => plan.id));
    const completedIds = new Set(completed.map((plan) => plan.id));
    const base = availablePlans.filter((plan) => !inProgressIds.has(plan.id) && !completedIds.has(plan.id));
    return filterPlans(base, filters);
  }, [availablePlans, inProgress, completed, filters]);

  const recommended = catalogue.filter((plan) => plan.recommended);
  const shortPlans = catalogue.filter((plan) => plan.durationDays <= 7 && !plan.recommended);
  const thematic = catalogue.filter((plan) => !plan.recommended && plan.durationDays > 7);

  const durationOptions = DURATION_FILTERS.map((filter) => ({ id: filter.id, label: filter.label }));
  const themeOptions = [{ id: 'all', label: 'Tous les thèmes' }, ...themes.map((theme) => ({ id: theme, label: theme }))];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-[2rem] border border-border bg-bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-gold"><CalendarRange size={15} /> Plans</p>
        <h1 className="mt-2 text-3xl font-bold text-text-primary">Catalogue de lecture</h1>
        <p className="mt-2 max-w-2xl text-text-secondary">Reprenez un parcours en cours ou choisissez-en un selon sa durée et son thème.</p>
      </header>

      {inProgress.length > 0 && (
        <Section title="En cours" count={inProgress.length}>
          <div className="grid gap-4 sm:grid-cols-2">{inProgress.map((plan) => <PlanCard key={plan.id} plan={plan} completedDays={completedDaysFor(plan.id)} />)}</div>
        </Section>
      )}

      <div className="space-y-3 rounded-[1.5rem] border border-border bg-bg-card p-4">
        <PlanFilterChips label="Durée" options={durationOptions} value={filters.duration} onChange={(id) => setFilters((f) => ({ ...f, duration: id as DurationFilterId }))} />
        <PlanFilterChips label="Thème" options={themeOptions} value={filters.theme} onChange={(id) => setFilters((f) => ({ ...f, theme: id }))} />
      </div>

      {catalogue.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-bg-card p-8 text-center text-text-secondary">Aucun plan ne correspond à ces filtres. Élargissez la durée ou le thème.</div>
      ) : (
        <>
          {recommended.length > 0 && (
            <Section title="Recommandés" count={recommended.length}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{recommended.map((plan) => <PlanCard key={plan.id} plan={plan} completedDays={completedDaysFor(plan.id)} />)}</div>
            </Section>
          )}
          {shortPlans.length > 0 && (
            <Section title="Courts (≤ 7 jours)" count={shortPlans.length}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{shortPlans.map((plan) => <PlanCard key={plan.id} plan={plan} completedDays={completedDaysFor(plan.id)} />)}</div>
            </Section>
          )}
          {thematic.length > 0 && (
            <Section title="Thématiques" count={thematic.length}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{thematic.map((plan) => <PlanCard key={plan.id} plan={plan} completedDays={completedDaysFor(plan.id)} />)}</div>
            </Section>
          )}
        </>
      )}

      {completed.length > 0 && (
        <Section title="Terminés" count={completed.length} icon={<CheckCircle2 className="text-accent-sage" size={20} />}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{completed.map((plan) => <PlanCard key={plan.id} plan={plan} completedDays={completedDaysFor(plan.id)} />)}</div>
        </Section>
      )}
    </div>
  );
};
